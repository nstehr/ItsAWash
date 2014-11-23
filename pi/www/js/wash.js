function WashState(wash) {
    this.wash = wash;
    this.ts = 3000;
    this.currentTime=0; // some arbitrary timeout for now
}
WashState.prototype = {
    start: function() {},
    end: function() {},
    pause: function() {},
    timeout: function(){this.IntervalId = setInterval(this.timeoutAction.bind(this), 1000)},
    timeoutAction:  function(){ 
        if (this.currentTime >= this.ts) 
        {
            clearInterval(this.IntervalId);
            this.end();
        }else{
            console.log(this);
            this.currentTime = this.currentTime + 1000
        }
    }
};


/******Default state******/
function Idle(wash) {
    WashState.call(this, wash);
}
Idle.prototype = Object.create(WashState.prototype, {
    start: {
        value: function() {
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


/*******States triggered by hardware********/

//Triggered by entering the washroom
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

//After they have flushed
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

//Hands detected in sensor (this includes soap)
function WetHands(wash) {
    WashState.call(this, wash);
}
WetHands.prototype = Object.create(WashState.prototype, {
    start: {
        value: function() {
            console.log("currentTime is " + this.currentTime +"current is " + stateMachine.current)
            if (this.currentTime > this.ts && (stateMachine.current != 'wethands' || stateMachine.current != "idle") ) {return ;}
            console.log("wethands started");
            this.timeout();
        }
    },
    end: {
        value: function() {
            console.log("wethands ended");
            this.currentTime = 0;
            if (stateMachine.current == "wethands"){
                stateMachine.run('latherhands')
            }
        }
    },
    pause: {
        //This should only be triggered by HandsRemoved
        value: function() {
    clearInterval(this.IntervalId)
            if (this.currentTime >= this.ts){ //The task was not finished
                this.end();
            }
        }
    },
   timeout: {
        value: function() {
            WashState.prototype.timeout.call(this)
        }
    }
});

/****** States triggered by other States *******/

//Triggered by timeout->end on wet hands
function LatherHands(wash) {
    WashState.call(this, wash);
}
LatherHands.prototype = Object.create(WashState.prototype, {
  start: {
        value: function() {
            console.log("latherhands started");
            this.timeout();
        }
    },
    end: {
        value: function() {
            console.log("latherhands ended");
            this.currentTime = 0;
            if (stateMachine.current == "latherhands"){
                stateMachine.run('scrubhands')
            }
        }
    },
    pause: {
        //This should only be triggered by HandsRemoved
        value: function() {
            clearInterval(this.IntervalId)
            if (this.currentTime >= this.ts){ //The task was not finished
                this.end();
            }
        }
    },
   timeout: {
        value: function() {
            WashState.prototype.timeout.call(this)
        }
    }
});

//Triggered by timeout on lather
function ScrubHands(wash) {
    this.ts = 2000;
    WashState.call(this, wash);
}
ScrubHands.prototype = Object.create(WashState.prototype, {
 start: {
        value: function() {
            console.log("scrubhands started");
            this.timeout();
        }
    },
    end: {
        value: function() {
            console.log("scrubhands ended");
            this.currentTime = 0;
            stateMachine.run('idle')
        }
    },
    pause: {
        //This should only be triggered by HandsRemoved
        value: function() {
            clearInterval(this.IntervalId)
            if (this.currentTime >= this.ts){ 
                this.end();
            }
        }
    },
   timeout: {
        value: function() {
            WashState.prototype.timeout.call(this)
        }
    }
});


function StateMachine() {
    this.states = {
        idle: new Idle(this),
        greet: new Greet(this),
        wethands: new WetHands(this),
        prompt: new Prompt(this),
        latherhands: new LatherHands(this),
        scrubhands: new ScrubHands(this)
    };
    this.current = 'idle';
    this.signal = ""
}
StateMachine.prototype = {
    run: function(state) {
        console.log("signal is " + this.signal)
        if (this.signal == "HandDetected"){
            this.current = state;
            this.states[this.current].start();
        }
    },
    interruptState: function(){
        this.states[this.current].pause();
    }
};

stateMachine = new StateMachine();

