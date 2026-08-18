import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Api } from '../../services/api';
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  userForm: FormGroup;
  toaster = inject(ToastrService);
  api = inject(Api);
  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const username = this.userForm.get('username')?.value;
      const password = this.userForm.get('password')?.value;
      console.log('Username:', username);
      console.log('Password:', password);
      this.api.login(username, password).subscribe({
        next: (response) => {
          console.log('Login successful:', response);

          const token = (response as any).access;
          localStorage.setItem('authToken', token);

          this.toaster.success('Login successful', 'Success');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.toaster.error('Invalid username or password', 'Error');
        },
      });
    } else {
      console.log('Form is invalid');
      this.userForm.markAllAsTouched();
      this.toaster.error('Please fill in all required fields correctly.', 'Error');
    }
  }
}
