// Smart-home binding demos for the exercise crate.

/// Demonstrates Rust's default immutability with `let` bindings and type inference.
/// Implementers should return the sample city's population as an `i32` without using `mut`.
pub fn define_city_population() -> i32 {
    // Bind an immutable population value with `let` and return it directly.
    todo!()
}

/// Highlights when `mut` is required to flip a boolean smart-home alarm state.
/// Implementers should toggle the state twice to prove mutations happen in a scoped, reversible way.
pub fn toggle_alarm_state(initial_state: bool) -> bool {
    // Make a mutable copy of the alarm state, flip it, then flip it back to demonstrate control.
    todo!()
}

/// Reinforces explicit `f64` math with `let`, constants, and inferred temporaries for interest calculations.
/// Implementers should compute `(gain / principal)` with double precision and illustrate why `mut` is unnecessary.
pub fn compute_interest_rate(principal: f64, gain: f64) -> f64 {
    // Use precise floating-point bindings (and optional consts) to derive the fractional interest rate.
    todo!()
}
