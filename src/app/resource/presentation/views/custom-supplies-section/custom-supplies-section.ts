import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ResourceStore } from '../../../application/resource.store';
import { IamStore as AuthService } from '../../../../iam/application/iam.store';
import { CustomSupply } from '../../../domain/model/custom-supply.entity';
import { CustomSupplyCardComponent } from '../../components/custom-supply-card/custom-supply-card';
import { CreateCustomSupplyDialogComponent } from '../../components/create-custom-supply-dialog/create-custom-supply-dialog';
import { EditCustomSupplyDialogComponent } from '../../components/edit-custom-supply-dialog/edit-custom-supply-dialog';
import { RESOURCE_PATHS } from '../../resource-paths';

@Component({
  selector: 'app-custom-supplies-section',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CustomSupplyCardComponent,
    CreateCustomSupplyDialogComponent,
    EditCustomSupplyDialogComponent,
  ],
  templateUrl: './custom-supplies-section.html',
  styleUrl: './custom-supplies-section.css'
})
export class CustomSuppliesSectionComponent implements OnInit {
  private readonly store = inject(ResourceStore);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly customSupplies = this.store.customSupplies;
  readonly loading = this.store.loading;
  readonly RESOURCE_PATHS = RESOURCE_PATHS;

  showCreateModal = false;
  selectedSupplyToEdit: CustomSupply | null = null;
  supplyPendingDelete: CustomSupply | null = null;

  ngOnInit(): void {
    const user = this.authService.currentUser();
    const accountId = user?.accountId ?? '';
    if (accountId) {
      this.store.loadCustomSuppliesByAccount(accountId);
    } else {
      console.warn('[CustomSuppliesSection] No accountId found in session');
    }
  }

  onViewSupply(id: string): void {
    this.router.navigate([RESOURCE_PATHS.customSupplies.detail(id)]);
  }

  onEditSupply(supply: CustomSupply): void {
    this.selectedSupplyToEdit = supply;
  }

  closeEditModal(): void {
    this.selectedSupplyToEdit = null;
  }

  onDeleteSupply(supply: CustomSupply): void {
    this.supplyPendingDelete = supply;
  }

  cancelDeleteSupply(): void {
    this.supplyPendingDelete = null;
  }

  confirmDeleteSupply(): void {
    const supply = this.supplyPendingDelete;
    const accountId = this.authService.currentUser()?.accountId ?? supply?.accountId ?? '';
    if (!supply || !accountId) return;

    this.store.deleteCustomSupply(supply.id, accountId).subscribe(() => {
      this.supplyPendingDelete = null;
    });
  }
}
