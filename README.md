# Throttled-Debounce

Throttled-Debounce is a library designed to limit the call rate of a function.
It allows to use a throttling & debouncing mechanism combined.

### Usage
```JavaScript
var controlFunc = (context) => {
    var event = context.arguments[0];
    if(context.callCount === 1){
        context.timing = Date.now();
        context.element = event.target;
    } else {
        //change of element
        if(context.element !== event.target){
            context.split(); //force bounce
        }
    }
};

var callback = (context) => {
    context.timing = Date.now() - context.timing;
    console.log(context);
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
