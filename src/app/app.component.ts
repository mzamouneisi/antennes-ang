import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './compo/config/auth.service';
import { UtilService } from './utils/utils-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showInfosUserConnected = false 
  userConnected = this.authService.userConnected

  constructor(public router: Router, public authService: AuthService, public shareService : UtilService) {}

  ngOnInit(): void {
    this.userConnected = this.authService.getUserConnected()
  }

  getButtonText(): string {
    const currentUser = this.userConnected;
    return currentUser ? currentUser.email : 'Se loguer';
  }

  getProfile(): string {
    const currentUser = this.userConnected;
    return currentUser ? currentUser.profile : '';
  }

  logout() {
    this.authService.logout();
    this.goToLogin();
    this.showInfosUserConnected = false 
    // this.shareService.showMenusTables=false 
  }

  goToLogin() {
    this.router.navigate(['/login']); // Redirige vers le composant de login
  }
  
}
