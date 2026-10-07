import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CryptoService {
  encrypt(value: unknown): string {
    return CryptoJS.AES.encrypt(JSON.stringify(value), this.key).toString();
  }

  decrypt<T>(payload: string): T {
    const bytes = CryptoJS.AES.decrypt(payload, this.key);
    const plain = bytes.toString(CryptoJS.enc.Utf8);
    if (!plain) {
      throw new Error('Invalid encrypted response');
    }
    return JSON.parse(plain) as T;
  }

  private get key(): string {
    if (!environment.cryptoKey) {
      throw new Error('Crypto key must be supplied securely in production');
    }
    return environment.cryptoKey;
  }
}
