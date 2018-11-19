import { PrincipalPage } from './../principal/principal';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MapaPage } from '../mapa/mapa';

@Component({
    selector: 'page-inicio',
    templateUrl: 'inicio.html'
})
export class InicioPage {

    constructor(public navCtrl: NavController) {

    }


    goToPainel() {
        this.navCtrl.push(PrincipalPage)
    }
    goToMapa() {
        this.navCtrl.push(MapaPage)
    }
}
