/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 948:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventEmitter = void 0;
/** Polyfill for an event emitter. */
class EventEmitter {
    constructor() {
        this.events = {};
    }
    /** Adds a listener for an event. */
    on(event, listener) {
        if (!this.events[event])
            this.events[event] = [];
        this.events[event].push(listener);
    }
    /** Emits an event. */
    emit(event, ...args) {
        if (!this.events[event])
            return;
        for (const listener of this.events[event]) {
            listener(...args);
        }
    }
}
exports.EventEmitter = EventEmitter;


/***/ }),

/***/ 876:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Colors = exports.ShapeType = exports.Environment = exports.Movement = exports.Plugin = exports.Vector = exports.Renderer = exports.Camera = exports.Collision = exports.Line = exports.Circle = exports.Polygon = exports.Shape = exports.Body = exports.System = void 0;
const System_1 = __webpack_require__(799);
Object.defineProperty(exports, "System", ({ enumerable: true, get: function () { return System_1.System; } }));
const CollisionResolver_1 = __webpack_require__(801);
const SpatialHashGrid_1 = __webpack_require__(847);
const Body_1 = __webpack_require__(989);
Object.defineProperty(exports, "Body", ({ enumerable: true, get: function () { return Body_1.Body; } }));
const Shape_1 = __webpack_require__(22);
Object.defineProperty(exports, "Shape", ({ enumerable: true, get: function () { return Shape_1.Shape; } }));
const Polygon_1 = __webpack_require__(837);
Object.defineProperty(exports, "Polygon", ({ enumerable: true, get: function () { return Polygon_1.Polygon; } }));
const Circle_1 = __webpack_require__(459);
Object.defineProperty(exports, "Circle", ({ enumerable: true, get: function () { return Circle_1.Circle; } }));
const Line_1 = __webpack_require__(569);
Object.defineProperty(exports, "Line", ({ enumerable: true, get: function () { return Line_1.Line; } }));
const Camera_1 = __webpack_require__(703);
Object.defineProperty(exports, "Camera", ({ enumerable: true, get: function () { return Camera_1.Camera; } }));
const Renderer_1 = __webpack_require__(959);
Object.defineProperty(exports, "Renderer", ({ enumerable: true, get: function () { return Renderer_1.Renderer; } }));
const Vector_1 = __webpack_require__(875);
Object.defineProperty(exports, "Vector", ({ enumerable: true, get: function () { return Vector_1.Vector; } }));
const Plugin_1 = __webpack_require__(135);
Object.defineProperty(exports, "Plugin", ({ enumerable: true, get: function () { return Plugin_1.Plugin; } }));
const Enums_1 = __webpack_require__(537);
Object.defineProperty(exports, "Movement", ({ enumerable: true, get: function () { return Enums_1.Movement; } }));
Object.defineProperty(exports, "Environment", ({ enumerable: true, get: function () { return Enums_1.Environment; } }));
Object.defineProperty(exports, "ShapeType", ({ enumerable: true, get: function () { return Enums_1.ShapeType; } }));
Object.defineProperty(exports, "Colors", ({ enumerable: true, get: function () { return Enums_1.Colors; } }));
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


/***/ }),

