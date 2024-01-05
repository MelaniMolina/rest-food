// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthServiceService } from 'src/app/services/auth-service.service';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { AlertController, LoadingController } from '@ionic/angular';
// import { ToastController } from '@ionic/angular';

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { IGenericUser } from '../models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage   {
  credentialForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private authService: AuthServiceService, private router: Router, private fb: FormBuilder) {}

  register() {
    // console.log("email: ", this.credentialForm, "Password: ", this.credentialForm.get('password')?.value);
    this.authService.register(this.credentialForm.get('email')?.value, this.credentialForm.get('password')?.value)
      .then((user: IGenericUser) => {
        // console.log('Registrado', user);
        this.router.navigateByUrl('login');
      })
      .catch(err => console.log(err));
  }
}
