#![allow(dead_code)]

/// Demonstrates that `let` bindings are immutable by default and should return a preset `i32`.
/// Implement by declaring an immutable indoor temperature and handing the value back untouched.
pub fn init_temperature() -> i32 {
    // TODO: Declare an immutable reading and return it.
    todo!()
}

/// Highlights the `mut` keyword by letting a boolean binding flip states before being returned.
/// Implement by toggling the provided power flag and persisting the mutated result.
pub fn toggle_power_state(current: bool) -> bool {
    // TODO: Copy the flag into a mutable binding, toggle it, and return the outcome.
    todo!()
}

/// Reinforces `const` declarations with explicit types for freezing thresholds.
/// Implement by defining a constant freeze level and making the function expose it.
pub fn freeze_level() -> i32 {
    // TODO: Declare a typed const inside or outside the function and surface its value.
    todo!()
}

/// Explores shadowing by reusing the same identifier for transformed numeric readings.
/// Implement by deriving successive bindings that change the value without mutating the original.
pub fn shadow_demo(reading: i32) -> i32 {
    // TODO: Shadow the input with new bindings and return the final value.
    todo!()
}

/// Emphasizes uppercase `const` naming and compile-time literals for identifiers.
/// Implement by exposing a string slice tied to a `const` that follows style guidelines.
pub fn const_identifier() -> &'static str {
    // TODO: Define the const identifier literal and return it here.
    todo!()
}

/// Showcases the unit type by logging side effects while returning `()` explicitly.
/// Implement by emitting diagnostics or counters and finishing with the unit value.
pub fn unit_logger(message: &str) {
    // TODO: Perform some observable action, then end with () implicitly or explicitly.
    todo!()
}
