use crate::basics::{parse_ratio, safe_divide};
use crate::combine::{
    STATUS_ERROR_PREFIX,
    STATUS_QUOTIENT_PREFIX,
    STATUS_SUCCESS_PREFIX,
    STATUS_VALUE_SEPARATOR,
};

pub const NORMALIZED_RATIO_ERROR_PREFIX: &str = "normalized ratio error:";

/// ex-4 — First principle: question-mark propagation.
/// Read: LESSON.md § "Worked example: refactor the same flow with the question-mark operator to highlight early-return propagation."
/// Test: test_describe_ratio_status_fast_matches_manual.
/// Start here: chain parse_ratio(input)? safe_divide(dividend, divisor)? and format STATUS_SUCCESS_PREFIX + STATUS_VALUE_SEPARATOR + STATUS_QUOTIENT_PREFIX.
pub fn describe_ratio_status_fast(input: &str) -> Result<String, String> {
    let _ = input;
    todo!()
}

/// ex-5 — First principle: map_err to align error types.
/// Read: LESSON.md § "Core concept: normalize heterogeneous error strings with `map_err` so downstream callers consume a unified contract."
/// Test: test_normalize_ratio_error_unifies_message.
/// Start here: take the incoming error string and prepend NORMALIZED_RATIO_ERROR_PREFIX with a single space separator exactly once before returning it.
pub fn normalize_ratio_error(error: String) -> String {
    let _ = error;
    todo!()
}
