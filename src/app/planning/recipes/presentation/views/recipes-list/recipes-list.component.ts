import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecipesStore } from '../../../application/recipes.store';
import { RecipeEntity } from '../../../domain/model/recipe.entity';
import { RecipeModalComponent } from '../../components/modals/recipe-modal/recipe-modal.component';
import { DeleteModalComponent } from '../../components/modals/delete-modal/delete-modal.component';

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [CommonModule, RecipeModalComponent, DeleteModalComponent],
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss'],
})
export class RecipesListComponent implements OnInit {
  readonly store = inject(RecipesStore);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.store.loadAll();
  }

  goToDetail(recipe: RecipeEntity): void {
    this.store.selectRecipe(recipe);
    this.router.navigate(['/recipes', recipe.id]);
  }

  onSearch(event: Event): void {
    this.store.setSearch((event.target as HTMLInputElement).value);
  }

  stopProp(event: Event): void {
    event.stopPropagation();
  }
}
