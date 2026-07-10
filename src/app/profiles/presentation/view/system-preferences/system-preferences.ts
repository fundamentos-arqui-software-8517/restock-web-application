import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { Profile } from '../../../domain/model/profile.entity';
import { ProfilesStore } from '../../../application/profiles.store';
import { UpdateProfileCommand } from '../../../domain/model/update-profile.command';
import { UpdateBusinessCommand } from '../../../domain/model/update-business.command';
import { ResourceStore } from '../../../../resource/application/resource.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { Router } from '@angular/router';
import { SubscriptionsStore } from '../../../../subscriptions/application/subscriptions.store';
import { DevicesStore } from '../../../../devices/application/devices.store';
import { KitStore } from '../../../../planning/kits/application/kits.store';
import { RecipesStore } from '../../../../planning/recipes/application/recipes.store';

/** Local snapshot for "discard changes" on the profile tab (primitives only). */
interface ProfileFieldSnapshot {
  profileId: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string;
  gender: string;
  birthDate: string;
}

@Component({
  selector: 'app-system-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, UpperCasePipe, TranslateModule],
  templateUrl: './system-preferences.html',
  styleUrl: './system-preferences.css',
})
export class SystemPreferences {
  private readonly store = inject(ProfilesStore);
  private readonly translate = inject(TranslateService);
  private readonly resourceStore = inject(ResourceStore);
  private readonly iamStore = inject(IamStore);
  private readonly subStore = inject(SubscriptionsStore);
  private readonly router = inject(Router);
  private readonly devicesStore = inject(DevicesStore);
  private readonly kitStore = inject(KitStore);
  private readonly recipesStore = inject(RecipesStore);

  activeTab = signal<'general' | 'profile' | 'branches' | 'subscriptions'>('general');

  // ── General tab ──
  timezone = signal('UTC -05:00 Eastern Time (US & Canada)');
  currency = signal('USD - United States Dollar ($)');
  language = signal(this.translate.getCurrentLang() || 'en');
  branch = signal(this.resourceStore.currentBranchId());
  emailNotifications = signal(true);
  smsAlerts = signal(false);

  readonly timezones = [
    'UTC -12:00 International Date Line West',
    'UTC -08:00 Pacific Time (US & Canada)',
    'UTC -07:00 Mountain Time (US & Canada)',
    'UTC -06:00 Central Time (US & Canada)',
    'UTC -05:00 Eastern Time (US & Canada)',
    'UTC +00:00 Greenwich Mean Time',
    'UTC +01:00 Central European Time',
  ];

  readonly currencies = [
    'USD - United States Dollar ($)',
    'EUR - Euro (€)',
    'GBP - British Pound (£)',
    'JPY - Japanese Yen (¥)',
    'MXN - Mexican Peso ($)',
  ];

  readonly languageOptions = [
    { code: 'en', label: 'English (US)' },
    { code: 'es', label: 'Spanish' },
  ];

  // Branches come from the ResourceStore — no local copy needed.
  readonly branchOptions = computed(() => this.resourceStore.branches());
  readonly allBranches = computed(() => this.resourceStore.branches());
  readonly currentBranchId = computed(() => this.resourceStore.currentBranchId());

  // ── Branches tab ──
  readonly branchesLoading = signal(false);
  readonly branchesError = signal<string | null>(null);
  readonly branchesCreateLoading = signal(false);
  readonly branchesCreateError = signal<string | null>(null);
  readonly showCreateForm = signal(false);

  readonly newBranchForm = new FormGroup({
    name:          new FormControl('', [Validators.required]),
    address:       new FormControl('', [Validators.required]),
    city:          new FormControl('', [Validators.required]),
    country:       new FormControl('United States', [Validators.required]),
    regionOrState: new FormControl('', [Validators.required]),
    description:   new FormControl(''),
  });

  readonly countries = [
    'United States', 'Canada', 'Mexico', 'Argentina', 'Brazil',
    'Colombia', 'Chile', 'Peru', 'Spain', 'United Kingdom',
  ];

