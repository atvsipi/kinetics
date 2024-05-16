"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollisionResolver = void 0;
const Enums_1 = require("../typings/Enums");
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
//# sourceMappingURL=CollisionResolver.js.map