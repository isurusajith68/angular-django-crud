import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-dialog.html',
  styleUrl: './alert-dialog.css',
})
export class AlertDialog {
  @Input() title = 'Alert';
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';

  @Input() confirmText = 'OK';
  @Input() cancelText = 'Cancel';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
