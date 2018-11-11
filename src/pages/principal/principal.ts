import { utils } from './../../app/utils';
import { registro, dados } from './../../app/types';
import { HistoricoPage } from './../historico/historico';
import { base_url, sensorInterval } from './../../app/config';
import { MapaPage } from './../mapa/mapa';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Headers } from '@angular/http';
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope';


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
  selector: 'page-principal',
  templateUrl: 'principal.html',
})
export class PrincipalPage {
  //variaveis
  aviso = false
  status = false
  addr = ""
  data_ant
  inicio = { lat: '', lng: '' }
  comprimento = 0
  location = { lat: '', lng: '' }
  acelerometer = { x: '', y: '', z: '' }
  acelerometer_historic = []
  acelerometer_variation = { x: '', y: '', z: '' }

  registros = []


  motionWatcher
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private deviceMotion: DeviceMotion,
    private geolocation: Geolocation,
    private _http: Http,
    private alertCtrl: AlertController,
    private gyroscope: Gyroscope) {

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
  start() {
    // if (this.comprimento == 0) {
    //   this.alertCtrl.create(
    //     {
    //       title: 'Erro',
    //       subTitle: 'Por favor selecione uma distancia',
    //       buttons: [{ text: 'ok' }]
    //     })
    //     .present()
    //      return
    // }
    this.status = true
    console.log('valor do select:', this.comprimento)
    this.monitorar()
  }
  stop() {
    this.alertCtrl.create({
      title: 'Tem certeza?',
      buttons: [
        { text: 'Sim', handler: () => { this.status = false } },
        { text: 'Não' }]
    }).present()
  }
  monitorar() {
    let tmp: dados = registro()
    console.log("tmp criado", tmp)
    this.motionWatcher = this.deviceMotion.watchAcceleration({ frequency: sensorInterval })
      .subscribe((acceleration: DeviceMotionAccelerationData) => {
        console.log('aceleracao', acceleration);
        this.geolocation.getCurrentPosition().then((loc) => {
          console.log('gps', loc)
          tmp.accelerometer = { x: acceleration.x, y: acceleration.y, z: acceleration.z }
          tmp.location = { lat: loc.coords.latitude, lng: loc.coords.longitude }
          if (this.registros.length == 0) {
            tmp.accelerometer_variation = utils.coordinates_variation(tmp.accelerometer, tmp.accelerometer)
          } else {
            tmp.accelerometer_variation = utils.coordinates_variation(this.registros[this.registros.length - 1].accelerometer, tmp.accelerometer)
          }
          console.log('valor a ser guardado', tmp)

          let options: GyroscopeOptions = {
            frequency: 1000
          };

          this.gyroscope.getCurrent(options)
            .then((orientation: GyroscopeOrientation) => {
              console.log('giroscopio', orientation.x, orientation.y, orientation.z, orientation.timestamp);
              tmp.gyroscope = { x: orientation.x, y: orientation.y, z: orientation.z }
            })
            .catch(

            )

          if (this.status == false) {
            this.motionWatcher.unsubscribe()
          }
          // var header = new Headers()
          // header.append('Content-Type', 'application/json')
          // console.log(base_url + "oscilacao")
          // this._http.post(base_url + "oscilacao", payload, { headers: header })
          //   .toPromise()
          //   .then(() => {
          //     console.log("cadastoru")
          //     this.location = { lat: String(payload.lat), lng: String(payload.lng) }
          //     this.acelerometer_historic.push(payload)
          //     this.acelerometer = { x: String(payload.x), y: String(payload.y), z: String(payload.z) }
          //     this._http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + payload.lat + "," + payload.lng + "&key=AIzaSyDkK8945ckkbgGP93QtliiGL-ea84WJ8vo")
          //       .map(res => res.json())
          //       .toPromise()
          //       .then((res) => {
          //         this.addr = res['results'][0]['formatted_address']
          //         console.log(res)

          //       })
          //   }).catch((err) => {
          //     console.log("erro", err)
          //   })
        }).catch((err) => console.log("erro ao pegar localização", err))

      });
  }

  pushHistorico() {
    this.navCtrl.push(HistoricoPage, { historico: this.acelerometer_historic })
  }



}
