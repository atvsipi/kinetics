"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygon = void 0;
const Shape_1 = require("./Shape");
const Enums_1 = require("../typings/Enums");
class Polygon extends Shape_1.Shape {
    constructor() {
        super(...arguments);
        this.type = Enums_1.ShapeType.Polygon;
    }
}
exports.Polygon = Polygon;
//# sourceMappingURL=Polygon.js.map