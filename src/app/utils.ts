import { cartesian_coordinates, registro } from './types';

export class utils {
    utils() { }

    static haversineDistance(latlngA, latlngB, isMiles) {
        const toRad = x => (x * Math.PI) / 180;
        const R = 6371; // km raio da terra

        const dLat = toRad(latlngB[0] - latlngA[0]);
        const dLatSin = Math.sin(dLat / 2);
        const dLon = toRad(latlngB[1] - latlngA[1]);
        const dLonSin = Math.sin(dLon / 2);

        const a = (dLatSin * dLatSin) +
            (Math.cos(toRad(latlngA[1])) * Math.cos(toRad(latlngB[1])) * dLonSin * dLonSin);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let distance = R * c;

        if (isMiles) distance /= 1.60934;

        return distance;
    }

    static coordinates_variation(a: cartesian_coordinates, b: cartesian_coordinates): cartesian_coordinates {
        let c = cartesian_coordinates()
        c.x = b.x - a.x
        c.y = b.y - a.z
        c.z = b.z - a.z
        return c
    }

}
