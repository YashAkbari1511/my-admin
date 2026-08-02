import { Injectable, inject } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  
  user$ = authState(this.auth);

  async login(email: string, pass: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, pass);
      return true;
    } catch (error: any) {
      this.toastr.error(error.message || 'Login failed', 'Error');
      return false;
    }
  }

  async register(email: string, pass: string) {
    try {
      await createUserWithEmailAndPassword(this.auth, email, pass);
      return true;
    } catch (error: any) {
      this.toastr.error(error.message || 'Registration failed', 'Error');
      return false;
    }
  }



  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}
