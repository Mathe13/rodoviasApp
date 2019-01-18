
import { Component } from '@angular/core';
import { NavController, } from 'ionic-angular';
import { Http } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';

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
  ) {
    statusBar.backgroundColorByHexString('#009fc1');
  }
  goToInicio() {
    this.navCtrl.pop()
  }




}
//console.log
