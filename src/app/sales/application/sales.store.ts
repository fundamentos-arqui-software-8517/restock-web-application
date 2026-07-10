import { computed, Injectable, signal } from '@angular/core';
import { SalesApi } from '../infrastructure/sales-api';
import { SalesOrderEntity } from '../domain/model/sales-order.entity';
import { SalesOrderItemEntity } from '../domain/model/sales-order-item.entity';
import { InsufficientStockError } from '../domain/model/insufficient-stock-error.model';
import { AddProductToOrderCommand } from '../domain/command/add-product-to-order.command';
import { InsufficientStockHttpError } from '../infrastructure/sales/insufficient-stock.error';

/**
 * SalesStore
 * Holds every piece of state the Sales bounded context needs:
 * - the transactions list + KPIs for the "Sales Overview" screen.
 * - the "active order" (the ticket currently being built at the POS screen).
 */
@Injectable({ providedIn: 'root' })
export class SalesStore {
  // ── Sales Overview state ──────────────────────────────────────────────
  readonly orders = signal<SalesOrderEntity[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // ── POS / New Sale state ──────────────────────────────────────────────
  private readonly _accountId = signal<string>('');
  readonly activeOrder = signal<SalesOrderEntity | null>(null);
  readonly saving = signal(false);
  readonly insufficientStockError = signal<InsufficientStockError | null>(null);
  readonly lastCompletedOrder = signal<SalesOrderEntity | null>(null);
  /** Set when a ticket can't be opened because the account has no usable branch. */
  readonly branchError = signal<string | null>(null);

  // ── Computed KPIs for the Sales Overview screen ───────────────────────
  readonly completedOrders = computed(() => this.orders().filter((o) => o.status === 'COMPLETED'));
  readonly totalSalesAmount = computed(() =>
    this.completedOrders().reduce((sum, o) => sum + o.totalAmount, 0),
  );
  readonly transactionCount = computed(() => this.completedOrders().length);

  /**
   * Month-over-month change in completed sales, based on each order's real
   * createdAt timestamp — null when there's no prior-month data to compare
   * against (so the UI can show "N/A" instead of a misleading 0%).
   */
  readonly salesDeltaPercent = computed<number | null>(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const prevDate = new Date(currentYear, currentMonth - 1, 1);
    const prevMonth = prevDate.getMonth();
    const prevYear = prevDate.getFullYear();

    let currentTotal = 0;
    let previousTotal = 0;

    for (const order of this.completedOrders()) {
      if (!order.createdAt) continue;
      const created = new Date(order.createdAt);
      if (created.getFullYear() === currentYear && created.getMonth() === currentMonth) {
        currentTotal += order.totalAmount;
      } else if (created.getFullYear() === prevYear && created.getMonth() === prevMonth) {
        previousTotal += order.totalAmount;
      }
    }

    if (previousTotal === 0) return null;
    return ((currentTotal - previousTotal) / previousTotal) * 100;
  });

  /** Count of orders that failed to sync (CANCELLED), for the Failed Sync Rate KPI caption. */
  readonly failedOrdersCount = computed(
    () => this.orders().filter((o) => o.status === 'CANCELLED').length,
  );

  constructor(private readonly api: SalesApi) {}

  // ── Sales Overview ─────────────────────────────────────────────────────

