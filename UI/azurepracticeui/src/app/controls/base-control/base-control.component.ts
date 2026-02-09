import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlConfig } from './control-config.interface';

@Component({
  selector: 'app-base-control',
  templateUrl: './base-control.component.html',
  styleUrls: ['./base-control.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class BaseControlComponent {
  @Input() config!: ControlConfig;
  @Input() control: any;
  @Input() submitted: boolean = false;
  @Output() valueChange = new EventEmitter<any>();

  get showError(): boolean {
    return this.submitted && this.control && this.control.invalid;
  }

  get errorMessage(): string {
    if (!this.control || !this.control.errors) {
      return '';
    }

    const errors = this.control.errors;
    const errorKey = Object.keys(errors)[0];
    
    if (this.config.errorMessages && this.config.errorMessages[errorKey]) {
      return this.config.errorMessages[errorKey];
    }

    switch (errorKey) {
      case 'required':
        return `${this.config.label} is required`;
      case 'email':
        return 'Invalid email format';
      case 'minlength':
        return `${this.config.label} must be at least ${errors['minlength'].requiredLength} characters`;
      case 'maxlength':
        return `${this.config.label} must not exceed ${errors['maxlength'].requiredLength} characters`;
      case 'pattern':
        return `${this.config.label} format is invalid`;
      default:
        return `${this.config.label} is invalid`;
    }
  }

  onValueChange(value: any) {
    this.valueChange.emit(value);
  }
}