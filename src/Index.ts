import {System} from './System';

import {CollisionResolver} from './collision/CollisionResolver';
import {SpatialHashGrid} from './collision/SpatialHashGrid';

import {Body} from './body/Body';

import {Shape} from './shapes/Shape';
import {Polygon} from './shapes/Polygon';
import {Circle} from './shapes/Circle';
import {Line} from './shapes/Line';

import {Camera} from './utils/Camera';
import {Renderer} from './utils/Renderer';
import {Vector, type VectorLike} from './utils/Vector';

import {Plugin} from './plugin/Plugin';

import {ShapeConfig, CircleConfig, CameraConfig, SystemRenderingConfig, ShapeRenderingConfig, SystemConfig} from './typings/Config';
import {ShapeForm, CollisionManager} from './typings/Interfaces';

import {Movement, Environment, ShapeType, Colors} from './typings/Enums';

// Check if the code is running in a web browser environment
const isWebEnvironment = typeof window !== 'undefined';

// SYSTEM
export {System};

// B O D Y
export {Body};

// B O D I E S
export {Shape, Polygon, Circle, Line};

// C O L L I S I O N
export const Collision = {CollisionResolver, SpatialHashGrid};

// U T I L S
export {Camera, Renderer, Vector, VectorLike};

// P L U G I N S
export {Plugin};

// I N T E R F A C E S
export {CameraConfig, SystemRenderingConfig, ShapeRenderingConfig, SystemConfig, ShapeConfig, CircleConfig, ShapeForm, CollisionManager};

// E N U M S
export {Movement, Environment, ShapeType, Colors};

// Attach the exports to the `window` object in a web environment
if (isWebEnvironment) {
    /** @ts-ignore */
    window.Kinetics = {
        System,
        Body,
        Shape,
        Polygon,
        Circle,
        Line,
        Collision,
        Camera,
        Renderer,
        Vector,
        Plugin,
        Movement,
        Environment,
        ShapeType,
        Colors,
    };
}
