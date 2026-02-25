#![allow(dead_code)]

/// Demonstrates explicit numeric typing by capping wide readings into a `u64` domain.
/// Implement by finding the largest `u128` in `candidates` and clamping it to `u64::MAX` when necessary.
pub fn max_u64_sensor(candidates: &[u128]) -> u64 {
    // TODO: Determine the maximum reading and prevent overflow beyond `u64::MAX`.
    todo!()
}

/// Highlights floating-point type inference and the Option pattern for potentially missing data.
/// Implement by returning `Some` average of `values` as an `f64` or `None` when the slice is empty.
pub fn avg_f64_readings(values: &[f64]) -> Option<f64> {
    // TODO: Sum with `f64` precision, divide by the count, and wrap the result in `Option`.
    todo!()
}

/// Covers `char` construction from scalar values while validating Unicode boundaries.
/// Implement by converting `code` to a `char` via `char::from_u32` and bubbling up invalid inputs.
pub fn char_from_code(code: u32) -> Option<char> {
    // TODO: Attempt the conversion and return `None` when the scalar value is disallowed.
    todo!()
}

/// Reinforces tuple destructuring and reconstruction without mutating the original binding.
/// Implement by pattern matching `(i32, bool)` and returning `(bool, i32)` in swapped order.
pub fn tuple_swap(pair: (i32, bool)) -> (bool, i32) {
    // TODO: Use pattern matching to reorder the elements immutably.
    todo!()
}

/// Explores boolean gate composition with strongly typed operands and return values.
/// Implement by combining `lhs` and `rhs` using a chosen gate (e.g., AND/OR) and exposing the resulting `bool`.
pub fn bool_gate(lhs: bool, rhs: bool) -> bool {
    // TODO: Pick a gate operation, document it, and return the evaluated boolean.
    todo!()
}
