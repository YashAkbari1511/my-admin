import { Component, inject, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);

  isLoginMode = true;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.cdr.markForCheck();
  }

  async onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      let success = false;
      if (this.isLoginMode) {
        success = await this.authService.login(email!, password!);
      } else {
        success = await this.authService.register(email!, password!);
      }
      
      if (success) {
        this.router.navigate(['/dashboard']);
      }
      this.cdr.markForCheck();
    }
  }
}
