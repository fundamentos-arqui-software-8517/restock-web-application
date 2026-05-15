import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, TranslatePipe],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css',
})
export class TopBar {
  userName = input<string>('User');
  userAvatarUrl = input<string | null>(null);
  /** ngx-translate key for the search input placeholder. */
  searchPlaceholderKey = input<string>('layout.search.default');
}
