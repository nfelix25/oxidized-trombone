## Hook: Safe Divide

This section equips you to implement `safe_divide`. Imagine our ratio planner’s first draft:```rust
fn naive_ratio(dividend: i32, divisor: i32) -> i32 {
    dividend / divisor
}

fn main() {
    println!("{}", naive_ratio(5, 0));
}
```Run it and the terminal explodes with `thread 'main' panicked at 'attempt to divide by zero'`, halting everything—no chance to log, retry, or inform the user which input failed. We want recoverable flows, so we redirect that panic into a `Result`. Here’s a full example of the pattern you’ll mimic in `safe_divide`:```rust
const DIVISION_BY_ZERO_ERR: &str = "division by zero";

fn safe_divide(dividend: i32, divisor: i32) -> Result<i32, String> {
    if divisor == 0 {
        Err(DIVISION_BY_ZERO_ERR.to_string())
    } else {
        Ok(dividend / divisor)
    }
}

fn main() {
    match safe_divide(5, 0) {
        Ok(q) => println!("quotient {q}"),
        Err(msg) => eprintln!("ratio error: {msg}"),
    }
}
```A single branch checks `divisor == 0`, immediately crafts a descriptive `Err`, and the caller decides whether to retry, ask for new data, or bubble the message up. All other paths funnel the integer quotient into `Ok`, keeping success ergonomic. Notice how we never panic: the downstream UI receives a string contract instead of a stack trace. This Result-first habit underpins every later helper, so get comfortable expressing both payload and failure explicitly. Now implement: safe_divide.

## Parse Ratio Flow

Stub target: parse_ratio.

```rust
use crate::basics::INVALID_RATIO_ERR_PREFIX;

fn parse_ratio(input: &str) -> Result<(i32, i32), String> {
    let trimmed = input.trim();
    let mut parts = trimmed.split(':');

    let left = parts
        .next()
        .ok_or_else(|| format!("{INVALID_RATIO_ERR_PREFIX} missing left value: '{trimmed}'"))?;
    let right = parts
        .next()
        .ok_or_else(|| format!("{INVALID_RATIO_ERR_PREFIX} missing right value: '{trimmed}'"))?;

    if parts.next().is_some() {
        return Err(format!(
            "{INVALID_RATIO_ERR_PREFIX} extra delimiters: '{trimmed}'"
        ));
    }

    let parse_int = |segment: &str, label: &str| {
        let cleaned = segment.trim();
        cleaned.parse::<i32>().map_err(|_| {
            format!("{INVALID_RATIO_ERR_PREFIX} non-integer {label}: '{cleaned}'")
        })
    };

    let dividend = parse_int(left, "left")?;
    let divisor = parse_int(right, "right")?;

    Ok((dividend, divisor))
}
```

By trimming once and storing `trimmed`, the example guarantees everything (whitespace handling, delimiter validation, and downstream error messages) references the same canonical input. Each `ok_or_else` call turns a missing split piece into a descriptive `Err(String)` immediately, emphasizing that `Result<T, E>` can mirror the structure of upstream `Option` data without panicking. The early `if parts.next().is_some()` branch demonstrates how you can reject malformed inputs before performing any math.

The `parse_int` closure isolates parsing so both halves reuse the same `map_err` formatting. Notice how the final `Ok((dividend, divisor))` only happens after both conversions succeed, making the tuple itself proof that earlier validations passed. This single helper now delivers either a clean `(i32, i32)` payload or a string message that callers can log or normalize later in the pipeline. Now implement: parse_ratio.

## Manual Status Match

Stub target: describe_ratio_status. Complete example first:```rust
use crate::basics::{parse_ratio, safe_divide};
use crate::combine::{
    STATUS_SUCCESS_PREFIX,
    STATUS_ERROR_PREFIX,
    STATUS_VALUE_SEPARATOR,
    STATUS_QUOTIENT_PREFIX,
};

fn describe_ratio_status(input: &str) -> Result<String, String> {
    match parse_ratio(input) {
        Ok((dividend, divisor)) => match safe_divide(dividend, divisor) {
            Ok(quotient) => Ok(format!(
                "{STATUS_SUCCESS_PREFIX}{STATUS_VALUE_SEPARATOR}{STATUS_QUOTIENT_PREFIX}{quotient}"
            )),
            Err(div_err) => Err(format!("{STATUS_ERROR_PREFIX}{STATUS_VALUE_SEPARATOR}{div_err}")),
        },
        Err(parse_err) => Err(format!("{STATUS_ERROR_PREFIX}{STATUS_VALUE_SEPARATOR}{parse_err}")),
    }
}
```Two nested matches are deliberate: each `Result` source becomes an exhaustively handled branch, so there’s no `unwrap` risk and every exit returns either `Ok(String)` or `Err(String)`. The outer `match parse_ratio(input)` gates downstream math; once you hold `(dividend, divisor)`, the inner `match safe_divide(...)` focuses solely on math errors. Notice how success formatting stitches the provided constants together, keeping the contract consistent with future sections: prefix + separator + `quotient` label. On failures, the same `STATUS_ERROR_PREFIX` envelope wraps whichever error emerged first, giving callers a uniform surface without hiding the original message. You can scale this pattern by adding more nested matches or by binding intermediate strings before returning, but the key idea is to keep control flow explicit so each possibility stays visible to the reader and the compiler. Now implement: describe_ratio_status.

