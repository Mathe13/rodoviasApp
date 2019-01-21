import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InicioPage } from '../pages/inicio/inicio';
import { Storage } from '@ionic/storage';
import { PrincipalPage } from '../pages/principal/principal';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
  rootPage: any = InicioPage;
  user = { nome: "nome" }
  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public _storage: Storage,
    public events: Events
  ) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.checa_user()


    this.events.subscribe('user:set', (retorno) => {
      this.user = retorno
    });
  }
  logout() {
    this._storage.remove('user').then(() => {
      this.navCtrl.setRoot(InicioPage)
    }).catch(() => {
      this.logout()
    })
  }
  checa_user() {
    this._storage.get('user').then((res) => {
      if (res.nome) {
        this.user = res
        this.navCtrl.setRoot(PrincipalPage)
        console.log("achou this", this.user)
      }
    }).catch(err => {
      console.log(err)
    })
  }
}
