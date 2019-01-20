
import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { Http } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { LoginPage } from '../login/login';
import { CadastroPage } from '../cadastro/cadastro';

@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html'
})
export class InicioPage {
  constructor(
    public navCtrl: NavController,
    public _http: Http,
    public statusBar: StatusBar,
    public menuCtrl: MenuController
  ) {
    statusBar.backgroundColorByHexString('#009fc1');
    this.menuCtrl.enable(false, 'myMenu')
  }
  goToSignup(params) {
    if (!params) params = {};
    this.navCtrl.push(CadastroPage)
  }
  goToLogin(params) {
    if (!params) params = {};
    this.navCtrl.push(LoginPage);
  }
  ionViewWillEnter() {
    this.statusBar.backgroundColorByHexString('#009fc1');
    // this._menu.enable(false)

  }



}
//console.log
