import { base_url } from '../../app/config';
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope';
import { MapaPage } from '../mapa/mapa';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Button, LoadingController, Platform } from 'ionic-angular';


import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http'
import { Storage } from '@ionic/storage';
import { InicioPage } from '../inicio/inicio';
import { User_data } from '../../app/models/user';



// @IonicPage()
@Component({
  selector: 'page-coleta',
  templateUrl: 'coleta.html',
})
export class ColetaPage {
  //variaveis
  quiz = false
  aviso = false
  faixa = ''
  rodovia = ""
  veiculo = 1
  veiculos = [{ id: 1, nome: "" }]
  user: User_data
  anotacoes = ''

  //pra exibição
  status = false
  trajeto = {}
  acelerometro = []
  gps = []
  giroscopio = []


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private deviceMotion: DeviceMotion,
    private geolocation: Geolocation,
    private _http: Http,
    private _storage: Storage,
    private alertCtrl: AlertController,
    private gyroscope: Gyroscope,
    private loadCtrl: LoadingController,
    private Platform: Platform
    // private sensores: sensores
  ) {

    this._storage.get('user').then(user => {
      this.user = user
    }).catch(err => {
      this.alertCtrl.create({
        title: "Erro",
        subTitle: "É necessario fazer login",
        buttons: [{
          text: 'ok', handler: () => {
            this.navCtrl.setRoot(InicioPage)
          }
        }]
      }).present()

    })

  }
  stop() {
    this.alertCtrl.create({
      title: 'Tem certeza?',
      buttons: [
        {
          text: 'sim', handler: () => {
            this.status = false
            this.salva_leitura()
          }
        },
        { text: 'não' }
      ]
    }).present()
  }


  async salva_leitura() {
    let path = this.trajeto
    path['aceloremtro'] = this.acelerometro
    path['giroscopio'] = this.giroscopio
    path['gps'] = this.gps
    this._storage.get('leituras').then(leituras => {
      leituras.push(this.trajeto)
      console.log(leituras)
      this._storage.set('leituras', leituras)
    }).catch(err => {
      console.log(err)
      this.salva_leitura()
    })
  }

  abreQuiz() {
    this.quiz = true
  }
  async ionViewDidLoad() {
    let loader = this.loadCtrl.create({ content: 'carregando' })
    loader.present()
    console.log('ionViewDidLoad InicioPage');
    await this.consulta_veiculos();
    await this.get_rodovia_name()
    loader.dismiss()
  }

  create_trajeto() {
    let payload = {
      user_id: this.user.id,
      tipo_veiculo: this.veiculo,
      nome_rodovia: this.rodovia,
      faixa: this.faixa,
      observacao: this.anotacoes
    }
    this._http.post(base_url + '/path', payload)
      .map(res => res.json())
      .toPromise()
      .then(res => {
        console.log(res)
        payload['id'] = res.insertId
        console.log(payload)
        this.trajeto = payload;
        this.disparaLeituras(res.insertId)
      }).catch(err => {
        this.alertCtrl.create({
          title: 'Erro',
          subTitle: 'Verifique sua conexão',
          buttons: [{ text: 'ok' }]
        })
      })
  }
  get_rodovia_name(cont = 0) {
    this.geolocation.getCurrentPosition()
      .then((loc) => {
        this._http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + loc.coords.latitude + "," + loc.coords.longitude + "&key=AIzaSyDkK8945ckkbgGP93QtliiGL-ea84WJ8vo")
          .map(res => res.json())
          .toPromise()
          .then((res) => {
            this.rodovia = res['results'][0]['formatted_address']
            console.log(res)
          })
      }).catch(err => {
        if (cont < 3) {
          this.get_rodovia_name(cont + 1)
        }
      })
  }
  async disparaLeituras(path_id) {
    this.status = true;
    this.leitor_acelerometro(path_id)
    this.leitor_gps(path_id)
    this.leitor_giroscopio(path_id)
  }

  leitor_acelerometro(path_id) {
    var subscription = this.deviceMotion.watchAcceleration({ frequency: 1000 })
      .subscribe((acceleration: DeviceMotionAccelerationData) => {
        console.log(acceleration);
        let payload = {
          trajeto_id: path_id,
          x: acceleration.x,
          y: acceleration.y,
          z: acceleration.z,
          datahora: new Date().toISOString()
        }
        this.acelerometro.push(payload)
        this.envia_dados('/acelerometro', payload)
        if (this.status == false) {
          subscription.unsubscribe()
        }
      });
  }
  leitor_gps(path_id) {
    let subscription = this.geolocation.watchPosition({ enableHighAccuracy: true })
      .subscribe((data) => {
        if (data.coords !== undefined) {
          let payload = {
            trajeto_id: path_id,
            lat: data.coords.latitude,
            lng: data.coords.longitude,
            velocidade: data.coords.speed,
            altitude: data.coords.altitude,
            precisao_loc: data.coords.accuracy,
            precisao_alt: data.coords.altitudeAccuracy,
            datahora: new Date().toISOString()
          }
          console.log('gps', payload);
          this.gps.push(payload)
          this.envia_dados('/gps', payload)
          if (this.status == false) {
            subscription.unsubscribe()
          }
        }
      });
  }
  leitor_giroscopio(path_id) {
    let subscription = this.gyroscope.watch({ frequency: 1000 })
      .subscribe((orientation: GyroscopeOrientation) => {
        console.log('gyroscope', orientation.x, orientation.y, orientation.z, orientation.timestamp);
        let payload = {
          x: orientation.x,
          y: orientation.y,
          z: orientation.z,
          trajeto_id: path_id,
          datahora: new Date().toISOString()
        }
        this.giroscopio.push(payload)
        this.envia_dados('/giroscopio', payload)
        if (this.status == false) {
          subscription.unsubscribe()
        }
      });
  }

  async envia_dados(sensor, payload) {
    this._http.post(base_url + sensor, payload)
      .toPromise()
      .then(() => { console.log('enviei:' + sensor) })
      .catch((err) => {
        console.log('erro ao envia:' + sensor + "\n erro:" + String(err))
        this.envia_dados(sensor, payload)
      })
  }



  consulta_veiculos() {
    this._http.get(base_url + '/path/tipo_veiculo')
      .map(res => res.json())
      .toPromise()
      .then(Response => {
        console.log(Response)
        this.veiculos = Response;
      }).catch(err => {
        console.log(err)
        this.consulta_veiculos()
      })
  }


  pushMapa() {
    this.navCtrl.push(MapaPage)
  }





}
