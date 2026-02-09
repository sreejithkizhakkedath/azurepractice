import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { UserService } from '../services/user.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export class CustomValidators {
  static passwordMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (!control || !matchingControl) {
        return null;
      }

      if (matchingControl.errors && !matchingControl.errors['passwordMismatch']) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }

  static emailExists(userService: UserService): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return of(null);
      }

      return userService.checkEmailExists(control.value)
        .pipe(
          map(result => result.exists ? { emailExists: true } : null),
          catchError(() => of(null))
        );
    };
  }

  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

      if (!passwordValid) {
        return { strongPassword: true };
      }

      return null;
    };
  }
}