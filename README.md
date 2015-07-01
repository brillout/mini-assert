```
// var assert = require('mini-assert'); // NPM, `npm install mini-assert`
// import assert from "mini-assert"; // JSPM, `jspm install npm:mini-assert`

var bool = Math.random()>0.5;

// use this function to bring to attention
// an unexpected code execution, i.e. a bug
assert(bool, "should not be <=0.5");

// use this function to bring to attention
// a wrong usage of an API
assert.expect(bool, "should be >0.5");

// use this function to bring to attention
// a warning, i.e. something non-critical
assert.warning(bool, "be careful; <= 0.5");

assert.onerror = function(){
    // track errors
};

```

the only differences between `assert`, `assert.expect`, and `assert.warning` are;
  - the error message is prepended with a different name: `ASSERTION-FAIL: /*...*/`, `WRONG-USAGE: /*...*/`, `WARNING: /*...*/`
  - [`assert`, `assert.expect`] throw an error whereas `assert.warning` only does a console.log

If in the browser and if `location.hostname!=='localhost'` then no error is ever thrown and only console.log is used
