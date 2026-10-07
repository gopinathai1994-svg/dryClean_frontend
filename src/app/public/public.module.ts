import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PublicLayoutComponent } from './public-layout.component';
import { HomeComponent } from './pages/home.component';
import { ServicesComponent } from './pages/services.component';
import { PricingComponent } from './pages/pricing.component';
import { BookingComponent } from './pages/booking.component';
import { TrackingComponent } from './pages/tracking.component';
import { ContactComponent } from './pages/contact.component';
import { I18nModule } from '../core/i18n/i18n.module';
import { ChatbotModule } from '../chatbot/chatbot.module';

const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'pricing', component: PricingComponent },
      { path: 'pickup-booking', component: BookingComponent },
      { path: 'order-tracking', component: TrackingComponent },
      { path: 'contact', component: ContactComponent },
    ],
  },
];

@NgModule({
  declarations: [
    PublicLayoutComponent,
    HomeComponent,
    ServicesComponent,
    PricingComponent,
    BookingComponent,
    TrackingComponent,
    ContactComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, I18nModule, ChatbotModule, RouterModule.forChild(routes)],
})
export class PublicModule {}
