# Throttled-Debounce

Throttled-Debounce is a library designed to limit the call rate of a function.
It allows to use a throttling & debouncing mechanism combined.

### Usage
```JavaScript
var controlFunc = (options) => {
    var event = options.arguments[0];
    if(options.callCount === 1){
        options.timing = Date.now();
        options.element = event.target;
    } else {
        //change of element
        if(options.element !== event.target){
            options.split(); //force bounce
        }
    }
};

var callback = (options) => {
	options.timing = Date.now() - options.timing;
    console.log(options);
};

var options = {
    callback: callback,
    controlFunc: controlFunc,
    maxDelay: 3000,
    throttleWait: 500
};

window.scroll_handler = throttledDebounce(options);
document.addEventListener('scroll', window.scroll_handler, true);

window.scroll_handler.cancel(); //stop fire events
window.scroll_handler.resume(); //resume

window.scroll_handler.bounce(); //force bounce
```
