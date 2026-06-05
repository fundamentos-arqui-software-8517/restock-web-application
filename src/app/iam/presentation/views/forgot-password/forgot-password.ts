import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { IamStore } from '../../../application/iam.store';
import { ForgotPasswordCommand } from '../../../domain/model/forgot-password.command';

/**
 * ForgotPasswordComponent
 * View for password recovery request within the IAM bounded context.
 */
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, TranslatePipe],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordComponent {
  private readonly router = inject(Router);
  private readonly iamStore = inject(IamStore);

  // Signals from the store for state management
  loading = this.iamStore.loading;
  error = this.iamStore.error;

  /**
   * Reactive Form for password recovery.
   */
  readonly forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  /**
   * Handles the form submission by executing the forgot password command.
   */
  onSubmit(): void {
    if (this.forgotForm.valid) {
      const email = this.forgotForm.get('email')?.value || '';
      const command = new ForgotPasswordCommand({ email });

      this.iamStore.forgotPassword(command, () => {
        // Optional: Show a success message before redirecting
        alert('Recovery email sent successfully! Please check your inbox.');
        void this.router.navigate(['/sign-in']);
      });
    } else {
      this.forgotForm.markAllAsTouched();
    }
  }
}
