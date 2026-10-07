import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { ServiceItem } from '../../core/models/catalog.model';

@Component({
  selector: 'app-services',
  standalone: false,
  template: `
    <section class="services-hero">
      <div class="services-copy">
        <span class="eyebrow">{{ 'Expert care menu' | t }}</span>
        <h1>{{ 'Services' | t }}</h1>
        <p>{{ 'Premium pickup, laundry, dry cleaning, ironing, and doorstep delivery designed for busy homes and delicate garments.' | t }}</p>
        <div class="service-pills">
          <span>{{ 'Premium pickup' | t }}</span>
          <span>{{ 'Laundry' | t }}</span>
          <span>{{ 'Dry cleaning' | t }}</span>
          <span>{{ 'Ironing' | t }}</span>
          <span>{{ 'Doorstep delivery' | t }}</span>
        </div>
        <div class="service-quick-stats">
          <article><strong>5</strong><span>{{ 'Care services' | t }}</span></article>
          <article><strong>24 hr</strong><span>{{ 'Express support' | t }}</span></article>
          <article><strong>{{ 'Doorstep' | t }}</strong><span>{{ 'Pickup and delivery' | t }}</span></article>
        </div>
        <div class="hero-actions">
          <a routerLink="/pickup-booking" class="btn primary">{{ 'Book Pickup' | t }}</a>
          <a routerLink="/pricing" class="btn ghost">{{ 'View Pricing' | t }}</a>
        </div>
      </div>

      <div
        class="service-carousel"
        tabindex="0"
        [attr.aria-label]="'Premium service gallery' | t"
        (mouseenter)="stopCarousel()"
        (mouseleave)="startCarousel()"
        (focusin)="stopCarousel()"
        (focusout)="startCarousel()"
        (touchstart)="onTouchStart($event)"
        (touchend)="onTouchEnd($event)"
        (keydown.arrowleft)="previousSlide()"
        (keydown.arrowright)="nextSlide()"
      >
        <div class="carousel-frame" [attr.aria-label]="carouselSlides[activeSlide].title | t">
          <article
            class="carousel-slide"
            *ngFor="let slide of carouselSlides; let index = index; trackBy: trackByTitle"
            [class.active]="index === activeSlide"
            [attr.aria-hidden]="index !== activeSlide"
          >
            <img
              [src]="slide.image"
              [alt]="slide.alt | t"
              [attr.loading]="index === 0 ? 'eager' : 'lazy'"
              decoding="async"
            />
            <div class="carousel-caption">
              <span>{{ slide.kicker | t }}</span>
              <strong>{{ slide.title | t }}</strong>
              <p>{{ slide.description | t }}</p>
            </div>
          </article>
          <button class="carousel-nav prev" type="button" (click)="previousSlide()" [attr.aria-label]="'Previous service image' | t">{{ 'Prev' | t }}</button>
          <button class="carousel-nav next" type="button" (click)="nextSlide()" [attr.aria-label]="'Next service image' | t">{{ 'Next' | t }}</button>
        </div>
        <div class="carousel-thumbs">
          <button
            type="button"
            *ngFor="let slide of carouselSlides; let index = index; trackBy: trackByTitle"
            [class.active]="index === activeSlide"
            (click)="setSlide(index)"
            [attr.aria-label]="('Show ' | t) + (slide.title | t)"
          >
            <img [src]="slide.image" [alt]="''" loading="lazy" decoding="async" />
            <span>{{ slide.title | t }}</span>
          </button>
        </div>
      </div>
    </section>

    <section class="service-detail-grid">
      <article class="service-detail-card" *ngFor="let slide of carouselSlides; trackBy: trackByTitle">
        <img [src]="slide.image" [alt]="slide.alt | t" loading="lazy" decoding="async" />
        <div>
          <span>{{ slide.kicker | t }}</span>
          <h2>{{ slide.title | t }}</h2>
          <p>{{ slide.description | t }}</p>
        </div>
      </article>
    </section>

    <section class="card-grid service-api-grid">
      <article class="service-card" *ngFor="let service of services">
        <span class="material-symbol">{{ service.icon }}</span>
        <h2>{{ service.name | t }}</h2>
        <p>{{ service.description | t }}</p>
      </article>
    </section>
  `,
})
export class ServicesComponent implements OnInit, OnDestroy {
  services: ServiceItem[] = [];
  activeSlide = 0;
  carouselSlides = [
    {
      title: 'Premium pickup',
      kicker: 'At your doorstep',
      alt: 'Laundry pickup service collecting packed garments from a home',
      description: 'Schedule a pickup and our team collects garments from your home with clean handling and order tagging.',
      image: '/assets/services/pickup.png',
    },
    {
      title: 'Fresh laundry',
      kicker: 'Sorted and sanitized',
      alt: 'Fresh folded laundry stacked in a clean laundry room',
      description: 'Everyday clothes, linens, and towels washed, dried, folded, and packed with hygienic care.',
      image: '/assets/services/laundry.png',
    },
    {
      title: 'Dry cleaning',
      kicker: 'Delicate garment care',
      alt: 'Premium garments on hangers ready after dry cleaning',
      description: 'Suits, sarees, coats, dresses, and premium fabrics handled with careful inspection and finishing.',
      image: '/assets/services/dry-cleaning.png',
    },
    {
      title: 'Steam ironing',
      kicker: 'Crisp finishing',
      alt: 'Steam iron pressing a clean shirt on an ironing board',
      description: 'Sharp, polished finishing for office wear, uniforms, occasion outfits, and daily essentials.',
      image: '/assets/services/ironing.png',
    },
    {
      title: 'Doorstep delivery',
      kicker: 'Packed with care',
      alt: 'Clean folded clothes prepared for doorstep delivery',
      description: 'Clean garments returned neatly packed at your doorstep with reliable status updates.',
      image: '/assets/services/delivery.png',
    },
  ];
  private carouselTimer?: ReturnType<typeof setInterval>;
  private touchStartX = 0;

  constructor(private readonly api: ApiService) {}

  ngOnInit(): void {
    this.api.services().subscribe((items) => (this.services = items));
    this.startCarousel();
  }

  ngOnDestroy(): void {
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
    }
  }

  previousSlide(): void {
    this.activeSlide = (this.activeSlide - 1 + this.carouselSlides.length) % this.carouselSlides.length;
  }

  nextSlide(): void {
    this.activeSlide = (this.activeSlide + 1) % this.carouselSlides.length;
  }

  setSlide(index: number): void {
    this.activeSlide = index;
  }

  startCarousel(): void {
    this.stopCarousel();
    this.carouselTimer = setInterval(() => this.nextSlide(), 4800);
  }

  stopCarousel(): void {
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
      this.carouselTimer = undefined;
    }
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0]?.clientX || 0;
  }

  onTouchEnd(event: TouchEvent): void {
    const touchEndX = event.changedTouches[0]?.clientX || 0;
    const delta = touchEndX - this.touchStartX;
    if (Math.abs(delta) < 45) {
      return;
    }
    delta > 0 ? this.previousSlide() : this.nextSlide();
  }

  trackByTitle(_index: number, slide: { title: string }): string {
    return slide.title;
  }
}
