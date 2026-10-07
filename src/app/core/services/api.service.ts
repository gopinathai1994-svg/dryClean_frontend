import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PricingItem, ServiceItem } from '../models/catalog.model';
import { Customer } from '../models/customer.model';
import { Order } from '../models/order.model';

export interface ChatAskResponse {
  success: boolean;
  question: string;
  answer: string;
  speechText?: string;
  source?: 'uploaded-pdf' | 'pricing-database';
  sources?: Array<{
    fileName: string;
    chunkIndex: number;
    preview: string;
  }>;
}

export interface PdfKnowledgeUploadResponse {
  success: boolean;
  documentId: string;
  fileName: string;
  chunksStored: number;
  charactersExtracted: number;
}

export interface PdfKnowledgeQueryResponse {
  success: boolean;
  question: string;
  answer: string;
  sources: Array<{
    fileName: string;
    chunkIndex: number;
    preview: string;
  }>;
}

type ChatAskRawResponse = ChatAskResponse | Record<string, unknown> | string;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  services(): Observable<ServiceItem[]> {
    return this.http.get<ServiceItem[]>(`${this.apiUrl}/services`);
  }

  pricing(): Observable<PricingItem[]> {
    return this.http.get<PricingItem[]>(`${this.apiUrl}/pricing`, {
      params: { _: Date.now().toString() },
    });
  }

  createOrder(order: Partial<Order>): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders`, order);
  }

  trackOrders(mobile: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/track?mobile=${encodeURIComponent(mobile)}`, {
      headers: { 'X-Skip-Encrypted-Response': 'true' },
    });
  }

  dashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  adminOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }

  updateOrder(id: string, order: Partial<Order>): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/orders/${id}`, order);
  }

  customers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/customers`);
  }

  adminPricing(): Observable<PricingItem[]> {
    return this.http.get<PricingItem[]>(`${this.apiUrl}/pricing/admin`);
  }

  createPricing(item: Partial<PricingItem>): Observable<PricingItem> {
    return this.http.post<PricingItem>(`${this.apiUrl}/pricing`, item);
  }

  updatePricing(id: string, item: Partial<PricingItem>): Observable<PricingItem> {
    return this.http.patch<PricingItem>(`${this.apiUrl}/pricing/${id}`, item);
  }

  deletePricing(id: string): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`${this.apiUrl}/pricing/${id}`);
  }

  askChat(question: string): Observable<ChatAskResponse> {
    return this.http
      .post<ChatAskRawResponse>(`${this.apiUrl}/chat/ask`, { question })
      .pipe(map((response) => this.normalizeChatResponse(question, response)));
  }

  uploadKnowledgePdf(file: File): Observable<PdfKnowledgeUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<PdfKnowledgeUploadResponse>(`${this.apiUrl}/pdf-knowledge/upload`, formData);
  }

  askKnowledgePdf(question: string): Observable<PdfKnowledgeQueryResponse> {
    return this.http.post<PdfKnowledgeQueryResponse>(`${this.apiUrl}/pdf-knowledge/query`, { question });
  }

  private normalizeChatResponse(question: string, response: ChatAskRawResponse): ChatAskResponse {
    const answer = this.extractChatAnswer(response);

    if (!answer) {
      throw new Error('Chat response did not include an answer');
    }

    const responseObject = this.asRecord(response);
    const dataObject = this.asRecord(responseObject?.['data']);
    const responseQuestion = this.asText(responseObject?.['question']) || question;
    const speechText = this.asText(responseObject?.['speechText']) || this.asText(dataObject?.['speechText']);
    const source = this.asChatSource(responseObject?.['source']) || this.asChatSource(dataObject?.['source']);
    const sources = this.asChatSources(responseObject?.['sources'] || dataObject?.['sources']);

    return {
      success: responseObject?.['success'] !== false,
      question: responseQuestion,
      answer,
      speechText: speechText || answer,
      source,
      sources,
    };
  }

  private extractChatAnswer(response: ChatAskRawResponse): string {
    const directText = this.asText(response);
    if (directText) {
      return directText;
    }

    const responseObject = this.asRecord(response);
    const dataObject = this.asRecord(responseObject?.['data']);
    const candidates = [
      responseObject?.['answer'],
      responseObject?.['response'],
      responseObject?.['message'],
      responseObject?.['text'],
      responseObject?.['result'],
      dataObject?.['answer'],
      dataObject?.['response'],
      dataObject?.['message'],
      dataObject?.['text'],
      dataObject?.['result'],
    ];

    for (const candidate of candidates) {
      const answer = this.asText(candidate);
      if (answer) {
        return answer;
      }
    }

    return '';
  }

  private asRecord(value: unknown): Record<string, unknown> | undefined {
    return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : undefined;
  }

  private asText(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  private asChatSource(value: unknown): ChatAskResponse['source'] | undefined {
    return value === 'uploaded-pdf' || value === 'pricing-database' ? value : undefined;
  }

  private asChatSources(value: unknown): NonNullable<ChatAskResponse['sources']> {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => {
        const source = this.asRecord(item);
        if (!source) {
          return undefined;
        }

        return {
          fileName: this.asText(source['fileName']) || 'Uploaded PDF',
          chunkIndex: this.asFiniteNumber(source['chunkIndex']),
          preview: this.asText(source['preview']),
        };
      })
      .filter((source): source is NonNullable<ChatAskResponse['sources']>[number] => Boolean(source));
  }

  private asFiniteNumber(value: unknown): number {
    const numberValue = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(numberValue) ? numberValue : 0;
  }
}

