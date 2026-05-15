import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-placeholder-page',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <section class="ph">
      <h1 class="ph-title">{{ titleKey() | translate }}</h1>
      <p class="ph-muted">{{ 'placeholder.notImplemented' | translate }}</p>
    </section>
  `,
  styles: [
    `
      .ph {
        padding: 24px 28px;
        max-width: 960px;
      }
      .ph-title {
        margin: 0 0 8px;
        font-size: 22px;
        font-weight: 700;
        color: #111827;
      }
      .ph-muted {
        margin: 0;
        color: #6b7280;
        font-size: 14px;
      }
    `,
  ],
})
export class PlaceholderPage {
  private readonly route = inject(ActivatedRoute);

  readonly titleKey = toSignal(
    this.route.data.pipe(map((d) => (typeof d['titleKey'] === 'string' ? d['titleKey'] : 'nav.recipes'))),
    { initialValue: 'nav.recipes' },
  );
}