/***/ 799:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.System = void 0;
const Enums_1 = __webpack_require__(537);
const Error_1 = __webpack_require__(285);
const SpatialHashGrid_1 = __webpack_require__(847);
const CollisionResolver_1 = __webpack_require__(801);
const Camera_1 = __webpack_require__(703);
const Renderer_1 = __webpack_require__(959);
const EventEmitter_1 = __webpack_require__(948);
const Vector_1 = __webpack_require__(875);
/** The area upon which the engine is operating on. */
class System extends EventEmitter_1.EventEmitter {
    /** Gets the momentum of the system. */
    get momentum() {
        let momentum = 0;
        for (const body of this.bodys) {
            if (!body)
                continue;
            momentum += body.velocity.magnitude * body.shape.mass + Math.abs(body.shape.angularVelocity * body.shape.inertia) * body.shape.mass;
        }
        return momentum;
    }
    /** Gets the kinetic energy of the system. */
    get kineticEnergy() {
        let energy = 0;
        for (const body of this.bodys) {
            if (!body)
                continue;
            energy += 0.5 * body.shape.mass * (body.velocity.magnitude * body.velocity.magnitude);
        }
        return energy;
    }
    /** Gets the next available ID. */
    get nextId() {
        const idx = this.bodys.indexOf(undefined);
        if (idx !== -1)
            return idx;
        return this.bodys.length;
    }
    constructor(config) {
        var _a, _b;
        super();
        /** The width of the system. */
        this.width = null;
        /** The height of the system. */
        this.height = null;
        /** The friction in the system. */
        this.friction = 0.1;
        /** The gravity in the system. */
        this.gravity = new Vector_1.Vector(0, 0);
        /** The plugins of the system. */
        this.plugins = [];
        /** The engine which detects and resolves collisions. */
        this.CollisionResolver = new CollisionResolver_1.CollisionResolver();
        /** The bodys in the system. */
        this.bodys = [];
        /** Flag for logging messages to console. */
        this.verbose = false;
        /** The amount of ticks elapsed since the start of the engine. */
        this.tick = 0;
        /** The amount of tick cycles that occur in one second. */
        this.tickRate = 0;
        /** The environment the system is running in. */
        this.environment = Enums_1.Environment.Browser;
        /** The performance of the system. */
        this.performance = {
            /** The time it takes for a world update. */
            worldUpdateRate: 0,
            /** The amount of memory used, in bytes. */
            memoryUsage: 0,
        };
        this.environment = typeof window === 'undefined' ? Enums_1.Environment.Node : Enums_1.Environment.Browser;
        this.config = config;
        this.width = ((_a = config.dimensions) === null || _a === void 0 ? void 0 : _a.x) || null;
        this.height = ((_b = config.dimensions) === null || _b === void 0 ? void 0 : _b.y) || null;
        if ((this.width && !this.height) || (this.height && !this.width))
            throw new Error_1.ConfigurationError('Both dimensions must be specified for the system.');
        this.friction = config.friction || 0.1;
        this.gravity = config.gravity || new Vector_1.Vector(0, 0);
        this.plugins = config.plugins || [];
        this.camera = new Camera_1.Camera(config.camera || {}, this);
        if (config.render && config.render.canvas)
            this.renderer = new Renderer_1.Renderer(config.render, this);
        this.verbose = config.verbose || false;
        if (!config.collisionInfo)
            throw new Error_1.ConfigurationError('Collision information must be specified for the system.');
        this.CollisionManager = new SpatialHashGrid_1.SpatialHashGrid(this, config.collisionInfo.cellSize || 12);
        if (this.verbose)
            console.log('[PHYSICS]: Engine started.');
        /** Handle ticksystem. */
        if (this.environment === Enums_1.Environment.Browser) {
            requestAnimationFrame(this.update.bind(this));
            return;
        }
        this.tickRate = config.tickRate || 60;
        setInterval(this.update.bind(this), 1000 / this.tickRate);
        // if (config.useRAF) requestAnimationFrame(this.update.bind(this));
        // else {
        //     this.tickRate = config.tickRate || 60;
        //     setInterval(this.update.bind(this), 1000 / this.tickRate);
        // }
    }
    /** Sets the collision engine. */
    setCollisionEngine(engine) {
        this.CollisionManager = engine;
    }
    update() {
        var _a;
        const time = performance.now();
        this.CollisionManager.clear();
        for (const body of this.bodys) {
            if (!body)
                return;
            this.CollisionManager.insert(body.shape.bounds.min.x, body.shape.bounds.min.y, body.shape.hitbox.x, body.shape.hitbox.y, body.id);
            body.update();
        }
        this.CollisionManager.query();
        for (const plugin of this.plugins) {
            plugin.update(this);
        }
        this.tick++;
        this.performance.worldUpdateRate = performance.now() - time;
        /** @ts-ignore */
        this.performance.memoryUsage = this.environment === Enums_1.Environment.Browser ? ((_a = performance.memory) === null || _a === void 0 ? void 0 : _a.usedJSHeapSize) / 1024 / 1024 : process.memoryUsage().heapUsed / 1024 / 1024;
        if (this.environment === Enums_1.Environment.Browser)
            requestAnimationFrame(this.update.bind(this));
    }
    /** Adds an body to the system. */
    addBody(body) {
        const id = this.nextId;
        body.id = id;
        body.system = this;
        this.bodys[id] = body;
        this.emit('bodyCreate', body);
        return body;
    }
    /** Removes an body from the system. */
    removeBody(body) {
        this.bodys[body.id] = undefined;
        this.emit('bodyDelete', body);
        return body;
    }
}
exports.System = System;


/***/ }),

/***/ 989:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Body = void 0;
const Vector_1 = __webpack_require__(875);
/** The 'body' for all elements. */
class Body {
    get speed() {
        return this._speed;
    }
    set speed(speed) {
        this._speed = speed;
    }
    get velocity() {
        return this.shape.velocity;
    }
    set velocity(velocity) {
        this.shape.velocity = velocity;
    }
    set moveAngle(angle) {
        this.acceleration.x += Math.cos(angle);
        this.acceleration.y -= Math.sin(angle);
        this.acceleration.normalize().scale(this.speed);
        this.velocity.add(this.acceleration);
    }
    constructor(shape) {
        this._speed = 1;
        this.acceleration = new Vector_1.Vector(0, 0);
        /** The plugins of the body. */
        this.plugins = [];
        this.shape = shape;
        this.shape.body = this;
    }
    collisioned(other) {
        for (const plugin of [...this.system.plugins, ...this.plugins]) {
            plugin.bodyCollisioned(this, other);
        }
    }
    update() {
        this.shape.update();
        this.acceleration.scale(0); // Reset acceleration.
        for (const plugin of [...this.system.plugins, ...this.plugins]) {
            plugin.bodyUpdate(this);
        }
    }
    render(context) {
        this.shape.render(context);
    }
}
exports.Body = Body;


/***/ }),

