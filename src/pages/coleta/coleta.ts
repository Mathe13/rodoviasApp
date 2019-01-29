import { utils } from '../../app/utils';
import { registro, dados, location } from '../../app/types';
import { HistoricoPage } from '../historico/historico';
import { base_url, sensorInterval } from '../../app/config';
import { MapaPage } from '../mapa/mapa';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Headers } from '@angular/http';
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope';


import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http'
import { Storage } from '@ionic/storage';
import { InicioPage } from '../inicio/inicio';
import { User_data } from '../../app/models/user';

/**
 * Generated class for the InicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-coleta',
  templateUrl: 'coleta.html',
})
export class ColetaPage {
  //variaveis
  quiz = false
  aviso = false
  status = false
  faixa = ''
  rodovia = ""
  veiculo = 1
  veiculos = [{ id: 1, nome: "" }]
  user: User_data
  anotacoes = ''
  trajeto = {}


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private deviceMotion: DeviceMotion,
    private geolocation: Geolocation,
    private _http: Http,
    private alertCtrl: AlertController,
    private _storage: Storage,
    private gyroscope: Gyroscope) {
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

  abreQuiz() {
    this.quiz = true
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad InicioPage');
    this.consulta_veiculos();
    this.get_rodovia_name()
  }
  create_trajeto() {
    let payload = {
      user_id: this.user.id,
      hora_inicio: new Date().toISOString(),
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
  disparaLeituras(path_id) {

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
