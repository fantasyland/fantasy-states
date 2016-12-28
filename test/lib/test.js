'use strict';

const λ = require('fantasy-check/src/adapters/nodeunit');
const applicative = require('fantasy-check/src/laws/applicative');
const functor = require('fantasy-check/src/laws/functor');
const monad = require('fantasy-check/src/laws/monad');
const helpers = require('fantasy-check/src/laws/helpers');

const daggy = require('daggy');

const {isInstanceOf} = require('fantasy-helpers');
const {constant, identity, compose} = require('fantasy-combinators');

const Identity = require('fantasy-identities');
const State = require('../../fantasy-states');

const equality = helpers.equality;

const mfunctor = {
    composition: function(λ) {
        return function(T, unpack) {
            return λ.check(function(a) {
                var x = T.hoist(compose(identity)(identity))(T.of(a)),
                    y = compose(T.hoist(identity))(T.hoist(identity))(T.of(a));
                return equality(unpack(x), unpack(y));
            }, [λ.AnyVal]);
        };
    },
    identity: function(λ) {
        return function(T, unpack) {
            return λ.check(function(a) {
                var x = T.hoist(identity)(T.of(a)),
                    y = identity(T.of(a));
                return equality(unpack(x), unpack(y));
            }, [λ.AnyVal]);
        };
    }
};

const isIdentity = isInstanceOf(Identity);
const isState = isInstanceOf(State);
const isIdentityOf = isInstanceOf(identityOf);

Identity.prototype.traverse = function(f, p) {
    return p.of(f(this.x));
};

function identityOf(type) {
    const self = this.getInstance(this, identityOf);
    self.type = type;
    return self;
}

const λʹ = λ
    .property('applicative', applicative)
    .property('functor', functor)
    .property('mfunctor', mfunctor)
    .property('monad', monad)
    .property('State', State)
    .property('Identity', Identity)
    .property('isIdentity', isIdentity)
    .property('identityOf', identityOf)
    .method('arb', isIdentityOf, function(a, b) {
        return Identity.of(this.arb(a.type, b - 1));
    });


// Export
if(typeof module != 'undefined')
    module.exports = λʹ;
