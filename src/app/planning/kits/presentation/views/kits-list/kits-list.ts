import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KitEntity } from '../../../domain/model/kit.entity';
import { EditKitModalComponent } from '../edit-kit/edit-kit';
import { KitCardComponent } from '../../components/kit-card/kit-cad';
import { KitFormModalComponent } from '../create-kit/create-kit';
import { TranslateModule } from '@ngx-translate/core';
import { KitStore } from '../../../application/kits.store';

@Component({
  selector: 'app-planning-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    KitCardComponent,
    KitFormModalComponent,
    EditKitModalComponent,
    TranslateModule,
  ],
  templateUrl: './kits-list.html',
  styleUrl: './kits-list.css',
})
export class PlanningDashboardComponent implements OnInit {
  protected readonly kitsStore = inject(KitStore);

  isCreateModalOpen = signal(false);
  isEditModalOpen = signal(false);
  selectedKit = signal<KitEntity | null>(null);

  ngOnInit() {
    this.kitsStore.loadAllKits();
  }

  openCreateModal() {
    this.isCreateModalOpen.set(true);
  }
  closeCreateModal() {
    this.isCreateModalOpen.set(false);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedKit.set(null);
  }
}
