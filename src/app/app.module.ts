import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { MapaPage } from '../pages/mapa/mapa';
import { ContactPage } from '../pages/contact/contact';
import { PrincipalPage } from './../pages/principal/principal';
import { InstrucoesPage } from '../pages/instrucoes/instrucoes';
import { HistoricoPage } from '../pages/historico/historico';
import { ColetaPage } from '../pages/coleta/coleta';
import { InicioPage } from '../pages/inicio/inicio';
import { LoginPage } from '../pages/login/login';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//importados
import { IonicStorageModule } from '@ionic/storage';
import { Gyroscope } from '@ionic-native/gyroscope';
import { Geolocation } from '@ionic-native/geolocation';
import { DeviceMotion } from '@ionic-native/device-motion';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise'
import { BrMaskerModule } from 'brmasker-ionic-3';
import { CadastroPage } from '../pages/cadastro/cadastro';
import { PerfilPage } from '../pages/perfil/perfil';

@NgModule({
  declarations: [
    MyApp,
    MapaPage,
    ContactPage,
    PrincipalPage,
    HistoricoPage,
    PrincipalPage,
    ColetaPage,
    InicioPage,
    LoginPage,
    InstrucoesPage,
    CadastroPage,
    PerfilPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrMaskerModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapaPage,
    ContactPage,
    PrincipalPage,
    HistoricoPage,
    PrincipalPage,
    ColetaPage,
    InicioPage,
    LoginPage,
    InstrucoesPage,
    CadastroPage,
    PerfilPage
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
