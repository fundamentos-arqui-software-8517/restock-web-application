import { Component, Input, Output, EventEmitter, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { KitEntity } from '../../../domain/model/kit.entity';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kit-card',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: 'kit-cad.html',
  styleUrl: 'kit-cad.css',
})
export class KitCardComponent {
  @Input({ required: true }) kit!: KitEntity;
  edit = output<KitEntity>();
  private readonly router = inject(Router);
  readonly fallbackImage =
    'https://st.depositphotos.com/9012638/52754/i/450/depositphotos_527544842-stock-photo-meal-kit-delivery-concept-set.jpg?h=400&w=600&fit=crop';

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.fallbackImage;
  }

  onViewDetail(): void {
    this.router.navigate(['/kits', this.kit.id]);
  }
}
