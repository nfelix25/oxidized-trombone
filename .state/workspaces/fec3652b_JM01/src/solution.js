/** ex-1 — First principle: inspect descriptors before freezing objects
 * Read: LESSON.md § "Hook: descriptor snapshots before freezing"
 * Test: "describeDescriptorState returns 'missing' when Object.getOwnPropertyDescriptor is undefined for the key"
 * Start here: call Object.getOwnPropertyDescriptor(obj, key) and branch on whether it returned a descriptor object
 */
export function describeDescriptorState(obj, key) {
  throw new Error("TODO: implement");
}

/** ex-2 — First principle: clone ECMAScript data descriptors without reference leaks
 * Read: LESSON.md § "Core concept: data descriptor cloning"
 * Test: "cloneDataDescriptor returns a new object whose boolean fields default to false when absent on the source descriptor"
 * Start here: retrieve the original descriptor and build a fresh object with default false values for writable/enumerable/configurable
 */
export function cloneDataDescriptor(obj, key) {
  throw new Error("TODO: implement");
}

/** ex-3 — First principle: enforce mutation policy by flipping writable flags
 * Read: LESSON.md § "Worked example: controlling writable"
 * Test: "setWritableFlag true enables property reassignment and returns a descriptor showing writable:true"
 * Start here: defineProperty with writable based on shouldWrite and then return the updated descriptor snapshot
 */
export function setWritableFlag(obj, key, shouldWrite) {
  throw new Error("TODO: implement");
}

/** ex-4 — First principle: control iteration by toggling enumerable visibility
 * Read: LESSON.md § "Worked example: enumerable and iteration"
 * Test: "listEnumerableKeys excludes properties that setWritableFlag previously marked enumerable:false while keeping others"
 * Start here: gather property keys and filter using their current enumerable descriptor values
 */
export function listEnumerableKeys(obj) {
  throw new Error("TODO: implement");
}

/** ex-5 — First principle: lock configuration to prevent redefinition attempts
 * Read: LESSON.md § "Gotcha: configurable=false effects"
 * Test: "guardConfigurable returns false without throwing when attempting to lock an already non-configurable property"
 * Start here: inspect configurable flag, attempt to defineProperty with configurable:false, and return whether the lock changed anything
 */
export function guardConfigurable(obj, key) {
  throw new Error("TODO: implement");
}
