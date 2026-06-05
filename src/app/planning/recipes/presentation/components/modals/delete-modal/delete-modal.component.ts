import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeEntity } from '../../../../domain/model/recipe.entity';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
})
export class DeleteModalComponent {
  @Input() recipe: RecipeEntity | null = null;
  @Output() onCancel  = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<void>();

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onCancel.emit();
    }
  }
}
