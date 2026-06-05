import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KitsStore } from '../../../application/kits.store';
import { Kit } from '../../../domain/model/kit.entity';
import { EditKitModalComponent } from '../edit-kit/edit-kit';
import { KitCardComponent } from '../../components/kit-card/kit-cad';
import { KitFormModalComponent } from '../create-kit/create-kit';
import { TranslateModule } from '@ngx-translate/core';

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
  protected readonly kitsStore = inject(KitsStore);

  isCreateModalOpen = signal(false);
  isEditModalOpen = signal(false);
  selectedKit = signal<Kit | null>(null);

  ngOnInit(): void {
    console.log('Iniciando carga de kits...');
    this.kitsStore.loadAllKits();
  }

  openCreateModal() {
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal() {
    this.isCreateModalOpen.set(false);
  }
  handleEditKit(kit: Kit): void {
    console.log('Kit seleccionado para actualización estratégica:', kit);
    this.selectedKit.set(kit);
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedKit.set(null);
  }
}
