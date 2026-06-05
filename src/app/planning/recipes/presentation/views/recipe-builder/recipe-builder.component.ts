import { Component, OnInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecipesStore } from '../../../application/recipes.store';
import { RecipeEntity } from '../../../domain/model/recipe.entity';
import { CustomSupplyEntity } from '../../../domain/model/custom-supply.entity';
import { IngredientEntryEntity } from '../../../domain/model/ingredient-entry.entity';
import { RecipeModalComponent } from '../../components/modals/recipe-modal/recipe-modal.component';
import { DeleteModalComponent } from '../../components/modals/delete-modal/delete-modal.component';

export interface ResolvedIngredient {
  entry: IngredientEntryEntity;
  supply: CustomSupplyEntity | undefined;
}

@Component({
  selector: 'app-recipe-builder',
  standalone: true,
  imports: [CommonModule, RouterModule, RecipeModalComponent, DeleteModalComponent],
  templateUrl: './recipe-builder.component.html',
  styleUrls: ['./recipe-builder.component.scss'],
})
export class RecipeBuilderComponent implements OnInit {
  readonly store = inject(RecipesStore);
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);

  recipe: RecipeEntity | null = null;
  resolvedIngredients: ResolvedIngredient[] = [];

  constructor() {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');
      const found = this.store.recipes().find(r => r.id === id);
      
      if (found) {
        this.recipe = found;
        this.resolvedIngredients = this.store.resolveIngredients(this.recipe);
      } else {
        this.recipe = null;
        this.resolvedIngredients = [];
      }
    });
  }

  ngOnInit(): void {
    if (this.store.recipes().length === 0) {
      this.store.loadAll();
    }
  }

  get estimatedCost(): number {
    return this.recipe?.estimatedCost ?? 0;
  }

  get profitMargin(): number {
    if (!this.recipe || this.recipe.sellingPrice === 0) return 0;
    return ((this.recipe.sellingPrice - this.estimatedCost) / this.recipe.sellingPrice) * 100;
  }

  goBack(): void {
    this.router.navigate(['/recipes']);
  }

  refreshRecipe(): void {}
}