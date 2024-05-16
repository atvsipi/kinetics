import type { Colors } from './Enums';
import type { ShapeForm } from './Interfaces';
import type { Shape } from '../shapes/Shape';
import type { Plugin } from '../plugin/Plugin';
import type { VectorLike } from '../utils/Vector';
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
/** The configuration for the camera. */
export interface CameraConfig {
    /** The position of the camera. Defaults to `{ x: 0, y: 0 }`. */
    position?: VectorLike;
    /** The measure of how zoomed in the camera is. Defaults to `1`. */
    zoom?: number;
}
/** The configuration for rendering. */
export interface SystemRenderingConfig {
    /** The canvas to draw on. */
    canvas: HTMLCanvasElement;
    /** The background color of the system. Defaults to `Colors.White`. */
    background?: Colors | string;
    /** The color of the grid. Defaults to `Colors.Black`. */
    gridColor?: Colors | string;
    /** The length of one side of the grid squares. If not provided, a grid will not be drawn. */
    gridSize?: number;
    /** The width of the gridlines. Defaults to `1`. */
    gridWidth?: number;
    /** Whether the renderer clears the screen or not. Defaults to `true`. */
    clear?: boolean;
    /** The hooks into the renderer. */
    hooks?: {
        /** The hooks to run before rendering. */
        preRender?: (context: CanvasRenderingContext2D) => void;
        /** The hooks to run after rendering. */
        postRender?: (context: CanvasRenderingContext2D) => void;
    };
}
/** The interface for rendering an shape. */
export interface ShapeRenderingConfig {
    /** The stroke color of the shape. If not specified, the shape will not be stroked. If neither fillColor nor strokeColor is specified, the shape will be stroked by `Colors.Black` */
    strokeColor?: Colors | string;
    /** The fill color of the shape. If not specified, the shape will not be filled. If neither fillColor nor strokeColor is specified, the shape will be stroked by `Colors.Black`. */
    fillColor?: Colors | string;
    /** The width of the stroke. Defaults to `1`. */
    strokeWidth?: number;
    /** The glow intensity of the shape. If not specified, the shape will not have a glow. */
    glowIntensity?: number;
    /** The glow color of the shape. If not specified, the shape will have the same glow as its stroke. */
    glowColor?: Colors | string;
    /** The hooks into the renderer. */
    hooks?: {
        /** The hooks to run before rendering the shape. */
        preRender?: (shape: Shape, context: CanvasRenderingContext2D) => void;
        /** The hooks to run after rendering the shape. */
        postRender?: (shape: Shape, context: CanvasRenderingContext2D) => void;
    };
}
/** The valid properties of the configuration of the system. */
export interface SystemConfig {
    collisionInfo: {
        /** The cell size of the collision engine (only applicable to hashgrids), which represents `2 ** x` game units. Default is `12`. */
        cellSize?: number;
    };
    /** The dimensions of the system. */
    dimensions?: VectorLike;
    /** The rate at which entities update (in FPS/Hz). Default is `60Hz`. */
    tickRate?: number;
    /** Whether or not verbose logs (such as warnings) should be logged. Default is `false`. */
    verbose?: boolean;
    /** The friction of the system when moving. Default is `0.1`. */
    friction?: number;
    /** The gravity of the system when moving. Default is `{x: 0, y: 0}`. */
    gravity?: VectorLike;
    /** The plugins of the system. */
    plugins?: Plugin[];
    /** The configuration of the camera. */
    camera?: CameraConfig;
    /** Rendering options for the system. */
    render?: SystemRenderingConfig;
}
