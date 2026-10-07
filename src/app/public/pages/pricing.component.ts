import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { PricingItem } from '../../core/models/catalog.model';
import { I18nService } from '../../core/i18n/i18n.service';
import { imageForCatalogItem } from '../../core/catalog/item-images';
import { PricingPdfService } from '../../core/services/pricing-pdf.service';

type PricingSort = 'popular' | 'priceLow' | 'priceHigh' | 'itemAsc';

interface CatalogPricingItem extends PricingItem {
  image: string;
  icon: string;
  note: string;
}

interface ServiceTab {
  serviceType: string;
  label: string;
  icon: string;
  image: string;
  description: string;
}

const serviceTabs: ServiceTab[] = [
  {
    serviceType: 'Dry Cleaning',
    label: 'Dry Cleaning',
    icon: 'dry_cleaning',
    image: '/assets/services/dry-cleaning-banner.png',
    description: 'Solvent-safe care for delicate, formal, bridal, and household fabrics.',
  },
  {
    serviceType: 'Wash & Fold',
    label: 'Wash & Fold',
    icon: 'local_laundry_service',
    image: '/assets/services/wash-fold-banner.png',
    description: 'Everyday washing, hygienic drying, careful folding, and neat packing.',
  },
  {
    serviceType: 'Wash & Iron',
    label: 'Wash & Iron',
    icon: 'iron',
    image: '/assets/services/wash-iron-banner.png',
    description: 'Fresh washing with steam finishing for crisp, ready-to-wear garments.',
  },
  {
    serviceType: 'Steam Ironing',
    label: 'Steam Ironing',
    icon: 'iron',
    image: '/assets/services/steam-ironing-banner.png',
    description: 'Premium steam press finishing for daily wear, office wear, and occasion wear.',
  },
];

