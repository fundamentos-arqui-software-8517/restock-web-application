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
    ],
  },
];
