import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { LoadingController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { Comida } from 'src/app/models';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { GoogleMapsPage } from '../google-maps/google-maps.page';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  // Arreglo de comidas y objeto para nueva comida
  comidas: Comida[] = [];
  newComida: Comida;
  enableNewComida = false;
  // Variables para gestionar la carga de imágenes
  public path = 'Comidas/';
  loading: any;
  newFile: any;
  // Constructor para inyectar servicios
  constructor(
    private firestorageService: FirestorageService,
    private firestoreService: FirestoreService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private authService: AuthServiceService,
    private router: Router
   

  ) {
    // Inicialización del objeto nueva comida con valores predeterminados
    this.newComida = {
      nombre_pla: '',
      precio_pla: 0,
      descrp_pla: '',
      ubicacion: '',
      foto: '',
      id: '',
      fecha: new Date(),
    };
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: GoogleMapsPage,
      cssClass: 'google-maps.page.scss'
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if(role === 'aceptar'){
      this.newComida.ubicacion = data;
    }
  }

  // Método llamado cuando se inicializa el componente
  ngOnInit() {
    this.getComidas();
  }

  // Obtener la colección de comidas desde Firestore
  getComidas() {
    this.firestoreService.getCollection<Comida>(this.path).subscribe(res => {
      this.comidas = res;
    });
  }
  
  // Guardar una nueva comida en Firestore y cargar la imagen si está presente
  async guardarComida() {
    this.presentLoading();
    const path = 'Comida';
    const name = this.newComida.nombre_pla;
    if (this.newFile !== undefined) {
      const res = await this.firestorageService.uploadImage(this.newFile, path, name);
      this.newComida.foto = res;
    }
    this.firestoreService.createDoc(this.newComida, this.path, this.newComida.id).then(res => {
      this.loading.dismiss();
      this.presentToast('¡Guardado con éxito!');
    }).catch(error => {
      this.presentToast('No se pudo guardar');
    });
  }

  


  // Eliminar una comida mostrando un mensaje de advertencia
  async deleteComida(comida: Comida) {

    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Advertencia',
      message: ' Seguro desea Eliminar esta opcion',
      buttons: [
        {
          text: 'cancelar',
          role: 'cancel',
          cssClass: 'normal',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            // this.alertController.dismiss();
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Okay');
            this.firestoreService.deleteDoc(this.path, comida.id).then(res => {
              this.presentToast('Eliminado con exito!');
              this.alertController.dismiss();
            }).catch(error => {
              this.presentToast('No se pude eliminar');
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async verComida(comida: Comida) {
    try {
      const alert = await this.alertController.create({
        cssClass: 'normal',
        header: 'Comida',
        message: '<strong>Nombre:</strong> ' + comida.nombre_pla + '<br>' +
          '<strong>Precio:</strong> ' + comida.precio_pla + '<br>' +
          '<strong>Descripcion:</strong> ' + comida.descrp_pla + '<br>' +
          '<strong>Ubicacion:</strong> ' + comida.ubicacion + '<br>' +
          '<strong>Fecha:</strong> ' + comida.fecha + '<br>' +
          '<strong>Foto:</strong> <br><img src="' + comida.foto + '" width="300px">',
        buttons: ['OK']
      });
  
      await alert.present();
    } catch (error) {
      console.log('error -> ', error);
    }
  }

  // Manejar la carga de una nueva imagen
  async newImageUpload(event: any) {

    if (event.target.files && event.target.files[0]) {
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) => {
        this.newComida.foto = image.target?.result as string;
        console.log('URL de la imagen:', this.newComida.foto);
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  // Configurar el modo de agregar una nueva comida
  nuevo() {
    this.enableNewComida = true;
    this.newComida = {
      nombre_pla: '',
      precio_pla: 0,
      descrp_pla: '',
      ubicacion: '',
      foto: '',
      id: this.firestoreService.getId(),
      fecha: new Date()
    };
  }
  // Presentar un indicador de carga
  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: 'guardando...',
    });
    await this.loading.present();
  }
  // Presentar un mensaje emergente
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'normal',
      duration: 2000,
      color: 'light',
    });
    toast.present();
  }

  logout() {
    this.authService.logout()
      .then(() => {
        this.router.navigateByUrl('/login'); // Redirige al usuario a la página de inicio de sesión después del cierre de sesión
      })
      .catch((error) => {
        console.error('Error en el cierre de sesión:', error);
        // Manejar errores o mostrar un mensaje al usuario si es necesario
      });
  }
}
