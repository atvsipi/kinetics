import System from './System';
import CollisionResolver from './collision/CollisionResolver';
import SpatialHashGrid from './collision/SpatialHashGrid';
import Body from './body/Body';
import Shape from './shapes/Shape';
import Polygon from './shapes/Polygon';
import Circle from './shapes/Circle';
import Line from './shapes/Line';
import Camera from './utils/Camera';
import Renderer from './utils/Renderer';
import Vector from './utils/Vector';
import { CameraConfig, SystemRenderingConfig, ShapeRenderingConfig, SystemConfig } from './typings/Config';
import { ShapeConfig, CircleConfig, ShapeForm, CollisionManager } from './typings/Interfaces';
import { Movement, Environment, ShapeType, Colors } from './typings/Enums';
export { System };
export { Body };
export { Shape, Polygon, Circle, Line };
export declare const Collision: {
    CollisionResolver: typeof CollisionResolver;
    SpatialHashGrid: typeof SpatialHashGrid;
};
export { Camera, Renderer, Vector };
export { CameraConfig, SystemRenderingConfig, ShapeRenderingConfig, SystemConfig, ShapeConfig, CircleConfig, ShapeForm, CollisionManager };
export { Movement, Environment, ShapeType, Colors };
//# sourceMappingURL=Index.d.ts.map