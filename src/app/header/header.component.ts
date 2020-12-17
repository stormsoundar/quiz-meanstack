import {
  AfterContentInit,
  Component,
  DoCheck,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CommonCoreService } from '../service/common-core.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy, AfterContentInit {
  userIsAuthenticated = false;
  testSubmitted: boolean;
  private authListenerSubscription: Subscription;
  userDetail: any;
  userName: string;
  result: any;
  collapsed = true;
  constructor(
    private authService: AuthService,
    private commonCoreService: CommonCoreService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        const user = JSON.parse(localStorage.getItem('user'));
        const userData = user.name;
        this.userName = userData;
      });
  }

  ngAfterContentInit() {
    const user = localStorage.getItem('userName');
    this.userName = user;
  }

  onLogout(): void {
     /** spinner starts on init */
      this.spinner.show();

      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
      }, 3000);
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSubscription.unsubscribe();
  }
}
