
import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, Events, Button } from 'ionic-angular';
import { Http } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { base_url } from '../../app/config';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-perfil',
    templateUrl: 'perfil.html'
})
export class PerfilPage {
    user = this.NavParams.get('user')
    senha2 = (this.NavParams.get('user')).senha
    constructor(
        public navCtrl: NavController,
        public _http: Http,
        public NavParams: NavParams,
        public statusBar: StatusBar,
        public alertCtrl: AlertController,
        public events: Events,
        public _storage: Storage
    ) {

    }
    goToInicio() {
        this.navCtrl.pop()
    }
    erro() {
        this.alertCtrl.create({
            title: "Erro",
            subTitle: "Preencha o formulario",
            buttons: [{ text: "ok" }]
        }).present()
    }


    atualizar() {
        if (this.user.senha != this.senha2) {
            this.alertCtrl.create({
                title: "erro",
                subTitle: "senhas não combinam",
                buttons: [{ text: "ok" }]
            }).present();
            return;
        }
        this._http.put(base_url + "/user", this.user)
            .map(res => res.json())
            .toPromise()
            .then((res) => {
                console.log(res)
                if (res.erro) {
                    if ((res.erro).includes("ER_DUP_ENTRY")) {
                        this.alertCtrl.create({
                            title: "Erro",
                            subTitle: "Email ou celular já em uso",
                            buttons: [{ text: "ok" }]
                        }).present()
                    }
                } else {
                    console.log("entrou")
                    this.alertCtrl.create({
                        title: "Sucesso",
                        subTitle: "Atualizado",
                        buttons: [{ text: "ok" }]
                    }).present()
                    this._storage.set('user', this.user)
                    this.events.publish('user:set', this.user)
                    this.navCtrl.pop()
                }
            }).catch(err => {
                console.log(err)
                this.alertCtrl.create({
                    title: "Erro",
                    subTitle: "Tente novamente",
                    buttons: [{ text: "ok" }]
                }).present()
            })
    }




}
//console.log
