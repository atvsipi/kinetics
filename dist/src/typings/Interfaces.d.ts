import Shape from '../shapes/Shape';
import Vector, { VectorLike } from '../utils/Vector';
import { ShapeRenderingConfig } from './Config';
/** Represents the methods required in a collision manager. */
export interface CollisionManager {
    /** Inserts an shape into the collision manager. */
    insert(x: number, y: number, w: number, h: number, id: number): void;
    /** Queries the entire system, and automatically detects/resolves collisions. */
    query(): void;
    /** Clears the collision manager. */
    clear(): void;
}
export interface ShapeForm {
    /** The number of sides of the shape. */
    sides?: number;
    /** The radius of the shape. */
    radius?: number;
    /** The rotation of the shape. */
    rotation?: number;
    /** The center offset of the shape. */
    offset?: VectorLike;
    /** The vertices of the shape (or compounded shapes) (in clockwise order). */
    vertices?: Vector[];
    /** The components of the shape. */
    components?: (ShapeConfig | CircleConfig | LineConfig)[];
}
/** Represents the information for a generic Shape. */
export interface ShapeConfig {
    /** The form of the shape. */
    form: ShapeForm;
    /** The speed of the Shape. */
    speed: number;
    /** The mass of the Shape. */
    mass: number;
    /** The elasticity of the Shape. */
    elasticity: number;
    /** Whether or not the shape is static. Defaults to `false`. */
    static?: boolean;
    /** The angular speed of the shape. Defaults to `0`. */
    angularSpeed?: number;
    /** Whether or not the shape should be able to rotate. Defaults to `true`. */
    rotate?: boolean;
    /** The threshold for the linear and angular velocities to put the shape to sleep. */
    sleepThreshold?: number;
    /** Rendering options for the shape. */
    render?: ShapeRenderingConfig;
    /** The hooks into collision resolution. */
    hooks?: {
        /** The hooks to run before resolving collisions. */
        preResolve?: (shape: Shape) => void;
        /** The hooks to run after resolving collisions. */
        postResolve?: (shape: Shape) => void;
    };
}
/** Represents the information for a circle. */
export interface CircleConfig extends ShapeConfig {
    /** The radius of the circle. */
    radius: number;
}
/** Represents the information for a Line. */
export interface LineConfig extends ShapeConfig {
    /** The x-component of the end of the line. */
    endX: number;
    /** The y-component of the end of the line. */
    endY: number;
}
//# sourceMappingURL=Interfaces.d.ts.map