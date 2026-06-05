import { Injectable, signal, computed, inject } from '@angular/core';
import { RecipeEntity } from '../domain/model/recipe.entity';
import { CustomSupplyEntity } from '../domain/model/custom-supply.entity';
import { IngredientEntryEntity } from '../domain/model/ingredient-entry.entity';
import { RecipesApiEndpoint } from '../infrastructure/recipes-api-endpoint';
import { CreateRecipeCommand } from '../domain/commands/create-recipe.command';
import { UpdateRecipeCommand } from '../domain/commands/update-recipe.command';
import { AddIngredientCommand } from '../domain/commands/add-ingredient.command';
import { forkJoin } from 'rxjs';

export type ModalMode = 'create' | 'edit' | null;

/** Transient ingredient row used inside the Create/Edit modal before saving */
export interface PendingIngredient {
  supply: CustomSupplyEntity;
  quantity: number;
  /** estimated local cost (supply.unitPriceAmount × quantity) — for display only */
  localCost: number;
}

// ── STORE ─────────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class RecipesStore {

  private readonly api = inject(RecipesApiEndpoint);

  // ── Primary account id (set externally, e.g. from AuthStore) ─────────────
  readonly accountId = signal<string>('acc-1'); // ← inject real accountId here

  // ── State ─────────────────────────────────────────────────────────────────
  readonly recipes         = signal<RecipeEntity[]>([]);
  readonly customSupplies  = signal<CustomSupplyEntity[]>([]);
  readonly selectedRecipe  = signal<RecipeEntity | null>(null);
  readonly loading         = signal(false);
  readonly saving          = signal(false);
  readonly error           = signal<string | null>(null);
  readonly searchQuery     = signal('');

  // Modal state
  readonly modalMode        = signal<ModalMode>(null);
  readonly showDeleteModal  = signal(false);
  readonly recipeToDelete   = signal<RecipeEntity | null>(null);

  // ── Derived ───────────────────────────────────────────────────────────────

  readonly filteredRecipes = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.recipes();
    return this.recipes().filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.sku.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q),
    );
  });

  readonly metrics = computed(() => {
    const all = this.recipes();
    return {
      total:    all.length,
      active:   all.filter(r => r.status === 'ACTIVE').length,
      inactive: all.filter(r => r.status === 'INACTIVE').length,
      lowStock: all.filter(r => r.status === 'LOW_STOCK').length,
    };
  });

  /**
   * Returns a resolved ingredient list for a given recipe,
   * joining IngredientEntryEntity with CustomSupplyEntity by customSupplyId.
   */
  resolveIngredients(recipe: RecipeEntity): Array<{
    entry: IngredientEntryEntity;
    supply: CustomSupplyEntity | undefined;
  }> {
    return recipe.ingredients.map(entry => ({
      entry,
      supply: this.customSupplies().find(s => s.id === entry.customSupplyId),
    }));
  }

  // ── Load ──────────────────────────────────────────────────────────────────

  loadAll(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      // Usamos el método renombrado que sí acepta el parámetro
      products:       this.api.getAllByAccountId(this.accountId()),
      customSupplies: this.api.getCustomSupplies(this.accountId()),
    }).subscribe({
      next: ({ products, customSupplies }) => {
        // La API ya devuelve Entidades, no hay que transformarlas
        this.recipes.set(products);
        this.customSupplies.set(customSupplies);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message ?? 'Error loading recipes');
        this.loading.set(false);
      },
    });
  }

  selectRecipe(recipe: RecipeEntity): void {
    this.selectedRecipe.set(recipe);
  }

  // ── CREATE (product only — ingredients added afterwards) ──────────────────

  create(cmd: CreateRecipeCommand, pendingIngredients: PendingIngredient[]): void {
    this.saving.set(true);
    this.api.createProduct({
      accountId:    cmd.accountId,
      name:         cmd.name,
      description:  cmd.description ?? '',
      sku:          cmd.sku,
      type:         'RECIPE',
      imageUrl:     cmd.imageUrl ?? '',
      sellingPrice: cmd.sellingPrice,
    }).subscribe({
      next: entity => {
        this.recipes.update(list => [entity, ...list]);

        // Add each pending ingredient sequentially
        this._addIngredientsBatch(entity.id, pendingIngredients, () => {
          this.saving.set(false);
          this.closeModal();
        });
      },
      error: err => {
        this.error.set(err.message);
        this.saving.set(false);
      },
    });
  }

  // ── UPDATE (product metadata only) ───────────────────────────────────────

  update(cmd: UpdateRecipeCommand): void {
    this.saving.set(true);
    this.api.updateProduct(cmd.id, {
      name:         cmd.name,
      description:  cmd.description ?? '',
      sku:          cmd.sku,
      imageUrl:     cmd.imageUrl ?? '',
      sellingPrice: cmd.sellingPrice,
    }).subscribe({
      next: entity => {
        this._patchRecipe(entity);
        this.saving.set(false);
        this.closeModal();
      },
      error: err => {
        this.error.set(err.message);
        this.saving.set(false);
      },
    });
  }

  // ── ADD INGREDIENT (in real-time from edit modal) ─────────────────────────

  addIngredient(cmd: AddIngredientCommand): void {
    this.saving.set(true);
    this.api.addIngredient(cmd.productId, {
      customSupplyId: cmd.customSupplyId,
      quantity:       cmd.quantity,
    }).subscribe({
      next: entity => {
        this._patchRecipe(entity);
        this.saving.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.saving.set(false);
      },
    });
  }

  // ── REMOVE INGREDIENT ─────────────────────────────────────────────────────

  removeIngredient(productId: string, customSupplyId: string): void {
    this.saving.set(true);
    this.api.removeIngredient(productId, customSupplyId).subscribe({
      next: entity => {
        this._patchRecipe(entity);
        if (this.selectedRecipe()?.id === entity.id) this.selectedRecipe.set(entity);
        this.saving.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.saving.set(false);
      },
    });
  }

  // ── DELETE ────────────────────────────────────────────────────────────────

  confirmDelete(recipe: RecipeEntity): void {
    this.recipeToDelete.set(recipe);
    this.showDeleteModal.set(true);
  }

  executeDelete(): void {
    const recipe = this.recipeToDelete();
    if (!recipe) return;
    this.saving.set(true);
    this.api.delete(recipe.id).subscribe({
      next: () => {
        this.recipes.update(list => list.filter(r => r.id !== recipe.id));
        if (this.selectedRecipe()?.id === recipe.id) this.selectedRecipe.set(null);
        this.closeDeleteModal();
        this.closeModal();
        this.saving.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.saving.set(false);
      },
    });
  }

  // ── Modal controls ────────────────────────────────────────────────────────

  openCreateModal(): void  { this.modalMode.set('create'); }

  openEditModal(recipe: RecipeEntity): void {
    this.selectedRecipe.set(recipe);
    this.modalMode.set('edit');
  }

  closeModal(): void         { this.modalMode.set(null); }
  closeDeleteModal(): void   { this.showDeleteModal.set(false); this.recipeToDelete.set(null); }

  setSearch(query: string): void { this.searchQuery.set(query); }

  setAccountId(id: string): void { this.accountId.set(id); }

  // ── Private helpers ───────────────────────────────────────────────────────

  private _patchRecipe(updated: RecipeEntity): void {
    this.recipes.update(list => list.map(r => r.id === updated.id ? updated : r));
  }

  /**
   * Sequentially adds all pending ingredients to a newly created product.
   * Each call waits for the previous to complete (server must confirm).
   */
  private _addIngredientsBatch(
    productId: string,
    pending: PendingIngredient[],
    onDone: () => void,
    index = 0,
  ): void {
    if (index >= pending.length) { onDone(); return; }

    const { supply, quantity } = pending[index];
    this.api.addIngredient(productId, { customSupplyId: supply.id, quantity }).subscribe({
      next: entity => {
        this._patchRecipe(entity);
        this._addIngredientsBatch(productId, pending, onDone, index + 1);
      },
      error: err => {
        this.error.set(err.message);
        this.saving.set(false);
        onDone();
      },
    });
  }
}