import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SalesStore } from '../../../application/sales.store';
import { SalesOrderItemEntity } from '../../../domain/model/sales-order-item.entity';
import { IamStore } from '../../../../iam/application/iam.store';
import { ProfilesStore } from '../../../../profiles/application/profiles.store';
import { ResourceApi } from '../../../../resource/infrastructure/resource-api';
import { ResourceStore } from '../../../../resource/application/resource.store';
import { KitStore } from '../../../../planning/kits/application/kits.store';
import { KitEntity } from '../../../../planning/kits/domain/model/kit.entity';
import { KitCatalogCardComponent } from '../../components/kit-catalog-card/kit-catalog-card';
import { OrderTicketComponent } from '../../components/order-ticket/order-ticket';
import { SaleSuccessModalComponent } from '../../components/sale-success-modal/sale-success-modal';
import { InsufficientStockModalComponent } from '../../components/insufficient-stock-modal/insufficient-stock-modal';
import { SALES_PATHS } from '../../sales-paths';

/**
 * "New Sale" / POS screen: kit catalog on the left, order ticket on the
 * right, plus the success and insufficient-stock modals. Orchestrator only:
 * injects SalesStore + KitStore, wires the presentational components, and
 * translates their outputs into store calls.
 */
@Component({
  selector: 'app-new-sale',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe,
    KitCatalogCardComponent,
    OrderTicketComponent,
    SaleSuccessModalComponent,
    InsufficientStockModalComponent,
  ],
  templateUrl: './new-sale.html',
  styleUrl: './new-sale.css',
})
export class NewSaleComponent implements OnInit {
  protected readonly store = inject(SalesStore);
  protected readonly kitsStore = inject(KitStore);
  protected readonly resourceStore = inject(ResourceStore);
  private readonly iamStore = inject(IamStore);
  private readonly profilesStore = inject(ProfilesStore);
  private readonly resourceApi = inject(ResourceApi);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  // Quick Add Custom signals
  readonly showQuickAddModal = signal(false);
  readonly quickAddTab = signal<'select' | 'manual'>('select');

  /** Set when there's no branch to open a ticket against (see resolveBranchAndStartOrder). */
  readonly branchError = this.store.branchError;

  /**
   * Best-effort match between the failed customSupplyId and the order item
   * whose Kit recipe actually contains that supply — the backend error only
   * knows the supply, not which sold item needed it.
   */
  readonly offendingItem = computed<SalesOrderItemEntity | null>(() => {
    const error = this.store.insufficientStockError();
    const order = this.store.activeOrder();
    if (!error || !order) return null;

    for (const item of order.items) {
      if (item.productType === 'SUPPLY' && item.productId === error.customSupplyId) {
        return item;
      }
      const kit = this.kitsStore.kits().find((k) => k.id === item.productId);
      const usesSupply = kit?.items?.some((i) => i.customSupplyId === error.customSupplyId);
      if (usesSupply) return item;
    }
    return order.items[0] ?? null;
  });

  ngOnInit(): void {
    this.kitsStore.loadAllKits();
    const accountId = this.iamStore.currentUser()?.accountId;
    if (accountId) {
      this.resourceStore.loadCustomSuppliesByAccount(accountId);
    }
    this.resolveBranchAndStartOrder();
  }

  onAddKit(kit: KitEntity): void {
    const order = this.store.activeOrder();
    if (!order) return;

    // Check if the item already exists in the order. If so, adjust quantity.
    const existingItem = order.items.find((item) => item.productId === kit.id);
    if (existingItem) {
      this.store.adjustItemQuantity(existingItem, 1);
    } else {
      this.store.addProduct({
        orderId: order.id,
        productId: kit.id,
        productType: 'KIT',
        nameSnapshot: kit.name,
        unitPrice: kit.sellingPrice,
        currency: order.currency || 'PEN',
        quantity: 1,
      });
    }
  }

