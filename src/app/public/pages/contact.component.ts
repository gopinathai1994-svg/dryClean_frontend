import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: false,
  template: `
    <section class="page-head">
      <span class="eyebrow">{{ 'Visit or call' | t }}</span>
      <h1>{{ 'Contact' | t }}</h1>
      <p>
        {{ 'Reach TL & Dry Cleaners for pickup support, garment care questions, and delivery updates.' | t }}
      </p>
    </section>
    <section class="contact-grid">
      <article>
        <h2>{{ 'Shop Details' | t }}</h2>
        <p><strong>{{ 'Phone:' | t }}</strong> +91 99999 99999</p>
        <p><strong>{{ 'Email:' | t }}</strong> care@tl.com</p>
        <p><strong>{{ 'Hours:' | t }}</strong> {{ '8:00 AM - 9:00 PM' | t }}</p>
        <p><strong>{{ 'Address:' | t }}</strong> {{ 'Main Road, Near Market Circle, India' | t }}</p>
      </article>
      <iframe
        src="https://www.google.com/maps/embed?pb=!4v1782312182580!6m8!1m7!1sxXTDVAXQbJkVZ8nRXjv8iQ!2m2!1d11.0298976137409!2d76.94475344101859!3f294.7939609063023!4f-2.0048907102758875!5f0.7820865974627469"
        width="600"
        height="450"
        style="border:0;"
        allowfullscreen=""
        loading="lazy"
        [title]="'Google Maps location' | t"
        referrerpolicy="strict-origin-when-cross-origin"
      ></iframe>
    </section>
  `,
})
export class ContactComponent {}
