var asyncSupportGlobalThis;
(function(root, factory) {
    asyncSupportGlobalThis = root;
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.jsccasyncSupport = factory();
    }
}(this, function() {
    // Use this module to get true async support in Java runners that have no
    // native setTimeout, setImmediate, etc.

    var gThis = asyncSupportGlobalThis,
        isNashorn = typeof Java === "object" && typeof Java.type === "function",
        isRhino = typeof java !== "undefined" && !isNashorn;

    var commonPool = null, Instant = null, millisecondsUnit = null, Thread = null, FutureTask = null, commonPoolSubmit = null,
        toJsArray = function(input) {
            return input;
        };
    if (isNashorn) {
        commonPool = Java.type("java.util.concurrent.ForkJoinPool").commonPool();
        Instant = Java.type("java.time.Instant");
        millisecondsUnit = Java.type("java.time.temporal.ChronoUnit").MILLIS;
        Thread = Java.type("java.lang.Thread");
        FutureTask = Java.type("java.util.concurrent.FutureTask");
        toJsArray = function(input) {
            if (Array.isArray(input)) {
                return input;
            }
            var length = input.length,
                result = [];
            for (var index = 0; index < length; index++) {
                result.push(input[index]);
            }
            return result;
        };
        commonPoolSubmit = function(callback) {
            // This is necessary because the commonPool variable may otherwise be garbage-collected,
            // reminiscent of .NET P/Invoke issues...
            return commonPool["submit(java.lang.Runnable)"](callback);
        };
    } else if (isRhino) {
        commonPool = java.util.concurrent.ForkJoinPool.commonPool();
        Instant = java.time.Instant;
        millisecondsUnit = java.time.temporal.ChronoUnit.MILLIS;
        Thread = java.lang.Thread;
        FutureTask = java.util.concurrent.FutureTask;
        commonPoolSubmit = commonPool.submit;
    }

    if (typeof gThis.setTimeout === "undefined") {
        if (commonPool) {
            gThis.setTimeout = function() {
                try {
                    var jsArgs = toJsArray(arguments),
                        callback = jsArgs[0],
                        delay = Math.floor(Math.max(4, Math.min(2147483647, jsArgs[1]))),
                        args = jsArgs.slice(2),
                        fireAfterInstant = Instant.now().plusMillis(delay);
                    if (typeof callback !== "function") {
                        // Not supporting the string-eval version, at least for now
                        throw new Error("Non-function callbacks are not supported in this version of setTimeout.  Callback parameter was of type " +
                                        (typeof callback) + ".");
                    }
                    var forkJoinTask = commonPoolSubmit(function() {
                        var remainingDelay = millisecondsUnit.between(Instant.now(), fireAfterInstant);
                        if (remainingDelay > 0) {
                            Thread.sleep(remainingDelay);
                        }
                        callback.apply(null, args);
                    });
                    return forkJoinTask;
                } catch (e) {
                    throw e;
                }
            };
        } else {
            // Just run task more-or-less immediately
            gThis.setTimeout = function() {
                var jsArgs = toJsArray(arguments),
                    callback = jsArgs[0],
                    args = jsArgs.slice(2);
                if (typeof callback !== "function") {
                    throw new Error("Non-function callbacks are not supported in this version of setTimeout.  Callback parameter was of type " +
                                    (typeof callback) + ".");
                }
                callback.apply(null, args);
            };
        }

        gThis.clearTimeout = function(forkJoinTask) {
            if (typeof forkJoinTask !== "undefined" && forkJoinTask !== null &&
                typeof forkJoinTask.cancel === "function") {
                forkJoinTask.cancel(true);
            }
        };
    }

    if (typeof gThis.setImmediate === "undefined") {
        gThis.setImmediate = function() {
            var args = toJsArray(arguments);
            args.splice(1, 0, 4);
            return gThis.setTimeout.apply(null, args);
        };
        gThis.clearImmediate = function(forkJoinTask) {
            gThis.clearTimeout(forkJoinTask);
        };
    }

    if (typeof gThis.setInterval === "undefined") {
        if (commonPool) {
            var IntervalTaskToken = function(callback, delay, args) {
                if (typeof callback !== "function") {
                    throw new Error("The callback passed to the IntervalTaskToken must be a function, but instead has type " +
                                    (typeof callback) + ".");
                }
                this._callback = callback;
                this._delay = Math.floor(Math.max(4, Math.min(2147483647, delay)));
                this._args = args;
            };
            /**
             * @type {!Function}
             * @private
             */
            IntervalTaskToken.prototype._callback = function() {
            };
            /**
             * @type {!number}
             * @private
             */
            IntervalTaskToken.prototype._delay = 4;
            /**
             * @type {!Array}
             * @private
             */
            IntervalTaskToken.prototype._args = [];
            /**
             * @type {!boolean}
             * @private
             */
            IntervalTaskToken.prototype._cancelCalled = false;
            /**
             * @type {Object<!{ cancel: function(boolean):boolean }, *>}
             * @private
             */
            IntervalTaskToken.prototype._taskObject = {};
            /**
             * @param {boolean=} interrupt
             */
            IntervalTaskToken.prototype.cancel = function(interrupt) {
                var that = this;
                this._cancelCalled = true;
                Object.keys(this._taskObject).forEach(function(task) {
                    try {
                        task.cancel(interrupt);
                    } catch (e) {
                        // no-op
                    }
                    try {
                        delete that._taskObject[task];
                    } catch (e) {
                        // no-op
                    }
                });
            };
            IntervalTaskToken.prototype.queueTask = function() {
                var that = this,
                    fireAfterInstant = Instant.now().plusMillis(this._delay);

                var task = commonPoolSubmit(function() {
                    var remainingMilliseconds = millisecondsUnit.between(Instant.now(), fireAfterInstant);
                    if (remainingMilliseconds > 0 && !that._cancelCalled) {
                        Thread.sleep(remainingMilliseconds);
                    }
                    if (!that._cancelCalled) {
                        var immediateTask = new FutureTask(function() {
                            that._callback.apply(null, that._args);
                            delete that._taskObject[immediateTask];
                        });
                        that._taskObject[immediateTask] = true;
                        immediateTask.fork();
                    }
                    if (!that._cancelCalled) {
                        // Don't save this one
                        new FutureTask(that.queueTask).fork();
                    }
                    var deleted = false;
                    while (!deleted) {
                        try {
                            deleted = that._cancelCalled;
                            delete that._taskObject[task];
                            deleted = true;
                        } catch (e) {
                            Thread.sleep(20);
                        }
                    }
                });
                this._taskObject[task] = true;
                return task;
            };

            gThis.setInterval = function() {
                var jsArgs = toJsArray(arguments),
                    callback = jsArgs[0],
                    delay = Math.floor(Math.max(4, Math.min(2147483647, jsArgs[1]))),
                    args = jsArgs.slice(2);
                if (typeof callback !== "function") {
                    throw new Error("Non-function callbacks are not supported in this version of setInterval.  Callback parameter was of type " +
                                    (typeof callback) + ".");
                }
                return new IntervalTaskToken(callback, delay, args);
            };
        } else {
            gThis.setInterval = function() {
                var jsArgs = toJsArray(arguments),
                    callback = jsArgs[0],
                    delay = Math.floor(Math.max(4, Math.min(2147483647, jsArgs[1]))),
                    args = jsArgs.slice(2),
                    cancelCalled = false;
                if (typeof callback !== "function") {
                    throw new Error("Non-function callbacks are not supported in this version of setInterval.  Callback parameter was of type " +
                                    (typeof callback) + ".");
                }
                var innerFunction = function() {
                    if (!cancelCalled) {
                        callback.apply(null, args);
                        gThis.setTimeout(innerFunction, delay);
                    }
                };
                gThis.setTimeout(innerFunction, delay);
                return {
                    cancel: function() {
                        cancelCalled = true;
                    }
                }
            }

        }

        gThis.clearInterval = function(forkJoinTask) {
            if (typeof forkJoinTask !== "undefined" && forkJoinTask !== null &&
                typeof forkJoinTask.cancel === "function") {
                forkJoinTask.cancel(true);
            }
        };
    }

    return gThis;
}));