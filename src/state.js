'use strict';

const daggy = require('daggy');

const {Tuple2} = require('fantasy-tuples');
const {constant} = require('fantasy-combinators');

const State = daggy.tagged('run');

// Methods
State.of = (a) => {
    return State((b) => Tuple2(a, b));
};

State.prototype.chain = function(f) {
    return State((s) => {
        const result = this.run(s);
        return f(result._1).run(result._2);
    });
};

State.get = State((s) => Tuple2(s, s));

State.modify = (f) => {
    return State((s) => Tuple2(null, f(s)));
};

State.put = (s) => {
    return State.modify(constant(s));
};

State.prototype.evalState = function(s) {
    return this.run(s)._1;
};

State.prototype.exec = function(s) {
    return this.run(s)._2;
};

// Derived
State.prototype.map = function(f) {
    return this.chain((a) => State.of(f(a)));
};

State.prototype.ap = function(a) {
    return this.chain((f) => a.map(f));
};

// Transformer
State.StateT = (M) => {
    const StateT = daggy.tagged('run');
    StateT.lift = (m) => {
        return StateT((b) => {
            return m.map((c) => Tuple2(c, b));
        });
    };

    StateT.of = (a) => {
        return StateT((b) => M.of(Tuple2(a, b)));
    };

    StateT.prototype.chain = function(f) {
        return StateT((s) => {
            const result = this.run(s);
            return result.chain((t) => f(t._1).run(t._2));
        });
    };

    StateT.get = StateT((s) => M.of(Tuple2(s, s)));

    StateT.modify = (f) => {
        return StateT((s) => M.of(Tuple2(null, f(s))));
    };

    StateT.put = function(s) {
        return StateT.modify(constant(s));
    };

    StateT.prototype.evalState = function(s) {
        return this.run(s).map((t) => t._1);
    };

    StateT.prototype.exec = function(s) {
        return this.run(s).map((t) => t._2);
    };

    StateT.prototype.map = function(f) {
        return this.chain((a) => StateT.of(f(a)));
    };

    StateT.prototype.ap = function(a) {
        return this.chain((f) => a.map(f));
    };

    return StateT;
};

// Export
if(typeof module != 'undefined')
    module.exports = State;
