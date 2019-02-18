import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing/';
import { Http } from '@angular/http';
import { base_url } from '../../app/config';


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
        public _share: SocialSharing,
        public _http: Http
    ) {
        console.log('data', this.data)
        this.data.forEach(leitura => {
            this.verifica_servidor(leitura)
        });
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
    async verifica_servidor(path) {
        this._http.get(base_url + '/path/detalhes/' + path.id)
            .map(res => res.json())
            .toPromise()
            .then((path_server) => {
                path_server = path_server[0]
                console.log('veio do server:', path_server)
                console.log('veio do sqlite', path)
                if (path_server.acelerometro.length != path.acelerometro.length) {
                    console.log('acelerometro diferente')
                    this.lida_acelerometro(path, path_server);
                }
                if (path_server.giroscopio.length != path.giroscopio.length) {
                    console.log('giroscopio diferente')
                    this.lida_giroscopio(path, path_server);

                }
                if (path_server.gps.length != path.gps.length) {
                    console.log('gps diferente')
                    this.lida_gps(path, path_server);

                }
            })
            .catch(err => { console.log(err) })
    }
    lida_acelerometro(path, path_server) {
        let achou = false;
        path.acelerometro.forEach(leitura => {
            path_server.acelerometro.forEach(leitura_server => {
                if (path.acelerometro.datahora == path_server.acelerometro.datahora) {
                    achou = true
                }
            });//fim da busca
            if (!achou) {
                let payload = {
                    trajeto_id: path.id,
                    x: leitura.x,
                    y: leitura.y,
                    z: leitura.z,
                    datahora: leitura.datahora
                }
                this.envia_dados('acelerometro', payload)
            }

        });
    }


    lida_giroscopio(path, path_server) {
        let achou = false;
        path.giroscopio.forEach(leitura => {
            path_server.giroscopio.forEach(leitura_server => {
                if (path.giroscopio.datahora == path_server.giroscopio.datahora) {
                    achou = true
                }
            });//fim da busca
            if (!achou) {
                let payload = {
                    trajeto_id: path.id,
                    x: leitura.x,
                    y: leitura.y,
                    z: leitura.z,
                    datahora: leitura.datahora
                }
                this.envia_dados('giroscopio', payload)
            }

        });
    }

    lida_gps(path, path_server) {
        let achou = false;
        path.gps.forEach(leitura => {
            path_server.gps.forEach(leitura_server => {
                if (path.gps.datahora == path_server.gps.datahora) {
                    achou = true
                }
            });//fim da busca
            if (!achou) {
                let payload = {
                    trajeto_id: path.id,
                    lat: leitura.lat,
                    lng: leitura.lng,
                    velocidade: leitura.velocidade,
                    altitude: leitura.altitude,
                    precisao_loc: leitura.precisao_loc,
                    precisao_alt: leitura.precisao_alt,
                    datahora: leitura.datahora
                }
                this.envia_dados('gps', payload)
            }

        });
    }


    async envia_dados(sensor, payload) {
        this._http.post(base_url + sensor, payload)
            .toPromise()
            .then(() => { console.log('enviei:' + sensor); })
            .catch((err) => {
                console.log('erro ao envia:' + sensor + "\n erro:" + String(err))
                this.envia_dados(sensor, payload)
            })
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