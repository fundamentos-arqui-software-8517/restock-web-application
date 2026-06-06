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
  readonly fallbackImage = 'assets/placeholder-kit.png';

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.fallbackImage;
  }

  onViewDetail(): void {
    this.router.navigate(['/kits', this.kit.id]);
  }
}
