
import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { base_url } from '../../app/config';
import { LoginPage } from '../login/login';

@Component({
    selector: 'page-cadastro',
    templateUrl: 'cadastro.html'
})
export class CadastroPage {
    user = {
        nome: "",
        senha: "",
        celular: "",
        email: ""
    }
    constructor(
        public navCtrl: NavController,
        public _http: Http,
        public statusBar: StatusBar,
        public alertCtrl: AlertController
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
    cadastrar() {
        this._http.post(base_url + "/user", this.user)
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
                        subTitle: "Cadastro realizado",
                        buttons: [{ text: "ok" }]
                    }).present()
                    this.navCtrl.popToRoot()
                    this.navCtrl.push(LoginPage)
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
