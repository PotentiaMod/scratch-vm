const fs = require('node:fs');
const path = require('node:path');
const {test} = require('tap');
const VM = require('../../src/virtual-machine');

test('monitor update', t => {
    const fixture = path.join(__dirname, '../fixtures/tw-monitors.sb3');
    const vm = new VM();
    vm.loadProject(fs.readFileSync(fixture)).then(() => {
        const variable = vm.runtime.getTargetForStage().lookupVariableByNameAndType('variable', '');
        const list = vm.runtime.getTargetForStage().lookupVariableByNameAndType('list', 'list');

        const updates = [];
        vm.runtime.on('MONITORS_UPDATE', monitors => {
            const values = {};
            for (const monitor of monitors.values()) {
                const name = Object.values(monitor.get('params'))[0];
                const value = monitor.get('value');
                values[name] = value;
            }
            updates.push(values);
        });

        // Baseline start
        updates.length = 0;
        vm.runtime._step();
        t.equal(updates.length, 1);
        t.equal(updates[0].variable, 0);
        t.same(updates[0].list, []);

        // Change variable to 5
        updates.length = 0;
        variable.value = 5;
        vm.runtime._step();
        t.equal(updates.length, 1);
        t.equal(updates[0].variable, 5);
        t.same(updates[0].list, []);

        // Change variable to -0
        updates.length = 0;
        variable.value = -0;
        vm.runtime._step();
        t.equal(updates.length, 1);
        t.ok(Object.is(updates[0].variable, -0));
        t.same(updates[0].list, []);

        // Change variable to 0
        updates.length = 0;
        variable.value = 0;
        vm.runtime._step();
        t.equal(updates.length, 1);
        t.ok(Object.is(updates[0].variable, 0));
        t.same(updates[0].list, []);

        // Replace list entirely
        updates.length = 0;
        list.value = [1, 2, 3];
        vm.runtime._step();
        t.equal(updates.length, 1);
        t.equal(updates[0].variable, 0);
        t.same(updates[0].list, [1, 2, 3]);

        // Append to list
        updates.length = 0;
        list.value.push(4);
        list.value._monitorUpToDate = false;
        vm.runtime._step();
        t.equal(updates.length, 1);
        t.equal(updates[0].variable, 0);
        t.same(updates[0].list, [1, 2, 3, 4]);

        t.end();
    });
});
