import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { IamStore } from '../../../../iam/application/iam.store';
import { ProfilesStore } from '../../../../profiles/application/profiles.store';
import { LoadProfilesStateCommand } from '../../../../profiles/domain/model/load-profiles-state.command';
import type { NavItem } from '../navigator/nav-item.model';
import { Navigator } from '../navigator/navigator';
import { TopBar } from '../top-bar/top-bar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, Navigator, TopBar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private readonly router = inject(Router);
  private readonly iamStore = inject(IamStore);
  private readonly profilesStore = inject(ProfilesStore);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url.split('?')[0] ?? ''),
      startWith(this.router.url.split('?')[0] ?? ''),
    ),
    { initialValue: this.router.url.split('?')[0] ?? '' },
  );

  readonly searchPlaceholderKey = computed(() => {
    const url = this.currentUrl();
    if (url.startsWith('/inventory/batches') || url.startsWith('/inventory/stock')) {
      return 'layout.search.batches';
    }
    if (url.startsWith('/inventory/custom-supplies')) {
      return 'layout.search.customSupplies';
    }
    return 'layout.search.default';
  });

  navItems = signal<NavItem[]>([
    { labelKey: 'nav.overview', icon: 'grid_view', link: '/home' },
    {
      labelKey: 'nav.inventory',
      icon: 'inventory_2',
      link: '/inventory',
      children: [
        { labelKey: 'nav.customSupplies', link: '/inventory/custom-supplies' },
        { labelKey: 'nav.batches', link: '/inventory/batches' },
        { labelKey: 'nav.discrepancies', link: '/inventory/discrepancies' },
      ],
    },
    { labelKey: 'nav.recipes', icon: 'restaurant_menu', link: '/recipes' },
    { labelKey: 'nav.kits', icon: 'inventory', link: '/kits' },
    { labelKey: 'nav.sales', icon: 'trending_up', link: '/sales' },
    { labelKey: 'nav.alerts', icon: 'notifications', link: '/alerts' },
    { labelKey: 'nav.devices', icon: 'router', link: '/devices' },
    { labelKey: 'nav.settings', icon: 'settings', link: '/settings' },
  ]);

  userName = computed(() => {
    const p = this.profilesStore.profile();
    if (p) {
      return `${p.name} ${p.lastName}`;
    }
    return this.iamStore.currentUser()?.email ?? '';
  });

  userAvatarUrl = computed(() => this.profilesStore.profile()?.avatarUrl.getValue() ?? null);

  constructor() {
    /** Bootstrap aggregates for the shell (avatar, name) and any child views consuming {@link ProfilesStore}. */
    this.profilesStore.loadProfilesState(new LoadProfilesStateCommand());
  }
}