/***/ 801:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CollisionResolver = void 0;
const Enums_1 = __webpack_require__(537);
/** A class which performs narrowphase collision detection on shapes. */
class CollisionResolver {
    /** Detects collisions between two shapes. */
    detect(shape1, shape2) {
        if (shape1.components.length && shape2.components.length) {
            for (const component1 of shape1.components) {
                for (const component2 of shape2.components) {
                    const detected = this.detectSimple(component1, component2);
                    if (detected)
                        break;
                }
            }
            return;
        }
        else if (shape1.components.length || shape2.components.length) {
            const component = shape1.components.length ? shape1 : shape2;
            const notComponent = shape1.components.length ? shape2 : shape1;
            for (const subComponent of component.components) {
                const detected = this.detectSimple(subComponent, notComponent);
                if (detected)
                    break;
            }
        }
        else
            this.detectSimple(shape1, shape2);
    }
    /** Calls the events of the two detected shapes. */
    processDetectedShapesEvents(shape1, shape2) {
        shape1.lastCollisionFrame = shape1.tick;
        shape2.lastCollisionFrame = shape2.tick;
        shape1.body.collisioned(shape2.body);
        shape2.body.collisioned(shape1.body);
    }
    /** Detects collisions between two simple shapes. */
    detectSimple(shape1, shape2) {
        if (shape1.type === Enums_1.ShapeType.Circle && shape2.type === Enums_1.ShapeType.Circle)
            return this.detectCircleCircle(shape1, shape2);
        if (shape1.type === Enums_1.ShapeType.Circle || shape2.type === Enums_1.ShapeType.Circle) {
            const circle = shape1.type === Enums_1.ShapeType.Circle ? shape1 : shape2;
            const notCircle = shape1.type === Enums_1.ShapeType.Circle ? shape2 : shape1;
            if (notCircle.type === Enums_1.ShapeType.Line)
                return this.detectCircleLine(circle, notCircle);
            return this.detectCirclePolygon(circle, notCircle);
        }
        let overlap = Infinity;
        let smallestAxis;
        const vertices1 = shape1.vertices;
        const vertices2 = shape2.vertices;
        const edges = vertices1.length + vertices2.length;
        for (let i = 0; i < edges; i++) {
            /** Calculate the orthogonal vector to each edge. */
            let normal;
            if (i < vertices1.length)
                normal = vertices1[i].clone.subtract(vertices1[(i + 1) % vertices1.length]).orthogonal.normalize();
            else
                normal = vertices2[i - vertices1.length].clone.subtract(vertices2[(i + 1) % vertices2.length]).orthogonal.normalize();
            /** Ignore zero vectors. */
            if (normal.x === 0 && normal.y === 0)
                continue;
            /** Project each vertex onto the orthogonal vector. */
            const [minA, maxA] = CollisionResolver.project(normal, vertices1);
            const [minB, maxB] = CollisionResolver.project(normal, vertices2);
            /** Calculate the overlap between the projections. */
            const overlapN = Math.min(maxA, maxB) - Math.max(minA, minB);
            if (overlapN <= 0)
                return false;
            /** Determine the smallest overlap. */
            if (overlapN < overlap) {
                smallestAxis = normal;
                overlap = overlapN;
            }
        }
        if (smallestAxis) {
            this.resolve(shape1.parent || shape1, shape2.parent || shape2, Math.max(shape1.elasticity, shape2.elasticity), overlap, smallestAxis);
            this.processDetectedShapesEvents(shape1, shape2);
            return true;
        }
        else
            return false;
    }
    /** Detects collisions between a circle and a polygon. */
    detectCirclePolygon(circle, polygon) {
        const vertices = polygon.vertices;
        let overlap = Infinity;
        let smallestAxis;
        for (let i = 0; i < vertices.length; i++) {
            const vertex1 = vertices[i];
            const vertex2 = vertices[(i + 1) % vertices.length];
            const axis = vertex2.clone.subtract(vertex1).orthogonal.normalize();
            if (axis.x === 0 && axis.y === 0)
                continue;
            const [min, max] = CollisionResolver.project(axis, vertices);
            const circleProjection = circle.position.dot(axis);
            const overlapN = Math.min(max, circleProjection + circle.radius) - Math.max(min, circleProjection - circle.radius);
            if (overlapN <= 0)
                return false;
            if (overlapN < overlap) {
                overlap = overlapN;
                smallestAxis = axis;
            }
        }
        if (smallestAxis) {
            this.resolve(circle.parent || circle, polygon.parent || polygon, Math.max(circle.elasticity, polygon.elasticity), overlap, smallestAxis);
            this.processDetectedShapesEvents(circle, polygon);
            return true;
        }
        else
            return false;
    }
    /** Detects collisions between two circles. */
    detectCircleCircle(circle1, circle2) {
        const distance = circle1.position.distance(circle2.position);
        const overlap = circle1.radius + circle2.radius - distance;
        const axis = circle1.position.clone.subtract(circle2.position).normalize();
        if (overlap <= 0)
            return false;
        if (axis) {
            this.resolve(circle1.parent || circle1, circle2.parent || circle2, Math.max(circle1.elasticity, circle2.elasticity), overlap, axis);
            this.processDetectedShapesEvents(circle1, circle2);
            return true;
        }
        else
            return false;
    }
    /** Detects a collision between a circle and a line. */
    detectCircleLine(circle, line) {
        const circleToLineStart = line.start.clone.subtract(circle.position);
        const lineEndToCircle = circle.position.clone.subtract(line.end);
        let closestPoint;
        if (line.lineDir.dot(circleToLineStart) > 0) {
            closestPoint = line.start;
        }
        else if (line.lineDir.dot(lineEndToCircle) > 0) {
            closestPoint = line.end;
        }
        else {
            const closestDist = line.lineDir.dot(circleToLineStart);
            const closestVector = line.lineDir.clone.scale(closestDist);
            closestPoint = line.start.clone.add(closestVector);
        }
        const penetration = circle.position.clone.subtract(closestPoint);
        const axis = penetration.clone.normalize();
        const overlap = circle.radius - penetration.magnitude;
        if (overlap > 0) {
            this.resolve(circle.parent || circle, line.parent || line, Math.max(circle.elasticity, line.elasticity), overlap, axis);
            this.processDetectedShapesEvents(circle, line);
            return true;
        }
        else {
            return false;
        }
    }
    /** Projects the vertices onto the given axis. */
    static project(axis, vertices) {
        let min = Infinity;
        let max = -Infinity;
        for (const vertex of vertices) {
            const projection = vertex.dot(axis);
            min = Math.min(min, projection);
            max = Math.max(max, projection);
        }
        return [min, max];
    }
    /** Resolves the collision between two entities. */
    resolve(shape1, shape2, elasticity, overlap, axis) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        (_b = (_a = shape1.hooks).preResolve) === null || _b === void 0 ? void 0 : _b.call(_a, shape2);
        (_d = (_c = shape2.hooks).preResolve) === null || _d === void 0 ? void 0 : _d.call(_c, shape1);
        if (shape1.position.dot(axis) < shape2.position.dot(axis))
            axis.scale(-1);
        const velocity1 = shape1.velocity;
        const velocity2 = shape2.velocity;
        const mass1 = shape1.mass;
        const mass2 = shape2.mass;
        const velocity = velocity1.clone.subtract(velocity2);
        const velocityProjection = velocity.dot(axis);
        const impulse = (-(1 + elasticity) * velocityProjection) / (1 / mass1 + 1 / mass2);
        const impulseVector = axis.clone.scale(impulse);
        /** Change the velocity by impulse and elasticity. */
        if (!shape1.static)
            shape1.velocity.add(impulseVector.clone.scale(1 / mass1));
        if (!shape2.static)
            shape2.velocity.subtract(impulseVector.clone.scale(1 / mass2));
        /** Change the angular velocity of the entities. */
        if (!shape1.static && !shape2.static) {
            shape1.angularVelocity -= (1 / shape1.inertia) * shape1.position.clone.subtract(shape2.position).cross(impulseVector);
            shape2.angularVelocity -= (1 / shape2.inertia) * shape1.position.clone.subtract(shape2.position).cross(impulseVector);
        }
        /** Move the entities out of each other. */
        const penetration = axis.clone.scale(overlap / (1 / mass1 + 1 / mass2));
        if (!shape1.static)
            shape1.updatePosition(penetration.clone.scale(1 / mass1));
        if (!shape2.static)
            shape2.updatePosition(penetration.clone.scale(-1 / mass2));
        (_f = (_e = shape1.hooks).postResolve) === null || _f === void 0 ? void 0 : _f.call(_e, shape2);
        (_h = (_g = shape2.hooks).postResolve) === null || _h === void 0 ? void 0 : _h.call(_g, shape1);
    }
}
exports.CollisionResolver = CollisionResolver;


