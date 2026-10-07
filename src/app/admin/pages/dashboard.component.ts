import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { ApiService } from '../../core/services/api.service';
import { I18nService } from '../../core/i18n/i18n.service';

type DashboardSummary = {
  totalOrdersCount?: number;
  todayOrdersCount?: number;
  pendingOrdersCount?: number;
  deliveredOrdersCount?: number;
  todayIncome?: number;
  monthlyIncome?: number;
};

@Component({
  selector: 'app-dashboard',
  standalone: false,
  template: `
    <section class="admin-page-head">
      <div>
        <span class="eyebrow">{{ 'Business overview' | t }}</span>
        <h1>{{ 'Dashboard' | t }}</h1>
        <p>{{ "Track today's workload, pending garments, delivered orders, and income at a glance." | t }}</p>
      </div>
      <button type="button" class="btn primary" (click)="load()">{{ 'Refresh' | t }}</button>
    </section>

    <section class="dashboard-hero-panel">
      <div>
        <span>{{ 'Monthly income' | t }}</span>
        <strong>INR {{ summary.monthlyIncome || 0 }}</strong>
        <p>{{ 'Delivered orders contribute to income totals. Keep statuses updated for accurate reporting.' | t }}</p>
      </div>
      <img src="/assets/services/delivery.png" [alt]="'Packed laundry delivery dashboard preview' | t" />
    </section>

    <section class="metric-grid dashboard-metrics">
      <article><span>{{ 'Today Orders' | t }}</span><strong>{{ summary.todayOrdersCount || 0 }}</strong><small>{{ 'New requests today' | t }}</small></article>
      <article><span>{{ 'Pending Orders' | t }}</span><strong>{{ summary.pendingOrdersCount || 0 }}</strong><small>{{ 'Needs processing' | t }}</small></article>
      <article><span>{{ 'Delivered Orders' | t }}</span><strong>{{ summary.deliveredOrdersCount || 0 }}</strong><small>{{ 'Completed service' | t }}</small></article>
      <article><span>{{ 'Today Income' | t }}</span><strong>INR {{ summary.todayIncome || 0 }}</strong><small>{{ 'Delivered today' | t }}</small></article>
      <article><span>{{ 'Monthly Income' | t }}</span><strong>INR {{ summary.monthlyIncome || 0 }}</strong><small>{{ 'This month' | t }}</small></article>
    </section>

    <section class="dashboard-chart-panel">
      <div>
        <span class="eyebrow">{{ 'Order analytics' | t }}</span>
        <h2>{{ 'Orders by status' | t }}</h2>
        <p>{{ 'Compare total, pending, and delivered order counts in one view.' | t }}</p>
      </div>
      <div class="dashboard-chart-canvas">
        <canvas #ordersChart></canvas>
      </div>
    </section>

    <section class="dashboard-workflow">
      <article *ngFor="let step of workflow; let index = index">
        <span>{{ index + 1 }}</span>
        <strong>{{ step.title | t }}</strong>
        <p>{{ step.text | t }}</p>
      </article>
    </section>
  `,
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('ordersChart') private readonly ordersChartRef?: ElementRef<HTMLCanvasElement>;
  summary: DashboardSummary = {};
  workflow = [
    { title: 'Received', text: 'Confirm pickup and customer details.' },
    { title: 'Washing', text: 'Move garments into the right care process.' },
    { title: 'Ironing', text: 'Finish and inspect each order.' },
    { title: 'Delivered', text: 'Close the order and update income.' },
  ];
  private ordersChart?: Chart<'bar'>;
  private chartReady = false;

  constructor(
    private readonly api: ApiService,
    private readonly i18n: I18nService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    this.chartReady = true;
    this.renderOrdersChart();
  }

  ngOnDestroy(): void {
    this.ordersChart?.destroy();
  }

  load(): void {
    this.api.dashboard().subscribe((summary) => {
      this.summary = summary;
      this.renderOrdersChart();
    });
  }

  private renderOrdersChart(): void {
    const canvas = this.ordersChartRef?.nativeElement;
    if (!this.chartReady || !canvas) {
      return;
    }

    const data = [
      this.summary.totalOrdersCount || 0,
      this.summary.pendingOrdersCount || 0,
      this.summary.deliveredOrdersCount || 0,
    ];

    if (this.ordersChart) {
      this.ordersChart.data.labels = this.chartLabels();
      this.ordersChart.data.datasets[0].data = data;
      this.ordersChart.update();
      return;
    }

    this.ordersChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.chartLabels(),
        datasets: [
          {
            label: this.t('Orders'),
            data,
            backgroundColor: ['rgba(15, 110, 168, 0.82)', 'rgba(243, 165, 28, 0.82)', 'rgba(15, 159, 110, 0.82)'],
            borderColor: ['#0f6ea8', '#f3a51c', '#0f9f6e'],
            borderRadius: 8,
            borderWidth: 1,
            hoverBackgroundColor: ['#0f6ea8', '#f3a51c', '#0f9f6e'],
            barThickness: 58,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 900,
          easing: 'easeOutQuart',
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: '#13202e',
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#344054',
              font: { weight: 'bold' },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              color: '#667085',
            },
            grid: {
              color: 'rgba(220, 229, 236, 0.78)',
            },
          },
        },
      },
    });
  }

  private t(value: string): string {
    return this.i18n.translate(value);
  }

  private chartLabels(): string[] {
    return [this.t('Total Orders'), this.t('Pending Orders'), this.t('Delivered Orders')];
  }
}
