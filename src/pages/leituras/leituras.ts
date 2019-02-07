import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
// import { SocialSharing } from '@ionic-native/social-sharing/ngx';


@Component({
    selector: 'page-leituras',
    templateUrl: 'leituras.html'
})
export class LeiturasPage {
    // data = this._params.get('data')
    ids = new Array()
    data = [
        {


            id: 18,
            user_id: 60,
            incio: null,
            fim: null,
            hora_inicio: "2019-02-04T18:09:06.000Z",
            hora_fim: null,
            tipo_veiculo: 1,
            nome_rodovia: "R. Cenair Maicá, 100 - Jardim dos Lagos, Guaí",
            faixa: "",
            observacao: "",
            recebido: "2019-02-04T18:09:06.000Z",
            gps: [
                {
                    id: 142,
                    lat: "-30.1158965",
                    lng: "-51.3688749",
                    desc: null,
                    datahora: "2019-02-04T18:09:24.000Z",
                    trajeto_id: 18,
                    velocidade: "null",
                    altitude: "null",
                    precisao_loc: "39.81999969482422",
                    precisao_alt: "null",
                    recebido: "2019-02-04T18:09:07.000Z"
                }

            ],
            giroscopio: [
                {
                    id: 184,
                    x: 0,
                    y: 0,
                    z: 0,
                    datahora: "2019-02-04T19:43:39.000Z",
                    trajeto_id: 25,
                    recebido: "2019-02-04T19:43:22.000Z"
                }
            ]
        },
        {


            id: 19,
            user_id: 60,
            incio: null,
            fim: null,
            hora_inicio: "2019-02-04T18:09:06.000Z",
            hora_fim: null,
            tipo_veiculo: 1,
            nome_rodovia: "R. Cenair Maicá, 100 - Jardim dos Lagos, Guaí",
            faixa: "",
            observacao: "",
            recebido: "2019-02-04T18:09:06.000Z",
            gps: [
                {
                    id: 142,
                    lat: "-30.1158965",
                    lng: "-51.3688749",
                    desc: null,
                    datahora: "2019-02-04T18:09:24.000Z",
                    trajeto_id: 18,
                    velocidade: "null",
                    altitude: "null",
                    precisao_loc: "39.81999969482422",
                    precisao_alt: "null",
                    recebido: "2019-02-04T18:09:07.000Z"
                }

            ],
            giroscopio: [
                {
                    id: 184,
                    x: 0,
                    y: 0,
                    z: 0,
                    datahora: "2019-02-04T19:43:39.000Z",
                    trajeto_id: 25,
                    recebido: "2019-02-04T19:43:22.000Z"
                }
            ]
        }

    ]
    constructor(
        public navCtrl: NavController,
        public _params: NavParams,
        public _storage: Storage,
        public alerCtrl: AlertController,
        // public _share: SocialSharing
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