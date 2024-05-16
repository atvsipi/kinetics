"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=EventEmitter.js.map