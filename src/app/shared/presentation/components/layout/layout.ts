import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { ProfilesStore } from '../../../../profiles/application/profiles.store';
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
    if (url.startsWith('/inventory/stock')) {
      return 'layout.search.batches';
    }
    return 'layout.search.default';
  });

  navItems = signal<NavItem[]>([
    { labelKey: 'nav.overview', icon: 'grid_view', link: '/' },
    {
      labelKey: 'nav.inventory',
      icon: 'inventory_2',
      link: '/inventory',
      children: [
        { labelKey: 'nav.stock', link: '/inventory/stock' },
        { labelKey: 'nav.discrepancies', link: '/inventory/discrepancies' },
      ],
    },
    { labelKey: 'nav.recipes', icon: 'restaurant_menu', link: '/recipes' },
    { labelKey: 'nav.sales', icon: 'trending_up', link: '/sales' },
    { labelKey: 'nav.alerts', icon: 'notifications', link: '/alerts' },
    { labelKey: 'nav.devices', icon: 'router', link: '/devices' },
    { labelKey: 'nav.settings', icon: 'settings', link: '/settings' },
  ]);

  userName = computed(() => {
    const p = this.profilesStore.profile();
    return p ? `${p.firstName} ${p.lastName}` : '';
  });

  userAvatarUrl = computed(() => this.profilesStore.profile()?.avatarUrl ?? null);

  constructor() {
    this.profilesStore.load();
  }
}
