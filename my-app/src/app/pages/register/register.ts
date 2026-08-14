import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Api } from '../../services/api';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  if (!confirmPassword) {
    return null;
  }
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  userRegisterForm: FormGroup;

  api = inject(Api);

  toastr = inject(ToastrService);

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.userRegisterForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(5)]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator },
    );
  }

  onSubmit() {
    if (this.userRegisterForm.valid) {
      const username = this.userRegisterForm.get('username')?.value;
      const password = this.userRegisterForm.get('password')?.value;
      console.log('Username:', username);
      console.log('Password:', password);

      this.api.createUser({ username, password }).subscribe(
        (response) => {
          console.log('User created successfully:', response);
          this.toastr.success('Registration successful', 'Success');
          this.router.navigate(['/login']);
        },
        (error) => {
          const body = error.error;
          const first = body && typeof body === 'object' ? Object.values(body)[0] : null;
          const msg = Array.isArray(first)
            ? first[0]
            : (body?.detail ?? 'An error occurred during registration');
          this.toastr.error(msg, 'Error');
        },
      );
    } else {
      this.userRegisterForm.markAllAsTouched();
      console.log('Form is invalid');
      if (this.userRegisterForm.errors?.['passwordMismatch']) {
        this.toastr.error('Passwords do not match', 'Error');
      }
    }
  }
}
