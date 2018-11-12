export interface dados {
    accelerometer: cartesian_coordinates;
    accelerometer_variation: cartesian_coordinates;
    location: location;
    gyroscope: cartesian_coordinates;
    gyroscope_variation: cartesian_coordinates;
    speed: number;
    aceleration: number;
}

export function registro(): dados {
    return {
        accelerometer: cartesian_coordinates(),
        accelerometer_variation: cartesian_coordinates(),
        gyroscope: cartesian_coordinates(),
        gyroscope_variation: cartesian_coordinates(),
        location: location(),
        speed: 0,
        aceleration: 0,

    }
}

// export type accelerometer = {
//     coordinates: cartesian_coordinates
// }
// export type accelerometer_variation = {
//     coordinates: cartesian_coordinates
// }
export type location = {
    lat: number
    lng: number
}
export function location(): location {
    return {
        lat: 0,
        lng: 0
    }
}
export type cartesian_coordinates = {
    x: number
    y: number
    z: number
}
export function cartesian_coordinates(): cartesian_coordinates {
    return {
        x: 0,
        y: 0,
        z: 0
    }
}
