import { Component, signal } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Added for async pipe, *ngIf
import { AuthService } from '../../services/auth.service'; // Added
import { Observable } from 'rxjs'; // Added

@Component({
  selector: 'app-header',
  standalone: true, // Assuming standalone based on other components
  imports: [CommonModule, RouterModule, RouterLink], // Added CommonModule
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isLoggedIn$: Observable<boolean>; // Added
  hideMenu = signal(true);

  constructor(private authService: AuthService) { // Added constructor and injection
    this.isLoggedIn$ = this.authService.loggedIn$; // Assign observable
  }

  async logout(): Promise<void> { // Added logout method
    try {
      await this.authService.signOut();
      // Optional: Add navigation after logout if needed, e.g., to login page
      // this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle logout error display if necessary
    }
  }

  toggleMenu() {
    const isHidden = this.hideMenu();
    this.hideMenu.set(!isHidden)
  }
}
