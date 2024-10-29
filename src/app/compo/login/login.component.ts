import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from '../../utils/utils-service';
import { AuthService } from '../config/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  emailAdmin = 'admin@mysoc.com';
  emailUser = 'user@mysoc.com';

  passwordAdmin: string = 'Admin.2024';
  passwordUser: string = 'Admin.2024';
  email: string = this.emailAdmin;
  password: string = this.passwordAdmin;
  loginError: boolean = false;
  errorMessage = ""

  constructor(public authService: AuthService, private router: Router, public shareService : UtilService) {}

  login() {
    this.authService.login(this.email, this.password).subscribe(
      (user: any) => {
        console.log('Login successful', user);

        // Stocker l'utilisateur dans le cookie
        this.authService.storeUserInCookie(user);
        
      },
      (error) => {
        console.error('Login failed', error);
        this.errorMessage = error;
      }
    );
  }

  setEmailAdmin() {
    this.email = this.emailAdmin
    this.password = this.passwordAdmin
  }
  setEmailUser() {
    this.email = this.emailUser
    this.password = this.passwordUser
  }


}
