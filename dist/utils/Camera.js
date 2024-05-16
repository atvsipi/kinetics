"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = void 0;
const Vector_1 = require("./Vector");
/** A representation of the view of the system. */
class Camera {
    /** Sets the camera's center position. */
    setCenter(position) {
        this.position.x = position.x;
        this.position.y = position.y;
    }
    /** Sets the camera's center body. */
    setCenterBody(body) {
        this.position = body.shape.position;
    }
    /** Gets the system coordinates of a client MouseEvent. */
    getSystemCoordinates(clientCoordinates) { }
    constructor({ position, zoom }, system) {
        /** The position the camera is centered at. */
        this.position = new Vector_1.Vector(0, 0);
        /** The measure of how zoomed out the camera is. */
        this.zoom = 1;
        this.setCenter(position || new Vector_1.Vector(0, 0));
        this.zoom = zoom || 1;
        this.system = system;
    }
}
exports.Camera = Camera;
//# sourceMappingURL=Camera.js.map