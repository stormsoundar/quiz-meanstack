import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { Registration } from '../model/registeration';
import { SignIn } from '../model/sign-in';
import { CommonCoreService } from '../service/common-core.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  response: any;
  testSubmitted: boolean;
  private authStatusListener = new Subject<boolean>();

  public hostUrl = 'http://localhost:3000';
  constructor(
    public httpClient: HttpClient,
    private router: Router,
    private commonCoreService: CommonCoreService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getUserDetails();
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  // Sign Up
  public signUp(registration: Registration) {
    const url = `${this.hostUrl}/sign-up`;
    return this.httpClient.post(url, registration).subscribe((response) => {
      this.toastr.success('Welcome', 'Registration Success');
      this.router.navigateByUrl('/login');
    });
  }

  // Sign In
  public signIn(signinUser: SignIn) {
    const url = `${this.hostUrl}/sign-in`;
    this.httpClient
      .post<{ token: string; expiresIn: number; response: any }>(
        url,
        signinUser
      )
      .subscribe(
        (data) => {
          const token = data.token;
          const expiresIn = data.expiresIn;
          this.response = data.response;
          const userName = data.response.name;
          const userData = JSON.stringify(this.response);
          localStorage.setItem('user', userData);
          localStorage.setItem('userName', userName);
          this.getUserDetails();
          this.token = token;
          if (token) {
            const expiresInDuration = expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(token, expirationDate);
            this.toastr.success('Welcome', 'Loggedin Successfully');
            this.router.navigateByUrl('/home');
          }
        },
        (error) => {
          this.toastr.error('Invalid Credintials', 'Try Again!');
          console.log('Auth Failed');
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.toastr.info( 'Good Bye', 'Loggedout Successfully');
    this.router.navigateByUrl('/login');
  }

  private setAuthTimer(duration: number) {
    // console.log("Setting time: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token && expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
    };
  }

  public getUserDetails() {
    // console.log(this.response);
    return this.response;
  }

  getTestStatus() {
    this.commonCoreService.getResult().subscribe((data: any) => {
      if (data.success == true) {
        this.testSubmitted = true;
      }
    });
  }
}
