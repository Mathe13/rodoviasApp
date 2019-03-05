import { base_url } from '../../app/config';
import { Gyroscope, GyroscopeOrientation } from '@ionic-native/gyroscope';
import { MapaPage } from '../mapa/mapa';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Button, LoadingController, Platform } from 'ionic-angular';


import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http'
import { Storage } from '@ionic/storage';
import { InicioPage } from '../inicio/inicio';
import { User_data } from '../../app/models/user';
import { LocationAccuracy } from '@ionic-native/location-accuracy/';
import { controlador } from '../../app/models/controlador';


// @IonicPage()
@Component({
  selector: 'page-coleta',
  templateUrl: 'coleta.html',
})
export class ColetaPage {
  //variaveis
  faixa_select = true
  falhas = []
  espera: any
  quiz = false
  aviso = false
  faixa = 'Esquerda'
  rodovia = ""
  km_inicio = ""
  km_fim = ""
  veiculo = 1
  velocidade: number
  espacamento: number
  veiculos = [{ id: 1, nome: "" }]
  user: User_data
  anotacoes = ''
  frequencia = 1000
  controlador = new controlador()

  //pra exibição
  status = false
  trajeto = {}
  acelerometro = []
  gps = []
  giroscopio = []
  // hours = 0
  // minutes = 0
  // seconds = 0
  // t = 0
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private deviceMotion: DeviceMotion,
    private geolocation: Geolocation,
    private _http: Http,
    private _storage: Storage,
    private alertCtrl: AlertController,
    private gyroscope: Gyroscope,
    private loadCtrl: LoadingController,
    private Platform: Platform,
    private locationAccuracy: LocationAccuracy
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
  muda_select() {
    this.faixa_select = (!this.faixa_select)
  }




  requisita_precisao() {
    console.log('requisitando precisao')

    this.locationAccuracy.canRequest().then((canRequest: boolean) => {

      if (canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => console.log('Request successful'),
          error => console.log('Error requesting location permissions', error)
        );
      }

    }).catch(err => console.log(err))
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
    path['acelerometro'] = this.acelerometro
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
    let loader = this.loadCtrl.create({
      content: 'enviando dados'
    })
    loader.present()
    this.espera = setTimeout(this.espera_envio(loader), 1000)

  }

  espera_envio(loader): any {
    console.log('espera envio')
    if (this.controlador.see_cont() == 0) {
      console.log('cont:', this.controlador.see_cont())
      console.log('terminou')
      clearTimeout(this.espera)
      this.lida_falhas()
      loader.dismiss();
    }

  }
  //lida com falhas
  lida_falhas() {
    if (this.falhas.length > 0) {
      this.falhas.forEach(falha => {
        this.envia_dados(falha.sensor, falha.payload)
      })
    }
  }

  abreQuiz() {
    this.quiz = true
  }
  ionViewDidEnter() {

    this.requisita_precisao();
  }
  async ionViewDidLoad() {
    let loader = this.loadCtrl.create({ content: 'carregando' })
    loader.present()
    console.log('ionViewDidLoad InicioPage');
    await this.consulta_veiculos();
    await this.get_rodovia_name()
    loader.dismiss()
  }
  calcula_frequencia() {
    if (this.velocidade && this.espacamento) {
      this.frequencia = ((this.espacamento / (this.velocidade / 3.6)) * 1000) //em milisegundos
    } else {
      this.frequencia = 1000
    }
    console.log(this.frequencia)
  }
  create_trajeto() {
    console.log('velocidade m/s', this.velocidade)
    let payload = {
      user_id: this.user.id,
      tipo_veiculo: this.veiculo,
      nome_rodovia: this.rodovia,
      faixa: this.faixa,
      observacao: this.anotacoes,
      velocidade: this.velocidade / 3.6,
      espacamento: this.espacamento,
      km_inicio: this.km_inicio,
      km_fim: this.km_fim
    }
    console.log('payload', payload)
    this.calcula_frequencia()
    this._http.post(base_url + '/path', payload)
      .map(res => res.json())
      .toPromise()
      .then(res => {
        console.log('voltou do server', res)
        // return
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
    var subscription = this.deviceMotion.watchAcceleration({ frequency: this.frequencia })
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

    let subscription = this.gyroscope.watch({ frequency: this.frequencia })
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
    let tentativas = 5;
    this.controlador.add_orden('+1')
    this._http.post(base_url + sensor, payload)
      .toPromise()
      .then(() => { console.log('enviei:' + sensor); this.controlador.add_orden('-1') })
      .catch((err) => {
        console.log('erro ao envia:' + sensor + "\n erro:" + String(err))
        tentativas--;
        if (tentativas > 0) {
          this.envia_dados(sensor, payload)
        } else {
          this.controlador.add_orden('-1')
          this.falhas.push({ sensor: sensor, payload: payload })
        }
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
