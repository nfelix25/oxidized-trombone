pub const DIVISION_BY_ZERO_ERR: &str = "division by zero";
pub const INVALID_RATIO_ERR_PREFIX: &str = "invalid ratio:";

/// ex-1 — First principle: encode zero-check failures as Err.
/// Read: LESSON.md § "Hook: contrast a panicking division with a `safe_divide` Result return to motivate recoverable math flows on user ratios."
/// Test: test_safe_divide_division_by_zero.
/// Start here: guard divisor == 0 and immediately return Err(DIVISION_BY_ZERO_ERR.into()).
pub fn safe_divide(dividend: i32, divisor: i32) -> Result<i32, String> {
    let _ = dividend;
    let _ = divisor;
    todo!()
}

/// ex-2 — First principle: validate & structure text before math.
/// Read: LESSON.md § "Core concept: dissect `Result<T, E>` via the `parse_ratio` helper, naming Ok payloads vs descriptive Err strings."
/// Test: test_parse_ratio_highlights_malformed_input.
/// Start here: split input on ':' then trim whitespace on both parts before parsing to i32.
pub fn parse_ratio(input: &str) -> Result<(i32, i32), String> {
    let _ = input;
    todo!()
}
