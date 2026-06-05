import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

import { IamStore } from '../../../application/iam.store';
import { SignInCommand } from '../../../domain/model/sign-in.command';

@Component({
  selector: 'app-sign-in-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, TranslatePipe],
  templateUrl: './sign-in-form.html',
  styleUrl: './sign-in-form.css',
})
export class SignInForm {
  private readonly router = inject(Router);
  private readonly iamStore = inject(IamStore);
  loading = this.iamStore.loading;
  error = this.iamStore.error;
  successMessage = this.iamStore.successMessage;

  hidePassword = signal(true);

  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  togglePasswordVisibility(): void {
    this.hidePassword.update((value) => !value);
  }

  onSignIn(): void {
    if (this.form.valid) {
      const email = this.form.get('email')?.value || '';
      const password = this.form.get('password')?.value || '';

      const command = new SignInCommand({ email, password });

      this.iamStore.signIn(command, () => {
        this.iamStore.clearSuccessMessage();
        void this.router.navigate(['/home']);
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
