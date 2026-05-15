import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, type IsActiveMatchOptions } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, map, startWith } from 'rxjs';
import type { NavItem } from './nav-item.model';

@Component({
  selector: 'app-navigator',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, TranslatePipe],
  templateUrl: './navigator.html',
  styleUrl: './navigator.css',
})
export class Navigator {
  navItems = input<NavItem[]>([]);

  private readonly router = inject(Router);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url.split('?')[0] ?? ''),
      startWith(this.router.url.split('?')[0] ?? ''),
    ),
    { initialValue: this.router.url.split('?')[0] ?? '' },
  );

  /** Stock / Discrepancies only while the user is in the inventory section (after navigating there). */
  readonly inventorySubnavVisible = computed(() => this.currentUrl().startsWith('/inventory'));

  /** Match when current URL extends this nav link (e.g. /inventory for /inventory/stock). */
  readonly sectionActiveMatch: IsActiveMatchOptions = {
    paths: 'subset',
    queryParams: 'ignored',
    matrixParams: 'ignored',
    fragment: 'ignored',
  };
}
