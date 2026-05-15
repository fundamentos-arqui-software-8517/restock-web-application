import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [TranslatePipe],
  template: `<p class="home-line">{{ 'home.title' | translate }}</p>`,
  styles: [
    `
      .home-line {
        margin: 24px 28px;
        font-size: 15px;
        color: #374151;
      }
    `,
  ],
})
export class HomePage {}
