import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ColetaPage } from '../coleta/coleta';

@Component({
  selector: 'page-instrucoes',
  templateUrl: 'instrucoes.html',
})
export class InstrucoesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad InstrucoesPage');
  }

  close() {
    console.log('vai dar pop');
    // this.navCtrl.setRoot(CursosPage)
    // this.appCtrl.getRootNav().push(TabsPage)
    this.navCtrl.pop().then(() => {
      this.navCtrl.push(ColetaPage);
    })
    // this.navCtrl.setRoot(DisponiveisPage)    
    // this.navCtrl.pop();
  }


}
