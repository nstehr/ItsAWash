function WashState(wash) {
    this.wash = wash;
    this.ts = 1000; // some arbitrary timeout for now
}
WashState.prototype = {
    start: function() {
        setTimeout(this.timeout, this.ts);
    },
    end: function() {},
    pause: function() {},
    timeout: function(){}
};

function Idle(wash) {
    WashState.call(this, wash);
}
Idle.prototype = Object.create(WashState.prototype, {
    start: {
        value: function() {
            // get facts
        }
    },
    end: {
        value: function() {
            // clean up
        }
    },
    pause: {
        value: function() {
            // do nothing
        }
    },
    timeout: {
        value: function() {
        }
    }
});

function Greet(wash) {
    WashState.call(this, wash);
}
Greet.prototype = Object.create(WashState.prototype, {
    start: {
        value: function() {
            // say hello
        }
    },
    end: {
        value: function() {
            // clean up
        }
    },
    pause: {
        value: function() {
            // do nothing
        }
    },
    timeout: {
        value: function() {
        }
    }
});

function Prompt(wash) {
    WashState.call(this, wash);
}
Prompt.prototype = Object.create(WashState.prototype, {
    start: {
        value: function() {
            // ask to wash hands
        }
    },
    end: {
        value: function() {
            // clean up
        }
    },
    pause: {
        value: function() {
            // do nothing
        }
    },
    timeout: {
        value: function() {
        }
    }
});

function WetHands(wash) {
    WashState.call(this, wash);
}
WetHands.prototype = Object.create(WashState.prototype, {
    start: {
        value: function() {
            // start water
        }
    },
    end: {
        value: function() {
            // clean up
        }
    },
    pause: {
        value: function() {
            // prompt for more time
        }
    },
    timeout: {
        value: function() {
        }
    }
});

function Wash(wash) {
    this.states = {
        idle: new Idle(this),
        greet: new Greet(this)
    };
    this.current = 'idle';
}
Wash.prototype = {
    run: function(state) {
        this.states[this.current].start();
    },
    handOut: function() {

    },
    handIn: function() {

    }
};

