import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa AngularFireAuth
import { IGenericUser } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private afAuth: AngularFireAuth) {}

  // Método para iniciar sesión con correo electrónico y contraseña
  // Método para iniciar sesión con correo electrónico y contraseña
  loginUser(email: string, password: string): Promise<IGenericUser | null> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Si el inicio de sesión es exitoso, puedes devolver el usuario o realizar otras acciones necesarias.
        return userCredential.user as IGenericUser;
      });
  }

  // Método para registrar un nuevo usuario con correo electrónico y contraseña
  register(email: string, password: string): Promise<IGenericUser> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Si el registro es exitoso, puedes devolver el usuario o realizar otras acciones necesarias.
        console.log(userCredential)
        return userCredential.user as IGenericUser;
      });
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }
}
