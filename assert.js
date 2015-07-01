// use this function to bring to attention an unexpected code execution, i.e. a bug
var assert =
    function(bool,msg) {
        test(bool, msg, 'ASSERTION-FAIL');
    };

// use this function to bring to attention a wrong usage of an API
assert.expect =
    function(bool,msg) {
        test(bool, msg, 'WRONG-USAGE');
    };

// use this function to bring to attention a warning, i.e. something non-critical
assert.warning =
    function(bool,msg) {
        test(bool, msg, 'WARNING', true);
    };

assert.onerror = null;

module.exports = assert;

function test(bool, msg, msg_prefix, is_not_critical){
    if( bool )
        return;

    var msg =
        msg_prefix + ': ' +
        get_calling_fct_info() +
        ( msg ? ( ': ' + msg) : '');

    communicateToDev(
        msg,
        is_not_critical);
}

function get_calling_fct_info(){ 
    //in non-strict-mode;
        //arguments.callee
        //arguments.callee.caller
        //arguments.callee.caller.caller
        //...
    var skipCallFcts = 2;

    if( !new Error().stack ) {
        call_stack = [];
        var caller = arguments.callee;
        for( var i=0;i<=skipCallFcts;i++ ) if( caller ) caller = caller.caller;
        return caller.toString();
    }

    var errorStack_line = (function(){
        var errorStack = new Error().stack;

        //remove top lines
        skipCallFcts+=2;
        do {
            errorStack = errorStack.replace(/.*[\s\S]/,'');
        }while( skipCallFcts-- )

        //remove bottom lines
        return errorStack.split('\n')[0];
    })();

    var fct_location = /[^\/]*$/.exec(errorStack_line).toString().replace(/\:[^\:]*$/,'');

    var fct_name = errorStack_line.replace(/\s\(.*$/,'').replace(/^.*\s/,'');

    return fct_name+'['+fct_location+']';
} 

function communicateToDev(msg, is_not_critical){ 
    if( assert.onerror ) {
        assert.onerror(msg);
    }

    if( ( typeof location === "undefined" || location.hostname==='localhost' ) && !is_not_critical ) {
        typeof alert !== "undefined" && alert(msg);
        throw msg;
    }
    else {
        typeof console !== "undefined" && console.log && console.log(msg);
    }
} 