/***/ }),

/***/ 847:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpatialHashGrid = void 0;
const Error_1 = __webpack_require__(285);
const hash = (x, y) => x + y * 0xb504;
/** A binary space partitioning system which splits the arena into square cells.  */
class SpatialHashGrid {
    constructor(system, cellSize) {
        this.cells = new Map();
        if (!Number.isInteger(cellSize) || cellSize >= 32)
            throw new Error_1.ConfigurationError('Could not initialize SpatialHashGrid: Cell size must be an integer value less than 32.');
        this.system = system;
        this.cellSize = cellSize;
    }
    /** Inserts an body into the grid. */
    insert(x, y, w, h, id) {
        const startX = x >> this.cellSize;
        const startY = y >> this.cellSize;
        const endX = (x + w) >> this.cellSize;
        const endY = (y + h) >> this.cellSize;
        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                const key = hash(x, y);
                if (!this.cells.get(key))
                    this.cells.set(key, []);
                this.cells.get(key).push(id);
            }
        }
    }
    /* Queries the grid by iterating over every cell and performing narrowphase detection on each body. */
    query() {
        for (const cell of this.cells.values()) {
            const length = cell.length;
            if (length < 2)
                continue;
            for (let i = 0; i < length; i++) {
                for (let j = i + 1; j < length; j++) {
                    const body1 = this.system.bodys[cell[i]];
                    const body2 = this.system.bodys[cell[j]];
                    if (body1.shape.sleeping && body2.shape.sleeping)
                        continue;
                    this.system.CollisionResolver.detect(body1.shape, body2.shape);
                }
            }
        }
    }
    /** Clears the grid. */
    clear() {
        this.cells.clear();
    }
}
exports.SpatialHashGrid = SpatialHashGrid;


/***/ }),

/***/ 135:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Plugin = void 0;
/** Base class for plugins */
class Plugin {
    constructor() {
        this.meta = {
            name: 'Plugin',
            version: '1.0.0',
        };
    }
    update(system) { }
    bodyUpdate(body) { }
    bodyCollisioned(body, other) { }
}
exports.Plugin = Plugin;


/***/ }),

