import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PrincipalPage } from '../principal/principal';

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
          
  close(){
    console.log('vai dar pop');
    // this.navCtrl.setRoot(CursosPage)
    // this.appCtrl.getRootNav().push(TabsPage)
    this.navCtrl.pop();
    this.navCtrl.push(PrincipalPage);
    // this.navCtrl.setRoot(DisponiveisPage)    
    // this.navCtrl.pop();
  }


}
