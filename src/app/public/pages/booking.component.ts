import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiService } from '../../core/services/api.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { Order } from '../../core/models/order.model';
import { PricingItem } from '../../core/models/catalog.model';
import { imageForCatalogItem } from '../../core/catalog/item-images';

type BookingPopup = {
  type: 'success' | 'error';
  title: string;
  message: string;
  details?: string;
};

type ServiceOption = {
  name: string;
  rate?: number;
  callForPricing?: boolean;
};

type ServicePriceItem = {
  name: string;
  control: string;
  price: number;
  image: string;
};

const requestedPriceItemNames = [
  'Reception Gown',
  'Shirt',
  'Pant',
  'T-Shirt',
  'Jeans',
  'Kurta',
  'Salwar',
  'Saree',
  'Cotton Saree',
  'Blouse',
  'Lehenga',
  'Normal Veshti',
  'Pattu Veshti',
  'Bed Sheet',
  'Blanket',
  'Pillow Cover',
  'Curtain',
  'Shorts',
  'Night Suit',
  'Skirt',
  'Towel',
  'Bath Towel',
  'Cushion Cover',
  'Duvet',
  'Quilt',
  'Table Cloth',
];

function controlForItem(itemName: string): string {
  return `item${itemName
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')}Count`;
}

function priceItem(name: string, price: number): ServicePriceItem {
  return {
    name,
    price,
    control: controlForItem(name),
    image: imageForCatalogItem(name),
  };
}

const serviceOrder = ['Dry Cleaning', 'Wash & Fold', 'Wash & Iron', 'Steam Ironing'];

const requestedPriceItemOrder = new Map(requestedPriceItemNames.map((item, index) => [item.toLowerCase(), index]));

const fallbackPriceSheets: Record<string, ServicePriceItem[]> = {
  'Dry Cleaning': [
    priceItem('Reception Gown', 300),
    priceItem('Shirt', 60),
    priceItem('Pant', 80),
    priceItem('T-Shirt', 50),
    priceItem('Jeans', 90),
    priceItem('Kurta', 100),
    priceItem('Salwar', 120),
    priceItem('Saree', 200),
    priceItem('Cotton Saree', 180),
    priceItem('Blouse', 50),
    priceItem('Lehenga', 350),
    priceItem('Normal Veshti', 100),
    priceItem('Pattu Veshti', 150),
    priceItem('Bed Sheet', 180),
    priceItem('Blanket', 300),
    priceItem('Pillow Cover', 40),
    priceItem('Curtain', 250),
    priceItem('Skirt', 120),
    priceItem('Duvet', 400),
    priceItem('Quilt', 350),
    priceItem('Table Cloth', 100),
  ],
  'Wash & Iron': [
    priceItem('Reception Gown', 250),
    priceItem('Shirt', 50),
    priceItem('Pant', 60),
    priceItem('T-Shirt', 40),
    priceItem('Jeans', 60),
    priceItem('Kurta', 70),
    priceItem('Salwar', 80),
    priceItem('Saree', 150),
    priceItem('Cotton Saree', 130),
    priceItem('Blouse', 40),
    priceItem('Lehenga', 250),
    priceItem('Normal Veshti', 60),
    priceItem('Pattu Veshti', 80),
    priceItem('Bed Sheet', 120),
    priceItem('Blanket', 220),
    priceItem('Pillow Cover', 30),
    priceItem('Curtain', 180),
    priceItem('Shorts', 45),
    priceItem('Night Suit', 90),
    priceItem('Skirt', 65),
    priceItem('Duvet', 280),
    priceItem('Quilt', 260),
    priceItem('Table Cloth', 90),
  ],
  'Wash & Fold': [
    priceItem('Reception Gown', 200),
    priceItem('Shirt', 35),
    priceItem('Pant', 40),
    priceItem('T-Shirt', 30),
    priceItem('Jeans', 45),
    priceItem('Kurta', 50),
    priceItem('Salwar', 60),
    priceItem('Saree', 120),
    priceItem('Cotton Saree', 100),
    priceItem('Blouse', 30),
    priceItem('Lehenga', 180),
    priceItem('Normal Veshti', 40),
    priceItem('Pattu Veshti', 60),
    priceItem('Bed Sheet', 80),
    priceItem('Blanket', 150),
    priceItem('Pillow Cover', 20),
    priceItem('Curtain', 120),
    priceItem('Shorts', 30),
    priceItem('Night Suit', 70),
    priceItem('Skirt', 45),
    priceItem('Towel', 35),
    priceItem('Bath Towel', 50),
    priceItem('Cushion Cover', 30),
    priceItem('Duvet', 220),
    priceItem('Quilt', 180),
    priceItem('Table Cloth', 60),
  ],
  'Steam Ironing': [
    priceItem('Reception Gown', 180),
    priceItem('Shirt', 10),
    priceItem('Pant', 10),
    priceItem('T-Shirt', 15),
    priceItem('Jeans', 30),
    priceItem('Kurta', 30),
    priceItem('Salwar', 35),
    priceItem('Saree', 80),
    priceItem('Cotton Saree', 70),
    priceItem('Blouse', 20),
    priceItem('Lehenga', 150),
    priceItem('Normal Veshti', 30),
    priceItem('Pattu Veshti', 50),
    priceItem('Bed Sheet', 50),
    priceItem('Pillow Cover', 20),
    priceItem('Curtain', 80),
    priceItem('Skirt', 40),
    priceItem('Table Cloth', 40),
  ],
};