## Question-Mark Status

Stub target: describe_ratio_status_fast.

```rust
use crate::basics::{parse_ratio, safe_divide};
use crate::combine::{
    STATUS_SUCCESS_PREFIX,
    STATUS_VALUE_SEPARATOR,
    STATUS_QUOTIENT_PREFIX,
};

fn describe_ratio_status_fast(input: &str) -> Result<String, String> {
    let (dividend, divisor) = parse_ratio(input)?;
    let quotient = safe_divide(dividend, divisor)?;
    Ok(format!(
        "{STATUS_SUCCESS_PREFIX}{STATUS_VALUE_SEPARATOR}{STATUS_QUOTIENT_PREFIX}{quotient}"
    ))
}
```

The question mark operator rewrites the nested-match control flow from the prior section into a linear narrative. `parse_ratio(input)?` either yields the `(dividend, divisor)` tuple or short-circuits, automatically converting the Err into this function’s return value—no temporary variables or explicit matches required. Because the tuple binding only happens after a successful parse, the subsequent `safe_divide(dividend, divisor)?` can focus purely on math validation, again exiting early when zero division occurs. This pattern keeps the happy path visually uncluttered: once both `Result`s have succeeded, only the final `Ok(format!(..))` remains, ensuring the same success string as before. Crucially, question marks never swallow errors; they propagate the exact string payload upward, preserving diagnostics while letting you express the pipeline as a sequence of ordinary statements. When you refactor the stub, maintain constant-driven formatting and remember that every `?` must live inside a function that already returns `Result`, so the compiler can thread the types together. Now implement: describe_ratio_status_fast.

## Normalize Errors

Stub target: normalize_ratio_error. Worked example first:```rust
use crate::propagate::NORMALIZED_RATIO_ERROR_PREFIX;
use crate::propagate::normalize_ratio_error;
use crate::basics::parse_ratio;

fn parse_ratio_normalized(input: &str) -> Result<(i32, i32), String> {
    parse_ratio(input).map_err(|err| normalize_ratio_error(err))
}

pub fn normalize_ratio_error(error: String) -> String {
    format!("{NORMALIZED_RATIO_ERROR_PREFIX} {error}")
}
```
This snippet shows two layers. The outer helper, `parse_ratio_normalized`, calls the existing `parse_ratio` but immediately invokes `.map_err(|err| normalize_ratio_error(err))`. The `map_err` call preserves the successful `(i32, i32)` path untouched while routing every failure through a single formatting function. Inside `normalize_ratio_error`, the operation is intentionally tiny yet precise: you must prepend exactly one space-separated `NORMALIZED_RATIO_ERROR_PREFIX` to the original message without duplicating prefixes or mutating the payload. Keeping the formatter pure (no logging, no branching) ensures it can be reused whenever a downstream caller wants consistent error contracts—`plan_ratios`, future logging layers, and tests can rely on the same string layout. This discipline also documents which layer owns human-readable messaging, preventing ad-hoc string building in higher-level combinators. When you implement the stub, favor owned `String` operations (`format!` or `push_str`) so the returned value contains both the prefix and original context in one allocation. Now implement: normalize_ratio_error.

## Checked Unwrap Pitfall

Stub target: checked_unwrap. Worked example first:
```rust
use crate::safety::{
    CHECKED_UNWRAP_ERR_PREFIX,
    CHECKED_UNWRAP_CONTEXT_SEPARATOR,
};

fn checked_unwrap<T: Clone>(value: Option<T>, label: &str) -> Result<T, String> {
    match value {
        Some(inner) => Ok(inner),
        None => Err(format!(
            "{CHECKED_UNWRAP_ERR_PREFIX}{CHECKED_UNWRAP_CONTEXT_SEPARATOR}{label}"
        )),
    }
}

fn pull_ratio_hint(cache: Option<String>) -> Result<String, String> {
    checked_unwrap(cache, "ratio cache")
}
```
This pattern mirrors the stub: destructure the `Option`, hand the `Some` payload straight back via `Ok`, and format a single descriptive `Err` that callers can propagate or log. Because `checked_unwrap` already returns `Result<T, String>`, downstream helpers like `pull_ratio_hint` get a fallible abstraction with consistent prefixes instead of ad-hoc panic text.

