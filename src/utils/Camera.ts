import {System} from '../System';
import {Vector, VectorLike} from './Vector';
import {Body} from '../body/Body';

import {CameraConfig} from '../typings/Config';

/** A representation of the view of the system. */
export class Camera {
    /** The system the camera is representing. */
    public system: System;
    /** The position the camera is centered at. */
    public position = new Vector(0, 0);
    /** The measure of how zoomed out the camera is. */
    public zoom = 1;

    /** Sets the camera's center position. */
    public setCenter(position: VectorLike): void {
        this.position.x = position.x;
        this.position.y = position.y;
    }

    /** Sets the camera's center body. */
    public setCenterBody(body: Body) {
        this.position = body.shape.position;
    }

    /** Gets the system coordinates of a client MouseEvent. */
    public getSystemCoordinates(clientCoordinates: VectorLike) {}

    constructor({position, zoom}: CameraConfig, system: System) {
        this.setCenter(position || new Vector(0, 0));
        this.zoom = zoom || 1;
        this.system = system;
    }
}
