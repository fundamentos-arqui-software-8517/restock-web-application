import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, type IsActiveMatchOptions } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, map, startWith } from 'rxjs';

import { IamStore } from '../../../../iam/application/iam.store';
import type { NavItem } from './nav-item.model';

@Component({
  selector: 'app-navigator',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, TranslatePipe],
  templateUrl: './navigator.html',
  styleUrl: './navigator.css',
})
export class Navigator {
  navItemsInput = input<NavItem[]>([], { alias: 'navItems' });

  private readonly router = inject(Router);
  private readonly iamStore = inject(IamStore);

  private readonly userRole = computed(() => this.iamStore.currentUser()?.roleId ?? '');

  readonly filteredNavItems = computed(() => {
    const currentRole = this.userRole();
    const items = this.navItemsInput();

    return items.filter(item => {
      if (!item.allowedRoles || item.allowedRoles.length === 0) {
        return true;
      }
      return item.allowedRoles.includes(currentRole);
    });
  });

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url.split('?')[0] ?? ''),
      startWith(this.router.url.split('?')[0] ?? ''),
    ),
    { initialValue: this.router.url.split('?')[0] ?? '' },
  );

  readonly inventorySubnavVisible = computed(() => this.currentUrl().startsWith('/inventory'));

  readonly sectionActiveMatch: IsActiveMatchOptions = {
    paths: 'subset',
    queryParams: 'ignored',
    matrixParams: 'ignored',
    fragment: 'ignored',
  };
}