  readonly genderOptions = [
    { value: 'MALE',   labelKey: 'settings.profile.gender.male' },
    { value: 'FEMALE', labelKey: 'settings.profile.gender.female' },
  ];

  // ── Profile tab ──
  profileEntityId = signal('');
  firstName = signal('');
  lastName = signal('');
  phone = signal('');
  avatarUrl = signal('');
  gender = signal('');
  birthDate = signal('');
  profileImageFile = signal<File | null>(null);
  profileImagePreview = signal<string | null>(null);

  // ── Business tab ──
  businessId = signal('');
  businessName = signal('');
  businessRuc = signal('');
  businessLocation = signal('');
  businessPictureUrl = signal('');
  businessImageFile = signal<File | null>(null);
  businessImagePreview = signal<string | null>(null);

  // ── Branch create image ──
  branchImageFile = signal<File | null>(null);
  branchImagePreview = signal<string | null>(null);

  readonly profileLoading = computed(() => this.store.loading());
  readonly business = computed(() => this.store.business());
  readonly profileError = computed(() => this.store.error());
  readonly subscription = computed(() => this.subStore.activeSubscription());
  readonly subscriptionLoading = computed(() => this.subStore.subscriptionLoading());
  readonly plans = computed(() => this.subStore.plans());

  isDowngrade(plan: any): boolean {
    const sub = this.subscription();
    if (!sub) return false;
    const tierLevels: Record<string, number> = { 'plan_starter': 1, 'plan_pro': 2, 'plan_enterprise': 3 };
    const currentTier = tierLevels[sub.planId] ?? 0;
    const targetTier = tierLevels[plan.id] ?? 0;
    return targetTier < currentTier;
  }

  readonly devicesCount = computed(() => this.devicesStore.devices().length);
  readonly maxDevicesText = computed(() => {
    const sub = this.subscription();
    return !sub ? '2' : sub.maxDevices === -1 ? 'Unlimited' : sub.maxDevices.toString();
  });
  readonly devicesUsagePercent = computed(() => {
    const count = this.devicesCount();
    const sub = this.subscription();
    if (!sub) return Math.min(100, Math.round((count / 2) * 100));
    if (sub.maxDevices === -1) return 100;
    return Math.min(100, Math.round((count / sub.maxDevices) * 100));
  });

  readonly invoiceHistory = computed(() => this.subStore.invoices());

  private savedProfileFields: ProfileFieldSnapshot | null = null;

  constructor() {
    // Re-load profile/business whenever the authenticated user changes.
    // This covers both the initial page load and any future sign-in transitions.
    effect(() => {
      const user = this.iamStore.currentUser();
      if (user?.accountId) {
        this.store.loadProfilesState();
      }
    });

    if (this.resourceStore.branches().length === 0) {
      this.resourceStore.loadBranches();
    }

    effect(() => {
      const profile = this.store.profile();
      if (!profile) return;
      this.applyProfile(profile);
      this.captureSnapshot(profile);
    });

    effect(() => {
      const biz = this.store.business();
      if (!biz) return;
      this.businessId.set(biz.id);
      this.businessName.set(biz.companyName);
      this.businessRuc.set(biz.ruc);
      this.businessLocation.set(biz.mainLocation.getValue());
      this.businessPictureUrl.set(biz.pictureUrl.getValue());
    });

    // Keep the general-tab branch selector in sync when branches load.
    effect(() => {
      const branches = this.resourceStore.branches();
      const saved = this.resourceStore.currentBranchId();
      const exists = branches.some((b) => b.id === saved);
      const next = exists ? saved : branches[0]?.id ?? '';
      this.branch.set(next);
    });
  }

  private applyProfile(profile: Profile): void {
    this.profileEntityId.set(profile.id);
    this.firstName.set(profile.name);
    this.lastName.set(profile.lastName);
    this.phone.set(profile.phoneNumber.getValue());
    this.avatarUrl.set(profile.avatarUrl.getValue());
    this.gender.set(profile.gender);
    this.birthDate.set(profile.birthDate.getValue());
  }