Pitfall snapshot—wrong code:
```rust
fn checked_unwrap<T>(value: Option<T>, _label: &str) -> Result<T, String> {
    Ok(value.unwrap())
}
```
Compiler says:
```
error[E0308]: mismatched types
  --> safety.rs:XX:5
   |
X  |     Ok(value.unwrap())
   |     -- ^^^^^^^^^^^^^^^ expected `Result<_, String>`, found `T`
```
Even if you wrap the expression, the `unwrap()` still panics at runtime when `value` is `None`, defeating the whole error-handling story. The fixed version above avoids both issues by matching explicitly, formatting the prefix once, and never calling `unwrap` at all. Now implement: checked_unwrap.

## Option To Result

Stub target: option_to_result. Complete worked example:
```rust
use crate::safety::{
    checked_unwrap,
    OPTION_TO_RESULT_ERR_PREFIX,
};

fn option_to_result<T>(value: Option<T>, label: &str) -> Result<T, String> {
    checked_unwrap(value, label).map_err(|_| {
        format!("{OPTION_TO_RESULT_ERR_PREFIX} {label}")
    })
}

fn load_threshold(hint: Option<&str>) -> Result<&str, String> {
    option_to_result(hint, "threshold override")
}
```
Here the helper immediately reuses `checked_unwrap` to avoid duplicating the branching logic; the subsequent `map_err` rewrites the contextual message so callers see the comparison-specific `OPTION_TO_RESULT_ERR_PREFIX` rather than the generic checked unwrap text. That means a missing `threshold override` surfaces as `"optional config missing threshold override"` while a present hint flows through untouched. Contrast this with the manual approach it replaces:
```rust
fn option_to_result_before<T>(value: Option<T>, label: &str) -> Result<T, String> {
    match value {
        Some(inner) => Ok(inner),
        None => Err(format!("{label} not set")),
    }
}
```
The before version invents ad-hoc message shapes (`"label not set"`) that drift from the unified error contract used across the pipeline, making later normalization impossible. The after version centralizes both behavior and wording: `checked_unwrap` handles the structural check, and a single `map_err` adapts the label to the Option-to-Result domain. When you fill in the stub, keep that layered structure so swapping prefixes or routing through other formatters remains trivial as the planner grows. Now implement: option_to_result.

## Plan Ratios Bridge

Stub target: plan_ratios. Worked example first:
```rust
use crate::propagate::{describe_ratio_status_fast, normalize_ratio_error};
use crate::safety::{
    option_to_result,
    PLAN_RATIOS_SUCCESS_PREFIX,
    PLAN_RATIOS_ERROR_PREFIX,
    PLAN_RATIOS_PIPELINE_SEPARATOR,
    PLAN_RATIOS_THRESHOLD_LABEL,
};

fn plan_ratios(input: &str, threshold_hint: Option<&str>) -> Result<String, String> {
    let status = describe_ratio_status_fast(input).map_err(|err| {
        format!(
            "{PLAN_RATIOS_ERROR_PREFIX}{PLAN_RATIOS_PIPELINE_SEPARATOR}{}",
            normalize_ratio_error(err)
        )
    })?;

    let threshold = option_to_result(threshold_hint, PLAN_RATIOS_THRESHOLD_LABEL).map_err(|err| {
        format!(
            "{PLAN_RATIOS_ERROR_PREFIX}{PLAN_RATIOS_PIPELINE_SEPARATOR}{err}"
        )
    })?;

    Ok(format!(
        "{PLAN_RATIOS_SUCCESS_PREFIX}{PIPE}{status}{PIPE}{label}: {threshold}",
        PIPE = PLAN_RATIOS_PIPELINE_SEPARATOR,
        label = PLAN_RATIOS_THRESHOLD_LABEL,
    ))
}
```
This bridge stitches every prior helper into one fallible planner. The first `map_err` wraps math and parse failures with the pipeline’s error prefix while delegating human-readable details to `normalize_ratio_error`, proving you can standardize contracts without losing context. Successful ratios fall through to the threshold stage, where `option_to_result` (and by extension `checked_unwrap`) ensures optional configs never panic yet still mention the exact label when missing. Because both branches reuse `PLAN_RATIOS_PIPELINE_SEPARATOR`, downstream logging can split the string predictably—important when the next module introduces richer custom error enums. Finally, the success formatter demonstrates how to interleave the previously computed status segment with the normalized threshold label so callers receive one cohesive success narrative. This single function showcases chaining, propagation, normalization, and Option-to-Result conversion in one place, preparing you to swap the string errors for structured types later. Now implement: plan_ratios.