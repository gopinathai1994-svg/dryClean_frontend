import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { AppLanguage, I18nService } from '../core/i18n/i18n.service';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  template: `
    <div class="admin-shell" [class.admin-menu-open]="isMenuOpen">
      <header class="admin-mobile-topbar">
        <a routerLink="/" class="brand admin-brand" (click)="closeMenu()"><span class="brand-mark">TL</span><strong>{{ 'Admin' | t }}</strong></a>
        <label class="language-select admin-language-select">
          <span>{{ 'Language' | t }}</span>
          <select [value]="language" (change)="setLanguage($any($event.target).value)">
            <option value="en">{{ 'English' | t }}</option>
            <option value="ta">{{ 'Tamil' | t }}</option>
          </select>
        </label>
        <button type="button" class="menu-toggle admin-menu-toggle" [attr.aria-expanded]="isMenuOpen" [attr.aria-label]="'Toggle admin menu' | t" (click)="toggleMenu()">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>
      <aside>
        <a routerLink="/" class="brand admin-brand" (click)="closeMenu()"><span class="brand-mark">TL</span><strong>{{ 'Admin' | t }}</strong></a>
        <label class="language-select admin-sidebar-language">
          <span>{{ 'Language' | t }}</span>
          <select [value]="language" (change)="setLanguage($any($event.target).value)">
            <option value="en">{{ 'English' | t }}</option>
            <option value="ta">{{ 'Tamil' | t }}</option>
          </select>
        </label>
        <a routerLink="/admin/dashboard" routerLinkActive="active" (click)="closeMenu()">{{ 'Dashboard' | t }}</a>
        <a routerLink="/admin/orders" routerLinkActive="active" (click)="closeMenu()">{{ 'Orders' | t }}</a>
        <a routerLink="/admin/customers" routerLinkActive="active" (click)="closeMenu()">{{ 'Customers' | t }}</a>
        <a routerLink="/admin/pricing" routerLinkActive="active" (click)="closeMenu()">{{ 'Pricing Management' | t }}</a>
        <a routerLink="/admin/profile" routerLinkActive="active" (click)="closeMenu()">{{ 'Profile' | t }}</a>
        <button type="button" (click)="logout()">{{ 'Logout' | t }}</button>
      </aside>
      <section class="admin-content"><router-outlet></router-outlet></section>
    </div>
  `,
})
export class AdminLayoutComponent {
  isMenuOpen = false;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly i18n: I18nService,
  ) {}

  get language(): AppLanguage {
    return this.i18n.language;
  }

  setLanguage(language: AppLanguage): void {
    this.i18n.setLanguage(language);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  logout(): void {
    this.auth.logout();
    this.closeMenu();
    this.router.navigate(['/admin/login']);
  }
}