  private captureSnapshot(profile: Profile): void {
    this.savedProfileFields = {
      profileId: profile.id,
      userId: profile.userId.getValue(),
      firstName: profile.name,
      lastName: profile.lastName,
      phone: profile.phoneNumber.getValue(),
      avatarUrl: profile.avatarUrl.getValue(),
      gender: profile.gender,
      birthDate: profile.birthDate.getValue(),
    };
  }

  setTab(tab: 'general' | 'profile' | 'branches' | 'subscriptions'): void {
    this.activeTab.set(tab);
    if (tab === 'branches' && this.resourceStore.branches().length === 0) {
      this.branchesLoading.set(true);
      this.resourceStore.loadBranches();
      // branchesLoading cleared reactively once branches signal populates
      // Use a short timeout as fallback since loadBranches is fire-and-forget.
      setTimeout(() => this.branchesLoading.set(false), 3000);
    }
    if (tab === 'subscriptions') {
      const currentUser = this.iamStore.currentUser();
      if (currentUser) {
        this.subStore.loadSubscriptionStatus(currentUser.accountId);
        this.subStore.loadPlans();
        this.subStore.loadInvoices(currentUser.accountId);
        this.devicesStore.loadDevicesForAccount(currentUser.accountId);
        this.kitStore.loadAllKits();
        this.recipesStore.loadAll(currentUser.accountId);
      }
    }
  }

  viewPricingPlans(): void {
    void this.router.navigate(['/subscriptions/plans']);
  }

  cancelCurrentSubscription(): void {
    const sub = this.subscription();
    if (!sub) return;
    if (confirm("Are you sure you want to cancel your current subscription? It will remain active until the end of the current billing cycle.")) {
      // In production, this would hit the API. For dev, we simulate:
      alert("Subscription cancellation request sent to Stripe. The subscription status will update at the end of the period.");
    }
  }

  downloadInvoicesCsv(): void {
    alert("Downloading billing history as CSV...");
  }

  viewInvoice(pdfUrl: string): void {
    if (pdfUrl && pdfUrl !== '#' && pdfUrl.startsWith('http')) {
      window.open(pdfUrl, '_blank');
    } else {
      alert("Stripe PDF invoice is still generating or not available for mock transactions.");
    }
  }

  loadMoreHistory(): void {
    alert("All billing history records loaded.");
  }

  viewAnalytics(): void {
    void this.router.navigate(['/analytics']);
  }

  selectPlan(planId: string): void {
    const currentUser = this.iamStore.currentUser();
    if (!currentUser) return;
    this.subStore.subscribeToPlan(currentUser.accountId, planId);
  }

  // ── General tab actions ────────────────────────────────────────────────────

  discardChanges(): void {
    this.timezone.set('UTC -05:00 Eastern Time (US & Canada)');
    this.currency.set('USD - United States Dollar ($)');
    this.language.set('English (US)');
    this.branch.set(this.resourceStore.currentBranchId() || this.branchOptions()[0]?.id || '');
    this.emailNotifications.set(true);
    this.smsAlerts.set(false);
  }

  savePreferences(): void {
    this.translate.use(this.language());
    this.resourceStore.setCurrentBranchId(this.branch());
  }

  setLanguage(languageCode: string): void {
    this.language.set(languageCode);
    this.translate.use(languageCode);
  }

  // ── Profile tab actions ───────────────────────────────────────────────────

  onProfileImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.profileImageFile.set(file);
    const reader = new FileReader();
    reader.onload = (e) => this.profileImagePreview.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  onBusinessImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.businessImageFile.set(file);
    const reader = new FileReader();
    reader.onload = (e) => this.businessImagePreview.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  onBranchImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.branchImageFile.set(file);
    const reader = new FileReader();
    reader.onload = (e) => this.branchImagePreview.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  discardProfileChanges(): void {
    const snap = this.savedProfileFields;
    if (!snap) return;
    this.profileEntityId.set(snap.profileId);
    this.firstName.set(snap.firstName);
    this.lastName.set(snap.lastName);
    this.phone.set(snap.phone);
    this.avatarUrl.set(snap.avatarUrl);
    this.gender.set(snap.gender);
    this.birthDate.set(snap.birthDate);
  }

