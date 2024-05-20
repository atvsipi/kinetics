"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Colors = exports.ShapeType = exports.Environment = exports.Movement = void 0;
/** Enum representing movement. */
var Movement;
(function (Movement) {
    Movement[Movement["Up"] = 0] = "Up";
    Movement[Movement["Down"] = 1] = "Down";
    Movement[Movement["Left"] = 2] = "Left";
    Movement[Movement["Right"] = 3] = "Right";
})(Movement || (exports.Movement = Movement = {}));
/** Enum representing the environment the program is running in. */
var Environment;
(function (Environment) {
    Environment[Environment["Browser"] = 0] = "Browser";
    Environment[Environment["Node"] = 1] = "Node";
    // Executable
})(Environment || (exports.Environment = Environment = {}));
/** Enum representing the geometric type of the entity. */
var ShapeType;
(function (ShapeType) {
    ShapeType[ShapeType["Generic"] = 0] = "Generic";
    ShapeType[ShapeType["Polygon"] = 1] = "Polygon";
    ShapeType[ShapeType["Circle"] = 2] = "Circle";
    ShapeType[ShapeType["Line"] = 3] = "Line";
})(ShapeType || (exports.ShapeType = ShapeType = {}));
/** Enum representing different colors. */
var Colors;
(function (Colors) {
    Colors["Pink"] = "#F177DD";
    Colors["LightRed"] = "#FC7677";
    Colors["Red"] = "#F14E54";
    Colors["Yellow"] = "#FFE869";
    Colors["Peach"] = "#FCC376";
    Colors["Orange"] = "#FFA500";
    Colors["Green"] = "#00E16E";
    Colors["BrightGreen"] = "#43FF91";
    Colors["NeonGreen"] = "#8AFF69";
    Colors["Blue"] = "#00B2E1";
    Colors["DarkBlue"] = "#768DFC";
    Colors["Purple"] = "#BF7FF5";
    Colors["Gray"] = "#C0C0C0";
    Colors["Black"] = "#000000";
    Colors["White"] = "#FFFFFF";
})(Colors || (exports.Colors = Colors = {}));
//# sourceMappingURL=Enums.js.map