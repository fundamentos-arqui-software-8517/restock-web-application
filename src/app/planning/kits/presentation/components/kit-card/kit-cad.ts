import { Component, Input, Output, EventEmitter, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Kit } from '../../../domain/model/kit.entity';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-kit-card',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: 'kit-cad.html',
  styleUrl: 'kit-cad.css',
})
export class KitCardComponent {
  @Input({ required: true }) kit!: Kit;

  edit = output<Kit>();

  onEdit(): void {
    this.edit.emit(this.kit);
  }
}
