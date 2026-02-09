import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseControlComponent } from './base-control.component';
import { ControlConfig } from './control-config.interface';

describe('BaseControlComponent', () => {
  let component: BaseControlComponent;
  let fixture: ComponentFixture<BaseControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseControlComponent, ReactiveFormsModule, CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(BaseControlComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display label with config label text', () => {
    const config: ControlConfig = {
      name: 'testField',
      label: 'Test Field',
      type: 'text'
    };
    component.config = config;
    component.control = new FormControl('');
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain('Test Field');
  });

  it('should display required asterisk when field is required', () => {
    const config: ControlConfig = {
      name: 'testField',
      label: 'Test Field',
      type: 'text',
      required: true
    };
    component.config = config;
    component.control = new FormControl('');
    fixture.detectChanges();

    const asterisk = fixture.nativeElement.querySelector('.required-asterisk');
    expect(asterisk).toBeTruthy();
  });

  it('should not display required asterisk when field is not required', () => {
    const config: ControlConfig = {
      name: 'testField',
      label: 'Test Field',
      type: 'text',
      required: false
    };
    component.config = config;
    component.control = new FormControl('');
    fixture.detectChanges();

    const asterisk = fixture.nativeElement.querySelector('.required-asterisk');
    expect(asterisk).toBeFalsy();
  });

  it('should show error message when control is invalid and submitted', () => {
    const config: ControlConfig = {
      name: 'email',
      label: 'Email',
      type: 'email',
      errorMessages: {
        required: 'Email is required'
      }
    };
    const control = new FormControl('', { validators: [], updateOn: 'blur' });
    control.markAsTouched();
    control.markAsDirty();

    component.config = config;
    component.control = control;
    component.submitted = true;
    fixture.detectChanges();

    const errorMessage = fixture.nativeElement.querySelector('.error-message');
    expect(errorMessage).toBeTruthy();
  });

  it('should not show error message when control is valid', () => {
    const config: ControlConfig = {
      name: 'testField',
      label: 'Test Field',
      type: 'text'
    };
    const control = new FormControl('valid value');

    component.config = config;
    component.control = control;
    component.submitted = true;
    fixture.detectChanges();

    const errorMessage = fixture.nativeElement.querySelector('.error-message');
    expect(errorMessage).toBeFalsy();
  });

  it('should emit valueChange event when input changes', () => {
    const config: ControlConfig = {
      name: 'testField',
      label: 'Test Field',
      type: 'text'
    };
    component.config = config;
    component.control = new FormControl('');
    
    component.onValueChange('new value');
    
    expect(component.valueChange.emit).toHaveBeenCalledWith('new value');
  });

  it('should display custom error message from config', () => {
    const config: ControlConfig = {
      name: 'email',
      label: 'Email',
      type: 'email',
      errorMessages: {
        email: 'Please enter a valid email address'
      }
    };
    const control = new FormControl('invalid-email', { validators: [], updateOn: 'blur' });
    control.setErrors({ email: true });

    component.config = config;
    component.control = control;
    component.submitted = true;

    expect(component.errorMessage).toBe('Please enter a valid email address');
  });

  it('should display default error message when custom message is not provided', () => {
    const config: ControlConfig = {
      name: 'testField',
      label: 'Test Field',
      type: 'text'
    };
    const control = new FormControl('', { validators: [], updateOn: 'blur' });
    control.setErrors({ required: true });

    component.config = config;
    component.control = control;

    expect(component.errorMessage).toBe('Test Field is required');
  });

  it('should apply is-invalid class when control is invalid and submitted', () => {
    const config: ControlConfig = {
      name: 'testField',
      label: 'Test Field',
      type: 'text'
    };
    const control = new FormControl('', { validators: [], updateOn: 'blur' });
    control.setErrors({ required: true });

    component.config = config;
    component.control = control;
    component.submitted = true;
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('.form-control');
    expect(input.classList.contains('is-invalid')).toBeTruthy();
  });
});