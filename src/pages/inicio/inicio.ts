
import { Component } from '@angular/core';
import { NavController, MenuController, Events, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';

@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html'
})
export class InicioPage {

  constructor(
    public navCtrl: NavController,
    public _menu: MenuController,
    public events: Events,
    public alertCtrl: AlertController,
    public _http: Http,
    public statusBar: StatusBar,
  ) {
    statusBar.backgroundColorByHexString('#009fc1');
  }
  goToSignup(params) {
    if (!params) params = {};
    // this.navCtrl.push(Cadastro1Page);
  }
  goToLogin(params) {
    if (!params) params = {};
    // this.navCtrl.push(LoginPage);
  }
  ionViewWillEnter() {
    this.statusBar.backgroundColorByHexString('#009fc1');
    this._menu.enable(false)

  }



}
//console.log
