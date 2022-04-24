import { Component, OnInit, ViewChild } from '@angular/core';
import { MatProgressBar, MatButton } from '@angular/material';
import { AUTHService } from 'app/services/negocio/auth/auth.service';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  userEmail;
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;
  signinForm: FormGroup;

  constructor(
    private _router: Router,
    private auth: AUTHService
  ) { }

  ngOnInit() {       
    localStorage.clear();
    this.signinForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  submitEmail() {
    this.submitButton.disabled = true;
    this.progressBar.mode = 'indeterminate';

    const { email } = this.signinForm.value;

    this.auth.resetPassword(email).subscribe(res => {
      this._router.navigate(['/sessao/entrar'])
    }, ({ error: err }) => {
      this.progressBar.mode = "determinate"
      Object.keys(err).forEach(key => {
        console.error(err);
        this.signinForm.controls[key].setErrors({ 'error': err[key] });
      });
    });
  }
}
