import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotWidgetComponent } from './chatbot-widget.component';

@NgModule({
  declarations: [ChatbotWidgetComponent],
  imports: [CommonModule, FormsModule],
  exports: [ChatbotWidgetComponent],
})
export class ChatbotModule {}
