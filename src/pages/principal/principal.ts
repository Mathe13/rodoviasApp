import { utils } from './../../app/utils';
import { registro, dados, location } from './../../app/types';
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
  ultimo: any = null
  mostra = registro()
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
    let tmp: dados
    console.log("tmp criado", tmp)
    this.motionWatcher = this.deviceMotion.watchAcceleration({ frequency: sensorInterval })
      .subscribe((sensor_acceleration: DeviceMotionAccelerationData) => {
        tmp = registro()
        console.log('aceleracao', sensor_acceleration);
        this.geolocation.getCurrentPosition().then((loc) => {
          console.log('gps', loc)
          tmp.accelerometer = { x: sensor_acceleration.x, y: sensor_acceleration.y, z: sensor_acceleration.z }
          tmp.location = { lat: loc.coords.latitude, lng: loc.coords.longitude }
          if (this.registros.length == 0) {
            // console.log('0 registros')
            tmp.accelerometer_variation = utils.coordinates_variation(tmp.accelerometer, tmp.accelerometer)
          } else {
            // console.log('mais de 1 registro')
            console.log(this.registros, this.registros.length - 1)
            tmp.accelerometer_variation = utils.coordinates_variation(this.registros[this.registros.length - 1].accelerometer, { x: sensor_acceleration.x, y: sensor_acceleration.y, z: sensor_acceleration.z })
          }

          let options: GyroscopeOptions = {
            frequency: 1000
          };

          this.gyroscope.getCurrent(options)
            .then((orientation: GyroscopeOrientation) => {
              console.log('giroscopio', orientation.x, orientation.y, orientation.z, orientation.timestamp);
              tmp.gyroscope = {
                x: orientation.x,
                y: orientation.y,
                z: orientation.z
              }
              if (this.registros.length == 0) {
                // console.log('0 registros')
                tmp.gyroscope_variation = utils.coordinates_variation(tmp.gyroscope, tmp.gyroscope)
              } else {
                // console.log('mais de 1 registro')
                console.log(this.registros, this.registros.length - 1)
                tmp.gyroscope_variation = utils.coordinates_variation(this.registros[this.registros.length - 1].gyroscope, { x: orientation.x, y: orientation.y, z: orientation.z })
              }
              if (this.ultimo == null) {
                // console.log("ultimo = null")
                tmp.speed = 0
                tmp.acceleration = 0
                this.ultimo = {
                  location: {
                    lat: tmp.location.lat,
                    lng: tmp.location.lng,
                  },
                  speed: 0,
                  acceleration: 0,
                  tempo: Date.now()
                }

              } else {

                let deltaT = ((Date.now() - this.ultimo.tempo) / 1000)
                console.log("deltat = ", deltaT)
                console.log('distancia', (utils.haversineDistance(this.ultimo.location, tmp.location)))
                tmp.speed = ((utils.haversineDistance(this.ultimo.location, tmp.location)) / deltaT)
                console.log("deta speed", (tmp.speed - this.ultimo.speed))
                tmp.acceleration = ((tmp.speed - this.ultimo.speed) / deltaT)


                /*
                tmp.speed = 0
                tmp.acceleration = 0
                */
                this.ultimo = {
                  location: {
                    lat: tmp.location.lat,
                    lng: tmp.location.lng,
                  },
                  speed: tmp.speed,
                  acceleration: tmp.acceleration,
                  tempo: Date.now()
                }
              }
              // console.log('valor a ser guardado', tmp)
              this.sendData(tmp)
              this.registros[this.registros.length] = (tmp)
              console.log('esse é o array', this.registros, 'e esse o novo valor', tmp)
              console.log("comparando, tmp:", tmp.accelerometer, 'e o sensor:', sensor_acceleration)
              this.mostra = tmp
            })
            .catch((err) => {
              console.log('erro giro', err)
              this.alertCtrl.create({
                title: 'Erro de sensor',
                subTitle: 'giroscópio não disponivel',
                buttons: [{ text: 'ok' }]
              }).present()
              this.status = false
            }
            )

          if (this.status == false) {
            console.log("vai parar")
            this.motionWatcher.unsubscribe()
          }

        }).catch((err) => console.log("erro ao pegar localização", err))

      });
  }
  sendData(payload: dados) {
    var header = new Headers()
    header.append('Content-Type', 'application/json')
    console.log(base_url + "oscilacao")
    this._http.post(base_url + "oscilacao", payload, { headers: header })
      .toPromise()
      .then(() => {
        console.log("cadastoru")
        this._http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + payload.location.lat + "," + payload.location.lng + "&key=AIzaSyDkK8945ckkbgGP93QtliiGL-ea84WJ8vo")
          .map(res => res.json())
          .toPromise()
          .then((res) => {
            this.addr = res['results'][0]['formatted_address']
            console.log(res)
          })
      }).catch((err) => {
        console.log("erro", err)
      })
  }
  pushHistorico() {
    this.navCtrl.push(HistoricoPage, { historico: this.registros })
  }



}
