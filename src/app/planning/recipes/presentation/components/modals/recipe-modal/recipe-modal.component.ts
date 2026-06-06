import {
  Component, Input, Output, EventEmitter,
  OnInit, OnChanges, SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeEntity } from '../../../../domain/model/recipe.entity';
import { CustomSupplyEntity } from '../../../../domain/model/custom-supply.entity';
import { IngredientEntryEntity } from '../../../../domain/model/ingredient-entry.entity';
import { CreateRecipeCommand } from '../../../../domain/commands/create-recipe.command';
import { UpdateRecipeCommand } from '../../../../domain/commands/update-recipe.command';
import { AddIngredientCommand } from '../../../../domain/commands/add-ingredient.command';
import { PendingIngredient } from '../../../../application/recipes.store';

// ── Output event shapes ───────────────────────────────────────────────────────

export interface CreateModalEvent {
  cmd: CreateRecipeCommand;
  pendingIngredients: PendingIngredient[];
}

export interface UpdateModalEvent {
  cmd: UpdateRecipeCommand;
}

export interface RemoveIngredientEvent {
  productId: string;
  customSupplyId: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-recipe-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-modal.component.html',
  styleUrls: ['./recipe-modal.component.scss'],
})
export class RecipeModalComponent implements OnInit, OnChanges {
  @Input() mode!: 'create' | 'edit';
  @Input() recipe: RecipeEntity | null = null;
  @Input() availableSupplies: CustomSupplyEntity[] = [];
  @Input() accountId = '';
  @Input() saving = false;

  @Output() onClose           = new EventEmitter<void>();
  @Output() onCreate          = new EventEmitter<CreateModalEvent>();
  @Output() onUpdate          = new EventEmitter<UpdateModalEvent>();
  @Output() onAddIngredient   = new EventEmitter<AddIngredientCommand>();
  @Output() onRemoveIngredient = new EventEmitter<RemoveIngredientEvent>();
  @Output() onDeleteRequest   = new EventEmitter<RecipeEntity>();

  // ── Form fields ───────────────────────────────────────────────────────────
  name         = '';
  description  = '';
  imageUrl     = '';
  sku          = '';
  sellingPrice = 0;

  // ── Ingredient builder ────────────────────────────────────────────────────
  selectedSupplyId = '';
  ingredientQty    = 1;

  /**
   * In CREATE mode: local list that will be submitted with the form.
   * In EDIT mode: mirrors the saved ingredients from recipe (already persisted).
   * Adding/removing in edit mode emits events to the store immediately.
   */
  pendingIngredients: PendingIngredient[] = [];

  ngOnInit(): void { this._populateForm(); }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recipe'] || changes['availableSupplies']) this._populateForm();
  }

  private _populateForm(): void {
    if (this.mode === 'edit' && this.recipe) {
      this.name         = this.recipe.name;
      this.description  = this.recipe.description;
      this.imageUrl     = this.recipe.imageUrl;
      this.sku          = this.recipe.sku;
      this.sellingPrice = this.recipe.sellingPrice;
      this.pendingIngredients = this._resolveExisting(this.recipe.ingredients);
    } else {
      this.name = this.description = this.imageUrl = this.sku = '';
      this.sellingPrice = 0;
      this.pendingIngredients = [];
    }
  }

  private _resolveExisting(entries: IngredientEntryEntity[]): PendingIngredient[] {
    return entries.map(entry => {
      const supply = this.availableSupplies.find(s => s.id === entry.customSupplyId);
      return {
        supply: supply ?? this._placeholderSupply(entry.customSupplyId),
        quantity: entry.quantity,
        localCost: entry.totalCost,
      };
    });
  }

  private _placeholderSupply(id: string): CustomSupplyEntity {
    return new CustomSupplyEntity({ id, name: id, unitPriceAmount: 0, unitMeasurement: '—' });
  }

  // ── Computed ──────────────────────────────────────────────────────────────

  get estimatedCost(): number {
    if (this.mode === 'edit' && this.recipe) {
      return this.recipe.estimatedCost; // server-calculated
    }
    return this.pendingIngredients.reduce((s, p) => s + p.localCost, 0);
  }

  /** Supplies not yet added to the current recipe */
  get availableToAdd(): CustomSupplyEntity[] {
    const usedIds = new Set(this.pendingIngredients.map(p => p.supply.id));
    return this.availableSupplies.filter(s => !usedIds.has(s.id));
  }

  // ── Ingredient actions ────────────────────────────────────────────────────

  addIngredient(): void {
    if (!this.selectedSupplyId || this.ingredientQty <= 0) return;
    const supply = this.availableSupplies.find(s => s.id === this.selectedSupplyId);
    if (!supply) return;

    if (this.mode === 'edit' && this.recipe) {
      this.onAddIngredient.emit({
        productId:      this.recipe.id,
        customSupplyId: supply.id,
        quantity:       this.ingredientQty,
      });
      this.pendingIngredients = [
        ...this.pendingIngredients,
        { supply, quantity: this.ingredientQty, localCost: supply.unitPriceAmount * this.ingredientQty },
      ];
    } else {
      // CREATE mode: accumulate locally
      this.pendingIngredients = [
        ...this.pendingIngredients,
        { supply, quantity: this.ingredientQty, localCost: supply.unitPriceAmount * this.ingredientQty },
      ];
    }

    this.selectedSupplyId = '';
    this.ingredientQty = 1;
  }

  removeIngredient(index: number): void {
    const removed = this.pendingIngredients[index];
    this.pendingIngredients = this.pendingIngredients.filter((_, i) => i !== index);

    if (this.mode === 'edit' && this.recipe) {
      this.onRemoveIngredient.emit({
        productId:      this.recipe.id,
        customSupplyId: removed.supply.id,
      });
    }
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  submit(): void {
    if (this.mode === 'create') {
      this.onCreate.emit({
        cmd: {
          accountId:    this.accountId,
          name:         this.name,
          description:  this.description,
          sku:          this.sku,
          type:         'RECIPE',
          imageUrl:     this.imageUrl,
          sellingPrice: this.sellingPrice,
        },
        pendingIngredients: this.pendingIngredients,
      });
    } else if (this.mode === 'edit' && this.recipe) {
      this.onUpdate.emit({
        cmd: {
          id:           this.recipe.id,
          name:         this.name,
          description:  this.description,
          sku:          this.sku,
          imageUrl:     this.imageUrl,
          sellingPrice: this.sellingPrice,
        },
      });
    }
  }

  requestDelete(): void {
    if (this.recipe) this.onDeleteRequest.emit(this.recipe);
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose.emit();
    }
  }
}
