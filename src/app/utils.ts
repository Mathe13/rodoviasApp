import { cartesian_coordinates, registro } from './types';

export class utils {
    utils() { }

    static haversineDistance(latlngA, latlngB) {
        console.log('Distancia recebe', latlngA, latlngB)
        const toRad = x => (x * Math.PI) / 180;
        const R = 6371; // km raio da terra

        const dLat = toRad(parseFloat(latlngB.lat) - parseFloat(latlngA.lat));
        const dLatSin = Math.sin(dLat / 2);
        const dLon = toRad(parseFloat(latlngB.lng) - parseFloat(latlngA.lng));
        const dLonSin = Math.sin(dLon / 2);
        console.log('distancia calcula', dLat, dLatSin, dLon, dLonSin)

        const a = (dLatSin * dLatSin) +
            (Math.cos(toRad(parseFloat(latlngB.lng))) * Math.cos(toRad(parseFloat(latlngB.lng))) * dLonSin * dLonSin);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let distance = R * c;

        // if (isMiles) distance /= 1.60934;
        console.log('distancia:', distance)
        return distance;
    }

    static coordinates_variation(a: cartesian_coordinates, b: cartesian_coordinates): cartesian_coordinates {
        console.log("a:", a, "b:", b)
        let c = cartesian_coordinates()
        c.x = b.x - a.x
        c.y = b.y - a.y
        c.z = b.z - a.z
        console.log('variacao', c)
        return c
    }

}
