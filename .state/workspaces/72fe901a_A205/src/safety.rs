pub const CHECKED_UNWRAP_ERR_PREFIX: &str = "checked unwrap failed";
pub const CHECKED_UNWRAP_CONTEXT_SEPARATOR: &str = " :: ";
pub const OPTION_TO_RESULT_ERR_PREFIX: &str = "optional config missing";
pub const PLAN_RATIOS_SUCCESS_PREFIX: &str = "ratio plan ready";
pub const PLAN_RATIOS_ERROR_PREFIX: &str = "ratio plan failed";
pub const PLAN_RATIOS_PIPELINE_SEPARATOR: &str = " | ";
pub const PLAN_RATIOS_THRESHOLD_LABEL: &str = "threshold source";

/// ex-6 — First principle: replace panicking unwraps with Result guards.
/// Read: LESSON.md § "Common pitfall: demonstrate how blindly calling `unwrap` panics and replace it with a `checked_unwrap` guard Result."
/// Test: test_checked_unwrap_reports_context.
/// Start here: inspect value for None and format CHECKED_UNWRAP_ERR_PREFIX plus CHECKED_UNWRAP_CONTEXT_SEPARATOR and label before returning Err.
pub fn checked_unwrap<T>(value: Option<T>, label: &str) -> Result<T, String> {
    let _ = value;
    let _ = label;
    todo!()
}

/// ex-7 — First principle: convert Option into Result with contextualized absence messages.
/// Read: LESSON.md § "Comparison: convert optional config values into `Result` via `option_to_result`, contrasting absence vs explicit error context."
/// Test: test_option_to_result_handles_some_and_none.
/// Start here: reuse checked_unwrap on value or shape OPTION_TO_RESULT_ERR_PREFIX plus label when the option is None.
pub fn option_to_result<T>(value: Option<T>, label: &str) -> Result<T, String> {
    let _ = value;
    let _ = label;
    todo!()
}

/// ex-8 — First principle: compose every helper into a single fallible planner.
/// Read: LESSON.md § "Bridge: chain every helper inside `plan_ratios` to preview transitioning into richer custom error types next."
/// Test: test_plan_ratios_threads_pipeline.
/// Start here: call describe_ratio_status_fast(input) and normalize_ratio_error on failures before appending PLAN_RATIOS_SUCCESS_PREFIX, PLAN_RATIOS_PIPELINE_SEPARATOR, and PLAN_RATIOS_THRESHOLD_LABEL details.
pub fn plan_ratios(input: &str, threshold_hint: Option<&str>) -> Result<String, String> {
    let _ = input;
    let _ = threshold_hint;
    todo!()
}
