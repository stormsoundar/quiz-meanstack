import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Registration } from 'src/app/model/registeration';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  submitted = false;
  register: FormGroup;
  public registration = new Registration();

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public httpClient: HttpClient,
    public authService: AuthService,
    private spinner: NgxSpinnerService
  ) {
    this.mainForm();
  }

  ngOnInit(): void {
      /** spinner starts on init */
      this.spinner.show();

      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
      }, 3000);
  }

  mainForm() {
    this.register = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('([A-Za-z])+')]],
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
    return this.register.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (!this.register.valid) {
      return false;
    } else {
      this.registration = this.register.value;
      this.authService.signUp(this.registration);
 /** spinner starts on init */
      this.spinner.show();

      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
      }, 3000);
    }
  }

  signIn() {
    this.register.reset();
  }
}
