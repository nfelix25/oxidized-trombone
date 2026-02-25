## MODIFIED Requirements

### Requirement: C curriculum contains 44 nodes across 11 tracks
The system SHALL include a C curriculum with ~44 nodes at D2–D3 depth covering advanced C systems-programming topics, organised into eleven tracks.

#### Scenario: C curriculum is accessible via getNode
- **WHEN** `getNode` is called with a C node ID (e.g. `"C200"`)
- **THEN** it returns the node with correct `language: "c"`, `track`, `depthTarget`, `keywords`, and `misconceptionTags`

#### Scenario: C tracks cover all eleven topic domains
- **WHEN** the C curriculum is loaded
- **THEN** nodes exist in tracks: `c-pointers`, `c-ipc`, `c-signals`, `c-concurrency`, `c-networking`, `c-virtual-memory`, `c-filesystem`, `c-kqueue-io`, `c-advanced-concurrency`, `c-dynamic-linking`, `c-subprocess-signals`

### Requirement: C-Networking track (C240–C242) uses portable poll() not Linux epoll
The C-Networking track SHALL cover I/O multiplexing using POSIX `select`/`poll` for portability, with a note that macOS-native kqueue coverage is in the `c-kqueue-io` track.

#### Scenario: C240 covers TCP client-server with BSD sockets
- **WHEN** a session targets node C240
- **THEN** the scaffold plans content on `socket`/`bind`/`listen`/`accept`/`connect`/`send`/`recv`, `struct sockaddr_in`, and a complete echo server/client pair

#### Scenario: C241 covers I/O multiplexing with poll (not epoll)
- **WHEN** a session targets node C241
- **THEN** the scaffold plans content on `select`/`poll` (POSIX), `O_NONBLOCK`, and an event-loop pattern; it SHALL NOT reference Linux-only `epoll`; a note SHALL direct learners to the `c-kqueue-io` track for macOS-native event I/O

#### Scenario: C242 covers UDP sockets
- **WHEN** a session targets node C242
- **THEN** the scaffold plans content on `sendto`/`recvfrom`, UDP characteristics (no connection, no ordering), and a simple datagram echo example

## ADDED Requirements

### Requirement: C curriculum includes six new systems-programming tracks
The C curriculum SHALL include six additional tracks (C3xx–C8xx) covering virtual memory management, filesystem internals, kqueue I/O, advanced concurrency primitives, dynamic linking, and subprocess/signal patterns — the OS foundations required for the JS runtime curriculum.

#### Scenario: New tracks are present in cSeed.js
- **WHEN** the C curriculum is loaded from `cSeed.js`
- **THEN** nodes exist with IDs C300–C306, C400–C404, C500–C506, C600–C603, C700–C703, and C800–C802