const defaultPricing: PricingItem[] = [
  { _id: 'default-dry-cleaning-shirt', item: 'Shirt', serviceType: 'Dry Cleaning', price: 60, active: true },
  { _id: 'default-dry-cleaning-pant', item: 'Pant', serviceType: 'Dry Cleaning', price: 80, active: true },
  { _id: 'default-dry-cleaning-t-shirt', item: 'T-Shirt', serviceType: 'Dry Cleaning', price: 50, active: true },
  { _id: 'default-dry-cleaning-jeans', item: 'Jeans', serviceType: 'Dry Cleaning', price: 90, active: true },
  { _id: 'default-dry-cleaning-blouse', item: 'Blouse', serviceType: 'Dry Cleaning', price: 50, active: true },
  { _id: 'default-dry-cleaning-saree', item: 'Saree', serviceType: 'Dry Cleaning', price: 200, active: true },
  { _id: 'default-dry-cleaning-silk-saree', item: 'Silk Saree', serviceType: 'Dry Cleaning', price: 250, active: true },
  { _id: 'default-dry-cleaning-cotton-saree', item: 'Cotton Saree', serviceType: 'Dry Cleaning', price: 180, active: true },
  { _id: 'default-dry-cleaning-designer-saree', item: 'Designer Saree', serviceType: 'Dry Cleaning', price: 350, active: true },
  { _id: 'default-dry-cleaning-wedding-saree', item: 'Wedding Saree', serviceType: 'Dry Cleaning', price: 500, active: true },
  { _id: 'default-dry-cleaning-lehenga', item: 'Lehenga', serviceType: 'Dry Cleaning', price: 350, active: true },
  { _id: 'default-dry-cleaning-bridal-lehenga', item: 'Bridal Lehenga', serviceType: 'Dry Cleaning', price: 600, active: true },
  { _id: 'default-dry-cleaning-reception-gown', item: 'Reception Gown', serviceType: 'Dry Cleaning', price: 300, active: true },
  { _id: 'default-dry-cleaning-wedding-gown', item: 'Wedding Gown', serviceType: 'Dry Cleaning', price: 500, active: true },
  { _id: 'default-dry-cleaning-normal-veshti', item: 'Normal Veshti', serviceType: 'Dry Cleaning', price: 100, active: true },
  { _id: 'default-dry-cleaning-pattu-veshti', item: 'Pattu Veshti', serviceType: 'Dry Cleaning', price: 150, active: true },
  { _id: 'default-dry-cleaning-kurta', item: 'Kurta', serviceType: 'Dry Cleaning', price: 100, active: true },
  { _id: 'default-dry-cleaning-salwar', item: 'Salwar', serviceType: 'Dry Cleaning', price: 120, active: true },
  { _id: 'default-dry-cleaning-salwar-suit', item: 'Salwar Suit', serviceType: 'Dry Cleaning', price: 120, active: true },
  { _id: 'default-dry-cleaning-churidar', item: 'Churidar', serviceType: 'Dry Cleaning', price: 100, active: true },
  { _id: 'default-dry-cleaning-dupatta', item: 'Dupatta', serviceType: 'Dry Cleaning', price: 60, active: true },
  { _id: 'default-dry-cleaning-sherwani', item: 'Sherwani', serviceType: 'Dry Cleaning', price: 450, active: true },
  { _id: 'default-dry-cleaning-blazer', item: 'Blazer', serviceType: 'Dry Cleaning', price: 250, active: true },
  { _id: 'default-dry-cleaning-coat', item: 'Coat', serviceType: 'Dry Cleaning', price: 300, active: true },
  { _id: 'default-dry-cleaning-suit-2-piece', item: 'Suit (2 Piece)', serviceType: 'Dry Cleaning', price: 450, active: true },
  { _id: 'default-dry-cleaning-suit-3-piece', item: 'Suit (3 Piece)', serviceType: 'Dry Cleaning', price: 550, active: true },
  { _id: 'default-dry-cleaning-jacket', item: 'Jacket', serviceType: 'Dry Cleaning', price: 220, active: true },
  { _id: 'default-dry-cleaning-sweater', item: 'Sweater', serviceType: 'Dry Cleaning', price: 180, active: true },
  { _id: 'default-dry-cleaning-hoodie', item: 'Hoodie', serviceType: 'Dry Cleaning', price: 180, active: true },
  { _id: 'default-dry-cleaning-kids-dress', item: 'Kids Dress', serviceType: 'Dry Cleaning', price: 80, active: true },
  { _id: 'default-dry-cleaning-school-uniform', item: 'School Uniform', serviceType: 'Dry Cleaning', price: 120, active: true },
  { _id: 'default-dry-cleaning-blanket', item: 'Blanket', serviceType: 'Dry Cleaning', price: 300, active: true },
  { _id: 'default-dry-cleaning-bed-sheet', item: 'Bed Sheet', serviceType: 'Dry Cleaning', price: 180, active: true },
  { _id: 'default-dry-cleaning-curtain', item: 'Curtain', serviceType: 'Dry Cleaning', price: 250, active: true },
  { _id: 'default-dry-cleaning-pillow-cover', item: 'Pillow Cover', serviceType: 'Dry Cleaning', price: 40, active: true },
  { _id: 'default-dry-cleaning-cushion-cover', item: 'Cushion Cover', serviceType: 'Dry Cleaning', price: 50, active: true },
  { _id: 'default-dry-cleaning-sofa-cover', item: 'Sofa Cover', serviceType: 'Dry Cleaning', price: 350, active: true },
  { _id: 'default-dry-cleaning-table-cloth', item: 'Table Cloth', serviceType: 'Dry Cleaning', price: 100, active: true },
  { _id: 'default-dry-cleaning-soft-toy', item: 'Soft Toy', serviceType: 'Dry Cleaning', price: 250, active: true },
  { _id: 'default-dry-cleaning-dress', item: 'Dress', serviceType: 'Dry Cleaning', price: 180, active: true },
  { _id: 'default-dry-cleaning-skirt', item: 'Skirt', serviceType: 'Dry Cleaning', price: 120, active: true },
  { _id: 'default-dry-cleaning-tie', item: 'Tie', serviceType: 'Dry Cleaning', price: 80, active: true },
  { _id: 'default-dry-cleaning-waistcoat', item: 'Waistcoat', serviceType: 'Dry Cleaning', price: 180, active: true },
  { _id: 'default-dry-cleaning-shawl', item: 'Shawl / Stole', serviceType: 'Dry Cleaning', price: 120, active: true },
  { _id: 'default-dry-cleaning-quilt', item: 'Quilt', serviceType: 'Dry Cleaning', price: 350, active: true },
  { _id: 'default-dry-cleaning-duvet', item: 'Duvet', serviceType: 'Dry Cleaning', price: 400, active: true },
  { _id: 'default-dry-cleaning-carpet', item: 'Carpet', serviceType: 'Dry Cleaning', price: 600, active: true },
  { _id: 'default-dry-cleaning-rug', item: 'Rug', serviceType: 'Dry Cleaning', price: 450, active: true },
  { _id: 'default-dry-cleaning-shoes', item: 'Shoes', serviceType: 'Dry Cleaning', price: 350, active: true },

  { _id: 'default-wash-fold-shirt', item: 'Shirt', serviceType: 'Wash & Fold', price: 35, active: true },
  { _id: 'default-wash-fold-pant', item: 'Pant', serviceType: 'Wash & Fold', price: 40, active: true },
  { _id: 'default-wash-fold-t-shirt', item: 'T-Shirt', serviceType: 'Wash & Fold', price: 30, active: true },
  { _id: 'default-wash-fold-jeans', item: 'Jeans', serviceType: 'Wash & Fold', price: 45, active: true },
  { _id: 'default-wash-fold-kurta', item: 'Kurta', serviceType: 'Wash & Fold', price: 50, active: true },
  { _id: 'default-wash-fold-salwar', item: 'Salwar', serviceType: 'Wash & Fold', price: 60, active: true },
  { _id: 'default-wash-fold-saree', item: 'Saree', serviceType: 'Wash & Fold', price: 120, active: true },
  { _id: 'default-wash-fold-cotton-saree', item: 'Cotton Saree', serviceType: 'Wash & Fold', price: 100, active: true },
  { _id: 'default-wash-fold-blouse', item: 'Blouse', serviceType: 'Wash & Fold', price: 30, active: true },
  { _id: 'default-wash-fold-lehenga', item: 'Lehenga', serviceType: 'Wash & Fold', price: 180, active: true },
  { _id: 'default-wash-fold-reception-gown', item: 'Reception Gown', serviceType: 'Wash & Fold', price: 200, active: true },
  { _id: 'default-wash-fold-normal-veshti', item: 'Normal Veshti', serviceType: 'Wash & Fold', price: 40, active: true },
  { _id: 'default-wash-fold-pattu-veshti', item: 'Pattu Veshti', serviceType: 'Wash & Fold', price: 60, active: true },
  { _id: 'default-wash-fold-bed-sheet', item: 'Bed Sheet', serviceType: 'Wash & Fold', price: 80, active: true },
  { _id: 'default-wash-fold-blanket', item: 'Blanket', serviceType: 'Wash & Fold', price: 150, active: true },
  { _id: 'default-wash-fold-pillow-cover', item: 'Pillow Cover', serviceType: 'Wash & Fold', price: 20, active: true },
  { _id: 'default-wash-fold-curtain', item: 'Curtain', serviceType: 'Wash & Fold', price: 120, active: true },
  { _id: 'default-wash-fold-shorts', item: 'Shorts', serviceType: 'Wash & Fold', price: 30, active: true },
  { _id: 'default-wash-fold-night-suit', item: 'Night Suit', serviceType: 'Wash & Fold', price: 70, active: true },
  { _id: 'default-wash-fold-dress', item: 'Dress', serviceType: 'Wash & Fold', price: 80, active: true },
  { _id: 'default-wash-fold-skirt', item: 'Skirt', serviceType: 'Wash & Fold', price: 45, active: true },
  { _id: 'default-wash-fold-towel', item: 'Towel', serviceType: 'Wash & Fold', price: 35, active: true },
  { _id: 'default-wash-fold-bath-towel', item: 'Bath Towel', serviceType: 'Wash & Fold', price: 50, active: true },
  { _id: 'default-wash-fold-cushion-cover', item: 'Cushion Cover', serviceType: 'Wash & Fold', price: 30, active: true },
  { _id: 'default-wash-fold-table-cloth', item: 'Table Cloth', serviceType: 'Wash & Fold', price: 60, active: true },
  { _id: 'default-wash-fold-quilt', item: 'Quilt', serviceType: 'Wash & Fold', price: 180, active: true },
  { _id: 'default-wash-fold-duvet', item: 'Duvet', serviceType: 'Wash & Fold', price: 220, active: true },

  { _id: 'default-wash-iron-shirt', item: 'Shirt', serviceType: 'Wash & Iron', price: 50, active: true },
  { _id: 'default-wash-iron-pant', item: 'Pant', serviceType: 'Wash & Iron', price: 60, active: true },
  { _id: 'default-wash-iron-t-shirt', item: 'T-Shirt', serviceType: 'Wash & Iron', price: 40, active: true },
  { _id: 'default-wash-iron-jeans', item: 'Jeans', serviceType: 'Wash & Iron', price: 60, active: true },
  { _id: 'default-wash-iron-kurta', item: 'Kurta', serviceType: 'Wash & Iron', price: 70, active: true },
  { _id: 'default-wash-iron-salwar', item: 'Salwar', serviceType: 'Wash & Iron', price: 80, active: true },
  { _id: 'default-wash-iron-blouse', item: 'Blouse', serviceType: 'Wash & Iron', price: 40, active: true },
  { _id: 'default-wash-iron-saree', item: 'Saree', serviceType: 'Wash & Iron', price: 150, active: true },
  { _id: 'default-wash-iron-cotton-saree', item: 'Cotton Saree', serviceType: 'Wash & Iron', price: 130, active: true },
  { _id: 'default-wash-iron-silk-saree', item: 'Silk Saree', serviceType: 'Wash & Iron', price: 200, active: true },
  { _id: 'default-wash-iron-lehenga', item: 'Lehenga', serviceType: 'Wash & Iron', price: 250, active: true },
  { _id: 'default-wash-iron-reception-gown', item: 'Reception Gown', serviceType: 'Wash & Iron', price: 250, active: true },
  { _id: 'default-wash-iron-normal-veshti', item: 'Normal Veshti', serviceType: 'Wash & Iron', price: 60, active: true },
  { _id: 'default-wash-iron-pattu-veshti', item: 'Pattu Veshti', serviceType: 'Wash & Iron', price: 80, active: true },
  { _id: 'default-wash-iron-bed-sheet', item: 'Bed Sheet', serviceType: 'Wash & Iron', price: 120, active: true },
  { _id: 'default-wash-iron-blanket', item: 'Blanket', serviceType: 'Wash & Iron', price: 220, active: true },
  { _id: 'default-wash-iron-curtain', item: 'Curtain', serviceType: 'Wash & Iron', price: 180, active: true },
  { _id: 'default-wash-iron-shorts', item: 'Shorts', serviceType: 'Wash & Iron', price: 45, active: true },
  { _id: 'default-wash-iron-night-suit', item: 'Night Suit', serviceType: 'Wash & Iron', price: 90, active: true },
  { _id: 'default-wash-iron-dress', item: 'Dress', serviceType: 'Wash & Iron', price: 110, active: true },
  { _id: 'default-wash-iron-skirt', item: 'Skirt', serviceType: 'Wash & Iron', price: 65, active: true },
  { _id: 'default-wash-iron-dupatta', item: 'Dupatta', serviceType: 'Wash & Iron', price: 50, active: true },
  { _id: 'default-wash-iron-school-uniform', item: 'School Uniform', serviceType: 'Wash & Iron', price: 100, active: true },
  { _id: 'default-wash-iron-pillow-cover', item: 'Pillow Cover', serviceType: 'Wash & Iron', price: 30, active: true },
  { _id: 'default-wash-iron-table-cloth', item: 'Table Cloth', serviceType: 'Wash & Iron', price: 90, active: true },
  { _id: 'default-wash-iron-quilt', item: 'Quilt', serviceType: 'Wash & Iron', price: 260, active: true },
  { _id: 'default-wash-iron-duvet', item: 'Duvet', serviceType: 'Wash & Iron', price: 280, active: true },

  { _id: 'default-steam-ironing-shirt', item: 'Shirt', serviceType: 'Steam Ironing', price: 10, active: true },
  { _id: 'default-steam-ironing-pant', item: 'Pant', serviceType: 'Steam Ironing', price: 10, active: true },
  { _id: 'default-steam-ironing-t-shirt', item: 'T-Shirt', serviceType: 'Steam Ironing', price: 15, active: true },
  { _id: 'default-steam-ironing-jeans', item: 'Jeans', serviceType: 'Steam Ironing', price: 30, active: true },
  { _id: 'default-steam-ironing-kurta', item: 'Kurta', serviceType: 'Steam Ironing', price: 30, active: true },
  { _id: 'default-steam-ironing-blouse', item: 'Blouse', serviceType: 'Steam Ironing', price: 20, active: true },
  { _id: 'default-steam-ironing-salwar', item: 'Salwar', serviceType: 'Steam Ironing', price: 35, active: true },
  { _id: 'default-steam-ironing-saree', item: 'Saree', serviceType: 'Steam Ironing', price: 80, active: true },
  { _id: 'default-steam-ironing-cotton-saree', item: 'Cotton Saree', serviceType: 'Steam Ironing', price: 70, active: true },
  { _id: 'default-steam-ironing-silk-saree', item: 'Silk Saree', serviceType: 'Steam Ironing', price: 100, active: true },
  { _id: 'default-steam-ironing-lehenga', item: 'Lehenga', serviceType: 'Steam Ironing', price: 150, active: true },
  { _id: 'default-steam-ironing-reception-gown', item: 'Reception Gown', serviceType: 'Steam Ironing', price: 180, active: true },
  { _id: 'default-steam-ironing-normal-veshti', item: 'Normal Veshti', serviceType: 'Steam Ironing', price: 30, active: true },
  { _id: 'default-steam-ironing-pattu-veshti', item: 'Pattu Veshti', serviceType: 'Steam Ironing', price: 50, active: true },
  { _id: 'default-steam-ironing-coat', item: 'Coat', serviceType: 'Steam Ironing', price: 80, active: true },
  { _id: 'default-steam-ironing-blazer', item: 'Blazer', serviceType: 'Steam Ironing', price: 70, active: true },
  { _id: 'default-steam-ironing-sherwani', item: 'Sherwani', serviceType: 'Steam Ironing', price: 120, active: true },
  { _id: 'default-steam-ironing-jacket', item: 'Jacket', serviceType: 'Steam Ironing', price: 60, active: true },
  { _id: 'default-steam-ironing-bed-sheet', item: 'Bed Sheet', serviceType: 'Steam Ironing', price: 50, active: true },
  { _id: 'default-steam-ironing-curtain', item: 'Curtain', serviceType: 'Steam Ironing', price: 80, active: true },
  { _id: 'default-steam-ironing-dupatta', item: 'Dupatta', serviceType: 'Steam Ironing', price: 30, active: true },
  { _id: 'default-steam-ironing-school-uniform', item: 'School Uniform', serviceType: 'Steam Ironing', price: 50, active: true },
  { _id: 'default-steam-ironing-dress', item: 'Dress', serviceType: 'Steam Ironing', price: 70, active: true },
  { _id: 'default-steam-ironing-skirt', item: 'Skirt', serviceType: 'Steam Ironing', price: 40, active: true },
  { _id: 'default-steam-ironing-suit-2-piece', item: 'Suit (2 Piece)', serviceType: 'Steam Ironing', price: 150, active: true },
  { _id: 'default-steam-ironing-suit-3-piece', item: 'Suit (3 Piece)', serviceType: 'Steam Ironing', price: 200, active: true },
  { _id: 'default-steam-ironing-pillow-cover', item: 'Pillow Cover', serviceType: 'Steam Ironing', price: 20, active: true },
  { _id: 'default-steam-ironing-table-cloth', item: 'Table Cloth', serviceType: 'Steam Ironing', price: 40, active: true },
];

