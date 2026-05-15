import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-inventory-discrepancies-placeholder',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './inventory-discrepancies-placeholder.html',
  styleUrl: './inventory-discrepancies-placeholder.css',
})
export class InventoryDiscrepanciesPlaceholder {}
