const {test} = require('tap');
const CancellableMutex = require('../../src/util/tw-cancellable-mutex');

test('basic queing', t => {
    const mutex = new CancellableMutex();
    const events = [];

    // Even though this operation takes the longest, because they are run sequentially,
    // should finish first.
    mutex.do(() => new Promise(resolve => {
        setTimeout(() => resolve(5), 100);
    })).then(value => {
        // Make sure resolved value passes through transparently
        t.equal(value, 5);
        events.push(1);
    });

    // Tests rejection and instant finishing.
    mutex.do(() => new Promise((resolve, reject) => {
        reject(new Error('Test error'));
    })).catch(error => {
        // Make sure rejection reason passes through transparently
        t.equal(error.message, 'Test error');
        events.push(2);
    });

    mutex.do(() => new Promise(resolve => {
        setTimeout(() => {
            resolve();

            // At this point the queue of operations is now empty. Make sure it can
            // resume operations from this state.
            setTimeout(() => {
                mutex.do(() => new Promise(resolve2 => {
                    resolve2();
                })).then(() => {
                    events.push(4);
                    t.same(events, [1, 2, 3, 4]);
                    t.end();
                });
            });
        }, 50);
    })).then(() => {
        events.push(3);
    });
});

test('cancellation', t => {
    const mutex = new CancellableMutex();

    // Start operation that should never end and then grab its cancel checker.
    let isCancelled = null;
    mutex.do(_isCancelled => new Promise(() => {
        isCancelled = _isCancelled;
    }));
    t.equal(isCancelled(), false);

    // This operation should never run.
    mutex.do(() => new Promise(() => {
        t.fail();
    }));

    // After dispoing, existing operation should be cancelled, queue should be cleared.
    mutex.cancel();
    t.equal(isCancelled(), true);

    mutex.do(() => new Promise(() => {
        t.end();
    }));
});
