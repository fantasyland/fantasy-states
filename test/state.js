'use strict';

const λ = require('./lib/test');
const applicative = λ.applicative;
const functor = λ.functor;
const mfunctor = λ.mfunctor;
const monad = λ.monad;
const identity = λ.identity;
const State = λ.State;
const Identity = λ.Identity;

function run(a) {
    return a.evalState();
}

exports.state = {

    // Applicative Functor tests
    'All (Applicative)': applicative.laws(λ)(State, run),
    'Identity (Applicative)': applicative.identity(λ)(State, run),
    'Composition (Applicative)': applicative.composition(λ)(State, run),
    'Homomorphism (Applicative)': applicative.homomorphism(λ)(State, run),
    'Interchange (Applicative)': applicative.interchange(λ)(State, run),

    // Functor tests
    'All (Functor)': functor.laws(λ)(State.of, run),
    'Identity (Functor)': functor.identity(λ)(State.of, run),
    'Composition (Functor)': functor.composition(λ)(State.of, run),

    // Monad tests
    'All (Monad)': monad.laws(λ)(State, run),
    'Left Identity (Monad)': monad.leftIdentity(λ)(State, run),
    'Right Identity (Monad)': monad.rightIdentity(λ)(State, run),
    'Associativity (Monad)': monad.associativity(λ)(State, run)
};

exports.stateT = {

    // Applicative Functor tests
    'All (Applicative)': applicative.laws(λ)(State.StateT(Identity), run),
    'Identity (Applicative)': applicative.identity(λ)(State.StateT(Identity), run),
    'Composition (Applicative)': applicative.composition(λ)(State.StateT(Identity), run),
    'Homomorphism (Applicative)': applicative.homomorphism(λ)(State.StateT(Identity), run),
    'Interchange (Applicative)': applicative.interchange(λ)(State.StateT(Identity), run),

    // Functor tests
    'All (Functor)': functor.laws(λ)(State.StateT(Identity).of, run),
    'Identity (Functor)': functor.identity(λ)(State.StateT(Identity).of, run),
    'Composition (Functor)': functor.composition(λ)(State.StateT(Identity).of, run),

    // Monad tests
    'All (Monad)': monad.laws(λ)(State.StateT(Identity), run),
    'Left Identity (Monad)': monad.leftIdentity(λ)(State.StateT(Identity), run),
    'Right Identity (Monad)': monad.rightIdentity(λ)(State.StateT(Identity), run),
    'Associativity (Monad)': monad.associativity(λ)(State.StateT(Identity), run),

    //MFunctor tests
    'Composition (MFunctor)': mfunctor.composition(λ)(State.StateT(Identity), run),
    'Identity (MFunctor)': mfunctor.identity(λ)(State.StateT(Identity), run),

};