/***/ 459:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Circle = void 0;
const Shape_1 = __webpack_require__(22);
const Enums_1 = __webpack_require__(537);
const Error_1 = __webpack_require__(285);
const Vector_1 = __webpack_require__(875);
/** A specific geometric shape which represents a circle. */
class Circle extends Shape_1.Shape {
    /** The bounds of the shape for the collision manager. */
    get bounds() {
        const vertex = this.position || this.vertices[0];
        if (this.position === undefined)
            this.position = vertex;
        return {
            min: new Vector_1.Vector(vertex.x - this.radius, vertex.y - this.radius),
            max: vertex,
            dimensions: this.hitbox,
        };
    }
    /** The radius of the circle. */
    get radius() {
        return this._radius;
    }
    set radius(value) {
        if (value <= 0)
            throw new Error_1.ConfigurationError('The radius of a circle must be greater than 0.');
        this._radius = value;
    }
    /** The hitbox of the circle. */
    get hitbox() {
        return new Vector_1.Vector(this.radius * 2, this.radius * 2);
    }
    /** The moment of inertia of the circle. */
    get inertia() {
        return this.static ? 0 : (this.mass * this.radius * this.radius) / 2;
    }
    constructor(info) {
        super(info);
        this.type = Enums_1.ShapeType.Circle;
        this._radius = 0;
        this.radius = info.radius;
    }
    /** Circles cannot rotate. Editing the angular velocity will deform the hitbox. */
    rotate() { }
    /** Renders the circle. */
    render(context) {
        const { stroke, fill } = this.determineColors();
        if (this.rendering.glowIntensity) {
            context.shadowBlur = this.rendering.glowIntensity;
            context.shadowColor = (this.rendering.glowColor || stroke || fill);
        }
        context.beginPath();
        if (fill)
            context.fillStyle = fill;
        if (stroke)
            context.strokeStyle = stroke;
        context.lineWidth = this.rendering.strokeWidth || 1;
        context.arc(this.position.x, -this.position.y, this.radius, 0, 2 * Math.PI);
        context.closePath();
        context.stroke();
        if (fill)
            context.fill();
        if (stroke)
            context.stroke();
    }
}
exports.Circle = Circle;


/***/ }),

/***/ 569:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Line = void 0;
const Enums_1 = __webpack_require__(537);
const Vector_1 = __webpack_require__(875);
const Shape_1 = __webpack_require__(22);
/** A specific geometric shape which represents a straight line boundary. */
class Line extends Shape_1.Shape {
    /** The vector which represents a vector from the start to the end. */
    get line() {
        return this.end.clone.subtract(this.start);
    }
    /** The vector which represents the direction of the start -> end vector. */
    get lineDir() {
        return this.line.normalize();
    }
    /** The length of the line. */
    get length() {
        return this.end.distance(this.start);
    }
    /** The corners of the collision detection range box. */
    get minX() {
        return Math.min(this.start.x, this.end.x);
    }
    get minY() {
        return Math.min(this.start.y, this.end.y);
    }
    get maxX() {
        return Math.max(this.start.x, this.end.x);
    }
    get maxY() {
        return Math.max(this.start.y, this.end.y);
    }
    /** The width and height of the collision detection range boxes of the line. */
    get width() {
        return this.maxX - this.minX;
    }
    get height() {
        return this.maxY - this.minY;
    }
    constructor(info) {
        super(info);
        this.type = Enums_1.ShapeType.Line;
        this.start = new Vector_1.Vector(this.position.x, this.position.y);
        this.end = new Vector_1.Vector(info.endX, info.endY);
    }
    /** Renders the line. */
    render(context) {
        const { stroke, fill } = this.determineColors();
        if (this.rendering.glowIntensity) {
            context.shadowBlur = this.rendering.glowIntensity;
            context.shadowColor = (this.rendering.glowColor || stroke || fill);
        }
        context.beginPath();
        if (fill)
            context.fillStyle = fill;
        if (stroke)
            context.strokeStyle = stroke;
        context.lineWidth = this.rendering.strokeWidth || 1;
        context.moveTo(this.start.x, -this.start.y);
        context.lineTo(this.end.x, -this.end.y);
        context.closePath();
        context.stroke();
        if (fill)
            context.fill();
        if (stroke)
            context.stroke();
    }
}
exports.Line = Line;


/***/ }),

/***/ 837:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Polygon = void 0;
const Shape_1 = __webpack_require__(22);
const Enums_1 = __webpack_require__(537);
class Polygon extends Shape_1.Shape {
    constructor() {
        super(...arguments);
        this.type = Enums_1.ShapeType.Polygon;
    }
}
exports.Polygon = Polygon;


/***/ }),

