import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import lottie, { AnimationItem } from 'lottie-web';
import { catchError, finalize, of } from 'rxjs';
import { Order } from '../../core/models/order.model';
import { ApiService } from '../../core/services/api.service';

interface StatusVisual {
  title: string;
  label: string;
  summary: string;
  image: string;
  alt: string;
}

interface ProgressStep {
  key: string;
  label: string;
}

const DEFAULT_VISUAL: StatusVisual = {
  title: 'Order update',
  label: 'In progress',
  summary: 'Your garments are moving through our care workflow.',
  image: '/assets/tracking/processing.png',
  alt: 'Premium order processing illustration',
};

const STATUS_VISUALS: Record<string, StatusVisual> = {
  RECEIVED: {
    title: 'Received',
    label: 'Parcel received',
    summary: 'Your order has been received, tagged, and queued for inspection.',
    image: '/assets/tracking/received.png',
    alt: 'Delivery person receiving a package inside a clean warehouse',
  },
  PROCESSING: {
    title: 'Processing',
    label: 'Sorting and care',
    summary: 'Your garments are being sorted, cleaned, and prepared with fabric-aware care.',
    image: '/assets/tracking/processing.png',
    alt: 'Packages and garments being sorted for order processing',
  },
  WASHING: {
    title: 'Processing',
    label: 'Cleaning in progress',
    summary: 'Your garments are in the cleaning stage with the right wash process.',
    image: '/assets/tracking/processing.png',
    alt: 'Packages and garments being sorted for order processing',
  },
  IRONING: {
    title: 'Processing',
    label: 'Finishing in progress',
    summary: 'Your garments are being finished, pressed, and checked for quality.',
    image: '/assets/tracking/processing.png',
    alt: 'Packages and garments being sorted for order processing',
  },
  READY: {
    title: 'Ready for Pickup',
    label: 'Waiting at counter',
    summary: 'Your order is packed and waiting at the pickup counter.',
    image: '/assets/tracking/ready.png',
    alt: 'Package waiting at a pickup counter',
  },
  OUT_FOR_DELIVERY: {
    title: 'Out for Delivery',
    label: 'On the way',
    summary: 'Your fresh garments are on the move with our delivery executive.',
    image: '/assets/tracking/out-for-delivery.png',
    alt: 'Delivery executive riding a bike with a package',
  },
  DELIVERED: {
    title: 'Delivered',
    label: 'Completed',
    summary: 'Your order has been delivered successfully. Thank you for choosing us.',
    image: '/assets/tracking/delivered.png',
    alt: 'Happy customer receiving a laundry package',
  },
  CANCELLED: {
    title: 'Cancelled',
    label: 'Order closed',
    summary: 'This order has been cancelled. Contact us if you need help booking again.',
    image: '/assets/tracking/cancelled.png',
    alt: 'Muted cancellation illustration with a package on a counter',
  },
};

const TRACKING_LOTTIE = {
  v: '5.9.0',
  fr: 30,
  ip: 0,
  op: 120,
  w: 220,
  h: 220,
  nm: 'Tracking pulse',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Outer pulse',
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [55] }, { t: 60, s: [16] }, { t: 120, s: [55] }] },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [110, 110, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [78, 78, 100] }, { t: 60, s: [118, 118, 100] }, { t: 120, s: [78, 78, 100] }] },
      },
      shapes: [
        { ty: 'el', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [150, 150] } },
        { ty: 'st', c: { a: 0, k: [0.0588, 0.6235, 0.4313, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 7 }, lc: 2, lj: 2 },
        { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: 'Core dot',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 1, k: [{ t: 0, s: [0] }, { t: 120, s: [360] }] },
        p: { a: 0, k: [110, 110, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [92, 92, 100] }, { t: 45, s: [102, 102, 100] }, { t: 90, s: [92, 92, 100] }] },
      },
      shapes: [
        { ty: 'el', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [84, 84] } },
        { ty: 'fl', c: { a: 0, k: [0.0588, 0.6235, 0.4313, 1] }, o: { a: 0, k: 100 }, r: 1 },
        { ty: 'el', p: { a: 0, k: [0, -58] }, s: { a: 0, k: [18, 18] } },
        { ty: 'fl', c: { a: 0, k: [0.0588, 0.4313, 0.6588, 1] }, o: { a: 0, k: 100 }, r: 1 },
        { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0,
    },
  ],
};

