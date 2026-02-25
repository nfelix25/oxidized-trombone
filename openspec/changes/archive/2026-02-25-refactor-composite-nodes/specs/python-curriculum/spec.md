## ADDED Requirements

### Requirement: Python High-Priority Composite Nodes Are Split Into Atomic Sub-Nodes
Python nodes that conflate multiple unrelated utilities or primitives SHALL be replaced by atomic sub-nodes:

- **PD06** (deque + Counter + defaultdict — 3 unrelated collections) SHALL be split into: PD06 (collections.deque: double-ended queue, appendleft, rotate, maxlen), PD06b (collections.Counter: counting hashables, most_common, arithmetic operators), and PD06c (collections.defaultdict: missing-key factory, use cases vs dict.setdefault).
- **PA04** (5 async synchronization primitives) SHALL be split into: PA04 (asyncio.Queue: producer-consumer patterns, get/put, task_done/join) and PA04b (asyncio.Lock, Event, Semaphore, Condition: the coordination primitive family).
- **PA05** (5+ threading primitives) SHALL be split into: PA05 (threading.Thread and Lock: the basic thread creation and mutual exclusion pattern) and PA05b (threading.Event, Condition, RLock: signalling and re-entrant locking).
- **PA06** (4+ multiprocessing concepts) SHALL be split into: PA06 (multiprocessing.Process: fork semantics, start/join, daemon processes), PA06b (multiprocessing.Pool: map/starmap/apply_async, worker pool pattern), and PA06c (multiprocessing.Queue and shared memory: IPC between processes).
- **PT07** (4 unrelated type annotations: TypedDict, Literal, Final, ClassVar) SHALL be split into: PT07 (typing.TypedDict: total/partial typed dicts, inheritance) and PT07b (Literal, Final, ClassVar: value-constrained types and class-level annotations).

#### Scenario: PD06 covers only deque
- **WHEN** a session targets node PD06
- **THEN** the scaffold plans content exclusively on collections.deque, O(1) append/pop from both ends, maxlen for bounded queues, and rotate

#### Scenario: PD06b covers Counter
- **WHEN** a session targets node PD06b
- **THEN** the scaffold plans content on Counter construction, most_common(), arithmetic operations (+, -, &, |), and typical frequency analysis patterns

#### Scenario: PD06c covers defaultdict
- **WHEN** a session targets node PD06c
- **THEN** the scaffold plans content on the default_factory callable, grouping patterns, and when to use defaultdict vs dict.setdefault vs collections.Counter

#### Scenario: PA04 covers asyncio.Queue only
- **WHEN** a session targets node PA04
- **THEN** the scaffold plans content on asyncio.Queue, producer/consumer coroutines, put/get, task_done, and join for backpressure

#### Scenario: PA06b covers Pool
- **WHEN** a session targets node PA06b
- **THEN** the scaffold plans content on Pool.map, Pool.starmap, Pool.apply_async, chunksize, and the process pool as a higher-level abstraction over multiprocessing.Process