/***/ 22:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Shape = void 0;
const Enums_1 = __webpack_require__(537);
const Error_1 = __webpack_require__(285);
const Vector_1 = __webpack_require__(875);
/** A representation of a geometric shape. */
class Shape {
    /** Whether or not the shape is sleeping. */
    get sleeping() {
        return this.tick - this.lastCollisionFrame > 5 && Math.abs(this.velocity.x) < this.sleepThreshold && Math.abs(this.velocity.y) < this.sleepThreshold && Math.abs(this.angularVelocity) < this.sleepThreshold;
    }
    /** The hitbox of the shape. */
    get hitbox() {
        return this.bounds.max.subtract(this.bounds.min);
    }
    /** The moment of inertia of the shape. */
    get inertia() {
        if (this.static)
            return 0;
        const vertices = this.vertices;
        let inertia = 0;
        for (let i = 0; i < vertices.length; i++) {
            const vertex1 = vertices[i];
            const vertex2 = vertices[(i + 1) % vertices.length];
            const term1 = vertex1.cross(vertex1) + vertex2.cross(vertex2);
            const term2 = vertex1.cross(vertex2);
            inertia += term1 + term2;
        }
        return Math.abs(inertia) / 12;
    }
    /** Gets the angle of the shape. */
    get angle() {
        return this._angle;
    }
    /** Sets the angle of the shape. */
    set angle(value) {
        if (value === this._angle || this.info.rotate === false)
            return;
        const angle = value - this._angle;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        this._angle = value;
        for (let i = 0; i < this.vertices.length; i++) {
            const translatedX = this.vertices[i].x - this.position.x;
            const translatedY = this.vertices[i].y - this.position.y;
            const rotatedX = translatedX * cos - translatedY * sin;
            const rotatedY = translatedX * sin + translatedY * cos;
            this.vertices[i].x = rotatedX + this.position.x;
            this.vertices[i].y = rotatedY + this.position.y;
        }
    }
    /** The bounds of the shape for the collision manager. */
    get bounds() {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const vertex of this.vertices) {
            const x = vertex.x;
            const y = vertex.y;
            minX = minX > x ? x : minX;
            minY = minY > y ? y : minY;
            maxX = maxX < x ? x : maxX;
            maxY = maxY < y ? y : maxY;
        }
        if (this.position === undefined)
            this.position = new Vector_1.Vector((minX + maxX) / 2, (minY + maxY) / 2);
        return {
            min: new Vector_1.Vector(minX, minY),
            max: new Vector_1.Vector(maxX, maxY),
        };
    }
    // TODO(Altanis): Angular and linear momentum.
    /** The area of the shape. */
    get area() {
        let area = 0;
        for (let i = 0; i < this.vertices.length; i++)
            area += this.vertices[i].cross(this.vertices[(i + 1) % this.vertices.length]);
        return Math.abs(area / 2);
    }
    constructor(info) {
        /** The number of ticks elapsed since the shape's spawn. */
        this.tick = 0;
        /** The last tick the shape has collided with another. */
        this.lastCollisionFrame = 0;
        /** The threshold for the linear and angular velocities to put the shape to sleep. */
        this.sleepThreshold = -1;
        /** The geometric type of the shape. */
        this.type = Enums_1.ShapeType.Generic;
        /** The velocity of the shape. */
        this.velocity = new Vector_1.Vector(0, 0);
        /** The angular velocity of the shape. */
        this.angularVelocity = 0;
        /** The angular speed of the shape. */
        this.angularSpeed = 0;
        /** The components of the shape. */
        this.components = [];
        /** The parent of the shape (if it is a component.) */
        this.parent = null;
        /** The collision hooks of the shape. */
        this.hooks = {};
        this._angle = 0;
        this.info = info;
        this.vertices = this.initializeVertices(info);
        this.bounds; // Initialize the bounds.
        this.mass = info.mass;
        this.angularSpeed = info.angularSpeed || 0;
        this.elasticity = Math.max(0, info.elasticity) || 0;
        this.static = !!info.static;
        this.sleepThreshold = info.sleepThreshold || -1;
        this.configure(info.render || {});
        this.hooks = info.hooks || {};
    }
    /** Initializes the vertices of the shape. */
    initializeVertices(info) {
        if (!info.form)
            throw new Error_1.ConfigurationError('No form was provided for the shape.');
        let returnedVertices = [];
        if (info.form.components) {
            for (const component of info.form.components) {
                if (component.info.form.components)
                    throw new Error_1.ConfigurationError('Components cannot have components.');
                this.components.push(component);
                returnedVertices.push(...component.vertices);
            }
        }
        else if (info.form.vertices)
            returnedVertices = info.form.vertices;
        else if (info.form.sides) {
            const vertices = [];
            const radius = info.form.radius;
            if (!radius)
                throw new Error_1.ConfigurationError('No radius was provided for the shape.');
            const angleStep = (Math.PI * 2) / info.form.sides;
            for (let i = 0; i < info.form.sides; i++) {
                const startAngle = angleStep * i + (info.form.rotation || 0);
                vertices.push(Vector_1.Vector.toCartesian(radius, startAngle).add(info.form.offset || { x: 0, y: 0 }));
            }
            returnedVertices = vertices;
        }
        else
            throw new Error_1.ConfigurationError('No form was provided for the shape.');
        return returnedVertices;
    }
    /** Configures the shape's rendering properties. */
    configure(info) {
        this.rendering = {
            strokeColor: info.strokeColor,
            fillColor: info.fillColor,
            strokeWidth: info.strokeWidth || 1,
            glowIntensity: info.glowIntensity,
            glowColor: info.glowColor,
            hooks: info.hooks || {},
        };
    }
    /** Rotates the shape by its angular speed. */
    rotate(...directions) {
        for (const movement of directions) {
            switch (movement) {
                case Enums_1.Movement.Up:
                    this.angularVelocity += this.angularSpeed;
                    break;
                case Enums_1.Movement.Down:
                    this.angularVelocity -= this.angularSpeed;
                    break;
                case Enums_1.Movement.Left:
                    this.angularVelocity -= this.angularSpeed;
                    break;
                case Enums_1.Movement.Right:
                    this.angularVelocity += this.angularSpeed;
                    break;
                default:
                    console.error('[SYSTEM]: Invalid angular movement key.');
                    break;
            }
        }
    }
    /** Update the shape. */
    update() {
        if (this.static)
            this.velocity.x = this.velocity.y = this.angularVelocity = 0;
        /** Apply gravity. */
        if (this.body.system.gravity && !this.static) {
            this.velocity.add(this.body.system.gravity);
        }
        // if (this.sleeping) return;
        this.velocity.scale(1 - this.body.system.friction); // Apply friction.
        this.angularVelocity *= 1 - this.body.system.friction; // Apply friction.
        this.updatePosition(this.velocity); // Apply velocity.
        this.angle += this.angularVelocity / 100; // Apply angular velocity.
        this.tick++;
        this.body.system.emit('shapeUpdate', this);
    }
    /** Updates the position. */
    updatePosition(vector) {
        if (this.static)
            return;
        const width = this.body.system.width;
        const height = this.body.system.height;
        if (width && height) {
            const halfWidth = width / 2;
            const halfHeight = height / 2;
            if (this.position.x + vector.x > halfWidth)
                vector.x = halfWidth - this.position.x;
            else if (this.position.x + vector.x < -halfWidth)
                vector.x = -halfWidth - this.position.x;
            if (this.position.y + vector.y > halfHeight)
                vector.y = halfHeight - this.position.y;
            else if (this.position.y + vector.y < -halfHeight)
                vector.y = -halfHeight - this.position.y;
        }
        this.position.add(vector);
        for (const vertex of this.vertices)
            vertex.add(vector);
    }
    /** Determines the stroke and fill color of the shape. */
    determineColors() {
        let stroke = undefined;
        let fill = undefined;
        const shape = this;
        if (shape.rendering.strokeColor)
            stroke = shape.rendering.strokeColor;
        if (shape.rendering.fillColor)
            fill = shape.rendering.fillColor;
        if (!stroke && !fill)
            stroke = Enums_1.Colors.Black;
        return { stroke, fill };
    }
    /** Renders the shape. */
    render(context) {
        const { stroke, fill } = this.determineColors();
        if (this.rendering.glowIntensity) {
            context.shadowBlur = this.rendering.glowIntensity;
            context.shadowColor = (this.rendering.glowColor || stroke || fill);
        }
        context.beginPath();
        if (stroke)
            context.strokeStyle = stroke;
        if (fill)
            context.fillStyle = fill;
        context.lineWidth = this.rendering.strokeWidth || 1;
        if (this.components.length) {
            for (const component of this.components) {
                component.render(context);
            }
        }
        else {
            for (const vertex of this.vertices) {
                context.lineTo(vertex.x, -vertex.y);
            }
        }
        context.closePath();
        if (fill)
            context.fill();
        if (stroke)
            context.stroke();
    }
    /** Scales from a shape. */
    scale(scalar) {
        const position = this.position.clone;
        for (const vertex of this.vertices) {
            vertex.scale(scalar);
        }
        this.position = position;
    }
    /** Divide from a shape. */
    divide(divider) {
        const position = this.position.clone;
        for (const vertex of this.vertices) {
            vertex.divide(divider);
        }
        this.position = position;
    }
}
exports.Shape = Shape;


