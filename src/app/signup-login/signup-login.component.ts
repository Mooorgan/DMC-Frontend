import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'dmc-signup-login',
  templateUrl: './signup-login.component.html',
  styleUrls: ['./signup-login.component.scss'],
})
export class SignupLoginComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  submitted = false;
  loginDisplay = false;
  authForm!: FormGroup;
  constructor(
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.subscription = this.activeRoute.url.subscribe((value) => {
      this.loginDisplay = value.length === 0 ? true : false;
    });

    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    if (!this.loginDisplay) {
      this.authForm.addControl(
        'username',
        this.fb.control('', Validators.required)
      );
    }
  }

  get authFormControl() {
    return this.authForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.authForm.invalid) {
      return;
    }
    const { email, password } = this.authForm.value;
    if (!this.loginDisplay) {
      const { username } = this.authForm.value;
      this.auth.signupUser(email, password, username);
    } else {
      this.auth.loginUser(email, password);
    }
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }
}
