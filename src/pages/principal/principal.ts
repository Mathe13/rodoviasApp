import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { MapaPage } from '../mapa/mapa';
import { InstrucoesPage } from '../instrucoes/instrucoes';
import { base_url } from '../../app/config';
import { Storage } from '@ionic/storage';
import { InicioPage } from '../inicio/inicio';


@Component({
    selector: 'page-principal',
    templateUrl: 'principal.html'
})
export class PrincipalPage {
    site = base_url
    constructor(
        public navCtrl: NavController,
        public menuCtrl: MenuController,
        public _storage: Storage) {
        this.menuCtrl.enable(true, "myMenu")
    }

    logout() {
        this._storage.remove('user').then(() => {
            this.navCtrl.setRoot(InicioPage)
        }).catch(() => {
            this.logout()
        })
    }

    goToPainel() {
        this.navCtrl.push(InstrucoesPage)

        // this.navCtrl.push(PrincipalPage)
    }
    goToMapa() {
        this.navCtrl.push(MapaPage)
    }
}
