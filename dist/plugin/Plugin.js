"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    bodyUpdate(body, other) { }
    bodyCollisioned(body, other) { }
}
exports.Plugin = Plugin;
//# sourceMappingURL=Plugin.js.map