const defaultRank = new Map(defaultPricing.map((item, index) => [pricingKey(item), index]));

function pricingKey(item: Pick<PricingItem, 'item' | 'serviceType'>): string {
  return `${item.serviceType.trim().toLowerCase()}::${item.item.trim().toLowerCase()}`;
}

@Component({
  selector: 'app-pricing',
  standalone: false,
  template: `
    <section class="pricing-hero catalog-hero">
      <div>
        <span class="eyebrow">{{ 'Premium care catalog' | t }}</span>
        <h1>{{ 'Service Catalog' | t }}</h1>
        <p>{{ 'Explore a complete laundry, dry cleaning, wash, fold, steam iron, and home-fabric care catalog before booking your pickup.' | t }}</p>
        <div class="pricing-highlights">
          <article><strong>{{ pricing.length }}</strong><span>{{ 'Premium services' | t }}</span></article>
          <article><strong>₹{{ startingPrice }}</strong><span>{{ 'Starting price' | t }}</span></article>
          <article><strong>{{ serviceTabs.length }}</strong><span>{{ 'Curated sections' | t }}</span></article>
        </div>
      </div>

      <aside class="pricing-quote-card" *ngIf="activeTab as tab">
        <img [src]="tab.image" [alt]="tab.label + ' preview' | t" />
        <div>
          <span>{{ 'Selected care' | t }}</span>
          <strong>{{ tab.label | t }}</strong>
          <p>{{ tab.description | t }}</p>
        </div>
      </aside>
    </section>

    <section class="pricing-tabs" role="tablist" [attr.aria-label]="'Service catalog sections' | t">
      <button
        type="button"
        role="tab"
        *ngFor="let tab of serviceTabs; trackBy: trackByService"
        class="service-banner-tab"
        [class.active]="selectedService === tab.serviceType"
        [attr.aria-selected]="selectedService === tab.serviceType"
        (click)="selectService(tab.serviceType)"
      >
        <img [src]="tab.image" [alt]="tab.label + ' category banner' | t" loading="lazy" decoding="async" />
        <span class="service-banner-shade"></span>
        <span class="service-banner-copy">
          <small>{{ countByService(tab.serviceType) }} {{ 'services' | t }}</small>
          <strong>{{ tab.label | t }}</strong>
          <em>{{ tab.description | t }}</em>
        </span>
      </button>
    </section>

    <section class="pricing-toolbar">
      <label class="pricing-search">
        <span>{{ 'Search price list' | t }}</span>
        <input [formControl]="searchControl" [placeholder]="'Search shirt, suit, saree, curtain...' | t" />
      </label>

      <label class="pricing-sort">
        <span>{{ 'Sort by' | t }}</span>
        <select [formControl]="sortControl">
          <option value="popular">{{ 'Recommended' | t }}</option>
          <option value="priceLow">{{ 'Price: Low to High' | t }}</option>
          <option value="priceHigh">{{ 'Price: High to Low' | t }}</option>
          <option value="itemAsc">{{ 'Item Name' | t }}</option>
        </select>
      </label>

      <ng-container *ngIf="pdfDownloadDisabled; else readyPdfDownload">
        <button type="button" class="btn primary pricing-download" disabled aria-disabled="true">
          <span class="material-symbols-rounded" aria-hidden="true">{{ pdfDownloading ? 'hourglass_top' : 'download' }}</span>
          <span>{{ (pdfDownloading ? 'Preparing PDF' : 'Download PDF') | t }}</span>
        </button>
      </ng-container>
      <ng-template #readyPdfDownload>
        <button type="button" class="btn primary pricing-download" (click)="downloadPricingPdf()">
          <span class="material-symbols-rounded" aria-hidden="true">download</span>
          <span>{{ 'Download PDF' | t }}</span>
        </button>
      </ng-template>
    </section>

    <section class="pricing-section-head" *ngIf="activeTab as tab">
      <div>
        <img class="pricing-section-thumb" [src]="tab.image" [alt]="tab.label + ' thumbnail' | t" loading="lazy" decoding="async" />
        <div>
          <strong>{{ tab.label | t }}</strong>
          <p>{{ tab.description | t }}</p>
        </div>
      </div>
      <small>{{ filteredPricing.length }} {{ 'matching services' | t }}</small>
    </section>

    <section class="catalog-skeleton-grid" *ngIf="loading && !pricing.length">
      <article class="catalog-skeleton-card" *ngFor="let skeleton of skeletonCards; trackBy: trackBySkeleton">
        <span></span><strong></strong><em></em><small></small>
      </article>
    </section>

    <section class="price-list-grid catalog-grid" *ngIf="filteredPricing.length; else noPricing">
      <article
        class="price-list-card catalog-card"
        *ngFor="let item of filteredPricing; let index = index; trackBy: trackByPricing"
        [style.animation-delay.ms]="index * 28"
      >
        <div class="price-card-media">
          <img [src]="item.image" [alt]="item.item + ' ' + item.serviceType + ' care image' | t" loading="lazy" decoding="async" />
          <span class="price-card-icon" aria-hidden="true">
            <img [src]="serviceImageFor(item.serviceType)" alt="" loading="lazy" decoding="async" />
          </span>
        </div>
        <div class="price-card-top">
          <span>{{ item.serviceType | t }}</span>
          <strong>₹{{ item.price }}</strong>
        </div>
        <h2>{{ item.item | t }}</h2>
        <p>{{ item.note | t }}</p>
        <a routerLink="/pickup-booking" class="btn ghost">{{ 'Book Pickup' | t }}</a>
      </article>
    </section>

    <ng-template #noPricing>
      <section class="pricing-empty" *ngIf="!loading">
        <strong>{{ 'No pricing found' | t }}</strong>
        <p>{{ 'Try another item name or choose a different service section.' | t }}</p>
      </section>
    </ng-template>

    <div class="table-wrap pricing-table">
      <table>
        <thead><tr><th>{{ 'Item' | t }}</th><th>{{ 'Service' | t }}</th><th>{{ 'Price' | t }}</th><th>{{ 'Booking' | t }}</th></tr></thead>
        <tbody>
          <tr *ngFor="let item of filteredPricing; trackBy: trackByPricing">
            <td>{{ item.item | t }}</td>
            <td>{{ item.serviceType | t }}</td>
            <td>₹{{ item.price }}</td>
            <td><a routerLink="/pickup-booking">{{ 'Book now' | t }}</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class PricingComponent implements OnInit {
  pricing: CatalogPricingItem[] = [];
  searchControl = new FormControl('', { nonNullable: true });
  sortControl = new FormControl<PricingSort>('popular', { nonNullable: true });
  selectedService = serviceTabs[0].serviceType;
  serviceTabs = serviceTabs;
  loading = true;
  pdfDownloading = false;
  skeletonCards = Array.from({ length: 8 }, (_, index) => index);

  constructor(
    private readonly api: ApiService,
    private readonly i18n: I18nService,
    private readonly pricingPdf: PricingPdfService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.pricing = this.enrichPricing(defaultPricing);
    this.api.pricing().subscribe({
      next: (items) => {
        this.pricing = this.enrichPricing(this.mergePricing(items || []));
        this.loading = false;
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.pricing = this.enrichPricing(defaultPricing);
        this.loading = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  get activeTab(): ServiceTab | undefined {
    return this.serviceTabs.find((tab) => tab.serviceType === this.selectedService);
  }

  get startingPrice(): number {
    if (!this.pricing.length) {
      return 0;
    }
    return Math.min(...this.pricing.map((item) => item.price));
  }

  get pdfDownloadDisabled(): boolean {
    return this.loading || this.pdfDownloading || !this.pricing.length;
  }

  get filteredPricing(): CatalogPricingItem[] {
    const query = this.searchControl.value.trim().toLowerCase();
    const filtered = this.pricing.filter((item) => {
      const matchesSearch = [item.item, item.serviceType].some((value) => value.toLowerCase().includes(query));
      return item.serviceType === this.selectedService && matchesSearch;
    });

    return filtered.sort((a, b) => {
      switch (this.sortControl.value) {
        case 'priceLow':
          return a.price - b.price || a.item.localeCompare(b.item);
        case 'priceHigh':
          return b.price - a.price || a.item.localeCompare(b.item);
        case 'itemAsc':
          return a.item.localeCompare(b.item);
        default:
          return this.rankPricing(a) - this.rankPricing(b);
      }
    });
  }

  selectService(service: string): void {
    this.selectedService = service;
  }

  countByService(service: string): number {
    return this.pricing.filter((item) => item.serviceType === service).length;
  }

  async downloadPricingPdf(): Promise<void> {
    if (this.loading || this.pdfDownloading || !this.pricing.length) {
      return;
    }

    this.pdfDownloading = true;
    try {
      await this.pricingPdf.downloadPricingList(this.pricing, {
        serviceOrder: this.serviceTabs.map((tab) => tab.serviceType),
      });
    } finally {
      this.pdfDownloading = false;
      this.changeDetector.markForCheck();
    }
  }

  serviceImageFor(serviceType: string): string {
    return this.serviceTabs.find((tab) => tab.serviceType === serviceType)?.image || '/assets/services/laundry.png';
  }

  trackByPricing(_index: number, item: CatalogPricingItem): string {
    return item._id || `${item.serviceType}-${item.item}-${item.price}`;
  }

  trackByService(_index: number, tab: ServiceTab): string {
    return tab.serviceType;
  }

  trackBySkeleton(_index: number, skeleton: number): number {
    return skeleton;
  }

  private mergePricing(apiItems: PricingItem[]): PricingItem[] {
    const merged = new Map(defaultPricing.map((item) => [pricingKey(item), item]));
    apiItems
      .filter((item) => item.active !== false)
      .forEach((item) => {
        const key = pricingKey(item);
        merged.set(key, { ...merged.get(key), ...item, active: item.active !== false });
      });

    return Array.from(merged.values());
  }

  private enrichPricing(items: PricingItem[]): CatalogPricingItem[] {
    return items.map((item) => ({
      ...item,
      image: this.imageForItem(item),
      icon: this.iconForItem(item),
      note: this.priceDescription(item),
    }));
  }

  private rankPricing(item: PricingItem): number {
    return defaultRank.get(pricingKey(item)) ?? 9999;
  }

  private imageForItem(item: PricingItem): string {
    return imageForCatalogItem(item.item, item.serviceType);
  }

  private iconForItem(item: PricingItem): string {
    const name = item.item.toLowerCase();
    if (/(blanket|bed|curtain|cover|cloth|toy|quilt|duvet|carpet|rug|towel)/.test(name)) {
      return 'bed';
    }
    if (/(saree|lehenga|gown|dress|blouse|dupatta|skirt|shawl)/.test(name)) {
      return 'styler';
    }
    if (/(suit|blazer|coat|sherwani|jacket|tie|waistcoat)/.test(name)) {
      return 'checkroom';
    }
    if (item.serviceType === 'Steam Ironing') {
      return 'iron';
    }
    if (item.serviceType === 'Wash & Fold') {
      return 'local_laundry_service';
    }
    return 'dry_cleaning';
  }

  private priceDescription(item: PricingItem): string {
    const service = this.t(item.serviceType);
    const itemName = this.t(item.item).toLowerCase();
    if (item.serviceType === 'Steam Ironing') {
      return `${service} finishing for ${itemName} with crease control, garment inspection, and neat packing.`;
    }
    if (item.serviceType === 'Wash & Fold') {
      return `${service} care for ${itemName} with sorted washing, hygienic drying, folding, and packing.`;
    }
    if (item.serviceType === 'Wash & Iron') {
      return `${service} care for ${itemName} with washing, steam finishing, inspection, and packing.`;
    }
    return `${service} care for ${itemName} with fabric inspection, stain attention, finishing, and premium packing.`;
  }

  private t(value: string): string {
    return this.i18n.translate(value);
  }
}
