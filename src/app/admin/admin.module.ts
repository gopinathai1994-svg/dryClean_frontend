import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { AdminLayoutComponent } from './admin-layout.component';
import { LoginComponent } from './pages/login.component';
import { DashboardComponent } from './pages/dashboard.component';
import { OrdersComponent } from './pages/orders.component';
import { CustomersComponent } from './pages/customers.component';
import { PricingManagementComponent } from './pages/pricing-management.component';
import { ProfileComponent } from './pages/profile.component';
import { I18nModule } from '../core/i18n/i18n.module';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'pricing', component: PricingManagementComponent },
      { path: 'profile', component: ProfileComponent },
    ],
  },
];

@NgModule({
  declarations: [
    AdminLayoutComponent,
    LoginComponent,
    DashboardComponent,
    OrdersComponent,
    CustomersComponent,
    PricingManagementComponent,
    ProfileComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, I18nModule, RouterModule.forChild(routes)],
})
export class AdminModule {}
