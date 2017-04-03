/** Creates a function that throttle and debounce events.
 * Basically it allows you to limit throttling time. 
 * @param {Function} options.func The function to debounce & throttle.
 * @param {number} options.maxDelay max time since begining of events-chain, bounce at timeout.
 * @param {number} options.throttleWait time to wait for the next event (while in events-chain).
 * @param {Function} options.controlFunc allows some control over the debounce mechanism, and option to aggregate events, should be lightweight!
 * @param {Function} options.setTimeout allows override the default 'setTimeout' function.
 * @param {Function} options.clearTimeout allows override the default 'clearTimeout' function.
 * @returns {Function} Returns the new debounced function.
 */

function throttleDebounce(options) {
    var setTimeoutFunc = options.setTimeout || setTimeout,
        clearTimeoutFunc = options.clearTimeout || clearTimeout;

    var maxDelayHandle = undefined,
        throttleHandle = undefined,
        shouldBounce = undefined,
        throttleTime = undefined,
        cancelled = undefined,
        context = undefined;

    function innerBounce(trigger){
        shouldBounce = true;
        context.trigger = trigger;
        debounced();
    }

    function reset(){
        //clear throttleHandle
        if(throttleHandle !== undefined){
            clearTimeoutFunc(throttleHandle);
            throttleHandle = undefined;
        }
        //clear waitHandle
        if(maxDelayHandle !== undefined){
            clearTimeoutFunc(maxDelayHandle);
            maxDelayHandle = undefined;
        }

        throttleTime = undefined;
        shouldBounce = false;

        var thisContext = {
            callCount: 0,
            arguments: undefined,
            bounce: function bounce(){
                if(shouldBounce === false && context === thisContext && cancelled !== true){
                    innerBounce('control');
                    return true;
                }
            }
        };
        context = thisContext;
    }

    function setMaxDelay(){
        maxDelayHandle = setTimeoutFunc(maxDelayTimeoutFunc, options.maxDelay);
    }

    function maxDelayTimeoutFunc(){
        maxDelayHandle = undefined;
        if(shouldBounce === false){
            innerBounce('debounce');
        }
    }

    function feedThrottle(selfCall, timeLeft){
        if(selfCall === false){
            var now = Date.now();
            var passedTime = throttleTime ? (throttleTime - now) : 0;

            if(passedTime === 0){
                throttleTime = now + options.throttleWait;
            } else if(passedTime > 0){
                throttleTime += (options.throttleWait - passedTime); //overtime
            } else {
                //code execution took too long, we've missed our train!
                innerBounce('throttle');
                return;
            }
        }

        if(throttleHandle === undefined){
            var throttleWait = timeLeft || options.throttleWait;
            throttleHandle = setTimeoutFunc(throttleWaitTimeoutFunc, throttleWait);
        }
    }

    function throttleWaitTimeoutFunc(){
        throttleHandle = undefined;
        var timeLeft = throttleTime - Date.now();
        if(shouldBounce === false){
            if(timeLeft > 0){
                feedThrottle(true, timeLeft);
            } else {
                innerBounce('throttle');
            }
        }
    }

    function debounced(){
        if(cancelled === true){
            return;
        }

        if(shouldBounce === false){
            context.callCount++;
            context.arguments = arguments;

            if(options.controlFunc !== undefined){
                //call user callback (can aggregate events and bounce)
                options.controlFunc.call(null, context);
            }

            feedThrottle(false);

            if(maxDelayHandle === undefined && options.maxDelay !== undefined){
                setMaxDelay();
            }
        }

        if(shouldBounce === true){
            context.arguments = Array.prototype.slice.call(context.arguments);
            delete context.bounce;

            //actual bounce
            options.func.call(null, context);
            reset();
        }
    }

    debounced.cancel = ()=>{
        if(cancelled !== true){
            cancelled = true;
            reset();
            return true;           
        }
    };

    debounced.resume = ()=>{
        if(cancelled === true){
            cancelled = false;
            return true;
        }
    };

    reset();
    return debounced;
}
