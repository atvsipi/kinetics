"use strict";
// CURRENTLY UNUSED
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
/** A colorful logger to highlight important actions. */
class Logger {
    static log(...args) {
        if (this.enabled)
            console.log(`%c[${Date().split(' ')[4]}]: ${args.join(' ')}`, 'color: blue;');
    }
    static err(...args) {
        if (this.enabled)
            console.log(`%c[${Date().split(' ')[4]}]: ${args.join(' ')}`, 'color: red;');
    }
    static success(...args) {
        if (this.enabled)
            console.log(`%c[${Date().split(' ')[4]}]: ${args.join(' ')}`, 'color: green;');
    }
    static warn(...args) {
        if (this.enabled)
            console.log(`%c[${Date().split(' ')[4]}]: ${args.join(' ')}`, 'color: yellow;');
    }
    static debug(...args) {
        if (this.enabled)
            console.log(args.join(' '));
    }
}
exports.Logger = Logger;
/** Whether or not to log messages. */
Logger.enabled = true;
//# sourceMappingURL=Logger.js.map