/***/ }),

/***/ 537:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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


/***/ }),

/***/ 285:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfigurationError = exports.InternalError = void 0;
class InternalError extends Error {
    constructor(message) {
        super("[SYSTEM]: Whoops, something went wrong! Please report it at our GitHub page: " + message);
        this.name = "InternalError";
    }
}
exports.InternalError = InternalError;
;
class ConfigurationError extends Error {
    constructor(message) {
        super("[SYSTEM]: An error occurred when configuring an Entity or the System: " + message);
        this.name = "ConfigurationError";
    }
}
exports.ConfigurationError = ConfigurationError;
;


/***/ }),

/***/ 703:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Camera = void 0;
const Vector_1 = __webpack_require__(875);
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


/***/ }),

/***/ 959:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Renderer = void 0;
const Enums_1 = __webpack_require__(537);
const Error_1 = __webpack_require__(285);
/** The class which handles rendering of the system. */
class Renderer {
    constructor(config, system) {
        /** Data about framerates. */
        this.framerate = {
            /** The list of the last 30 framerates. */
            fpsArr: [],
            /** The average framerate. */
            fps: 0,
            /** The delta between frames. */
            dt: 0,
            /** The last time the framerate was updated. */
            lastUpdate: 0,
        };
        this.system = system;
        this.canvas = config.canvas;
        const ctx = this.canvas.getContext('2d');
        if (!ctx)
            throw new Error_1.ConfigurationError('Could not configure Renderer: Your browser does not support CanvasRenderingContext2D.');
        this.context = ctx;
        /** Ensure the canvas stays in bounds. */
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth * window.devicePixelRatio;
            this.canvas.height = window.innerHeight * window.devicePixelRatio;
        });
        window.dispatchEvent(new Event('resize'));
        this.configure(config);
        requestAnimationFrame(this.render.bind(this));
    }
    /** Configures the renderer. */
    configure(config) {
        this.rendering = {
            canvas: this.canvas,
            background: config.background || Enums_1.Colors.White,
            hooks: config.hooks || {},
            gridSize: config.gridSize || 0,
            gridColor: config.gridColor || Enums_1.Colors.Black,
            gridWidth: config.gridWidth || 1,
        };
    }
    /** Renders the system. */
    render() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        /** Update framerate information. */
        this.framerate.dt = performance.now() - this.framerate.lastUpdate;
        this.framerate.lastUpdate = performance.now();
        if (this.framerate.fpsArr.length > 30)
            this.framerate.fpsArr.shift();
        this.framerate.fpsArr.push(this.framerate.dt);
        let avg = 0;
        for (const fps of this.framerate.fpsArr)
            avg += fps;
        this.framerate.fps = Math.round(1000 / (avg / this.framerate.fpsArr.length));
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.save();
        /** Render the background, boundaries, and grid. */
        this.context.fillStyle = this.rendering.background;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        (_b = (_a = this.rendering.hooks).preRender) === null || _b === void 0 ? void 0 : _b.call(_a, this.context);
        this.context.scale(this.system.camera.zoom, this.system.camera.zoom);
        this.context.translate(this.canvas.width / 2 / this.system.camera.zoom - this.system.camera.position.x, this.canvas.height / 2 / this.system.camera.zoom + this.system.camera.position.y);
        if (this.rendering.gridSize !== 0) {
            this.context.strokeStyle = this.rendering.gridColor;
            this.context.lineWidth = this.rendering.gridWidth;
            if (!this.system.width || !this.system.height) {
                for (let x = 0; x < this.canvas.width; x += this.rendering.gridSize) {
                    this.context.beginPath();
                    this.context.moveTo(x, 0);
                    this.context.lineTo(x, this.canvas.height);
                    this.context.stroke();
                }
                for (let y = 0; y < this.canvas.height; y += this.rendering.gridSize) {
                    this.context.beginPath();
                    this.context.moveTo(0, y);
                    this.context.lineTo(this.canvas.width, y);
                    this.context.stroke();
                }
            }
            else {
                const width = this.system.width / 2;
                const height = this.system.height / 2;
                for (let y = -height; y <= height; y += this.rendering.gridSize) {
                    this.context.beginPath();
                    this.context.moveTo(-width, y);
                    this.context.lineTo(width, y);
                    this.context.stroke();
                }
                for (let x = -width; x <= width; x += this.rendering.gridSize) {
                    this.context.beginPath();
                    this.context.moveTo(x, -height);
                    this.context.lineTo(x, height);
                    this.context.stroke();
                }
            }
        }
        this.context.strokeStyle = this.rendering.gridColor;
        /** Render the bodys. */
        for (const body of this.system.bodys) {
            if (!body)
                continue;
            this.context.save();
            (_d = (_c = body.shape.rendering.hooks).preRender) === null || _d === void 0 ? void 0 : _d.call(_c, body.shape, this.context);
            body.render(this.context);
            (_f = (_e = body.shape.rendering.hooks).postRender) === null || _f === void 0 ? void 0 : _f.call(_e, body.shape, this.context);
            this.context.restore();
        }
        this.context.restore();
        (_h = (_g = this.rendering.hooks).postRender) === null || _h === void 0 ? void 0 : _h.call(_g, this.context);
    }
}
exports.Renderer = Renderer;


