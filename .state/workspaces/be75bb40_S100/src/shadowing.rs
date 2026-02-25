// Shadowing demos to compare mutation and redeclaration patterns.

/// Shows how to shadow an immutable temperature binding to change both value and type without requiring `mut`.
/// Implementers should return the original Celsius reading plus a formatted Fahrenheit summary derived via shadowing.
pub fn shadow_temperature_reading(reading_celsius: f64) -> (f64, String) {
    // Capture the initial immutable reading, then shadow it with converted forms to illustrate type swapping.
    todo!()
}

/// Demonstrates safe redeclaration of a unit label inside a narrow scope to enforce ASCII-only characters.
/// Implementers should shadow the label to sanitize non-ASCII input while proving the outer binding remains unchanged.
pub fn redeclare_unit_label(raw_label: &str) -> (String, String) {
    // Keep the original immutable label, then shadow it with a cleaned ASCII variant that the function returns.
    todo!()
}

/// Contrasts mutation and shadowing by keeping an outer immutable counter while an inner scope mutates its own copy.
/// Implementers should return the untouched outer count alongside the inner mutable tally to highlight isolation.
pub fn scoped_counter_demo(start: i32) -> (i32, i32) {
    // Bind an outer count, shadow it in an inner scope with a mutable version, and expose both results.
    todo!()
}
