import { Routes } from '@angular/router';
import { guestOnlyGuard } from '../infrastructure/guest-only.guard';
import { requireAuthGuard } from '../infrastructure/require-auth.guard';

const signUpForm = () => import('./views/sign-up-form/sign-up-form').then((m) => m.SignUpForm);
const signInForm = () => import('./views/sign-in-form/sign-in-form').then((m) => m.SignInForm);
const authenticationSection = () => import('./components/authentication-section/authentication-section').then((m) => m.AuthenticationSection);
const forgotPassword = () => import('./views/forgot-password/forgot-password').then((m) => m.ForgotPasswordComponent);

export const iamRoutes: Routes = [
  {
    path: 'sign-in',
    loadComponent: signInForm,
    canActivate: [guestOnlyGuard],
    title: 'Login',
  },
  {
    path: 'sign-up',
    loadComponent: signUpForm,
    canActivate: [guestOnlyGuard],
    title: 'Register',
  },
  {
    path: 'role-selection',
    loadComponent: authenticationSection,
    canActivate: [guestOnlyGuard],
    title: 'Select Role',
  },
  {
    path: 'forgot-password',
    loadComponent: forgotPassword,
    canActivate: [guestOnlyGuard],
    title: 'Reset Password',
  },
];
