import test from 'node:test';
import assert from 'node:assert/strict';
import {
  describeDescriptorState,
  cloneDataDescriptor,
  setWritableFlag,
  listEnumerableKeys,
  guardConfigurable
} from '../src/solution.js';
import {
  applyDescriptorBatch,
  mapForeignDescriptor,
  promoteDescriptorToTrap
} from '../src/descriptors.js';

test('describeDescriptorState: returns missing when descriptor absent', () => {
  const obj = {};
  const result = describeDescriptorState(obj, 'ghost');
  assert.equal(result, 'missing', 'should return literal word missing when descriptor absent');
});

test('describeDescriptorState: reports ordered flag summary', () => {
  const obj = {};
  Object.defineProperty(obj, 'flag', {
    value: 1,
    writable: true,
    enumerable: false,
    configurable: true
  });
  const summary = describeDescriptorState(obj, 'flag');
  assert.equal(summary, 'writable:true enumerable:false configurable:true', 'should list writable enumerable configurable flags in order');
});

test('cloneDataDescriptor: clones descriptor and defaults booleans', () => {
  const obj = {};
  Object.defineProperty(obj, 'alpha', { value: 10, writable: true });
  const source = Object.getOwnPropertyDescriptor(obj, 'alpha');
  const clone = cloneDataDescriptor(obj, 'alpha');
  assert.notStrictEqual(clone, source, 'should return a new descriptor object');
  assert.equal(clone.writable, true, 'should preserve writable flag from source');
  assert.equal(clone.enumerable, false, 'should default enumerable to false when missing on source');
  assert.equal(clone.configurable, false, 'should default configurable to false when missing on source');
  assert.equal(clone.value, 10, 'should copy the descriptor value field');
});

test('setWritableFlag: enabling writes updates descriptor snapshot', () => {
  const obj = {};
  Object.defineProperty(obj, 'token', { value: 1, writable: false, enumerable: true, configurable: true });
  const updatedDescriptor = setWritableFlag(obj, 'token', true);
  obj.token = 42;
  assert.equal(obj.token, 42, 'should permit writing new values after enabling writable');
  assert.equal(updatedDescriptor.writable, true, 'returned descriptor should advertise writable true');
});

test('setWritableFlag: disabling writes prevents future assignment attempts', () => {
  const obj = {};
  Object.defineProperty(obj, 'token', { value: 5, writable: true, enumerable: true, configurable: true });
  const updatedDescriptor = setWritableFlag(obj, 'token', false);
  assert.throws(() => {
    obj.token = 99;
  }, TypeError, 'should throw TypeError in strict mode when writing to a non writable property');
  assert.equal(obj.token, 5, 'should retain the old value after failed write');
  assert.equal(updatedDescriptor.writable, false, 'returned descriptor should show writable false');
});

test('listEnumerableKeys: filters out enumerability hidden entries while preserving others', () => {
  const obj = {};
  Object.defineProperty(obj, 'hidden', { value: 'secret', enumerable: false, writable: true, configurable: true });
  Object.defineProperty(obj, 'visible', { value: 'shared', enumerable: true, writable: true, configurable: true });
  setWritableFlag(obj, 'hidden', true);
  const keys = listEnumerableKeys(obj);
  assert.deepEqual(keys, ['visible'], 'should omit non enumerable keys but keep enumerable ones in order');
});

test('guardConfigurable: returns false when property already locked', () => {
  const obj = {};
  Object.defineProperty(obj, 'sealed', { value: 1, configurable: false, writable: true, enumerable: true });
  const result = guardConfigurable(obj, 'sealed');
  assert.equal(result, false, 'should report lock failure when property is already non configurable');
  const descriptor = Object.getOwnPropertyDescriptor(obj, 'sealed');
  assert.equal(descriptor.configurable, false, 'should leave the property non configurable');
});

test('guardConfigurable: locks configurable flag and reports success', () => {
  const obj = {};
  Object.defineProperty(obj, 'open', { value: 1, configurable: true, writable: true, enumerable: true });
  const result = guardConfigurable(obj, 'open');
  assert.equal(result, true, 'should signal lock success when transitioning to non configurable');
  const descriptor = Object.getOwnPropertyDescriptor(obj, 'open');
  assert.equal(descriptor.configurable, false, 'should set configurable to false');
});

test('applyDescriptorBatch: applies descriptors and returns original object', () => {
  const target = {};
  const returned = applyDescriptorBatch(target, {
    alpha: { value: 1, writable: true, enumerable: true, configurable: true },
    beta: { value: 2, writable: false, enumerable: false, configurable: false }
  });
  assert.strictEqual(returned, target, 'should return the same object reference that was passed in');
  assert.equal(target.alpha, 1, 'should define alpha from descriptor map');
  assert.equal(Object.getOwnPropertyDescriptor(target, 'beta').writable, false, 'should define beta using provided descriptor');
});

test('applyDescriptorBatch: omitting enumerable defaults it to false', () => {
  const target = {};
  applyDescriptorBatch(target, {
    hidden: { value: 123, writable: true, configurable: true }
  });
  const descriptor = Object.getOwnPropertyDescriptor(target, 'hidden');
  assert.equal(descriptor.enumerable, false, 'should default enumerable to false when omitted in descriptor map');
});

test('mapForeignDescriptor: converts readOnly schema into JS descriptor flags', () => {
  const result = mapForeignDescriptor({ readOnly: true });
  assert.equal(result.writable, false, 'readOnly true should translate to writable false');
  assert.equal(result.configurable, false, 'readOnly schema should lock configurability in JS terms');
});

test('promoteDescriptorToTrap: merges plan defaults and descriptor metadata for proxy config', () => {
  const plan = { trap: 'defineProperty', defaults: { stage: 'pre', notify: true } };
  const descriptor = { key: 'mode', writable: false, configurable: false, enumerable: true };
  const trapConfig = promoteDescriptorToTrap(plan, descriptor);
  assert.strictEqual(trapConfig.plan, plan, 'should keep direct reference to the plan for reuse');
  assert.strictEqual(trapConfig.descriptor, descriptor, 'should expose the descriptor metadata that was passed in');
  assert.deepEqual(trapConfig.config, { stage: 'pre', notify: true, key: 'mode', writable: false, configurable: false, enumerable: true }, 'should merge plan defaults and descriptor metadata into the proxy config payload');
});