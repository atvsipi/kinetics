import { System } from '../System';
import { Vector, VectorLike } from './Vector';
import { Body } from '../body/Body';
import { CameraConfig } from '../typings/Config';
/** A representation of the view of the system. */
export declare class Camera {
    /** The system the camera is representing. */
    system: System;
    /** The position the camera is centered at. */
    position: Vector;
    /** The measure of how zoomed out the camera is. */
    zoom: number;
    /** Sets the camera's center position. */
    setCenter(position: VectorLike): void;
    /** Sets the camera's center body. */
    setCenterBody(body: Body): void;
    /** Gets the system coordinates of a client MouseEvent. */
    getSystemCoordinates(clientCoordinates: VectorLike): void;
    constructor({ position, zoom }: CameraConfig, system: System);
}
