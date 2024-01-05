import { Component, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Input, Renderer2, ElementRef, ViewChild, Inject } from '@angular/core';
import { GoogleMapsService } from './google-maps.service';
import { ModalController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google: any;
// declare var Geolocation: {
//   getCurrentPosition: any; // o el tipo correcto según tu aplicación
// };

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.page.html',
  styleUrls: ['./google-maps.page.scss'],
})

export class GoogleMapsPage implements OnInit {


  @Input() position = {
    lat: -2.898116,
    lng: -78.99958149999999
  };

  label = {
    titulo: 'Ubicación',
    subtitulo: 'Mi ubicación de envío'
  }

  @ViewChild('map', { static: true }) divMap!: ElementRef;
  map: any;
  marker: any;
  infowindow: any;
  positionSet: any



  constructor(
    @Inject(DOCUMENT) private document: any,
    private renderer: Renderer2,
    private googlemapsService: GoogleMapsService,
    public modalController: ModalController,
    private geolocation: Geolocation
    ) { }

  ngOnInit(): void {
    this.init();

    console.log('position ->', this.position)
  }
  async init() {

    this.googlemapsService.init(this.renderer, this.document).then(() => {
      this.initMap();
    }).catch((err: any) => {
      console.log(err);
    });
  }

  initMap() {

    const position = this.position;

    let latLng = new google.maps.LatLng(position.lat, position.lng);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      disableDefaultUI: true,
      clickableIcons: false,
    };

    this.map = new google.maps.Map(this.divMap.nativeElement, mapOptions);
    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      draggable: false,
    });
    this.clickHandleEvent();
    this.infowindow = new google.maps.InfoWindow();
    this.addMarker(position);
    this.setInfoWindow(this.marker, this.label.titulo, this.label.subtitulo);

  }

  clickHandleEvent() {

    this.map.addListener('click', (event: any) => {
      const position = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      this.addMarker(position);
    });

  }


  addMarker(position: any): void {

    let latLng = new google.maps.LatLng(position.lat, position.lng);

    this.marker.setPosition(latLng);
    this.map.panTo(position);
    this.positionSet = position;

  }


  setInfoWindow(marker: any, titulo: string, subtitulo: string) {

    const contentString = '<div id="contentInsideMap">' +
      '<div>' +
      '</div>' +
      '<p style="font-weight: bold; margin-bottom: 5px;">' + titulo + '</p>' +
      '<div id="bodyContent">' +
      '<p class"normal m-0">'
      + subtitulo + '</p>' +
      '</div>' +
      '</div>';
    this.infowindow.setContent(contentString);
    this.infowindow.open(this.map, marker);

  }

  async mylocation() {
    const position = await this.geolocation.getCurrentPosition();
    console.log('position -> ', position);
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    this.addMarker({ lat, lng });
  }

  aceptar() {
    try {
      console.log('click aceptar -> ', this.positionSet);
      this.modalController.dismiss(this.positionSet, 'aceptar');
    } catch (error) {
      console.log('error -> ', error);
    }
  }
  cancelar() {
    this.modalController.dismiss(null, 'cancelar');
  }



}
