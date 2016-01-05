const State = require('../fantasy-state');
const {Tuple2} = require('fantasy-tuples');
const {constant} = require('fantasy-combinators');

// Tuple2 Number Number
const initial = Tuple2(0, 1);

// State (Tuple2 Number Number) Number -> State (Tuple2 Number Number) Number
const next = discard(
    State.modify((t) => {
        return Tuple2(t._1 + 1, (t._1 + 1) * t._2);
    }),
    State.get.map(snd)
);

// Number
const result = factorial(5);

// Tuple2 a b -> b
function snd(t) {
    return t._2;
}

// (m a, m b) -> m b
function discard(a, b) {
    return a.chain(constant(b));
}

// Array (m a) -> m a
function sequence(actions) {
    var r = actions[0],
        i;
    for(i = 1; i < actions.length; i++) {
        r = discard(r, actions[i]);
    }
    return r;
}

// (Number, a) -> Array a
function replicate(n, x) {
    var r = [],
        i;
    for(i = 0; i < n; i++) {
        r.push(x);
    }
    return r;
}

// Number -> Number
function factorial(n) {
    return sequence(replicate(n, next)).evalState(initial);
}

// Side-effect!
console.log(result);
