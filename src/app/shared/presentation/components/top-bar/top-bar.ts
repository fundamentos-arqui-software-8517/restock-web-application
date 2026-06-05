import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';
import { IamStore } from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatMenuModule, TranslatePipe],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css',
})
export class TopBar {
  private readonly iamStore = inject(IamStore);
  private readonly router = inject(Router);

  userName = input<string>('User');
  userAvatarUrl = input<string | null>(null);
  /** ngx-translate key for the search input placeholder. */
  searchPlaceholderKey = input<string>('layout.search.default');

  onSignOut(): void {
    this.iamStore.signOut();
    void this.router.navigate(['/sign-in']);
  }
}
