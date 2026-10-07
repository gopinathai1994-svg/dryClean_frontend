import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Order, OrderStatus } from '../../core/models/order.model';

type OrderSort = 'newest' | 'oldest' | 'amountHigh' | 'amountLow' | 'customerAsc';

@Component({
  selector: 'app-admin-orders',
  standalone: false,
  template: `
    <section class="admin-page-head">
      <div>
        <span class="eyebrow">{{ 'Operations control' | t }}</span>
        <h1>{{ 'Orders' | t }}</h1>
        <p>{{ 'Search, sort, paginate, and update customer laundry orders from one premium workspace.' | t }}</p>
      </div>
      <button type="button" class="btn primary" (click)="load()">{{ 'Refresh Orders' | t }}</button>
    </section>

    <section class="admin-order-metrics">
      <article><span>{{ 'Total orders' | t }}</span><strong>{{ orders.length }}</strong></article>
      <article><span>{{ 'Pending' | t }}</span><strong>{{ pendingCount }}</strong></article>
      <article><span>{{ 'Delivered' | t }}</span><strong>{{ deliveredCount }}</strong></article>
      <article><span>{{ 'Total value' | t }}</span><strong>INR {{ totalValue }}</strong></article>
    </section>

    <section class="admin-orders-toolbar">
      <label class="admin-search">
        <span>{{ 'Search orders' | t }}</span>
        <input [formControl]="searchControl" [placeholder]="'Search customer, mobile, service, address...' | t" />
      </label>

      <label>
        <span>{{ 'Status' | t }}</span>
        <select [formControl]="statusFilter">
          <option value="All">{{ 'All Status' | t }}</option>
          <option *ngFor="let status of statuses" [value]="status">{{ status | t }}</option>
        </select>
      </label>

      <label>
        <span>{{ 'Sort' | t }}</span>
        <select [formControl]="sortControl">
          <option value="newest">{{ 'Newest first' | t }}</option>
          <option value="oldest">{{ 'Oldest first' | t }}</option>
          <option value="amountHigh">{{ 'Amount high to low' | t }}</option>
          <option value="amountLow">{{ 'Amount low to high' | t }}</option>
          <option value="customerAsc">{{ 'Customer name' | t }}</option>
        </select>
      </label>

      <label>
        <span>{{ 'Rows' | t }}</span>
        <select [formControl]="pageSizeControl">
          <option *ngFor="let size of pageSizes" [value]="size">{{ size }}</option>
        </select>
      </label>
    </section>

    <div class="table-wrap admin-table orders-table">
      <table>
        <thead>
          <tr>
            <th>{{ 'Customer' | t }}</th>
            <th>{{ 'Mobile' | t }}</th>
            <th>{{ 'Service' | t }}</th>
            <th>{{ 'Pickup' | t }}</th>
            <th>{{ 'Status' | t }}</th>
            <th>{{ 'Total' | t }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="orders-click-row"
            *ngFor="let order of pagedOrders; trackBy: trackByOrder"
            tabindex="0"
            role="button"
            [attr.aria-label]="('View order details for' | t) + ' ' + order.customerName"
            (click)="openOrderDetails(order)"
            (keydown.enter)="openOrderDetails(order)"
            (keydown.space)="openOrderDetails(order); $event.preventDefault()"
          >
            <td>
              <strong>{{ order.customerName }}</strong>
              <small>{{ order.address }}</small>
            </td>
            <td>{{ order.mobile }}</td>
            <td><span class="service-badge">{{ order.serviceType | t }}</span></td>
            <td>{{ order.pickupDate | date }} {{ order.pickupTime }}</td>
            <td>
              <select
                class="status-select"
                [value]="order.status"
                (click)="$event.stopPropagation()"
                (keydown)="$event.stopPropagation()"
                (change)="setStatus(order, $any($event.target).value); $event.stopPropagation()"
              >
                <option *ngFor="let status of statuses" [value]="status" [selected]="status === order.status">
                  {{ status | t }}
                </option>
              </select>
            </td>
            <td>INR {{ order.totalAmount }}</td>
          </tr>
          <tr *ngIf="!pagedOrders.length">
            <td colspan="6" class="orders-empty">{{ 'No orders found for the selected filters.' | t }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <section class="orders-pagination">
      <span>{{ 'Showing' | t }} {{ rangeStart }}-{{ rangeEnd }} {{ 'of' | t }} {{ filteredOrders.length }} {{ 'orders' | t }}</span>
      <div>
        <button type="button" (click)="previousPage()" [disabled]="page === 1">{{ 'Previous' | t }}</button>
        <strong>{{ 'Page' | t }} {{ page }} / {{ totalPages }}</strong>
        <button type="button" (click)="nextPage()" [disabled]="page === totalPages">{{ 'Next' | t }}</button>
      </div>
    </section>

    <div class="order-detail-overlay" *ngIf="selectedOrder" role="dialog" aria-modal="true" [attr.aria-label]="'Order details' | t" (click)="closeOrderDetails()">
      <section class="order-detail-modal" (click)="$event.stopPropagation()">
        <button type="button" class="order-detail-close" [attr.aria-label]="'Close' | t" (click)="closeOrderDetails()">×</button>
        <div class="order-detail-head">
          <span class="service-badge">{{ selectedOrder.serviceType | t }}</span>
          <h2>{{ selectedOrder.customerName }}</h2>
          <p>{{ selectedOrder.pickupDate | date }} {{ selectedOrder.pickupTime }}</p>
        </div>
        <div class="order-detail-grid">
          <article>
            <span>{{ 'Customer Name' | t }}</span>
            <strong>{{ selectedOrder.customerName }}</strong>
          </article>
          <article>
            <span>{{ 'Mobile' | t }}</span>
            <strong>{{ selectedOrder.mobile }}</strong>
          </article>
          <article class="wide">
            <span>{{ 'Address' | t }}</span>
            <strong>{{ selectedOrder.address }}</strong>
          </article>
          <article>
            <span>{{ 'Number of clothes' | t }}</span>
            <strong>{{ selectedOrder.clothCount }}</strong>
          </article>
          <article>
            <span>{{ 'Total Amount' | t }}</span>
            <strong>INR {{ selectedOrder.totalAmount }}</strong>
          </article>
          <article>
            <span>{{ 'Status' | t }}</span>
            <strong>{{ selectedOrder.status | t }}</strong>
          </article>
          <article class="wide" *ngIf="selectedOrder.notes">
            <span>{{ 'Notes' | t }}</span>
            <strong>{{ selectedOrder.notes }}</strong>
          </article>
        </div>
      </section>
    </div>
  `,
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder?: Order;
  statuses: OrderStatus[] = ['RECEIVED', 'WASHING', 'IRONING', 'READY', 'DELIVERED', 'CANCELLED'];
  searchControl = new FormControl('', { nonNullable: true });
  statusFilter = new FormControl<OrderStatus | 'All'>('All', { nonNullable: true });
  sortControl = new FormControl<OrderSort>('newest', { nonNullable: true });
  pageSizeControl = new FormControl(10, { nonNullable: true });
  pageSizes = [10, 25, 50, 100];
  page = 1;

  constructor(
    private readonly api: ApiService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
    this.searchControl.valueChanges.subscribe(() => (this.page = 1));
    this.statusFilter.valueChanges.subscribe(() => (this.page = 1));
    this.sortControl.valueChanges.subscribe(() => (this.page = 1));
    this.pageSizeControl.valueChanges.subscribe(() => (this.page = 1));
  }

  load(resetPage = true): void {
    this.api.adminOrders().subscribe((orders) => {
      this.orders = orders;
      if (resetPage) {
        this.page = 1;
      }
      this.cdr.detectChanges();
    });
  }

  setStatus(order: Order, status: OrderStatus): void {
    this.api.updateOrder(order._id || '', { status }).subscribe((updated) => {
      this.orders = this.orders.map((item) => (item._id === updated._id ? updated : item));
      if (this.selectedOrder?._id === updated._id) {
        this.selectedOrder = updated;
      }
      this.cdr.detectChanges();
      this.load(false);
    });
  }

  openOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = undefined;
  }

  get pendingCount(): number {
    return this.orders.filter((order) => !['DELIVERED', 'CANCELLED'].includes(order.status)).length;
  }

  get deliveredCount(): number {
    return this.orders.filter((order) => order.status === 'DELIVERED').length;
  }

  get totalValue(): number {
    return this.orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  }

  get filteredOrders(): Order[] {
    const query = this.searchControl.value.trim().toLowerCase();
    const status = this.statusFilter.value;
    const filtered = this.orders.filter((order) => {
      const values = [order.customerName, order.mobile, order.address, order.serviceType, order.status, order.notes || ''];
      const matchesSearch = values.some((value) => value.toLowerCase().includes(query));
      const matchesStatus = status === 'All' || order.status === status;
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      switch (this.sortControl.value) {
        case 'oldest':
          return this.dateValue(a) - this.dateValue(b);
        case 'amountHigh':
          return Number(b.totalAmount || 0) - Number(a.totalAmount || 0);
        case 'amountLow':
          return Number(a.totalAmount || 0) - Number(b.totalAmount || 0);
        case 'customerAsc':
          return a.customerName.localeCompare(b.customerName);
        default:
          return this.dateValue(b) - this.dateValue(a);
      }
    });
  }

  get pagedOrders(): Order[] {
    const start = (this.page - 1) * this.pageSizeControl.value;
    return this.filteredOrders.slice(start, start + this.pageSizeControl.value);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredOrders.length / this.pageSizeControl.value));
  }

  get rangeStart(): number {
    return this.filteredOrders.length ? (this.page - 1) * this.pageSizeControl.value + 1 : 0;
  }

  get rangeEnd(): number {
    return Math.min(this.page * this.pageSizeControl.value, this.filteredOrders.length);
  }

  previousPage(): void {
    this.page = Math.max(1, this.page - 1);
  }

  nextPage(): void {
    this.page = Math.min(this.totalPages, this.page + 1);
  }

  trackByOrder(_index: number, order: Order): string {
    return order._id || `${order.mobile}-${order.pickupDate}-${order.pickupTime}`;
  }

  private dateValue(order: Order): number {
    return new Date(order.createdAt || order.pickupDate || '').getTime() || 0;
  }
}
