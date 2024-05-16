import { System } from './System';
import { CollisionResolver } from './collision/CollisionResolver';
import { SpatialHashGrid } from './collision/SpatialHashGrid';
import { Body } from './body/Body';
import { Shape } from './shapes/Shape';
import { Polygon } from './shapes/Polygon';
import { Circle } from './shapes/Circle';
import { Line } from './shapes/Line';
import { Camera } from './utils/Camera';
import { Renderer } from './utils/Renderer';
import { Vector, type VectorLike } from './utils/Vector';
import { Plugin } from './plugin/Plugin';
import { ShapeConfig, CircleConfig, CameraConfig, SystemRenderingConfig, ShapeRenderingConfig, SystemConfig } from './typings/Config';
import { ShapeForm, CollisionManager } from './typings/Interfaces';
import { Movement, Environment, ShapeType, Colors } from './typings/Enums';
export { System };
export { Body };
export { Shape, Polygon, Circle, Line };
export declare const Collision: {
    CollisionResolver: typeof CollisionResolver;
    SpatialHashGrid: typeof SpatialHashGrid;
};
export { Camera, Renderer, Vector, VectorLike };
export { Plugin };
export { CameraConfig, SystemRenderingConfig, ShapeRenderingConfig, SystemConfig, ShapeConfig, CircleConfig, ShapeForm, CollisionManager };
export { Movement, Environment, ShapeType, Colors };
//# sourceMappingURL=Index.d.ts.map