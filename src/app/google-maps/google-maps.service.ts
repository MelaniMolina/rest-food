import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

declare var google: any;

@Injectable({
  providedIn: 'root'
})

export class GoogleMapsService {
  apiKey = environment.ApiKeyGoogleMaps;
  mapsLoaded = false;
  
  constructor() { }

  init(renderer: any, document: any): Promise<any> {

    return new Promise((resolve) => {

      if (this.mapsLoaded) {
        console.log('google is preview loaded')
        resolve(true);
        return;
      }

      const script = renderer.createElement('script');
      script.id = 'googleMaps';

    
      (window as any).mapInit = () => {
        this.mapsLoaded = true;
        if (google) {
          console.log('Google Maps is loaded');
        } else {
          console.log('Google Maps is not defined');
        }
        resolve(true);
        return;
      };

      if (this.apiKey) {
        script.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
      } else {
        script.src = 'https://maps.googleapis.com/maps/api/js?callback=mapInit';
      }

      renderer.appendChild(document.body, script);

    });


  }
}

