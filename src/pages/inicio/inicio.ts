import { HistoricoPage } from './../historico/historico';
import { base_url, sensorInterval } from './../../app/config';
import { MapaPage } from './../mapa/mapa';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Headers } from '@angular/http';



import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http'

/**
 * Generated class for the InicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
})
export class InicioPage {
  //variaveis
  status = false
  addr = ""
  location = { lat: '', lng: '' }
  acelerometer = { x: '', y: '', z: '' }
  acelerometer_historic = []
  acelerometer_variation = { x: '', y: '', z: '' }
  motionWatcher
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private deviceMotion: DeviceMotion,
    private geolocation: Geolocation,
    private _http: Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InicioPage');
  }
  pushMapa() {
    this.navCtrl.push(MapaPage)
  }
  changeStatus() {
    console.log("mudando status")
    this.status = !(this.status);
    if (this.status) {
      this.monitorar()
    } else {
      console.log("vai desativar")
      this.motionWatcher.unsubscribe();
    }
  }
  monitorar() {
    this.motionWatcher = this.deviceMotion.watchAcceleration({ frequency: sensorInterval })
      .subscribe((acceleration: DeviceMotionAccelerationData) => {
        console.log(acceleration);
        this.geolocation.getCurrentPosition().then((loc) => {
          console.log(loc)
          let payload = {
            "lat": loc.coords.latitude,
            "lng": loc.coords.longitude,
            "x": acceleration.x,
            "y": acceleration.y,
            "z": acceleration.z,
          }
          this.calcula_variacao(payload)
          payload['variation_x'] = this.acelerometer_variation.x
          payload['variation_y'] = this.acelerometer_variation.y
          payload['variation_z'] = this.acelerometer_variation.z
          console.log(payload)
          if (this.status == false) {
            this.motionWatcher.unsubscribe()
          }
          var header = new Headers()
          header.append('Content-Type', 'application/json')
          console.log(base_url + "oscilacao")
          this._http.post(base_url + "oscilacao", payload, { headers: header })
            .toPromise()
            .then(() => {
              console.log("cadastoru")
              this.location = { lat: String(payload.lat), lng: String(payload.lng) }
              this.acelerometer_historic.push(payload)
              this.acelerometer = { x: String(payload.x), y: String(payload.y), z: String(payload.z) }
              this._http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + payload.lat + "," + payload.lng + "&key=AIzaSyDkK8945ckkbgGP93QtliiGL-ea84WJ8vo")
                .map(res => res.json())
                .toPromise()
                .then((res) => {
                  this.addr = res['results'][0]['formatted_address']
                  console.log(res)

                })
            }).catch((err) => {
              console.log("erro", err)
            })
        }).catch((err) => console.log("erro ao pegar localização", err))

      });
  }
  calcula_variacao(dados) {
    if (this.acelerometer_historic.length == 0) {
      this.acelerometer_variation.x = '0'
      this.acelerometer_variation.y = '0'
      this.acelerometer_variation.z = '0'
    } else {
      let mais_recente = this.acelerometer_historic.length - 1
      this.acelerometer_variation.x = String(parseFloat(dados.x) - parseFloat(this.acelerometer_historic[mais_recente].x))
      this.acelerometer_variation.y = String(parseFloat(dados.y) - parseFloat(this.acelerometer_historic[mais_recente].y))
      this.acelerometer_variation.z = String(parseFloat(dados.z) - parseFloat(this.acelerometer_historic[mais_recente].z))
    }
  }
  pushHistorico() {
    this.navCtrl.push(HistoricoPage, { historico: this.acelerometer_historic })
  }
}