  /**
   * Adds an existing custom supply straight to the ticket as its own line
   * (productType SUPPLY, productId = the custom supply's own id). This is a
   * standalone sale of a supply the account already has — it must NOT create
   * or touch any Kit, and it must NOT appear in the Kits/Combos catalog.
   */
  onAddSupply(supplyId: string): void {
    const order = this.store.activeOrder();
    if (!order) return;

    const supply = this.resourceStore.getCustomSupplyById(supplyId);
    if (!supply) return;

    const existingItem = order.items.find(
      (item) => item.productType === 'SUPPLY' && item.productId === supply.id,
    );
    if (existingItem) {
      this.store.adjustItemQuantity(existingItem, 1);
    } else {
      this.store.addProduct({
        orderId: order.id,
        productId: supply.id,
        productType: 'SUPPLY',
        nameSnapshot: supply.name,
        unitPrice: supply.unitPrice,
        currency: supply.unitPriceCurrencyCode || order.currency || 'PEN',
        quantity: 1,
      });
    }
    this.showQuickAddModal.set(false);
  }

  onAdjustQuantity(event: { item: SalesOrderItemEntity; delta: number }): void {
    this.store.adjustItemQuantity(event.item, event.delta);
  }

  onRemoveItem(itemId: string): void {
    this.store.removeItem(itemId);
  }

  onCompleteOrder(): void {
    this.store.completeOrder();
  }

  onClearOrder(): void {
    this.store.cancelOrder();
  }

  onRemoveOffendingItem(): void {
    const item = this.offendingItem();
    this.store.clearInsufficientStockError();
    if (item) {
      this.store.removeItem(item.id);
    }
  }

  onStartNewSale(): void {
    this.store.clearLastCompletedOrder();
    this.resolveBranchAndStartOrder();
  }

  onBackToSales(): void {
    this.store.clearLastCompletedOrder();
    this.router.navigateByUrl(SALES_PATHS.overview.root);
  }

  onRetryBranch(): void {
    this.resolveBranchAndStartOrder();
  }

  // Quick Add Custom Handlers
  openQuickAddModal(): void {
    this.showQuickAddModal.set(true);
  }

  onAddSelectedKit(kitId: string): void {
    const kit = this.kitsStore.kits().find((k) => k.id === kitId);
    if (kit) {
      this.onAddKit(kit);
      this.showQuickAddModal.set(false);
    }
  }

  /**
   * "Quick Add Custom" now only covers picking an existing catalog Kit
   * (handled by onAddSelectedKit) or an existing account custom supply
   * (handled by onAddSupply). Manually typing a brand-new name/SKU/price used
   * to silently create a new Kit behind the scenes — that's gone, since a
   * "custom" sale here should always resolve to real inventory the account
   * already tracks, not a phantom catalog entry.
   */

  /**
   * A sales order needs a branchId, but nothing forces the person to pick
   * one under System Preferences first — `ProfilesStore.currentBranchId()`
   * then defaults to `''`, which the backend rejects with 400 ("Branch ID
   * cannot be null or blank"). Instead of failing outright, fall back to the
   * account's first registered branch (and remember it as the preference),
   * and only surface an error if the account truly has no branches yet.
   */
  private resolveBranchAndStartOrder(): void {
    const accountId = this.iamStore.currentUser()?.accountId;
    if (!accountId) return;

    const savedBranchId = this.profilesStore.currentBranchId();
    if (savedBranchId) {
      this.store.startNewOrder(accountId, savedBranchId);
      return;
    }

    this.store.branchError.set(null);
    this.resourceApi.getBranches(accountId).subscribe({
      next: (branches) => {
        const firstBranch = branches[0];
        if (!firstBranch) {
          this.store.branchError.set(this.translate.instant('sales.newSale.noBranchError'));
          return;
        }
        this.profilesStore.setCurrentBranchId(firstBranch.id);
        this.store.startNewOrder(accountId, firstBranch.id);
      },
      error: () => {
        this.store.branchError.set(this.translate.instant('sales.newSale.branchResolveError'));
      },
    });
  }
}
