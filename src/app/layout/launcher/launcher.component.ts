import { Component, ChangeDetectionStrategy, HostListener, ElementRef, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-launcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './launcher.component.html',
  styleUrls: ['./launcher.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LauncherComponent {
  isOpen = false;
  
  private router = inject(Router);
  private auth = inject(AuthService);
  private el = inject(ElementRef);

  toggle() {
    this.isOpen = !this.isOpen;
  }

  navigate(path: string) {
    this.router.navigate([path]);
    this.isOpen = false;
  }

  logout() {
    this.auth.logout();
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
