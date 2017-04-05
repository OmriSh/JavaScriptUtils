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
            options.split();
        }
    }
};

var callback = (options) => {
	options.timing = Date.now() - options.timing;
    console.log(options);
};

window.scroll_handler = throttledDebounce({callback: callback, controlFunc: controlFunc, maxDelay: 3000, throttleWait: 500});
document.addEventListener('scroll', window.scroll_handler, true);
```

```JavaScript
window.scroll_handler.cancel();
window.scroll_handler.resume();
```

```JavaScript
window.scroll_handler.bounce();
```
