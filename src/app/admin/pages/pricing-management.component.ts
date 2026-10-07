import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { PricingItem } from '../../core/models/catalog.model';

@Component({
  selector: 'app-pricing-management',
  standalone: false,
  template: `
    <section class="admin-page-head">
      <div>
        <span class="eyebrow">{{ 'Rate control' | t }}</span>
        <h1>{{ 'Pricing Management' | t }}</h1>
        <p>{{ 'Create, activate, deactivate, and remove pricing items for services shown to customers.' | t }}</p>
      </div>
      <button type="button" class="btn primary" (click)="load()">{{ 'Refresh' | t }}</button>
    </section>

    <section class="admin-order-metrics pricing-admin-metrics">
      <article><span>{{ 'Total Items' | t }}</span><strong>{{ pricing.length }}</strong></article>
      <article><span>{{ 'Active' | t }}</span><strong>{{ activeCount }}</strong></article>
      <article><span>{{ 'Inactive' | t }}</span><strong>{{ inactiveCount }}</strong></article>
      <article><span>{{ 'Starting Price' | t }}</span><strong>INR {{ startingPrice }}</strong></article>
    </section>

    <form class="management-form premium-management-form" [formGroup]="form" (ngSubmit)="save()">
      <label><span>{{ 'Item' | t }}</span><input formControlName="item" [placeholder]="'Shirt, suit, saree...' | t" /></label>
      <label><span>{{ 'Service Type' | t }}</span><input formControlName="serviceType" [placeholder]="'Wash & Iron' | t" /></label>
      <label><span>{{ 'Price' | t }}</span><input type="number" formControlName="price" [placeholder]="'Price' | t" /></label>
      <button class="btn primary" type="submit" [disabled]="form.invalid">{{ 'Add Price' | t }}</button>
    </form>

    <section class="admin-orders-toolbar pricing-management-toolbar">
      <label class="admin-search">
        <span>{{ 'Search pricing' | t }}</span>
        <input [formControl]="searchControl" [placeholder]="'Search item or service...' | t" />
      </label>
    </section>

    <div class="table-wrap admin-table pricing-management-table">
      <table>
        <thead><tr><th>{{ 'Item' | t }}</th><th>{{ 'Service' | t }}</th><th>{{ 'Price' | t }}</th><th>{{ 'Status' | t }}</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let item of filteredPricing; trackBy: trackByPricing">
            <td>{{ item.item | t }}</td>
            <td><span class="service-badge">{{ item.serviceType | t }}</span></td>
            <td>
              <div class="price-edit-cell" *ngIf="editingPriceId === item._id; else priceView">
                <span>INR</span>
                <input
                  type="number"
                  min="0"
                  [formControl]="editPriceControl"
                  [attr.aria-label]="'Edit price' | t"
                  (keydown.enter)="savePrice(item)"
                  (keydown.escape)="cancelEditPrice()"
                />
                <button class="mini-action save" type="button" (click)="savePrice(item)" [disabled]="editPriceControl.invalid || savingPriceId === item._id">{{ 'Save' | t }}</button>
                <button class="mini-action ghost" type="button" (click)="cancelEditPrice()">{{ 'Cancel' | t }}</button>
              </div>
              <ng-template #priceView>
                <button class="price-edit-trigger" type="button" (click)="startEditPrice(item)" [attr.aria-label]="'Edit price' | t">
                  <strong>INR {{ item.price }}</strong>
                  <span>{{ 'Edit' | t }}</span>
                </button>
              </ng-template>
            </td>
            <td>
              <button
                class="status-pill-toggle"
                type="button"
                [class.inactive]="item.active === false"
                [attr.aria-pressed]="item.active !== false"
                (click)="toggle(item)"
                [disabled]="savingStatusId === item._id"
              >
                <span class="status-dot"></span>
                <strong>{{ (item.active === false ? 'Inactive' : 'Active') | t }}</strong>
                <small>{{ (item.active === false ? 'Show service' : 'Hide service') | t }}</small>
              </button>
            </td>
            <td><button class="danger-action" type="button" (click)="remove(item)">{{ 'Delete' | t }}</button></td>
          </tr>
          <tr *ngIf="!filteredPricing.length">
            <td colspan="5" class="orders-empty">{{ 'No pricing items found.' | t }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class PricingManagementComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  pricing: PricingItem[] = [];
  searchControl = new FormControl('', { nonNullable: true });
  editPriceControl = new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] });
  editingPriceId = '';
  savingPriceId = '';
  savingStatusId = '';
  form = this.fb.group({
    item: ['', Validators.required],
    serviceType: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    active: [true],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.api.adminPricing().subscribe((items) => (this.pricing = items));
  }

  save(): void {
    this.api.createPricing(this.form.getRawValue() as any).subscribe(() => {
      this.form.reset({ active: true, price: 0 });
      this.load();
    });
  }

  toggle(item: PricingItem): void {
    const id = item._id || '';
    if (!id) {
      return;
    }
    this.savingStatusId = id;
    this.api.updatePricing(id, { active: item.active === false }).subscribe({
      next: (updated) => {
        this.replacePricingItem(updated);
        this.savingStatusId = '';
      },
      error: () => (this.savingStatusId = ''),
    });
  }

  startEditPrice(item: PricingItem): void {
    this.editingPriceId = item._id || '';
    this.editPriceControl.setValue(item.price);
    this.editPriceControl.markAsPristine();
  }

  cancelEditPrice(): void {
    this.editingPriceId = '';
    this.editPriceControl.reset(0);
  }

  savePrice(item: PricingItem): void {
    const id = item._id || '';
    if (!id || this.editPriceControl.invalid) {
      this.editPriceControl.markAsTouched();
      return;
    }

    const price = Number(this.editPriceControl.value || 0);
    this.savingPriceId = id;
    this.api.updatePricing(id, { price }).subscribe({
      next: (updated) => {
        this.replacePricingItem(updated);
        this.savingPriceId = '';
        this.cancelEditPrice();
      },
      error: () => (this.savingPriceId = ''),
    });
  }

  remove(item: PricingItem): void {
    this.api.deletePricing(item._id || '').subscribe(() => this.load());
  }

  get activeCount(): number {
    return this.pricing.filter((item) => item.active !== false).length;
  }

  get inactiveCount(): number {
    return this.pricing.filter((item) => item.active === false).length;
  }

  get startingPrice(): number {
    return this.pricing.length ? Math.min(...this.pricing.map((item) => item.price)) : 0;
  }

  get filteredPricing(): PricingItem[] {
    const query = this.searchControl.value.trim().toLowerCase();
    return this.pricing.filter((item) =>
      [item.item, item.serviceType].some((value) => value.toLowerCase().includes(query)),
    );
  }

  trackByPricing(_index: number, item: PricingItem): string {
    return item._id || `${item.item}-${item.serviceType}-${item.price}`;
  }

  private replacePricingItem(updated: PricingItem): void {
    this.pricing = this.pricing.map((item) => (item._id === updated._id ? updated : item));
  }
}
