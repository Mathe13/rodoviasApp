import { base_url } from '../../app/config';
import { Http } from '@angular/http';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';


declare var google;
declare var MarkerClusterer;

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html'
})
export class MapaPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  constructor(public navCtrl: NavController,
    private geolocation: Geolocation,
    private _http: Http) {
  }
  ionViewCanEnter() {
    console.log("entrou mapa")
    this.geolocation.getCurrentPosition().then(loc => {
      console.log("loc", loc)
      this.loadMap({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      }).then(() => {
        this.addBuracos();
      })
    })
  }
  async loadMap(centro) {
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: centro,
      streetViewControl: false,
      styles: [
        {
          "featureType": "poi",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.business",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
      ]
    });
  }
  addBuracos() {
    this._http.get(base_url + "oscilacao")
      .map(res => res.json())
      .toPromise()
      .then((res) => {
        // console.log(res)
        let markers = []
        res['resultado'].forEach(buraco => {
          // console.log(buraco)
          let marcador = new google.maps.Marker({
            position: { lat: parseFloat(buraco.lat), lng: parseFloat(buraco.lng) },
            map: this.map,
            icon: './assets/imgs/icon.png'
          })
          if (marcador) {
            marcador.addListener('click', function () {
              window.open('https://maps.google.com/maps/?f=q&q=' + buraco.lat + ',' + buraco.lng, '_blank');
              this.map.setCenter(marcador.getPosition());
            });
            markers.push(marcador)
          }
        });
        let cluster = new MarkerClusterer(this.map, markers)
        this.verifica_bounds(markers)
      })
  }
  verifica_bounds(markers) {
    setTimeout(() => {
      for (var i = 0; i < markers.length; i++) {
        if (!(this.map.getBounds().contains(markers[i].getPosition()))) {
          markers[i].setVisible(false)
          // console.log('sumiu');

        } else {
          markers[i].setVisible(true)
          // console.log('apareceu');

        }
      }
      if (this.navCtrl.getActive().component.name == 'AboutPage') {
        this.verifica_bounds(markers)
      } else {
        return
      }

    }, 1000);
  }

}
