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
        cancelled = undefined,
        context = undefined;

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

        shouldBounce = false;

        var thisContext = {
            callCount: 0,
            arguments: undefined,
            bounce: function bounce(){
                if(shouldBounce === false && context === thisContext && cancelled !== true){
                    thisContext.trigger = 'control';
                    shouldBounce = true;
                    return true;
                }
            }
        };
        context = thisContext;
    }

    function setMaxDelay(){
        maxDelayHandle = setTimeoutFunc(()=>{
            maxDelayHandle = undefined;
            if(shouldBounce === false){
                shouldBounce = true;
                context.trigger = 'debounce';
                debounced();
            }
        }, options.maxDelay);
    }

    function setThrottleWait(){
        throttleHandle = setTimeoutFunc(()=>{
            throttleHandle = undefined;
            if(shouldBounce === false){
                shouldBounce = true;
                context.trigger = 'throttle';
                debounced();
            }
        }, options.throttleWait);
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

            throttleHandle && clearTimeoutFunc(throttleHandle);
            setThrottleWait();

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
