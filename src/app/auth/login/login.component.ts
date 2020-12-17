import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignIn } from 'src/app/model/sign-in';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  submitted = false;
  signin: FormGroup;
  public signinUser = new SignIn();
  response;
  constructor(
    public fb: FormBuilder,
    public router: Router,
    public httpClient: HttpClient,
    public authService: AuthService,
    private spinner: NgxSpinnerService
  ) {
    this.mainForm();
  }

  ngOnInit(): void {}

  mainForm() {
    this.signin = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
          ),
        ],
      ],
    });
  }

  // Getter to access form control
  get registerFormControl() {
    return this.signin.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (!this.signin.valid) {
      return false;
    } else {
      this.signinUser = this.signin.value;
      this.authService.signIn(this.signinUser);
      /** spinner starts on init */
      this.spinner.show();

      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
      }, 3000);
    }
  }

  signUp() {
    this.signin.reset();
  }
}
