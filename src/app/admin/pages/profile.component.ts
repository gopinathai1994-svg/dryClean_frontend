import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService, PdfKnowledgeQueryResponse, PdfKnowledgeUploadResponse } from '../../core/services/api.service';
import { AdminProfile, AuthService } from '../../core/services/auth.service';

type ProfilePanel = 'email' | 'password';

@Component({
  selector: 'app-profile',
  standalone: false,
  template: `
    <section class="profile-hero">
      <div>
        <span class="eyebrow">{{ 'Admin profile' | t }}</span>
        <h1>{{ 'Profile Settings' | t }}</h1>
        <p>{{ 'Update the login email and password used for the admin dashboard.' | t }}</p>
      </div>
      <div class="profile-identity-card">
        <span class="profile-avatar">TL</span>
        <div>
          <small>{{ 'Signed in as' | t }}</small>
          <strong>{{ admin?.email || cachedEmail }}</strong>
        </div>
      </div>
    </section>

    <section class="profile-status" *ngIf="message || error" [class.error]="!!error">
      <span class="material-symbols-rounded">{{ error ? 'error' : 'check_circle' }}</span>
      <strong>{{ error || message }}</strong>
    </section>

    <section class="profile-grid">
      <article class="profile-panel" [class.editing]="editing === 'email'">
        <div class="profile-panel-head">
          <span class="profile-icon material-symbols-rounded">alternate_email</span>
          <div>
            <small>{{ 'Login email' | t }}</small>
            <h2>{{ 'Email' | t }}</h2>
          </div>
          <button type="button" class="profile-edit-button" (click)="edit('email')" *ngIf="editing !== 'email'">
            <span class="material-symbols-rounded">edit</span>
            {{ 'Edit' | t }}
          </button>
        </div>

        <div class="profile-read-view" *ngIf="editing !== 'email'">
          <strong>{{ admin?.email || cachedEmail }}</strong>
          <p>{{ 'This address is used for secure admin login.' | t }}</p>
        </div>

        <form class="profile-edit-form" [formGroup]="emailForm" (ngSubmit)="saveEmail()" *ngIf="editing === 'email'">
          <label [class.invalid]="invalidEmail">
            <span>{{ 'Email address' | t }}</span>
            <input type="email" formControlName="email" autocomplete="email" />
            <small *ngIf="invalidEmail">{{ 'Enter a valid email address.' | t }}</small>
          </label>
          <div class="profile-actions">
            <button type="submit" class="btn" [disabled]="emailForm.invalid || savingEmail">
              <span class="button-loader" *ngIf="savingEmail"></span>
              {{ (savingEmail ? 'Updating...' : 'Update Email') | t }}
            </button>
            <button type="button" class="mini-action ghost" (click)="cancel()" [disabled]="savingEmail">{{ 'Cancel' | t }}</button>
          </div>
        </form>
      </article>

      <article class="profile-panel" [class.editing]="editing === 'password'">
        <div class="profile-panel-head">
          <span class="profile-icon material-symbols-rounded">lock_reset</span>
          <div>
            <small>{{ 'Private credential' | t }}</small>
            <h2>{{ 'Password' | t }}</h2>
          </div>
          <button type="button" class="profile-edit-button" (click)="edit('password')" *ngIf="editing !== 'password'">
            <span class="material-symbols-rounded">edit</span>
            {{ 'Edit' | t }}
          </button>
        </div>

        <div class="profile-read-view" *ngIf="editing !== 'password'">
          <strong>**********</strong>
          <p>{{ 'Keep your admin password fresh and private.' | t }}</p>
        </div>

        <form class="profile-edit-form" [formGroup]="passwordForm" (ngSubmit)="savePassword()" *ngIf="editing === 'password'">
          <label [class.invalid]="invalidPassword('currentPassword')">
            <span>{{ 'Current password' | t }}</span>
            <input type="password" formControlName="currentPassword" autocomplete="current-password" />
            <small *ngIf="invalidPassword('currentPassword')">{{ 'Current password is required.' | t }}</small>
          </label>

          <label [class.invalid]="invalidPassword('password')">
            <span>{{ 'New password' | t }}</span>
            <input type="password" formControlName="password" autocomplete="new-password" />
            <small *ngIf="invalidPassword('password')">{{ 'Password must be at least 6 characters.' | t }}</small>
          </label>

          <label [class.invalid]="invalidPassword('confirmPassword')">
            <span>{{ 'Confirm password' | t }}</span>
            <input type="password" formControlName="confirmPassword" autocomplete="new-password" />
            <small *ngIf="invalidPassword('confirmPassword')">{{ confirmPasswordError | t }}</small>
          </label>

          <div class="profile-actions">
            <button type="submit" class="btn" [disabled]="passwordForm.invalid || !passwordsMatch || savingPassword">
              <span class="button-loader" *ngIf="savingPassword"></span>
              {{ (savingPassword ? 'Updating...' : 'Update Password') | t }}
            </button>
            <button type="button" class="mini-action ghost" (click)="cancel()" [disabled]="savingPassword">{{ 'Cancel' | t }}</button>
          </div>
        </form>
      </article>
    </section>

    <section class="profile-knowledge-panel">
      <div class="profile-panel-head">
        <span class="profile-icon material-symbols-rounded">picture_as_pdf</span>
        <div>
          <small>{{ 'PDF knowledge' | t }}</small>
          <h2>{{ 'Profile PDF Assistant' | t }}</h2>
        </div>
      </div>

      <section class="profile-status" *ngIf="knowledgeMessage || knowledgeError" [class.error]="!!knowledgeError">
        <span class="material-symbols-rounded">{{ knowledgeError ? 'error' : 'check_circle' }}</span>
        <strong>{{ knowledgeError || knowledgeMessage }}</strong>
      </section>

      <div class="profile-pdf-upload">
        <label class="profile-file-drop" [class.has-file]="!!selectedPdfFile">
          <input type="file" accept="application/pdf" (change)="onPdfSelected($event)" />
          <span class="material-symbols-rounded">upload_file</span>
          <strong>{{ selectedPdfFile?.name || ('Choose PDF' | t) }}</strong>
          <small>{{ selectedPdfFile ? formatFileSize(selectedPdfFile.size) : ('PDF only, max 10MB' | t) }}</small>
        </label>

        <button type="button" class="btn primary" (click)="uploadPdf()" [disabled]="!selectedPdfFile || uploadingPdf">
          <span class="button-loader" *ngIf="uploadingPdf"></span>
          {{ (uploadingPdf ? 'Indexing PDF...' : 'Upload PDF') | t }}
        </button>
      </div>

      <div class="pdf-index-summary" *ngIf="pdfUploadSummary">
        <strong>{{ pdfUploadSummary.fileName }}</strong>
        <span>{{ pdfUploadSummary.chunksStored }} {{ 'chunks indexed' | t }}</span>
        <span>{{ pdfUploadSummary.charactersExtracted }} {{ 'characters extracted' | t }}</span>
      </div>

      <form class="profile-pdf-query" [formGroup]="pdfQuestionForm" (ngSubmit)="askPdf()">
        <label>
          <span>{{ 'Ask from uploaded PDF' | t }}</span>
          <textarea
            formControlName="question"
            rows="3"
            [placeholder]="'Example: What is the cancellation rule in this PDF?' | t"
          ></textarea>
        </label>
        <button type="submit" class="btn" [disabled]="pdfQuestionForm.invalid || askingPdf">
          <span class="button-loader" *ngIf="askingPdf"></span>
          {{ (askingPdf ? 'Searching...' : 'Ask PDF') | t }}
        </button>
      </form>

      <article class="pdf-answer-card" *ngIf="pdfAnswer">
        <small>{{ 'Answer' | t }}</small>
        <p>{{ pdfAnswer }}</p>
        <div class="pdf-source-list" *ngIf="pdfSources.length">
          <strong>{{ 'Sources' | t }}</strong>
          <span *ngFor="let source of pdfSources">
            {{ source.fileName }} - {{ 'chunk' | t }} {{ source.chunkIndex + 1 }}
          </span>
        </div>
      </article>
    </section>
  `,
})
export class ProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);

  admin: AdminProfile | null = null;
  editing: ProfilePanel | null = null;
  savingEmail = false;
  savingPassword = false;
  uploadingPdf = false;
  askingPdf = false;
  message = '';
  error = '';
  knowledgeMessage = '';
  knowledgeError = '';
  selectedPdfFile: File | null = null;
  pdfUploadSummary: PdfKnowledgeUploadResponse | null = null;
  pdfAnswer = '';
  pdfSources: PdfKnowledgeQueryResponse['sources'] = [];

  readonly emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  readonly passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  readonly pdfQuestionForm = this.fb.group({
    question: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  ngOnInit(): void {
    this.admin = this.auth.currentAdmin();
    this.emailForm.patchValue({ email: this.cachedEmail });

    this.auth.profile().subscribe({
      next: (admin) => {
        this.admin = admin;
        this.emailForm.patchValue({ email: admin.email });
      },
      error: () => {
        this.error = 'Unable to load profile right now.';
      },
    });
  }

  get cachedEmail(): string {
    return this.auth.currentAdmin()?.email || 'admin@tl.com';
  }

  get invalidEmail(): boolean {
    const control = this.emailForm.controls.email;
    return control.invalid && (control.dirty || control.touched);
  }

  get passwordsMatch(): boolean {
    return this.passwordForm.controls.password.value === this.passwordForm.controls.confirmPassword.value;
  }

  get confirmPasswordError(): string {
    return this.passwordForm.controls.confirmPassword.errors?.['required'] ? 'Confirm password is required.' : 'Passwords do not match.';
  }

  edit(panel: ProfilePanel): void {
    this.clearFeedback();
    this.editing = panel;
    if (panel === 'email') {
      this.emailForm.reset({ email: this.admin?.email || this.cachedEmail });
    } else {
      this.passwordForm.reset({ currentPassword: '', password: '', confirmPassword: '' });
    }
  }

  cancel(): void {
    this.editing = null;
    this.clearFeedback();
  }

  saveEmail(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    const email = this.emailForm.controls.email.value || '';
    this.savingEmail = true;
    this.clearFeedback();

    this.auth.updateEmail(email).pipe(finalize(() => (this.savingEmail = false))).subscribe({
      next: (response) => {
        this.admin = response.admin;
        this.emailForm.patchValue({ email: response.admin.email });
        this.editing = null;
        this.message = 'Email updated successfully.';
      },
      error: () => {
        this.error = 'Unable to update email. Please try again.';
      },
    });
  }

  savePassword(): void {
    if (this.passwordForm.invalid || !this.passwordsMatch) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const value = this.passwordForm.getRawValue();
    this.savingPassword = true;
    this.clearFeedback();

    this.auth
      .updatePassword(value.currentPassword || '', value.password || '')
      .pipe(finalize(() => (this.savingPassword = false)))
      .subscribe({
        next: (admin) => {
          this.admin = admin;
          this.passwordForm.reset({ currentPassword: '', password: '', confirmPassword: '' });
          this.editing = null;
          this.message = 'Password updated successfully.';
        },
        error: () => {
          this.error = 'Unable to update password. Please check the current password.';
        },
      });
  }

  invalidPassword(controlName: 'currentPassword' | 'password' | 'confirmPassword'): boolean {
    const control = this.passwordForm.controls[controlName];
    const mismatch = controlName === 'confirmPassword' && control.touched && !this.passwordsMatch;
    return (control.invalid && (control.dirty || control.touched)) || mismatch;
  }

  onPdfSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.clearKnowledgeFeedback();
    this.pdfUploadSummary = null;

    if (!file) {
      this.selectedPdfFile = null;
      return;
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      this.selectedPdfFile = null;
      input.value = '';
      this.knowledgeError = 'Please choose a PDF file.';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.selectedPdfFile = null;
      input.value = '';
      this.knowledgeError = 'PDF file must be 10MB or smaller.';
      return;
    }

    this.selectedPdfFile = file;
  }

  uploadPdf(): void {
    if (!this.selectedPdfFile) {
      this.knowledgeError = 'Please choose a PDF file.';
      return;
    }

    this.uploadingPdf = true;
    this.clearKnowledgeFeedback();
    this.api
      .uploadKnowledgePdf(this.selectedPdfFile)
      .pipe(finalize(() => (this.uploadingPdf = false)))
      .subscribe({
        next: (summary) => {
          this.pdfUploadSummary = summary;
          this.knowledgeMessage = 'PDF uploaded and indexed successfully.';
        },
        error: () => {
          this.knowledgeError = 'Unable to upload or index this PDF.';
        },
      });
  }

  askPdf(): void {
    if (this.pdfQuestionForm.invalid) {
      this.pdfQuestionForm.markAllAsTouched();
      return;
    }

    const question = this.pdfQuestionForm.controls.question.value || '';
    this.askingPdf = true;
    this.clearKnowledgeFeedback();
    this.pdfAnswer = '';
    this.pdfSources = [];

    this.api
      .askKnowledgePdf(question)
      .pipe(finalize(() => (this.askingPdf = false)))
      .subscribe({
        next: (response) => {
          this.pdfAnswer = response.answer;
          this.pdfSources = response.sources || [];
        },
        error: () => {
          this.knowledgeError = 'Unable to answer from uploaded PDF right now.';
        },
      });
  }

  formatFileSize(size: number): string {
    if (size < 1024 * 1024) {
      return `${Math.max(1, Math.round(size / 1024))} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  private clearFeedback(): void {
    this.message = '';
    this.error = '';
  }

  private clearKnowledgeFeedback(): void {
    this.knowledgeMessage = '';
    this.knowledgeError = '';
  }
}
