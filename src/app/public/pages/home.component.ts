import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  template: `
    <section class="hero home-hero">
      <div class="bubble-field" aria-hidden="true">
        <span class="bubble bubble-one"></span>
        <span class="bubble bubble-two"></span>
        <span class="bubble bubble-three"></span>
        <span class="bubble bubble-four"></span>
        <span class="bubble bubble-five"></span>
        <span class="bubble bubble-six"></span>
        <span class="bubble bubble-seven"></span>
        <span class="bubble bubble-eight"></span>
        <span class="bubble bubble-nine"></span>
        <span class="bubble bubble-ten"></span>
      </div>
      <div class="hero-copy">
        <span class="eyebrow">{{ 'Pickup today. Fresh clothes tomorrow.' | t }}</span>
        <h1>{{ 'TL & Dry Cleaners' | t }}</h1>
        <p>{{ 'Premium garment care with hygienic washing, expert dry cleaning, steam ironing, and reliable doorstep service.' | t }}</p>
        <div class="hero-actions">
          <a routerLink="/pickup-booking" class="btn primary">{{ 'Book Pickup' | t }}</a>
          <a routerLink="/order-tracking" class="btn ghost">{{ 'Track Order' | t }}</a>
        </div>
      </div>
      <div class="hero-visual">
        <img
          src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=900&q=80"
          [alt]="'Fresh folded laundry in a clean laundry shop' | t"
        />
      </div>
    </section>
    <section class="stats home-stats">
      <article>
        <span class="stat-kicker">{{ 'Fast care' | t }}</span>
        <strong>24 hr</strong>
        <span>{{ 'Express support' | t }}</span>
        <p>{{ 'Quick pickup assistance, clear communication, and urgent garment handling for busy schedules.' | t }}</p>
      </article>
      <article>
        <span class="stat-kicker">{{ 'Quality flow' | t }}</span>
        <strong>6 step</strong>
        <span>{{ 'Garment care process' | t }}</span>
        <p>{{ 'Tagging, inspection, service sorting, cleaning, finishing, packing, and status updates.' | t }}</p>
      </article>
      <article>
        <span class="stat-kicker">{{ 'Convenience' | t }}</span>
        <strong>{{ 'Doorstep' | t }}</strong>
        <span>{{ 'Pickup and delivery' | t }}</span>
        <p>{{ 'Free delivery within 5 km, careful handling, and neatly packed clothes returned to your home.' | t }}</p>
      </article>
    </section>
    <section class="section-grid home-value-grid">
      <article>
        <span class="value-index">01</span>
        <h2>{{ 'Care that feels personal' | t }}</h2>
        <p>{{ 'Every order is tagged, inspected, cleaned by service type, finished, packed, and updated through live status stages.' | t }}</p>
        <div class="value-points">
          <span>{{ 'Order tagging' | t }}</span>
          <span>{{ 'Fabric-aware cleaning' | t }}</span>
          <span>{{ 'Neat packing' | t }}</span>
        </div>
      </article>
      <article>
        <span class="value-index">02</span>
        <h2>{{ 'Built for busy homes' | t }}</h2>
        <p>{{ 'Schedule a pickup, share notes, and let the team manage wash, iron, dry cleaning, and delivery from one place.' | t }}</p>
        <div class="value-points">
          <span>{{ 'Pickup scheduling' | t }}</span>
          <span>{{ 'Itemized pricing' | t }}</span>
          <span>{{ 'Live tracking' | t }}</span>
        </div>
      </article>
    </section>
    <section class="home-premium-band">
      <div class="home-premium-copy">
        <span class="eyebrow">{{ 'Premium laundry experience' | t }}</span>
        <h2>{{ 'Clean clothes, clear updates, zero hassle.' | t }}</h2>
        <p>{{ 'From everyday wash care to steam ironing and delicate dry cleaning, every service is organized around comfort, hygiene, and dependable delivery.' | t }}</p>
      </div>
      <div class="home-premium-steps">
        <article><span>01</span><strong>{{ 'Book' | t }}</strong><p>{{ 'Choose service, date, time, and item details.' | t }}</p></article>
        <article><span>02</span><strong>{{ 'Process' | t }}</strong><p>{{ 'We sort garments and clean by service type.' | t }}</p></article>
        <article><span>03</span><strong>{{ 'Deliver' | t }}</strong><p>{{ 'Finished clothes return fresh, packed, and ready.' | t }}</p></article>
      </div>
    </section>
  `,
})
export class HomeComponent {}
