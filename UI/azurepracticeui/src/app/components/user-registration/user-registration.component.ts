import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ControlConfig } from '../../controls/base-control/control-config.interface';
import { UserService, RegistrationRequest } from '../../services/user.service';
import { CustomValidators } from '../../validators/custom.validators';
import { BaseControlComponent } from '../../controls/base-control/base-control.component';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    BaseControlComponent
  ]
})
export class UserRegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  submitted = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  private destroy$ = new Subject<void>();

  controlConfigs: ControlConfig[] = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'Enter your first name',
      required: true,
      errorMessages: {
        required: 'First name is required',
        minlength: 'First name must be at least 2 characters'
      }
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Enter your last name',
      required: true,
      errorMessages: {
        required: 'Last name is required',
        minlength: 'Last name must be at least 2 characters'
      }
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
      required: true,
      errorMessages: {
        required: 'Email is required',
        email: 'Please enter a valid email address',
        emailExists: 'This email is already registered'
      }
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password (min 8 characters)',
      required: true,
      errorMessages: {
        required: 'Password is required',
        minlength: 'Password must be at least 8 characters',
        strongPassword: 'Password must contain uppercase, lowercase, and numbers'
      }
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      placeholder: 'Confirm your password',
      required: true,
      errorMessages: {
        required: 'Confirm password is required',
        passwordMismatch: 'Passwords do not match'
      }
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registrationForm = this.initializeForm();
  }

  ngOnInit(): void {
    this.setupFormValueChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): FormGroup {
    return this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: [
        '',
        [Validators.required, Validators.email],
        [CustomValidators.emailExists(this.userService)]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          CustomValidators.strongPassword()
        ]
      ],
      confirmPassword: ['', Validators.required]
    }, {
      validators: CustomValidators.passwordMatch('password', 'confirmPassword')
    });
  }

  private setupFormValueChanges(): void {
    this.registrationForm.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.clearMessages();
      });
  }

  get f() {
    return this.registrationForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.clearMessages();

    if (this.registrationForm.invalid) {
      return;
    }

    this.isLoading = true;

    const registrationData: RegistrationRequest = {
      firstName: this.registrationForm.get('firstName')?.value,
      lastName: this.registrationForm.get('lastName')?.value,
      email: this.registrationForm.get('email')?.value,
      password: this.registrationForm.get('password')?.value,
      confirmPassword: this.registrationForm.get('confirmPassword')?.value
    };

    this.userService.register(registrationData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.handleRegistrationSuccess(response);
        },
        error: (error) => {
          this.handleRegistrationError(error);
        }
      });
  }

  private handleRegistrationSuccess(response: any): void {
    this.isLoading = false;
    this.successMessage = response.message || 'Registration successful! Redirecting...';
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }

    this.registrationForm.reset();
    this.submitted = false;

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

  private handleRegistrationError(error: any): void {
    this.isLoading = false;
    this.errorMessage = error.message || 'Registration failed. Please try again.';
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  resetForm(): void {
    this.registrationForm.reset();
    this.submitted = false;
    this.clearMessages();
  }
}