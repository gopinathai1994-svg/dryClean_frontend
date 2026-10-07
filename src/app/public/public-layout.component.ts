import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { AppLanguage, I18nService } from '../core/i18n/i18n.service';

type Theme = 'green' | 'blue' | 'white';

@Component({
  selector: 'app-public-layout',
  standalone: false,
  template: `
    <div class="site-shell" [class.theme-blue]="theme === 'blue'" [class.theme-white]="theme === 'white'">
      <header class="topbar" [class.menu-open]="isMenuOpen">
        <span class="topbar-aurora" aria-hidden="true"></span>
        <a routerLink="/" class="brand" (click)="closeMenu()">
          <span class="brand-mark">
            <span>TL</span>
          </span>
          <span class="brand-copy"><strong>{{ 'TL' | t }}</strong><small>{{ '& Dry Cleaners' | t }}</small></span>
        </a>
        <button
          type="button"
          class="menu-toggle"
          [attr.aria-expanded]="isMenuOpen"
          [attr.aria-label]="'Toggle navigation menu' | t"
          (click)="toggleMenu()"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div class="nav-panel">
          <nav>
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeMenu()">
              <span class="material-symbols-rounded" aria-hidden="true">home</span>
              <span>{{ 'Home' | t }}</span>
            </a>
            <a routerLink="/services" routerLinkActive="active" (click)="closeMenu()">
              <span class="material-symbols-rounded" aria-hidden="true">local_laundry_service</span>
              <span>{{ 'Services' | t }}</span>
            </a>
            <a routerLink="/pricing" routerLinkActive="active" (click)="closeMenu()">
              <span class="material-symbols-rounded" aria-hidden="true">sell</span>
              <span>{{ 'Pricing' | t }}</span>
            </a>
            <a routerLink="/pickup-booking" routerLinkActive="active" (click)="closeMenu()">
              <span class="material-symbols-rounded" aria-hidden="true">calendar_month</span>
              <span>{{ 'Pickup Booking' | t }}</span>
            </a>
            <a routerLink="/order-tracking" routerLinkActive="active" (click)="closeMenu()">
              <span class="material-symbols-rounded" aria-hidden="true">route</span>
              <span>{{ 'Tracking' | t }}</span>
            </a>
            <a routerLink="/contact" routerLinkActive="active" (click)="closeMenu()">
              <span class="material-symbols-rounded" aria-hidden="true">call</span>
              <span>{{ 'Contact' | t }}</span>
            </a>
            <a routerLink="/admin/login" class="admin-link" (click)="closeMenu()">
              <span class="material-symbols-rounded" aria-hidden="true">admin_panel_settings</span>
              <span>{{ 'Admin' | t }}</span>
            </a>
          </nav>
          <div class="header-actions">
            <label class="language-select">
              <span class="material-symbols-rounded" aria-hidden="true">language</span>
              <span class="language-label">{{ 'Language' | t }}</span>
              <select [value]="language" (change)="setLanguage($any($event.target).value)">
                <option value="en">{{ 'English' | t }}</option>
                <option value="ta">{{ 'Tamil' | t }}</option>
              </select>
            </label>
            <div class="theme-switch" [attr.aria-label]="'Theme options' | t">
              <button type="button" class="swatch green" [class.selected]="theme === 'green'" (click)="setTheme('green')" [attr.aria-label]="'Green theme' | t"></button>
              <button type="button" class="swatch blue" [class.selected]="theme === 'blue'" (click)="setTheme('blue')" [attr.aria-label]="'Blue theme' | t"></button>
              <button type="button" class="swatch white" [class.selected]="theme === 'white'" (click)="setTheme('white')" [attr.aria-label]="'White theme' | t"></button>
            </div>
          </div>
        </div>
      </header>
      <main><router-outlet></router-outlet></main>
      <a class="whatsapp" [href]="whatsappUrl" target="_blank" rel="noreferrer">
        <img src="/assets/services/whatsapp.svg" alt="" aria-hidden="true" />
        <!-- <span>{{ 'WhatsApp Booking' | t }}</span> -->
      </a>
      <app-chatbot-widget></app-chatbot-widget>
      <footer>
        <strong>{{ 'TL & Dry Cleaners' | t }}</strong>
        <span>{{ 'Premium pickup, laundry, dry cleaning, ironing, and doorstep delivery.' | t }}</span>
      </footer>
    </div>
  `,
})
export class PublicLayoutComponent {
  theme: Theme = (localStorage.getItem('tl_theme') as Theme) || 'green';
  isMenuOpen = false;
  whatsappUrl = `https://wa.me/${environment.whatsappNumber}?text=I%20want%20to%20book%20laundry%20pickup`;

  constructor(private readonly i18n: I18nService) {}

  get language(): AppLanguage {
    return this.i18n.language;
  }

  setLanguage(language: AppLanguage): void {
    this.i18n.setLanguage(language);
  }

  setTheme(theme: Theme): void {
    this.theme = theme;
    localStorage.setItem('tl_theme', theme);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
