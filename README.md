# throttled-debounce

```JavaScript
var controlFunc = (options) => {
    var event = options.arguments[0];
    if(options.callCount === 1){
		options.timing = Date.now();
        options.element = event.target;
    } else {
        //change of element
        if(options.element !== event.target){
            options.bounce();
        }
    }
};

var func = (options) => {
	options.timing = Date.now() - options.timing;
    console.log(options);
};

window.onscroll = throttledDebounce({func: func, controlFunc: controlFunc, maxDelay: 3000, throttleWait: 500});
```

```JavaScript
window.onscroll.cancel();
window.onscroll.resume();
```

```JavaScript
window.onscroll.bounce();
```
