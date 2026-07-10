import { Routes } from '@angular/router';

const systemPreferences = () =>
  import('./view/system-preferences/system-preferences').then((m) => m.SystemPreferences);

const registrationPersonalProfile = () =>
  import('./view/registration-personal-profile/registration-personal-profile').then(
    (m) => m.RegistrationPersonalProfile,
  );

const registrationBusinessDetails = () =>
  import('./view/registration-business-details/registration-business-details').then(
    (m) => m.RegistrationBusinessDetails,
  );

const registrationBranchSetup = () =>
  import('./view/registration-branch-setup/registration-branch-setup').then(
    (m) => m.RegistrationBranchSetup,
  );

const registrationPlanSelection = () =>
  import('./view/registration-plan-selection/registration-plan-selection').then(
    (m) => m.RegistrationPlanSelection,
  );

/**
 * Routes for the profiles module.
 */
export const profilesRoutes: Routes = [
  {
    path: '',
    loadComponent: systemPreferences,
    title: 'Profile Overview',
  },
  {
    path: 'register',
    children: [
      {
        path: '',
        loadComponent: registrationPersonalProfile,
        title: 'Create your Account',
      },
      {
        path: 'business',
        loadComponent: registrationBusinessDetails,
        title: 'Business details',
      },
      {
        path: 'plan',
        loadComponent: registrationPlanSelection,
        title: 'Choose your Restock Plan',
      },
      {
        path: 'branch',
        loadComponent: registrationBranchSetup,
        title: 'Set up your first branch',
      },
    ],
  },
];
