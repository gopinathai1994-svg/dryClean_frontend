import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { I18nService } from './i18n.service';

@Pipe({
  name: 't',
  standalone: false,
  pure: false,
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private readonly subscription: Subscription;

  constructor(
    private readonly i18n: I18nService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {
    this.subscription = this.i18n.language$.subscribe(() => this.changeDetector.markForCheck());
  }

  transform(value: string | null | undefined): string {
    return this.i18n.translate(value);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
