import { Injectable } from '@angular/core';
import type { jsPDF } from 'jspdf';
import type { RowInput } from 'jspdf-autotable';
import { PricingItem } from '../models/catalog.model';
import { I18nService } from '../i18n/i18n.service';

interface PricingPdfOptions {
  serviceOrder: string[];
}

@Injectable({ providedIn: 'root' })
export class PricingPdfService {
  constructor(private readonly i18n: I18nService) {}

  async downloadPricingList(items: PricingItem[], options: PricingPdfOptions): Promise<void> {
    const [{ jsPDF }, autoTableModule] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
    const autoTable = autoTableModule.default;
    const sortedItems = this.sortPricing(items, options.serviceOrder);
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const generatedAt = new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date());

    doc.setProperties({
      title: this.t('Complete Pricing List'),
      subject: this.t('Dry cleaning and laundry service pricing'),
      creator: 'Dry Clean Shop',
    });

    doc.setFillColor(12, 107, 82);
    doc.rect(0, 0, 210, 31, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(19);
    doc.text(this.t('Complete Pricing List'), 14, 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`${this.t('Generated')}: ${generatedAt}`, 14, 22);
    doc.text(`${this.t('Total items')}: ${sortedItems.length}`, 14, 27);

    autoTable(doc, {
      startY: 39,
      head: [[this.t('No.'), this.t('Item'), this.t('Service'), this.t('Price')]],
      body: this.toRows(sortedItems),
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: { top: 2.4, right: 2.5, bottom: 2.4, left: 2.5 },
        lineColor: [218, 226, 232],
        lineWidth: 0.18,
        textColor: [31, 41, 55],
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [12, 107, 82],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'left',
      },
      alternateRowStyles: {
        fillColor: [247, 250, 252],
      },
      columnStyles: {
        0: { cellWidth: 14, halign: 'right' },
        1: { cellWidth: 70 },
        2: { cellWidth: 58 },
        3: { cellWidth: 34, halign: 'right', fontStyle: 'bold' },
      },
      margin: { top: 39, right: 14, bottom: 18, left: 14 },
      didDrawPage: () => this.drawFooter(doc),
    });

    doc.save(`pricing-list-${this.fileDate()}.pdf`);
  }

  private toRows(items: PricingItem[]): RowInput[] {
    return items.map((item, index) => [
      String(index + 1),
      this.t(item.item),
      this.t(item.serviceType),
      `INR ${this.formatPrice(item.price)}`,
    ]);
  }

  private sortPricing(items: PricingItem[], serviceOrder: string[]): PricingItem[] {
    const serviceRank = new Map(serviceOrder.map((service, index) => [service, index]));

    return [...items]
      .filter((item) => item.active !== false)
      .sort((a, b) => {
        const serviceDiff = (serviceRank.get(a.serviceType) ?? 999) - (serviceRank.get(b.serviceType) ?? 999);
        return serviceDiff || a.serviceType.localeCompare(b.serviceType) || a.item.localeCompare(b.item);
      });
  }

  private drawFooter(doc: jsPDF): void {
    const pageSize = doc.internal.pageSize;
    const pageWidth = pageSize.getWidth();
    const pageHeight = pageSize.getHeight();
    const pageNumber = doc.getNumberOfPages();

    doc.setDrawColor(218, 226, 232);
    doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);
    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(this.t('Prices are subject to confirmation at pickup.'), 14, pageHeight - 7);
    doc.text(`${this.t('Page')} ${pageNumber}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
  }

  private formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(price);
  }

  private fileDate(): string {
    return new Intl.DateTimeFormat('en-CA').format(new Date());
  }

  private t(value: string): string {
    return this.i18n.translate(value);
  }
}
