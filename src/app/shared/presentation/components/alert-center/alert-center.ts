import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { AlertService } from '../../../application/alert.service';

@Component({
  selector: 'app-alert-center',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './alert-center.html',
  styleUrl: './alert-center.css',
})
export class AlertCenterComponent {
  protected readonly alerts = inject(AlertService);
}
