"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpatialHashGrid = void 0;
const Error_1 = require("../typings/Error");
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
                    for (const plugin of this.system.plugins) {
                        plugin.bodyUpdate(body1, body2);
                        plugin.bodyUpdate(body2, body1);
                    }
                    for (const plugin of body1.plugins)
                        plugin.bodyUpdate(body1, body2);
                    for (const plugin of body2.plugins)
                        plugin.bodyUpdate(body2, body1);
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
//# sourceMappingURL=SpatialHashGrid.js.map