import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { MapaPage } from '../mapa/mapa';
import { InstrucoesPage } from '../instrucoes/instrucoes';

@Component({
    selector: 'page-principal',
    templateUrl: 'principal.html'
})
export class PrincipalPage {

    constructor(
        public navCtrl: NavController,
        public menuCtrl: MenuController) {
        this.menuCtrl.enable(true, "myMenu")
    }



    goToPainel() {
        this.navCtrl.push(InstrucoesPage)

        // this.navCtrl.push(PrincipalPage)
    }
    goToMapa() {
        this.navCtrl.push(MapaPage)
    }
}