/***/ }),

/***/ 875:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Vector = void 0;
/** A vector in 2D space, represents a direction and magnitude simultaneously. */
class Vector {
    constructor(x, y) {
        /** The coordinates of the vector. */
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    /** Converts polar coordinates to Cartesian coordinates. */
    static toCartesian(r, theta) {
        return new Vector(r * Math.cos(theta), r * Math.sin(theta));
    }
    /** Adds to a vector. */
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }
    /** Subtracts from a vector. */
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }
    /** Scales from a vector. */
    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    /** Divide from a vector. */
    divide(divider) {
        this.x /= divider;
        this.y /= divider;
        return this;
    }
    /** Normalizes the vector. */
    normalize() {
        const magnitude = this.magnitude;
        if (magnitude === 0)
            this.x = this.y = 0;
        else {
            this.x /= magnitude;
            this.y /= magnitude;
        }
        return this;
    }
    /** Gets the distance from another vector. */
    distance(vector) {
        return this.clone.subtract(vector).magnitude;
    }
    /** Gets the dot product of two vectors. */
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    /** Gets the cross product of two vectors. */
    cross(vector) {
        return this.x * vector.y - this.y * vector.x;
    }
    /** Gets the projection of the current vector onto another vector. */
    project(vector) {
        if (vector.x === 0 && vector.y === 0)
            return new Vector(0, 0);
        return vector.clone.scale(this.dot(vector) / vector.magnitudeSq);
    }
    /** Creates a vector directionally orthogonal to the current vector. */
    get orthogonal() {
        return new Vector(-this.y, this.x);
    }
    /** Gets the angle of the vector from a reference point. */
    angle(reference = { x: 0, y: 0 }) {
        return Math.atan2(this.y - reference.y, this.x - reference.x);
    }
    /** Rotates the angle to a new angle. */
    rotate(angle) {
        const magnitude = this.magnitude;
        this.x = magnitude * Math.cos(angle);
        this.y = magnitude * Math.sin(angle);
        return this;
    }
    /** Gets the magnitude (length) of the vector. */
    get magnitude() {
        return Math.sqrt(this.magnitudeSq);
    }
    /** Sets the magnitude (length) of the vector. */
    set magnitude(magnitude) {
        const angle = this.angle();
        this.x = magnitude * Math.cos(angle);
        this.y = magnitude * Math.sin(angle);
    }
    /** Gets the squared magnitude of the vector. */
    get magnitudeSq() {
        return this.x * this.x + this.y * this.y;
    }
    /** Clones the vector. */
    get clone() {
        return new Vector(this.x, this.y);
    }
    /** Get the distance from two vectors. */
    static distance(a, b) {
        return Math.sqrt(Math.pow((b.x - a.x), 2) + Math.pow((b.y - a.y), 2));
    }
    /** Adds to a vector. */
    static add(a, b) {
        return new Vector(a.x + b.x, a.y + b.y);
    }
    /** Subtract from the two vectors. */
    static subtract(a, b) {
        return new Vector(a.x - b.x, a.y - b.y);
    }
    /** Scales from a vector. */
    static scale(v, scalar) {
        return new Vector(v.x * scalar, v.y * scalar);
    }
    /** Divide from a vector. */
    static divide(v, divider) {
        return new Vector(v.x / divider, v.y / divider);
    }
}
exports.Vector = Vector;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(876);
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;