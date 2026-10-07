import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { CryptoService } from '../services/crypto.service';

@Injectable()
export class JwtCryptoInterceptor implements HttpInterceptor {
  constructor(
    private readonly auth: AuthService,
    private readonly crypto: CryptoService,
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let secureReq = req;
    const token = this.auth.getToken();
    const isApi = req.url.startsWith(environment.apiUrl);
    const isFileUpload = req.body instanceof FormData;
    const skipEncryptedResponse = req.headers.has('X-Skip-Encrypted-Response');
    const shouldEncryptBody = isApi && !!req.body && !isFileUpload && this.isSensitiveUrl(req.url);
    const shouldDecryptResponse = isApi && this.isSensitiveUrl(req.url) && !skipEncryptedResponse;

    if (skipEncryptedResponse) {
      secureReq = secureReq.clone({ headers: secureReq.headers.delete('X-Skip-Encrypted-Response') });
    }

    if (shouldEncryptBody) {
      secureReq = secureReq.clone({ body: { payload: this.crypto.encrypt(req.body) } });
    }

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (shouldDecryptResponse) {
      headers['X-Encrypted-Response'] = 'true';
    }
    if (Object.keys(headers).length) {
      secureReq = secureReq.clone({ setHeaders: headers });
    }

    return next.handle(secureReq).pipe(
      map((event) => {
        if (event instanceof HttpResponse && event.body && typeof event.body === 'object' && 'payload' in event.body) {
          return event.clone({ body: this.crypto.decrypt((event.body as { payload: string }).payload) });
        }
        return event;
      }),
    );
  }

  private isSensitiveUrl(url: string): boolean {
    return ['/auth/login', '/auth/profile', '/orders', '/customers', '/dashboard'].some((path) => url.includes(path));
  }
}