  loadOrders(accountId: string): void {
    if (!accountId) return;
    this.loading.set(true);
    this.error.set(null);

    this.api.getOrdersByAccount(accountId).subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  // ── POS / New Sale ─────────────────────────────────────────────────────

  /** Starts a fresh ticket for the given branch. */
  startNewOrder(accountId: string, branchId: string): void {
    this._accountId.set(accountId);
    this.saving.set(true);
    this.error.set(null);
    this.branchError.set(null);
    this.lastCompletedOrder.set(null);

    this.api.createOrder(accountId, { branchId }).subscribe({
      next: (order) => {
        this.activeOrder.set(order);
        this.saving.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.saving.set(false);
      },
    });
  }

  addProduct(command: AddProductToOrderCommand): void {
    this.saving.set(true);
    this.error.set(null);

    this.api.addItem(command).subscribe({
      next: (order) => {
        this.activeOrder.set(order);
        this.saving.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.saving.set(false);
      },
    });
  }

  removeItem(itemId: string): void {
    const order = this.activeOrder();
    if (!order) return;

    this.saving.set(true);
    this.error.set(null);

    this.api.removeItem({ orderId: order.id, itemId }).subscribe({
      next: (updated) => {
        this.activeOrder.set(updated);
        this.saving.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.saving.set(false);
      },
    });
  }

  /**
   * There's no "update quantity" endpoint on the backend — SalesOrder only
   * supports addItem/removeItem, and addItem always appends a brand new
   * line rather than merging quantities. So a "+"/"-" step in the Order
   * Ticket is implemented as remove-then-re-add-with-the-new-quantity,
   * called sequentially to avoid the same race condition fixed earlier in
   * the Kits module (two concurrent writes clobbering each other).
   */
  adjustItemQuantity(item: SalesOrderItemEntity, delta: number): void {
    const order = this.activeOrder();
    if (!order) return;

    // Find all items with the same productId in the current order
    const matchingItems = order.items.filter((i) => i.productId === item.productId);
    const currentTotalQty = matchingItems.reduce((sum, i) => sum + i.quantity, 0);
    const newQuantity = currentTotalQty + delta;

    this.saving.set(true);
    this.error.set(null);

    // Recursive helper to delete duplicate items one by one sequentially
    const deleteSequence = (itemsToDelete: SalesOrderItemEntity[], callback: () => void) => {
      if (itemsToDelete.length === 0) {
        callback();
        return;
      }
      const current = itemsToDelete[0];
      this.api.removeItem({ orderId: order.id, itemId: current.id }).subscribe({
        next: (updatedOrder) => {
          this.activeOrder.set(updatedOrder);
          deleteSequence(itemsToDelete.slice(1), callback);
        },
        error: (err: Error) => {
          this.error.set(err.message);
          this.saving.set(false);
        },
      });
    };

    if (newQuantity <= 0) {
      deleteSequence(matchingItems, () => {
        this.saving.set(false);
      });
    } else {
      deleteSequence(matchingItems, () => {
        this.api
          .addItem({
            orderId: order.id,
            productId: item.productId,
            productType: item.productType,
            nameSnapshot: item.nameSnapshot,
            unitPrice: item.unitPrice,
            currency: order.currency || 'PEN',
            quantity: newQuantity,
          })
          .subscribe({
            next: (updated) => {
              this.activeOrder.set(updated);
              this.saving.set(false);
            },
            error: (err: Error) => {
              this.error.set(err.message);
              this.saving.set(false);
            },
          });
      });
    }
  }

  /**
   * Logs the sale and deducts stock. On success the ticket is cleared and
   * `lastCompletedOrder` is populated for the confirmation screen. On an
   * insufficient-stock failure, the offending item stays in the order so the
   * person can remove it and try again — `insufficientStockError` drives the
   * "Action Blocked" modal.
   */
  completeOrder(): void {
    const order = this.activeOrder();
    if (!order) return;

    this.saving.set(true);
    this.error.set(null);
    this.insufficientStockError.set(null);

    this.api.completeOrder(order.id, this._accountId()).subscribe({
      next: (completed) => {
        this.lastCompletedOrder.set(completed);
        this.activeOrder.set(null);
        this.saving.set(false);
      },
      error: (err: Error) => {
        this.saving.set(false);
        if (err instanceof InsufficientStockHttpError) {
          this.insufficientStockError.set(err.details);
        } else {
          this.error.set(err.message);
        }
      },
    });
  }

  cancelOrder(): void {
    const order = this.activeOrder();
    if (!order) return;

    this.saving.set(true);
    this.api.cancelOrder(order.id).subscribe({
      next: () => {
        this.activeOrder.set(null);
        this.saving.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.saving.set(false);
      },
    });
  }

  clearInsufficientStockError(): void {
    this.insufficientStockError.set(null);
  }

  /** Drops the just-completed order snapshot once the success screen closes. */
  clearLastCompletedOrder(): void {
    this.lastCompletedOrder.set(null);
  }
}
