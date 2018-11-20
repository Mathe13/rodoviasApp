import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { MapaPage } from '../pages/mapa/mapa';
import { ContactPage } from '../pages/contact/contact';
import { PrincipalPage } from './../pages/principal/principal';
import { InicioPage } from './../pages/inicio/inicio';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//importados
import { Gyroscope } from '@ionic-native/gyroscope';
import { Geolocation } from '@ionic-native/geolocation';
import { DeviceMotion } from '@ionic-native/device-motion';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise'
import { HistoricoPage } from '../pages/historico/historico';
import { InstrucoesPage } from '../pages/instrucoes/instrucoes';

@NgModule({
  declarations: [
    MyApp,
    MapaPage,
    ContactPage,
    PrincipalPage,
    HistoricoPage,
    InicioPage,
    InstrucoesPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapaPage,
    ContactPage,
    PrincipalPage,
    HistoricoPage,
    InicioPage,
    InstrucoesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    DeviceMotion,
    Gyroscope,

    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
