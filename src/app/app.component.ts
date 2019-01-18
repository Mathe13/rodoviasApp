import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
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
  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public _storage: Storage,
  ) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this._storage.get('user').then((user) => {
      if (user.nome) {
        this.navCtrl.setRoot(PrincipalPage)
      }
    }).catch(err => {
      console.log(err)
    })
  }
  logout() {
    this._storage.remove('user').then(() => {
      this.navCtrl.setRoot(InicioPage)
    }).catch(() => {
      this.logout()
    })
  }
}