@Component({
  selector: 'app-booking',
  standalone: false,
  template: `
    <section class="booking-hero">
      <div class="booking-copy">
        <span class="eyebrow">{{ 'Encrypted doorstep booking' | t }}</span>
        <h1>{{ 'Pickup Booking' | t }}</h1>
        <p>{{ 'Schedule premium laundry and dry cleaning pickup with secure encrypted order details and quick doorstep support. Free delivery is available within 5 km; beyond 5 km, delivery is charged at ₹10 per km.' | t }}</p>

        <div class="booking-service-tabs">
          <button
            type="button"
            *ngFor="let service of serviceOptions"
            [class.active]="selectedServiceType === service.name"
            (click)="selectService(service.name)"
          >
            <strong>{{ service.name | t }}</strong>
            <span>{{ serviceRateText(service) }}</span>
          </button>
        </div>
      </div>

      <aside class="booking-visual" [attr.aria-label]="'Premium dry cleaning pickup' | t">
        <img src="/assets/services/dry-cleaning.png" [alt]="'Premium dry cleaning garments ready for pickup' | t" />
        <div class="steam-cloud one"></div>
        <div class="steam-cloud two"></div>
        <div class="steam-cloud three"></div>
        <div class="booking-visual-card">
          <span>{{ 'Today slot' | t }}</span>
          <strong>{{ selectedPickupTime || ('Choose time' | t) }}</strong>
          <small>{{ (selectedServiceType || 'Premium care') | t }}</small>
        </div>
      </aside>
    </section>

    <section class="booking-shell">
      <form class="booking-form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <div class="form-section-title">
          <span>1</span>
          <div>
            <h2>{{ 'Customer details' | t }}</h2>
            <p>{{ 'Your personal information is encrypted before sending.' | t }}</p>
          </div>
        </div>

        <label [class.invalid]="invalid('customerName')">
          <span>{{ 'Customer Name' | t }}</span>
          <input formControlName="customerName" [placeholder]="'Enter full name' | t" />
          <small class="form-error" *ngIf="invalid('customerName')">{{ 'Customer name is required.' | t }}</small>
        </label>

        <label [class.invalid]="invalid('mobile')">
          <span>{{ 'Mobile' | t }}</span>
          <input formControlName="mobile" inputmode="tel" [placeholder]="'10 digit mobile number' | t" />
          <small class="form-error" *ngIf="invalid('mobile')">{{ 'Enter a valid mobile number.' | t }}</small>
        </label>

        <label class="full" [class.invalid]="invalid('address')">
          <span>{{ 'Pickup Address' | t }}</span>
          <textarea formControlName="address" [placeholder]="'House number, street, landmark' | t"></textarea>
          <small class="form-error" *ngIf="invalid('address')">{{ 'Pickup address is required.' | t }}</small>
        </label>

        <div class="form-section-title full">
          <span>2</span>
          <div>
            <h2>{{ 'Service and pickup slot' | t }}</h2>
            <p>{{ 'Pick the service, garment count, and preferred collection time.' | t }}</p>
          </div>
        </div>

        <label [class.invalid]="invalid('serviceType')">
          <span>{{ 'Service Type' | t }}</span>
          <select formControlName="serviceType">
            <option *ngFor="let service of serviceOptions" [value]="service.name">{{ service.name | t }}</option>
          </select>
          <small class="form-error" *ngIf="invalid('serviceType')">{{ 'Select a service type.' | t }}</small>
        </label>

        <section class="ironing-sheet full" *ngIf="hasPriceSheet">
          <div class="ironing-sheet-head">
            <div>
              <span class="eyebrow">{{ 'Laundry Service Price List' | t }}</span>
              <h3>{{ selectedServiceType | t }}</h3>
              <p>{{ 'Enter item quantity. The estimated total is calculated from the selected service price sheet.' | t }}</p>
            </div>
            <strong>INR {{ selectedTotalAmount }}</strong>
          </div>
          <div class="ironing-item-grid">
            <label *ngFor="let item of currentPriceItems" [class.invalid]="invalid(item.control)">
              <span class="item-price-title">
                <img [src]="item.image" [alt]="item.name + ' price item' | t" loading="lazy" decoding="async" />
                <span>{{ item.name | t }}</span>
              </span>
              <strong>INR {{ item.price }}</strong>
              <input type="number" min="0" [formControlName]="item.control" />
            </label>
          </div>
          <small class="form-error" *ngIf="showItemSheetError">{{ 'Select at least one item.' | t }}</small>
        </section>

        <section class="dry-cleaning-note full" *ngIf="isDryCleaning && !hasPriceSheet">
          <span class="eyebrow">{{ 'Dry Cleaning' | t }}</span>
          <h3>{{ 'Please call us for pricing.' | t }}</h3>
          <p>{{ 'Our team will confirm the final dry cleaning price after checking the garment type and fabric.' | t }}</p>
        </section>

        <label [class.invalid]="invalid('clothCount')" *ngIf="!hasPriceSheet">
          <span>{{ 'Cloth Count' | t }}</span>
          <input type="number" formControlName="clothCount" min="1" />
          <small class="form-error" *ngIf="invalid('clothCount')">{{ 'Cloth count must be at least 1.' | t }}</small>
        </label>

        <label [class.invalid]="invalid('pickupDate')">
          <span>{{ 'Pickup Date' | t }}</span>
          <input type="date" formControlName="pickupDate" [min]="today" />
          <small class="form-error" *ngIf="invalid('pickupDate')">{{ 'Choose a pickup date.' | t }}</small>
        </label>

        <label [class.invalid]="invalid('pickupTime')">
          <span>{{ 'Pickup Time' | t }}</span>
          <input type="time" formControlName="pickupTime" />
          <small class="form-error" *ngIf="invalid('pickupTime')">{{ 'Choose a pickup time.' | t }}</small>
        </label>

        <label [class.invalid]="invalid('totalAmount')" *ngIf="!hasPriceSheet && !isDryCleaning">
          <span>{{ 'Estimated Total' | t }}</span>
          <input type="number" formControlName="totalAmount" min="0" />
          <small class="form-error" *ngIf="invalid('totalAmount')">{{ 'Estimated total cannot be negative.' | t }}</small>
        </label>

        <label class="full">
          <span>{{ 'Notes' | t }}</span>
          <textarea formControlName="notes" [placeholder]="'Stain details, fabric care notes, delivery preference' | t"></textarea>
        </label>

        <!-- <div class="booking-map-field full">
          <button type="button" class="booking-map-trigger" (click)="openCurrentLocationMap()" [disabled]="locating">
            <span class="material-symbols-rounded">my_location</span>
            <strong>{{ (locating ? 'Finding location...' : 'Google Maps') | t }}</strong>
          </button>
          <small>{{ 'Tap to open your current live location from this device.' | t }}</small>
        </div> -->

        <div class="booking-summary full">
          <div>
            <span>{{ 'Estimated bill' | t }}</span>
            <strong>{{ estimatedBillText }}</strong>
          </div>
          <button class="btn primary" type="submit" [disabled]="saving">
            {{ (saving ? 'Booking...' : 'Confirm Pickup') | t }}
          </button>
        </div>

        <p class="success full" *ngIf="message && !error">{{ message }}</p>
        <p class="form-alert full" *ngIf="error">{{ error }}</p>
      </form>
    </section>

    <div class="swal-overlay" *ngIf="bookingPopup" role="dialog" aria-modal="true" [attr.aria-label]="bookingPopup.title">
      <section class="swal-card" [class.error]="bookingPopup.type === 'error'">
        <span class="swal-icon" aria-hidden="true">{{ bookingPopup.type === 'success' ? '✓' : '!' }}</span>
        <h2>{{ bookingPopup.title }}</h2>
        <p>{{ bookingPopup.message }}</p>
        <small *ngIf="bookingPopup.details">{{ bookingPopup.details }}</small>
        <button type="button" class="btn primary" (click)="closePopup()">{{ 'OK' | t }}</button>
      </section>
    </div>

    <!-- <div class="swal-overlay" *ngIf="mapPopupOpen" role="dialog" aria-modal="true" [attr.aria-label]="'Google Maps current location' | t">
      <section class="swal-card map-popup-card" [class.error]="!!locationError">
        <button type="button" class="map-popup-close" [attr.aria-label]="'Close' | t" (click)="closeMapPopup()">&times;</button>
        <span class="swal-icon material-symbols-rounded" aria-hidden="true">{{ locationError ? 'location_off' : 'location_on' }}</span>
        <h2>{{ 'Google Maps' | t }}</h2>
        <p>{{ (locationError || (locating ? 'Fetching your current live location...' : 'Your current live location is ready.')) | t }}</p>

        <div class="map-popup-frame" *ngIf="currentMapEmbedUrl && !locationError; else mapLoading">
          <iframe
            [src]="currentMapEmbedUrl"
            [title]="'Google Maps current location' | t"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          ></iframe>
        </div>

        <ng-template #mapLoading>
          <div class="map-popup-loading">
            <span class="button-loader" *ngIf="locating"></span>
            <strong>{{ (locating ? 'Please allow location access in your browser.' : 'Location unavailable') | t }}</strong>
          </div>
        </ng-template>

        <small *ngIf="currentLocation && !locationError">
          {{ 'Accuracy' | t }}: {{ currentLocation.accuracy | number: '1.0-0' }} m
        </small>

        <div class="map-popup-actions">
          <button type="button" class="btn primary" (click)="useCurrentLocation()" [disabled]="!currentMapUrl || !!locationError">
            {{ 'Use this location' | t }}
          </button>
          <a class="btn ghost" *ngIf="currentMapUrl && !locationError" [href]="currentMapUrl" target="_blank" rel="noopener">
            {{ 'Open in Google Maps' | t }}
          </a>
        </div>
      </section>
    </div> -->
  `,
})
export class BookingComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly i18n = inject(I18nService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly sanitizer = inject(DomSanitizer);
  saving = false;
  message = '';
  error = '';
  bookingPopup?: BookingPopup;
  mapPopupOpen = false;
  locating = false;
  locationError = '';
  currentMapUrl = '';
  currentMapEmbedUrl?: SafeResourceUrl;
  currentLocation?: GeolocationCoordinates;
  today = new Date().toISOString().slice(0, 10);
  serviceOptions: ServiceOption[] = [
    { name: 'Wash & Fold', rate: 20 },
    { name: 'Wash & Iron', rate: 30 },
    { name: 'Dry Cleaning', rate: 40 },
    { name: 'Steam Ironing', rate: 15 },
  ];
  priceSheets: Record<string, ServicePriceItem[]> = fallbackPriceSheets;
  private itemCountControls = requestedPriceItemNames.map(controlForItem);
  form = this.fb.group({
    customerName: ['', Validators.required],
    mobile: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{10,15}$/)]],
    address: ['', Validators.required],
    serviceType: ['Wash & Fold', Validators.required],
    clothCount: [1, [Validators.required, Validators.min(1)]],
    pickupDate: ['', Validators.required],
    pickupTime: ['', Validators.required],
    status: ['RECEIVED'],
    totalAmount: [0, [Validators.required, Validators.min(0)]],
    notes: [''],
    ...Object.fromEntries(requestedPriceItemNames.map((item) => [controlForItem(item), [0, [Validators.min(0)]]])),
  } as any);

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => this.updateEstimate());
    this.loadPricingSheet();
    this.updateEstimate();
  }

  submit(): void {
    this.error = '';
    this.message = '';
    this.updateEstimate();
    if (this.hasPriceSheet && this.serviceItemCount === 0) {
      this.form.markAllAsTouched();
      this.error = this.i18n.translate('Select at least one item.');
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = this.i18n.translate('Please complete the highlighted fields before confirming pickup.');
      return;
    }
    this.saving = true;
    this.api.createOrder(this.buildOrderPayload()).subscribe({
      next: (order) => {
        this.message = this.i18n.translate('Pickup booked successfully. Our team will contact you shortly.');
        this.showPopup({
          type: 'success',
          title: this.i18n.translate('Pickup booked successfully'),
          message: this.message,
          details: this.responseDetails(order),
        });
        this.form.reset({
          serviceType: 'Wash & Fold',
          clothCount: 1,
          status: 'RECEIVED',
          totalAmount: 0,
          ...this.emptyItemCounts(),
        } as any);
        this.saving = false;
      },
      error: () => {
        this.error = this.i18n.translate('Unable to book pickup right now. Please try again.');
        this.showPopup({
          type: 'error',
          title: this.i18n.translate('Booking failed'),
          message: this.error,
        });
        this.saving = false;
      },
    });
  }

  invalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  selectService(serviceName: string): void {
    this.form.patchValue({
      serviceType: serviceName,
      ...this.emptyItemCounts(),
    } as any);
  }

  get currentPriceItems(): ServicePriceItem[] {
    return this.priceSheets[this.selectedServiceType] || [];
  }

  get hasPriceSheet(): boolean {
    return this.currentPriceItems.length > 0;
  }

  get isDryCleaning(): boolean {
    return this.selectedServiceType === 'Dry Cleaning';
  }

  get serviceItemCount(): number {
    return this.currentPriceItems.reduce((sum, item) => sum + this.countValue(item.control), 0);
  }

  get showItemSheetError(): boolean {
    return this.hasPriceSheet && this.form.touched && this.serviceItemCount === 0;
  }

  get estimatedBillText(): string {
    return this.isDryCleaning && !this.hasPriceSheet
      ? this.i18n.translate('Please call us for pricing.')
      : `INR ${this.selectedTotalAmount}`;
  }

  get selectedServiceType(): string {
    return String(this.form.get('serviceType')?.value || '');
  }

  get selectedPickupTime(): string {
    return String(this.form.get('pickupTime')?.value || '');
  }

  get selectedTotalAmount(): number {
    return Number(this.form.get('totalAmount')?.value || 0);
  }

  get selectedClothCount(): number {
    return Number(this.form.get('clothCount')?.value || 0);
  }

  closePopup(): void {
    this.bookingPopup = undefined;
  }

  openCurrentLocationMap(): void {
    this.mapPopupOpen = true;
    this.locating = true;
    this.locationError = '';
    this.currentMapUrl = '';
    this.currentMapEmbedUrl = undefined;
    this.currentLocation = undefined;

    if (!navigator.geolocation) {
      this.locating = false;
      this.locationError = this.i18n.translate('Location is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.currentLocation = position.coords;
        this.currentMapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        this.currentMapEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.google.com/maps?q=${latitude},${longitude}&z=17&output=embed`,
        );
        this.locating = false;
        this.locationError = '';
        this.cdr.detectChanges();
      },
      (error) => {
        this.locating = false;
        this.locationError = this.locationMessage(error);
        this.cdr.detectChanges();
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      },
    );
  }

  closeMapPopup(): void {
    this.mapPopupOpen = false;
    this.locating = false;
  }

  useCurrentLocation(): void {
    if (!this.currentMapUrl) {
      return;
    }

    const existingAddress = String(this.form.get('address')?.value || '').trim();
    const mapLine = `${this.i18n.translate('Google Maps')}: ${this.currentMapUrl}`;
    const nextAddress = existingAddress && !existingAddress.includes(this.currentMapUrl)
      ? `${existingAddress}\n${mapLine}`
      : mapLine;

    this.form.patchValue({ address: nextAddress });
    this.form.get('address')?.markAsDirty();
    this.form.get('address')?.markAsTouched();
    this.closeMapPopup();
  }

  private showPopup(popup: BookingPopup): void {
    this.bookingPopup = popup;
  }

  private locationMessage(error: GeolocationPositionError): string {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return this.i18n.translate('Location permission was denied. Please allow location access and try again.');
      case error.POSITION_UNAVAILABLE:
        return this.i18n.translate('Current location is unavailable. Please try again.');
      case error.TIMEOUT:
        return this.i18n.translate('Location request timed out. Please try again.');
      default:
        return this.i18n.translate('Unable to fetch current location. Please try again.');
    }
  }

  private loadPricingSheet(): void {
    this.api.pricing().subscribe({
      next: (items) => {
        const priceSheets = this.buildPriceSheets(items || []);
        if (!Object.keys(priceSheets).length) {
          return;
        }
        this.priceSheets = priceSheets;
        this.ensureItemControls(Object.values(this.priceSheets).flat());
        this.serviceOptions = this.serviceOptions.map((service) => ({
          ...service,
          rate: this.startingPriceForService(service.name) ?? service.rate,
        }));
        this.updateEstimate();
        this.cdr.detectChanges();
      },
      error: () => {
        this.ensureItemControls(Object.values(this.priceSheets).flat());
        this.updateEstimate();
        this.cdr.detectChanges();
      },
    });
  }

  private buildPriceSheets(items: PricingItem[]): Record<string, ServicePriceItem[]> {
    const grouped: Record<string, ServicePriceItem[]> = {};

    items
      .filter((item) => item.active !== false && item.item && item.serviceType && Number.isFinite(Number(item.price)))
      .forEach((item) => {
        const serviceType = item.serviceType.trim();
        grouped[serviceType] = grouped[serviceType] || [];
        grouped[serviceType].push(priceItem(item.item.trim(), Number(item.price)));
      });

    Object.keys(grouped).forEach((serviceType) => {
      grouped[serviceType] = this.sortPriceItems(grouped[serviceType]);
    });

    return grouped;
  }

  private sortPriceItems(items: ServicePriceItem[]): ServicePriceItem[] {
    return [...items].sort((a, b) => {
      const aRank = requestedPriceItemOrder.get(a.name.toLowerCase()) ?? 999;
      const bRank = requestedPriceItemOrder.get(b.name.toLowerCase()) ?? 999;
      return aRank === bRank ? a.name.localeCompare(b.name) : aRank - bRank;
    });
  }

  private ensureItemControls(items: ServicePriceItem[]): void {
    items.forEach((item) => {
      if (!this.form.contains(item.control)) {
        this.form.addControl(item.control, this.fb.control(0, [Validators.min(0)]));
      }
    });
    this.itemCountControls = Array.from(new Set([...this.itemCountControls, ...items.map((item) => item.control)]));
  }

  private startingPriceForService(serviceType: string): number | undefined {
    const items = this.priceSheets[serviceType] || [];
    return items.length ? Math.min(...items.map((item) => item.price)) : undefined;
  }

  private responseDetails(order: Order): string {
    const parts = [
      order._id ? `${this.i18n.translate('Order ID')}: ${order._id}` : '',
      order.status ? `${this.i18n.translate('Status')}: ${this.i18n.translate(order.status)}` : '',
      order.totalAmount !== undefined ? `${this.i18n.translate('Estimated bill')}: INR ${order.totalAmount}` : '',
    ].filter(Boolean);

    return parts.join(' • ');
  }

  private updateEstimate(): void {
    if (this.hasPriceSheet) {
      const total = this.currentPriceItems.reduce((sum, item) => sum + this.countValue(item.control) * item.price, 0);
      const count = this.serviceItemCount;
      if (this.selectedTotalAmount !== total || this.selectedClothCount !== count) {
        this.form.patchValue({ totalAmount: total, clothCount: count }, { emitEvent: false });
      }
      return;
    }

    if (this.isDryCleaning) {
      const count = Math.max(1, this.selectedClothCount);
      if (this.selectedTotalAmount !== 0 || this.selectedClothCount !== count) {
        this.form.patchValue({ totalAmount: 0, clothCount: count }, { emitEvent: false });
      }
      return;
    }

    const service = this.serviceOptions.find((item) => item.name === this.selectedServiceType);
    const count = Math.max(1, this.selectedClothCount);
    const total = Math.max(0, count * (service?.rate || 0));
    if (this.selectedTotalAmount !== total || this.selectedClothCount !== count) {
      this.form.patchValue({ totalAmount: total, clothCount: count }, { emitEvent: false });
    }
  }

  serviceRateText(service: ServiceOption): string {
    return service.callForPricing ? this.i18n.translate('Please call us for pricing.') : `${this.i18n.translate('From')} INR ${service.rate}`;
  }

  private countValue(controlName: string): number {
    return Math.max(0, Number(this.form.get(controlName)?.value || 0));
  }

  private buildOrderPayload(): Partial<Order> {
    const value = this.form.getRawValue() as Record<string, unknown>;
    const priceSheetNotes = this.hasPriceSheet ? this.serviceBreakdown() : '';
    const dryCleaningNotes =
      this.isDryCleaning && !this.hasPriceSheet ? this.i18n.translate('Dry Cleaning pricing: Please call us for pricing.') : '';
    const notes = [value['notes'], priceSheetNotes, dryCleaningNotes].filter(Boolean).join('\n');

    return {
      customerName: String(value['customerName'] || ''),
      mobile: String(value['mobile'] || ''),
      address: String(value['address'] || ''),
      serviceType: String(value['serviceType'] || 'Wash & Fold'),
      clothCount: Number(value['clothCount'] || 0),
      pickupDate: String(value['pickupDate'] || ''),
      pickupTime: String(value['pickupTime'] || ''),
      status: 'RECEIVED',
      totalAmount: Number(value['totalAmount'] || 0),
      notes,
    };
  }

  private serviceBreakdown(): string {
    const serviceType = this.selectedServiceType;
    const items = this.currentPriceItems
      .map((item) => {
        const count = this.countValue(item.control);
        return count ? `${item.name} x ${count} = INR ${count * item.price}` : '';
      })
      .filter(Boolean);

    return items.length ? `${serviceType} items: ${items.join(', ')}` : '';
  }

  private emptyItemCounts(): Record<string, number> {
    return Object.fromEntries(this.itemCountControls.map((controlName) => [controlName, 0]));
  }
}
