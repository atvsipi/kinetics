"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Colors = exports.ShapeType = exports.Environment = exports.Movement = exports.Plugin = exports.Vector = exports.Renderer = exports.Camera = exports.Collision = exports.Line = exports.Circle = exports.Polygon = exports.Shape = exports.Body = exports.System = void 0;
const System_1 = require("./System");
Object.defineProperty(exports, "System", { enumerable: true, get: function () { return System_1.System; } });
const CollisionResolver_1 = require("./collision/CollisionResolver");
const SpatialHashGrid_1 = require("./collision/SpatialHashGrid");
const Body_1 = require("./body/Body");
Object.defineProperty(exports, "Body", { enumerable: true, get: function () { return Body_1.Body; } });
const Shape_1 = require("./shapes/Shape");
Object.defineProperty(exports, "Shape", { enumerable: true, get: function () { return Shape_1.Shape; } });
const Polygon_1 = require("./shapes/Polygon");
Object.defineProperty(exports, "Polygon", { enumerable: true, get: function () { return Polygon_1.Polygon; } });
const Circle_1 = require("./shapes/Circle");
Object.defineProperty(exports, "Circle", { enumerable: true, get: function () { return Circle_1.Circle; } });
const Line_1 = require("./shapes/Line");
Object.defineProperty(exports, "Line", { enumerable: true, get: function () { return Line_1.Line; } });
const Camera_1 = require("./utils/Camera");
Object.defineProperty(exports, "Camera", { enumerable: true, get: function () { return Camera_1.Camera; } });
const Renderer_1 = require("./utils/Renderer");
Object.defineProperty(exports, "Renderer", { enumerable: true, get: function () { return Renderer_1.Renderer; } });
const Vector_1 = require("./utils/Vector");
Object.defineProperty(exports, "Vector", { enumerable: true, get: function () { return Vector_1.Vector; } });
const Plugin_1 = require("./plugin/Plugin");
Object.defineProperty(exports, "Plugin", { enumerable: true, get: function () { return Plugin_1.Plugin; } });
const Enums_1 = require("./typings/Enums");
Object.defineProperty(exports, "Movement", { enumerable: true, get: function () { return Enums_1.Movement; } });
Object.defineProperty(exports, "Environment", { enumerable: true, get: function () { return Enums_1.Environment; } });
Object.defineProperty(exports, "ShapeType", { enumerable: true, get: function () { return Enums_1.ShapeType; } });
Object.defineProperty(exports, "Colors", { enumerable: true, get: function () { return Enums_1.Colors; } });
// Check if the code is running in a web browser environment
const isWebEnvironment = typeof window !== 'undefined';
// C O L L I S I O N
exports.Collision = { CollisionResolver: CollisionResolver_1.CollisionResolver, SpatialHashGrid: SpatialHashGrid_1.SpatialHashGrid };
// Attach the exports to the `window` object in a web environment
if (isWebEnvironment) {
    /** @ts-ignore */
    window.Kinetics = {
        System: System_1.System,
        Body: Body_1.Body,
        Shape: Shape_1.Shape,
        Polygon: Polygon_1.Polygon,
        Circle: Circle_1.Circle,
        Line: Line_1.Line,
        Collision: exports.Collision,
        Camera: Camera_1.Camera,
        Renderer: Renderer_1.Renderer,
        Vector: Vector_1.Vector,
        Plugin: Plugin_1.Plugin,
        Movement: Enums_1.Movement,
        Environment: Enums_1.Environment,
        ShapeType: Enums_1.ShapeType,
        Colors: Enums_1.Colors,
    };
}
//# sourceMappingURL=Index.js.map