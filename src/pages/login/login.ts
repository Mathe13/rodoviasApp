
import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { base_url } from '../../app/config';
import { Storage } from '@ionic/storage';
import { PrincipalPage } from '../principal/principal';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})


export class LoginPage {
  usuario = { celular: "", senha: "" }

  constructor(
    public navCtrl: NavController,
    public _http: Http,
    public statusBar: StatusBar,
    public alertCtrl: AlertController,
    public _storage: Storage
  ) {
    statusBar.backgroundColorByHexString('#009fc1');
  }
  goToInicio() {
    this.navCtrl.pop()
  }
  doLogin() {
    if (this.usuario.celular.length < 14) {
      this.alertCtrl.create({
        title: 'Celular inválido',
        subTitle: 'Preencha corretamente',
        buttons: [{ text: 'ok' }]
      }).present();
      return;
    }
    let url = base_url + '/user/login?celular=' + this.usuario.celular + "&senha=" + this.usuario.senha;
    console.log(url)
    this._http.get(base_url + '/user/login?celular=' + this.usuario.celular + "&senha=" + this.usuario.senha)
      .map(res => res.json())
      .toPromise()
      .then((result) => {
        console.log('status', result.status)
        if (result.status == "Sucesso") {
          console.log('logou')
          this._storage.set('user', result.user)
          this.navCtrl.setRoot(PrincipalPage)
        } else {
          this.alertCtrl.create({
            title: "Erro",
            subTitle: result.status,
            buttons: [{ text: 'ok' }]
          }).present();
        }
      }).catch((err) => {
        console.log("cai no erro")
        console.log(err)

      });
  }




}
//console.log
