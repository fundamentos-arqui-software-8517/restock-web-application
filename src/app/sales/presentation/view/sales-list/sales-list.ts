import { Component, inject, signal } from '@angular/core';
import { SalesStore } from '../../../application/sales.store';
import { Router, RouterLink } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Sale } from '../../../domain/model/sale.entity';
import { SaleDetailDrawer } from '../../components/sale-detail-drawer/sale-detail-drawer';

@Component({
  selector: 'app-sales-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatPaginatorModule,
    MatCard,
    MatCardContent,
    MatProgressBar,
    RouterLink,
    SaleDetailDrawer,
  ],
  templateUrl: './sales-list.html',
  styleUrl: './sales-list.css',
})
export class SalesList {
  readonly store = inject(SalesStore);
  protected router = inject(Router);

  displayedColumns: string[] = ['id', 'saleDate', 'itemsCount', 'total', 'saleStatus'];
  selectedSale = signal<Sale | null>(null);

  ngOnInit(): void {
    this.store.loadSalesByBranchId();
  }

  openDrawer(sale: Sale): void {
    this.selectedSale.set(sale);
  }

  closeDrawer(): void {
    this.selectedSale.set(null);
  }
}
