import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http'
import { Storage } from '@ionic/storage';
import { base_url, sensorInterval } from '../../app/config';
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope';

export class sensores {

    constructor(
        private deviceMotion: DeviceMotion,
        private geolocation: Geolocation,
        private _http: Http,
        private _storage: Storage,
        private gyroscope: Gyroscope
    ) { }

    //loops
    async loop_gyroscope() {
        while (true) {
            try {
                var gyscope_data = await this.deviceMotion.getCurrentAcceleration();
                console.log(gyscope_data)
            } catch (e) {
                console.log(e); // 30
            }
        }
    }



    //envios
}