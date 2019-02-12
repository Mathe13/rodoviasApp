import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing/';


@Component({
    selector: 'page-leituras',
    templateUrl: 'leituras.html'
})
export class LeiturasPage {
    data = this._params.get('data')
    ids = new Array()

    constructor(
        public navCtrl: NavController,
        public _params: NavParams,
        public _storage: Storage,
        public alerCtrl: AlertController,
        public _share: SocialSharing
    ) {
        console.log('data', this.data)
    }
    toString(dados) {
        let str = JSON.stringify(dados, undefined, 2)
        //.replace('",', '",<br>');
        console.log('str', str)
        return str
    }
    compartilhar(msg) {
        console.log('share', msg)
        this._share.shareWithOptions({ message: msg })
            .then(() => {
                console.log('shared')
            })
            .catch(err => console.log(err))
    }
    ApagarLeituras() {
        this.alerCtrl.create({
            title: "Tem certeza?",
            subTitle: "não é possivel desfazer essa ação",
            buttons: [
                {
                    text: "sim", handler: () => {
                        this._storage.remove('leituras').then(() => {
                            this._storage.set('leituras', [])
                            this.navCtrl.pop()
                        }).catch(e => {
                            console.log(e)
                        })
                    }
                },
                { text: "não" }]
        }).present()
    }
    verifica(d) {
        var found = false;
        for (var i = 0; i < this.ids.length && !found; i++) {
            if (this.ids[i] === d.id) {
                found = true;
                break;
            }
        }
        return found
    }

    ativa(id) {
        this.ids.push(id)
        console.log("ativa", this.ids)
    }
    desativa(id) {
        for (var i = 0; i < this.ids.length; i++) {
            if (this.ids[i] === id) {
                this.ids.splice(i, 1)
                break;
            }
        }
    }
}