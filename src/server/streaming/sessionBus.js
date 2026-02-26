import { EventEmitter } from "node:events";

/**
 * In-memory SSE bus.
 * Maps sessionId -> EventEmitter so the server can push events to
 * connected clients without a database.
 */
const registry = new Map();

export function create(sessionId) {
  const emitter = new EventEmitter();
  emitter.setMaxListeners(20);
  registry.set(sessionId, emitter);
  return emitter;
}

export function emit(sessionId, event) {
  registry.get(sessionId)?.emit("event", event);
}

export function subscribe(sessionId, handler) {
  registry.get(sessionId)?.on("event", handler);
}

export function unsubscribe(sessionId, handler) {
  registry.get(sessionId)?.off("event", handler);
}

export function destroy(sessionId) {
  const emitter = registry.get(sessionId);
  if (emitter) {
    emitter.removeAllListeners();
    registry.delete(sessionId);
  }
}