@Component({
  selector: 'app-tracking',
  standalone: false,
  template: `
    <section class="tracking-screen">
      <div class="tracking-ambient" aria-hidden="true">
        <img class="tracking-float-asset asset-one" src="/assets/services/pickup.png" alt="" />
        <img class="tracking-float-asset asset-two" src="/assets/services/ironing.png" alt="" />
        <img class="tracking-float-asset asset-three" src="/assets/services/delivery.png" alt="" />
      </div>

      <section class="tracking-hero">
        <div class="tracking-copy">
          <span class="eyebrow">{{ 'Secure live order tracking' | t }}</span>
          <h1>{{ 'Know exactly where your garments are.' | t }}</h1>
          <p>{{ 'Enter your mobile number for a private view of every active laundry and dry cleaning order.' | t }}</p>

          <form class="tracking-search-card" [formGroup]="form" (ngSubmit)="track()">
            <label>
              <span>{{ 'Mobile number' | t }}</span>
              <input
                formControlName="mobile"
                inputmode="tel"
                autocomplete="tel"
                [placeholder]="'10 digit mobile number' | t"
                [attr.aria-label]="'Mobile number' | t"
              />
            </label>
            <button class="btn primary tracking-submit" type="submit" [disabled]="form.invalid || isLoading">
              <span *ngIf="isLoading" class="button-loader" aria-hidden="true"></span>
              <span>{{ (isLoading ? 'Tracking...' : 'Track') | t }}</span>
            </button>
          </form>

          <div class="tracking-assurance" aria-label="Tracking highlights">
            <article>
              <strong>{{ 'Secure' | t }}</strong>
              <span>{{ 'Private lookup' | t }}</span>
            </article>
            <article>
              <strong>{{ 'Live' | t }}</strong>
              <span>{{ 'Status updates' | t }}</span>
            </article>
            <article>
              <strong>{{ 'Premium' | t }}</strong>
              <span>{{ 'Care visibility' | t }}</span>
            </article>
          </div>
        </div>

        <div class="tracking-hero-visual">
          <div #lottiePulse class="tracking-lottie" aria-hidden="true"></div>
          <img [src]="heroVisual.image" [alt]="heroVisual.alt | t" />
          <div class="tracking-hero-chip">
            <span>{{ heroVisual.label | t }}</span>
            <strong>{{ heroVisual.title | t }}</strong>
          </div>
        </div>
      </section>

      <p class="tracking-error" *ngIf="errorMessage">{{ errorMessage | t }}</p>

      <section class="tracking-skeleton-grid" *ngIf="isLoading" aria-label="Loading orders">
        <article *ngFor="let item of skeletonRows">
          <span></span>
          <div>
            <i></i>
            <i></i>
            <i></i>
          </div>
        </article>
      </section>

      <section class="tracking-results" *ngIf="!isLoading && orders.length">
        <article
          class="tracking-order-card"
          *ngFor="let order of orders; let orderIndex = index; trackBy: trackByOrder"
          [class.cancelled]="statusKey(order.status) === 'CANCELLED'"
          [style.--card-index]="orderIndex"
        >
          <div class="tracking-illustration">
            <img [src]="statusVisual(order.status).image" [alt]="statusVisual(order.status).alt | t" />
          </div>

          <div class="tracking-order-content">
            <div class="tracking-order-top">
              <div>
                <span class="tracking-kicker">{{ order.serviceType | t }}</span>
                <h2>{{ statusVisual(order.status).title | t }}</h2>
                <p>{{ statusVisual(order.status).summary | t }}</p>
              </div>
              <span class="tracking-status-pill" [ngClass]="statusTone(order.status)">
                {{ statusVisual(order.status).label | t }}
              </span>
            </div>

            <div class="tracking-detail-grid">
              <article>
                <span>{{ 'Pickup slot' | t }}</span>
                <strong>{{ order.pickupDate | date }} {{ 'at' | t }} {{ order.pickupTime }}</strong>
              </article>
              <article>
                <span>{{ 'Clothes' | t }}</span>
                <strong>{{ order.clothCount }}</strong>
              </article>
              <article>
                <span>{{ 'Estimated bill' | t }}</span>
                <strong>{{ order.totalAmount | currency: 'INR' : 'symbol' : '1.0-0' }}</strong>
              </article>
            </div>

            <div class="tracking-progress" *ngIf="statusKey(order.status) !== 'CANCELLED'; else cancelledNote">
              <div
                class="tracking-step"
                *ngFor="let step of progressSteps; let stepIndex = index"
                [class.complete]="isStepComplete(order.status, stepIndex)"
                [class.active]="isStepActive(order.status, stepIndex)"
              >
                <span></span>
                <strong>{{ step.label | t }}</strong>
              </div>
            </div>

            <ng-template #cancelledNote>
              <div class="tracking-cancelled-note">
                <strong>{{ 'Order cancelled' | t }}</strong>
                <span>{{ 'Need help? Call or book a fresh pickup anytime.' | t }}</span>
              </div>
            </ng-template>
          </div>
        </article>
      </section>

      <section class="tracking-empty" *ngIf="!isLoading && searched && !orders.length && !errorMessage">
        <img src="/assets/tracking/received.png" [alt]="'Parcel received illustration' | t" />
        <div>
          <span class="eyebrow">{{ 'No matching orders' | t }}</span>
          <h2>{{ 'We could not find an order for that mobile number.' | t }}</h2>
          <p>{{ 'Check the number or contact us if your pickup was booked recently.' | t }}</p>
        </div>
      </section>
    </section>
  `,
})
export class TrackingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('lottiePulse') private readonly lottiePulse?: ElementRef<HTMLElement>;

  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly cdr = inject(ChangeDetectorRef);
  private trackingAnimation?: AnimationItem;

  readonly skeletonRows = Array.from({ length: 3 });
  readonly progressSteps: ProgressStep[] = [
    { key: 'RECEIVED', label: 'Received' },
    { key: 'PROCESSING', label: 'Processing' },
    { key: 'READY', label: 'Ready for Pickup' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  orders: Order[] = [];
  searched = false;
  isLoading = false;
  errorMessage = '';
  form = this.fb.group({ mobile: ['', [Validators.required, Validators.minLength(10)]] });

  get heroVisual(): StatusVisual {
    return this.orders.length ? this.statusVisual(this.orders[0].status) : STATUS_VISUALS['RECEIVED'];
  }

  ngAfterViewInit(): void {
    if (!this.lottiePulse?.nativeElement) {
      return;
    }

    this.trackingAnimation = lottie.loadAnimation({
      container: this.lottiePulse.nativeElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: TRACKING_LOTTIE,
    });
  }

  ngOnDestroy(): void {
    this.trackingAnimation?.destroy();
  }

  track(): void {
    if (this.form.invalid || this.isLoading) {
      this.form.markAllAsTouched();
      return;
    }

    const mobile = this.form.value.mobile || '';
    this.isLoading = true;
    this.searched = true;
    this.errorMessage = '';
    this.orders = [];

    this.api
      .trackOrders(mobile)
      .pipe(
        catchError(() => {
          this.errorMessage = 'Unable to track orders right now. Please try again.';
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe((orders) => {
        this.orders = orders;
        this.cdr.detectChanges();
      });
  }

  statusVisual(status: string): StatusVisual {
    return STATUS_VISUALS[this.statusKey(status)] || DEFAULT_VISUAL;
  }

  statusTone(status: string): string {
    return `status-${this.statusKey(status).toLowerCase().replaceAll('_', '-')}`;
  }

  statusKey(status: string): string {
    return (status || '').toUpperCase().replace(/[\s-]+/g, '_');
  }

  currentStepIndex(status: string): number {
    const key = this.statusKey(status);
    if (key === 'CANCELLED') {
      return -1;
    }
    if (key === 'WASHING' || key === 'IRONING' || key === 'PROCESSING') {
      return 1;
    }
    return this.progressSteps.findIndex((step) => step.key === key);
  }

  isStepComplete(status: string, stepIndex: number): boolean {
    return this.currentStepIndex(status) > stepIndex;
  }

  isStepActive(status: string, stepIndex: number): boolean {
    return this.currentStepIndex(status) === stepIndex;
  }

  trackByOrder(index: number, order: Order): string {
    return order._id || `${order.mobile}-${order.pickupDate}-${index}`;
  }
}
