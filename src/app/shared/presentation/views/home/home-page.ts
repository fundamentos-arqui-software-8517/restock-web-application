import { Component } from '@angular/core';
import { DashboardSectionComponent } from '../../../../analytics/presentation/views/dashboard-section/dashboard-section';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [DashboardSectionComponent],
  template: `<app-dashboard-section />`,
})
export class HomePage {}

