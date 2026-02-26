use crate::basics::{parse_ratio, safe_divide};

pub const STATUS_SUCCESS_PREFIX: &str = "ratio success:";
pub const STATUS_ERROR_PREFIX: &str = "ratio error:";
pub const STATUS_VALUE_SEPARATOR: &str = " => ";
pub const STATUS_QUOTIENT_PREFIX: &str = "quotient ";

/// ex-3 — First principle: exhaustively match multiple Result sources to craft user feedback.
/// Read: LESSON.md § "Worked example: step through a manual `match` that consumes `safe_divide` + `parse_ratio` outputs to craft a user-facing status line."
/// Test: test_describe_ratio_status_formats_success.
/// Start here: call parse_ratio(input) then match safe_divide(dividend, divisor) to format a STATUS_*PREFIX message with STATUS_VALUE_SEPARATOR + STATUS_QUOTIENT_PREFIX.
pub fn describe_ratio_status(input: &str) -> Result<String, String> {
    let _ = input;
    todo!()
}
