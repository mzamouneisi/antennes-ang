import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Aservice } from '../../service/Aservice';

const TOKEN_KEY='token_key'
const TOKEN_USER='token_user'

@Injectable({
  providedIn: 'root'
})
export class AuthService extends Aservice  {
  
  getTokenKey() {
      return TOKEN_KEY;
  }

  private apiUrl = this.API_URL + "auth/login";

  userConnected : any | null 

  constructor(private http: HttpClient, private cookieService: CookieService) { super() }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { email, password }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 404) {
      return throwError('User not found or incorrect password');
    }
    return throwError('An unknown error occurred');
  }

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  getAuthHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_USER);
    this.userConnected = null 

    window.location.reload();
  }

  isLoggedIn(): boolean {
    return this.getUserConnected() !== null;
  }



  ///////////////
  // logout() {
  //   this.clearUserCookie()
  // }

    // Supprimer l'utilisateur du cookie lors de la déconnexion
    // clearUserCookie(): void {
    //   this.cookieService.delete('loggedInUser');
    // }

  // Stocker l'utilisateur dans un cookie
  storeUserInCookie(user: any): void {
    const userJson = JSON.stringify(user);
    // this.cookieService.set('loggedInUser', userJson, 1); // 1 jour de durée
    localStorage.setItem(TOKEN_USER, userJson);

    this.userConnected = user 

    window.location.reload();

  }

  // Récupérer l'utilisateur depuis le cookie
  getUserConnected(): any {
    // const userJson = this.cookieService.get('loggedInUser');
    const userJson = localStorage.getItem(TOKEN_USER)
    this.userConnected = userJson ? JSON.parse(userJson) : null;
    return this.userConnected;
  }



  ////////////////


}
