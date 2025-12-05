const {test} = require('tap');
const {OrderedMap} = require('immutable');
const {compareImmutableMaps, mergeMaps} = require('../../src/util/tw-immutable-util');

test('compareImmutableMaps', t => {
    t.ok(compareImmutableMaps(OrderedMap(), OrderedMap()));
    t.ok(compareImmutableMaps(OrderedMap({
        a: 'hello'
    }), OrderedMap({
        a: 'hello'
    })));
    t.ok(compareImmutableMaps(OrderedMap({
        what: 0,
        why: 'how'
    }), OrderedMap({
        why: 'how',
        what: 0
    })));

    t.notOk(compareImmutableMaps(OrderedMap({
        a: 0
    }), OrderedMap({
        a: -0
    })));
    t.notOk(compareImmutableMaps(OrderedMap(), OrderedMap({
        a: 0
    })));
    t.notOk(compareImmutableMaps(OrderedMap({
        a: 0
    }), OrderedMap()));

    const arr = [];
    t.ok(compareImmutableMaps(OrderedMap({
        arr
    }), OrderedMap({
        arr
    })));
    t.notOk(compareImmutableMaps(OrderedMap({
        arr: []
    }), OrderedMap({
        arr: []
    })));

    t.end();
});

test('mergeMaps', t => {
    t.ok(compareImmutableMaps(mergeMaps(
        OrderedMap({
            a: 'hello',
            b: 'bye',
            c: 'ok'
        }),
        OrderedMap({
            b: '!!',
            c: null,
            d: 'e',
            e: undefined
        })
    ), OrderedMap({
        a: 'hello',
        b: '!!',
        c: 'ok',
        d: 'e',
        e: undefined
    })));

    t.ok(compareImmutableMaps(mergeMaps(
        OrderedMap({
            a: 0
        }),
        OrderedMap({
            a: -0
        })
    ), OrderedMap({
        a: -0
    })));

    t.ok(compareImmutableMaps(mergeMaps(
        OrderedMap({
            a: -0
        }),
        OrderedMap({
            a: 0
        })
    ), OrderedMap({
        a: 0
    })));

    t.end();
});
