import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  
})
export class LoginPage{
  
  credentialForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });


  constructor(private authService: AuthServiceService, private router: Router, private fb: FormBuilder) {}

  login() {
    this.authService.loginUser(this.credentialForm.get('email')?.value, this.credentialForm.get('password')?.value)
      .then(() => {
        this.router.navigateByUrl('/home'); // Redirige al usuario a la página de inicio después del inicio de sesión exitoso
      })
      .catch((error) => {
        console.error('Error en el inicio de sesión:', error);
        // Manejar errores o mostrar un mensaje al usuario, por ejemplo:
        // this.errorMessage = error.message;
      });
  }

}
