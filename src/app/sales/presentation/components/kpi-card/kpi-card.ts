import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Small, 100% reusable stat card: label + big value + optional trend caption.
 * Used 4x in Sales Overview (Total Sales, Transaction Count, Failed Sync
 * Rate, Active Terminals), each with its own data via @Input.
 */
@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.css',
})
export class KpiCardComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() caption = '';
  /** Controls the color of `value` and `caption`. */
  @Input() variant: 'neutral' | 'positive' | 'negative' = 'neutral';
  /** Controls the color of the caption specifically. If blank, falls back to `variant`. */
  @Input() captionVariant: 'neutral' | 'positive' | 'negative' | '' = '';
}
