var Tuple2 = require('fantasy-tuples').Tuple2,
    daggy = require('daggy'),
    State = daggy.tagged('runState');

// Methods
State.of = function(a) {
    return State(function(b) {
        return Tuple2(a, b);
    });
};
State.prototype.chain = function(f) {
    var state = this;
    return State(function(s) {
        var result = state.runState(s);
        return f(result._1).runState(result._2);
    });
};
State.get = State(function(s) {
    return Tuple2(s, s);
});
State.modify = function(f) {
    return State(function(s) {
        return Tuple2(null, f(s));
    });
};
State.put = function(s) {
    return State.modify(function(a) {
        return s;
    });
};
State.prototype.eval = function(s) {
    return this.runState(s)._1;
};
State.prototype.exec = function(s) {
    return this.runState(s)._2;
};

// Derived
State.prototype.map = function(f) {
    return this.chain(function(a) {
        return State.of(f(a));
    });
};
State.prototype.ap = function(a) {
    return this.chain(function(f) {
        return a.map(f);
    });
};

// Export
if(typeof module != 'undefined')
    module.exports = State;