  saveProfileChanges(): void {
    // Always read the live profile from the store — never trust the local signal alone,
    // because profileEntityId may still be '' if the effect hasn't fired yet.
    const liveProfile = this.store.profile();
    const resolvedProfileId = liveProfile?.id || this.profileEntityId();

    const userId =
      liveProfile?.userId.getValue() ||
      this.iamStore.currentUser()?.id ||
      '';

    const cmd = new UpdateProfileCommand({
      profileId: resolvedProfileId,
      userId,
      name: this.firstName(),
      lastName: this.lastName(),
      phoneNumber: this.phone(),
      avatarUrl: this.avatarUrl(),
      gender: this.gender(),
      birthDate: this.birthDate(),
      imageFile: this.profileImageFile() ?? undefined,
    });
    this.store.updateProfile(cmd);
    this.profileImageFile.set(null);
    this.profileImagePreview.set(null);
  }

  // ── Business tab actions ──────────────────────────────────────────────────

  discardBusinessChanges(): void {
    const biz = this.store.business();
    if (!biz) return;
    this.businessName.set(biz.companyName);
    this.businessRuc.set(biz.ruc);
    this.businessLocation.set(biz.mainLocation.getValue());
    this.businessPictureUrl.set(biz.pictureUrl.getValue());
  }

  saveBusinessChanges(): void {
    // Always read the live business from the store — never trust the local signal alone.
    const liveBusiness = this.store.business();
    const resolvedBusinessId = liveBusiness?.id || this.businessId();

    const userId =
      liveBusiness?.ownerId.getValue() ||
      this.iamStore.currentUser()?.id ||
      '';

    const cmd = new UpdateBusinessCommand(
      resolvedBusinessId,
      userId,
      this.businessName(),
      this.businessRuc(),
      this.businessPictureUrl(),
      this.businessLocation(),
      this.businessImageFile() ?? undefined,
    );
    this.store.saveBusiness(cmd);
    this.businessImageFile.set(null);
    this.businessImagePreview.set(null);
  }

  // ── Branches tab actions ──────────────────────────────────────────────────

  switchBranch(branchId: string): void {
    this.resourceStore.setCurrentBranchId(branchId);
    this.branch.set(branchId);
  }

  openCreateForm(): void {
    this.newBranchForm.reset({ country: 'United States' });
    this.branchesCreateError.set(null);
    this.showCreateForm.set(true);
  }

  cancelCreateForm(): void {
    this.showCreateForm.set(false);
    this.branchesCreateError.set(null);
  }

  submitCreateBranch(): void {
    if (this.newBranchForm.invalid) {
      this.newBranchForm.markAllAsTouched();
      return;
    }

    const accountId = this.resourceStore.accountId();

    this.branchesCreateLoading.set(true);
    this.branchesCreateError.set(null);

    this.resourceStore
      .createBranch({
        accountId,
        name:          this.newBranchForm.value.name!,
        address:       this.newBranchForm.value.address!,
        city:          this.newBranchForm.value.city!,
        country:       this.newBranchForm.value.country!,
        regionOrState: this.newBranchForm.value.regionOrState ?? undefined,
        description:   this.newBranchForm.value.description ?? undefined,
        image:         this.branchImageFile() ?? undefined,
      })
      .pipe(finalize(() => this.branchesCreateLoading.set(false)))
      .subscribe({
        next: (branch) => {
          this.showCreateForm.set(false);
          this.branchImageFile.set(null);
          this.branchImagePreview.set(null);
          this.switchBranch(branch.id);
        },
        error: () => {
          this.branchesCreateError.set('settings.branches.createError');
        },
      });
  }
}
