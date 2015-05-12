var assertion = {
    assert: function(bool,msg) {
        //use this function to bring to attention an unexpected code execution
        test(bool, msg, 'ASSERTION-FAIL');
    },
    expect: function(bool,msg) {
        //use this function to bring to attention a wrong usage of a function
        test(bool, msg, 'WRONG-USAGE');
    },
    warning: function(bool,msg) {
        //use this function to bring to attention a warning
        test(bool, msg, 'WARNING');
    },
    on_error: null
};

export default assertion;

function test(bool, msg, msg_prefix){
    if( bool )
        return;

    communicateToDev(
        msg_prefix+': ' +
        get_calling_fct_info() +
        (msg?(': '+msg):'')
    );
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

function communicateToDev(msg){ 
    if( assertion.on_error ) {
        assertion.on_error(msg);
    }

    if( window && window.location && window.location.hostname && window.location.hostname==='localhost' ) {
        alert(msg);
        throw msg;
    }
    else {
        window.console&&window.console.log&&window.console.log(msg);
    }
} 
