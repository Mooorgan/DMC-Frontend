import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const BACKEND_USER_URL = `${environment.apiUrl}/user`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _token!: string | null;
  private _userId!: string | null;
  private _username!: string | null;
  private authStatusSubj = new BehaviorSubject<null | boolean>(null);
  readonly authStatus$ = this.authStatusSubj.asObservable();
  private usernameSubj = new BehaviorSubject<null | string>(null);
  readonly username$ = this.usernameSubj.asObservable();
  private tokenTimer!: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  get token() {
    return this._token;
  }

  get username() {
    return this._username;
  }

  get userId() {
    return this._userId;
  }

  signupUser(email: string, password: string, username: string) {
    const authData = { email, password, username };
    this.http.post(BACKEND_USER_URL + '/signup', authData).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.authStatusSubj.next(false);
      },
    });
  }

  loginUser(email: string, password: string) {
    const authData = { email: email, password: password };
    this.http
      .post<{
        status: string;
        message: string;
        result: {
          token: string;
          expiresIn: number;
          userId: string;
          username: string;
        };
      }>(BACKEND_USER_URL + '/login', authData)
      .subscribe({
        next: ({ result }) => {
          const token = result.token;
          this._token = token;
          if (token) {
            const expiresInDuration = result.expiresIn;
            this.setAuthTimer(expiresInDuration);
            // this.isAuthenticated = true;
            this._userId = result.userId;
            this._username = result.username;
            this.authStatusSubj.next(true);
            this.usernameSubj.next(this.username);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(
              token,
              expirationDate,
              this.userId,
              this.username
            );
            this.router.navigate(['/tasks']);
          }
        },
        error: () => {
          this.authStatusSubj.next(false);
        },
      });
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string | null,
    username: string | null
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    userId && localStorage.setItem('userId', userId);
    username && localStorage.setItem('username', username);
  }

  logout() {
    this._token = null;
    // this.isAuthenticated = false;
    this.authStatusSubj.next(false);
    this.usernameSubj.next(null);
    this._userId = null;
    this._username = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      username: username,
    };
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      this.authStatusSubj.next(false);
      this.usernameSubj.next(null);
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this._token = authInformation.token;
      // this.isAuthenticated = true;
      this._userId = authInformation.userId;
      this._username = authInformation.username;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusSubj.next(true);
      this.usernameSubj.next(this.username);
    } else {
      this.authStatusSubj.next(false);
      this.usernameSubj.next(null);
    }
  }
}
