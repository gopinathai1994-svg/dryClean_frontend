import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AppLanguage, I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'app-login',
  standalone: false,
  template: `
    <main class="login-screen">
      <section class="login-brand-panel">
        <a routerLink="/" class="brand">
          <span class="brand-mark">TL</span>
          <span><strong>{{ 'TL' | t }}</strong><small>{{ '& Dry Cleaners' | t }}</small></span>
        </a>
        <label class="language-select login-language-select">
          <span>{{ 'Language' | t }}</span>
          <select [value]="language" (change)="setLanguage($any($event.target).value)">
            <option value="en">{{ 'English' | t }}</option>
            <option value="ta">{{ 'Tamil' | t }}</option>
          </select>
        </label>
        <div>
          <span class="eyebrow">{{ 'Staff portal' | t }}</span>
          <h1>{{ 'Manage orders with premium care.' | t }}</h1>
          <p>{{ 'Track pickups, customers, pricing, and daily laundry operations from one secure dashboard.' | t }}</p>
        </div>
        <div class="login-feature-row">
          <article><strong>JWT</strong><span>{{ 'Admin access' | t }}</span></article>
          <article><strong>AES</strong><span>{{ 'Encrypted data' | t }}</span></article>
          <article><strong>{{ 'Live' | t }}</strong><span>{{ 'Order status' | t }}</span></article>
        </div>
      </section>

      <form class="login-card" [formGroup]="form" (ngSubmit)="login()" novalidate>
        <div class="login-card-head">
          <span class="brand-mark">TL</span>
          <div>
            <h2>{{ 'Admin Login' | t }}</h2>
            <p>{{ 'Secure access for TL & Dry Cleaners staff.' | t }}</p>
          </div>
        </div>

        <label [class.invalid]="invalid('email')">
          <span>{{ 'Email address' | t }}</span>
          <input type="email" formControlName="email" placeholder="admin@tl.com" autocomplete="email" />
          <small class="form-error" *ngIf="invalid('email')">
            {{ (form.controls.email.errors?.['required'] ? 'Email is required.' : 'Enter a valid email address.') | t }}
          </small>
        </label>

        <label [class.invalid]="invalid('password')">
          <span>{{ 'Password' | t }}</span>
          <input type="password" formControlName="password" [placeholder]="'Enter admin password' | t" autocomplete="current-password" />
          <small class="form-error" *ngIf="invalid('password')">
            {{ (form.controls.password.errors?.['required'] ? 'Password is required.' : 'Password must be at least 6 characters.') | t }}
          </small>
        </label>

        <button class="btn primary login-submit" type="submit" [disabled]="loading">
          <span class="button-loader" *ngIf="loading" aria-hidden="true"></span>
          <span>{{ (loading ? 'Checking access...' : 'Login to Dashboard') | t }}</span>
        </button>

        <p class="form-alert" *ngIf="error">{{ error }}</p>
      </form>
    </main>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);
  loading = false;
  error = '';
  form = this.fb.group({
    email: ['admin@tl.com', [Validators.required, Validators.email]],
    password: ['admin123', [Validators.required, Validators.minLength(6)]],
  });

  get language(): AppLanguage {
    return this.i18n.language;
  }

  setLanguage(language: AppLanguage): void {
    this.i18n.setLanguage(language);
  }

  login(): void {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = this.i18n.translate('Please complete the highlighted fields.');
      return;
    }
    this.loading = true;
    const { email, password } = this.form.getRawValue();
    this.auth.login(email || '', password || '').subscribe({
      next: () => this.router.navigate(['/admin/dashboard']),
      error: () => {
        this.error = this.i18n.translate('Invalid credentials. Please check email and password.');
        this.loading = false;
      },
    });
  }

  invalid(controlName: 'email' | 'password'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }
}
