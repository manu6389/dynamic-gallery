/* eslint-disable no-console */

class Logger {
    constructor(level) {
        this.level = level || Logger.levels.ERROR;
    }

    info() {
        if (this.level >= Logger.levels.INFO) {
            console.log.apply(console, arguments);
        }
    }

    warn() {
        if (this.level >= Logger.levels.WARN) {
            console.log.apply(console, arguments);
        }
    }

    test() {
        if (this.level >= Logger.levels.TEST) {
            console.log.apply(console, arguments);
        }
    }

    error() {
        if (this.level >= Logger.levels.ERROR) {
            console.log.apply(console, arguments);
        }
    }
}

Logger.levels = {
    ERROR: 0,
    WARN: 1,
    TEST: 2,
    INFO: 3
};

export default Logger;
