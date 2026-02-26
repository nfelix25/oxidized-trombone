use exercise::basics::{parse_ratio, safe_divide, DIVISION_BY_ZERO_ERR, INVALID_RATIO_ERR_PREFIX};
use exercise::combine::{describe_ratio_status, STATUS_QUOTIENT_PREFIX, STATUS_SUCCESS_PREFIX, STATUS_VALUE_SEPARATOR};
use exercise::propagate::{describe_ratio_status_fast, normalize_ratio_error, NORMALIZED_RATIO_ERROR_PREFIX};
use exercise::safety::{
    checked_unwrap,
    option_to_result,
    plan_ratios,
    CHECKED_UNWRAP_CONTEXT_SEPARATOR,
    CHECKED_UNWRAP_ERR_PREFIX,
    PLAN_RATIOS_ERROR_PREFIX,
    PLAN_RATIOS_PIPELINE_SEPARATOR,
    PLAN_RATIOS_SUCCESS_PREFIX,
    PLAN_RATIOS_THRESHOLD_LABEL,
};

fn expected_ratio_success_string(quotient: i32) -> String {
    format!(
        "{}{}{}{}",
        STATUS_SUCCESS_PREFIX,
        STATUS_VALUE_SEPARATOR,
        STATUS_QUOTIENT_PREFIX,
        quotient
    )
}

fn expected_plan_success(status_segment: &str, threshold: &str) -> String {
    format!(
        "{}{}{}{}{}: {}",
        PLAN_RATIOS_SUCCESS_PREFIX,
        PLAN_RATIOS_PIPELINE_SEPARATOR,
        status_segment,
        PLAN_RATIOS_PIPELINE_SEPARATOR,
        PLAN_RATIOS_THRESHOLD_LABEL,
        threshold
    )
}

#[test]
fn test_safe_divide_returns_ok() {
    let result = safe_divide(8, 2);
    assert_eq!(
        result,
        Ok(4),
        "safe_divide should divide non-zero operands without side effects"
    );
}

#[test]
fn test_safe_divide_division_by_zero() {
    let result = safe_divide(5, 0);
    assert_eq!(
        result,
        Err(DIVISION_BY_ZERO_ERR.to_string()),
        "safe_divide must return the division by zero error constant when divisor is zero"
    );
}

#[test]
fn test_parse_ratio_trims_whitespace() {
    let result = parse_ratio(" 6:3 ");
    assert_eq!(
        result,
        Ok((6, 3)),
        "parse_ratio should trim whitespace before parsing the pair"
    );
}

#[test]
fn test_parse_ratio_reports_malformed_input() {
    let err = parse_ratio("bad:data").expect_err("parse_ratio should Err on malformed input");
    assert!(
        err.starts_with(INVALID_RATIO_ERR_PREFIX),
        "parse_ratio error should start with the invalid ratio prefix, got {}",
        err
    );
    assert!(
        err.contains("bad:data"),
        "parse_ratio error should mention the malformed input, got {}",
        err
    );
}

#[test]
fn test_describe_ratio_status_formats_success() {
    let status = describe_ratio_status("6:3")
        .expect("describe_ratio_status should succeed for balanced ratios");
    let expected = expected_ratio_success_string(2);
    assert_eq!(
        status,
        expected,
        "describe_ratio_status should produce the formatted success line"
    );
}

#[test]
fn test_describe_ratio_status_fast_matches_spec() {
    let status = describe_ratio_status_fast("6:3")
        .expect("describe_ratio_status_fast should succeed for balanced ratios");
    let expected = expected_ratio_success_string(2);
    assert_eq!(
        status,
        expected,
        "describe_ratio_status_fast should match the manual success format"
    );
}

#[test]
fn test_describe_ratio_status_fast_propagates_safe_divide_error() {
    let err = describe_ratio_status_fast("4:0")
        .expect_err("describe_ratio_status_fast should fail when divisor is zero");
    assert_eq!(
        err,
        DIVISION_BY_ZERO_ERR.to_string(),
        "describe_ratio_status_fast should bubble up safe_divide errors unchanged"
    );
}

#[test]
fn test_normalize_ratio_error_unifies_message() {
    let raw_error = "input exploded".to_string();
    let normalized = normalize_ratio_error(raw_error.clone());
    let expected = format!("{} {}", NORMALIZED_RATIO_ERROR_PREFIX, raw_error);
    assert_eq!(
        normalized,
        expected,
        "normalize_ratio_error should prepend the normalized prefix exactly once"
    );
}

#[test]
fn test_checked_unwrap_reports_context() {
    let err = checked_unwrap::<i32>(None, "ratio cache")
        .expect_err("checked_unwrap should Err when provided None");
    let expected = format!(
        "{}{}{}",
        CHECKED_UNWRAP_ERR_PREFIX,
        CHECKED_UNWRAP_CONTEXT_SEPARATOR,
        "ratio cache"
    );
    assert_eq!(
        err,
        expected,
        "checked_unwrap should format the contextual failure string"
    );
}

#[test]
fn test_option_to_result_returns_some_value() {
    let value = option_to_result(Some("hi"), "unused label")
        .expect("option_to_result should unwrap Some values");
    assert_eq!(
        value,
        "hi",
        "option_to_result should return the contained value unchanged"
    );
}

#[test]
fn test_plan_ratios_threads_success_pipeline() {
    let plan = plan_ratios("6:3", Some("threshold"))
        .expect("plan_ratios should succeed for valid data with a hint");
    let status_segment = expected_ratio_success_string(2);
    let expected = expected_plan_success(&status_segment, "threshold");
    assert_eq!(
        plan,
        expected,
        "plan_ratios should build the success pipeline with status output and threshold hint"
    );
}

#[test]
fn test_plan_ratios_returns_normalized_error() {
    let err = plan_ratios("bad", None).expect_err("plan_ratios should fail for malformed input");
    let mut sections = err.splitn(2, PLAN_RATIOS_PIPELINE_SEPARATOR);
    let prefix = sections.next().unwrap_or_default();
    let normalized = sections.next().unwrap_or_default();
    assert_eq!(
        prefix,
        PLAN_RATIOS_ERROR_PREFIX,
        "plan_ratios should prefix failures with the plan error label"
    );
    assert!(
        normalized.starts_with(NORMALIZED_RATIO_ERROR_PREFIX),
        "plan_ratios should normalize upstream errors, got {}",
        err
    );
    assert!(
        normalized.contains("bad"),
        "normalized error should mention the problematic input, got {}",
        err
    );
}
