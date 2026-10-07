import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Customer } from '../../core/models/customer.model';

@Component({
  selector: 'app-customers',
  standalone: false,
  template: `
    <section class="customers-page">
      <div class="customers-ambient" aria-hidden="true">
        <span class="customer-particle particle-one"></span>
        <span class="customer-particle particle-two"></span>
        <span class="customer-particle particle-three"></span>
        <img class="customer-float-icon icon-one" src="/assets/services/pickup.png" alt="" />
        <img class="customer-float-icon icon-two" src="/assets/services/delivery.png" alt="" />
      </div>

      <section class="admin-page-head premium-customers-head">
        <div>
          <span class="eyebrow">{{ 'Customer directory' | t }}</span>
          <h1>{{ 'Customers' | t }}</h1>
          <p>{{ 'Search customer profiles, mobile numbers, addresses, and repeat order counts.' | t }}</p>
        </div>
        <button type="button" class="btn primary premium-refresh" (click)="load()" [disabled]="isLoading">
          <span *ngIf="isLoading" class="button-loader" aria-hidden="true"></span>
          <span>{{ (isLoading ? 'Refreshing...' : 'Refresh') | t }}</span>
        </button>
      </section>

      <section class="customer-command-panel">
        <div class="customer-command-copy">
          <span>{{ 'Live customer intelligence' | t }}</span>
          <strong>{{ visibleInsight }}</strong>
          <p>{{ 'Keep repeat customers, addresses, and order frequency easy to scan from one polished workspace.' | t }}</p>
        </div>
        <div class="customer-command-orbit" aria-hidden="true">
          <span>{{ customers.length || 0 }}</span>
          <i></i>
        </div>
      </section>

      <section class="admin-order-metrics customers-metrics premium-customer-metrics" *ngIf="!isLoading; else metricSkeletons">
        <article><span>{{ 'Total Customers' | t }}</span><strong>{{ customers.length }}</strong><small>{{ 'Saved profiles' | t }}</small></article>
        <article><span>{{ 'Repeat Customers' | t }}</span><strong>{{ repeatCustomers }}</strong><small>{{ 'Returned for care' | t }}</small></article>
        <article><span>{{ 'Total Orders' | t }}</span><strong>{{ totalOrders }}</strong><small>{{ 'Across customers' | t }}</small></article>
        <article><span>{{ 'Visible Results' | t }}</span><strong>{{ filteredCustomers.length }}</strong><small>{{ 'Current view' | t }}</small></article>
      </section>

      <ng-template #metricSkeletons>
        <section class="customers-metric-skeletons">
          <article *ngFor="let item of metricSkeletonRows"><span></span><i></i><b></b></article>
        </section>
      </ng-template>

      <section class="admin-orders-toolbar customers-toolbar premium-customers-toolbar">
        <label class="admin-search">
          <span>{{ 'Search customers' | t }}</span>
          <input [formControl]="searchControl" [placeholder]="'Search name, mobile, or address...' | t" />
        </label>
        <label>
          <span>{{ 'Sort' | t }}</span>
          <select [formControl]="sortControl">
            <option value="recent">{{ 'Recently updated' | t }}</option>
            <option value="nameAsc">{{ 'Name A-Z' | t }}</option>
            <option value="ordersHigh">{{ 'Orders high to low' | t }}</option>
          </select>
        </label>
      </section>

      <p class="customer-load-error" *ngIf="errorMessage">{{ errorMessage | t }}</p>

      <section class="customers-skeleton-grid" *ngIf="isLoading" aria-label="Loading customers">
        <article *ngFor="let item of customerSkeletonRows">
          <span></span>
          <i></i>
          <b></b>
          <b></b>
          <em></em>
        </article>
      </section>

      <section class="card-grid compact customers-grid premium-customers-grid" *ngIf="!isLoading">
        <article
          class="customer-card premium-customer-card"
          *ngFor="let customer of filteredCustomers; let index = index; trackBy: trackByCustomer"
          [class.repeat-customer]="isRepeatCustomer(customer)"
          [style.--card-index]="index"
        >
          <span class="customer-card-glow"></span>
          <div class="customer-card-top">
            <span class="customer-avatar">{{ initials(customer.name) }}</span>
            <span class="customer-tier">{{ (customer.totalOrders && customer.totalOrders > 1 ? 'Repeat' : 'New') | t }}</span>
          </div>
          <h2>{{ customer.name }}</h2>
          <div class="customer-details">
            <p><span>{{ 'Mobile' | t }}</span>{{ customer.mobile }}</p>
            <p><span>{{ 'Address' | t }}</span>{{ customer.address }}</p>
          </div>
          <div class="customer-card-footer">
            <strong>{{ customer.totalOrders || 0 }} {{ 'orders' | t }}</strong>
            <small>{{ customerValueLabel(customer) | t }}</small>
          </div>
        </article>
        <article class="admin-empty-card premium-customer-empty" *ngIf="!filteredCustomers.length">
          <h2>{{ 'No customers found' | t }}</h2>
          <p>{{ 'Try a different name, mobile number, or address.' | t }}</p>
        </article>
      </section>
    </section>
  `,
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  isLoading = true;
  errorMessage = '';
  readonly metricSkeletonRows = Array.from({ length: 4 });
  readonly customerSkeletonRows = Array.from({ length: 6 });
  searchControl = new FormControl('', { nonNullable: true });
  sortControl = new FormControl<'recent' | 'nameAsc' | 'ordersHigh'>('recent', { nonNullable: true });

  constructor(
    private readonly api: ApiService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
    this.searchControl.valueChanges.subscribe(() => this.cdr.detectChanges());
    this.sortControl.valueChanges.subscribe(() => this.cdr.detectChanges());
  }

  load(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.api
      .customers()
      .pipe(
        catchError(() => {
          this.errorMessage = 'Unable to load customers right now. Please try again.';
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe((customers) => {
        this.customers = customers;
        this.cdr.detectChanges();
      });
  }

  get repeatCustomers(): number {
    return this.customers.filter((customer) => Number(customer.totalOrders || 0) > 1).length;
  }

  get totalOrders(): number {
    return this.customers.reduce((sum, customer) => sum + Number(customer.totalOrders || 0), 0);
  }

  get filteredCustomers(): Customer[] {
    const query = this.searchControl.value.trim().toLowerCase();
    const filtered = this.customers.filter((customer) =>
      [customer.name, customer.mobile, customer.address].some((value) => value.toLowerCase().includes(query)),
    );

    return filtered.sort((a, b) => {
      if (this.sortControl.value === 'nameAsc') {
        return a.name.localeCompare(b.name);
      }
      if (this.sortControl.value === 'ordersHigh') {
        return Number(b.totalOrders || 0) - Number(a.totalOrders || 0);
      }
      return 0;
    });
  }

  get visibleInsight(): string {
    if (this.isLoading) {
      return 'Loading customer profiles';
    }
    if (!this.customers.length) {
      return 'No customer profiles yet';
    }
    return `${this.filteredCustomers.length} ${this.filteredCustomers.length === 1 ? 'profile visible' : 'profiles visible'}`;
  }

  initials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }

  trackByCustomer(_index: number, customer: Customer): string {
    return customer._id || customer.mobile;
  }

  customerValueLabel(customer: Customer): string {
    return this.isRepeatCustomer(customer) ? 'Loyal customer' : 'First-time profile';
  }

  isRepeatCustomer(customer: Customer): boolean {
    return Number(customer.totalOrders || 0) > 1;
  }
}
