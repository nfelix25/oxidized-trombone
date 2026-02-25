// Type and tuple demos for the exercise crate.

/// Demonstrates explicit integer annotations and conversions when mixing signed and unsigned energy data.
/// Implementers should add the signed delta to the unsigned baseline using safe casting that preserves totals.
pub fn sum_mixed_integers(delta_signed: i32, baseline_unsigned: u64) -> u64 {
    // Combine i32 and u64 values via deliberate casting choices to avoid overflow surprises.
    todo!()
}

/// Highlights tuple destructuring with annotated element types and underscores for unused bindings.
/// Implementers should destructure a `(char, bool, f64)` packet and return the pieces exactly as received to reinforce ownership.
pub fn split_tuple_components(packet: (char, bool, f64)) -> (char, bool, f64) {
    // Break the tuple apart with pattern matching before reassembling the values for the caller.
    todo!()
}

/// Reinforces `const` bindings with `f64` precision and shows they remain accessible across calls.
/// Implementers should expose a smart-home Planck ratio constant and return it as a double-precision literal without mutation.
pub fn const_planck_ratio() -> f64 {
    // Declare a descriptive `const` and hand the literal back directly to prove immutability.
    todo!()
}
