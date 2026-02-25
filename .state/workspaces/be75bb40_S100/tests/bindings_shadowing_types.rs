use exercise::bindings::{compute_interest_rate, define_city_population, toggle_alarm_state};
use exercise::shadowing::{redeclare_unit_label, scoped_counter_demo, shadow_temperature_reading};
use exercise::types::{const_planck_ratio, split_tuple_components, sum_mixed_integers};

const EXPECTED_CITY_POPULATION: i32 = 915_000;
const EXPECTED_PLANCK_RATIO: f64 = 6.626_070_15e-34;

#[test]
fn define_city_population_matches_story_sample() {
    let population = define_city_population();
    assert_eq!(population, EXPECTED_CITY_POPULATION, "Sample city population should remain immutable and match the story-driven constant.");
}

#[test]
fn toggle_alarm_state_round_trip_property() {
    for &initial in &[true, false] {
        let restored = toggle_alarm_state(initial);
        assert_eq!(restored, initial, "Toggling the alarm twice should restore the original state for {:?}", initial);
    }
}

#[test]
fn compute_interest_rate_precision_within_tolerance() {
    let principal = 2500.0;
    let gain = 137.5;
    let rate = compute_interest_rate(principal, gain);
    let expected = gain / principal;
    let delta = (rate - expected).abs();
    assert!(delta <= 1e-6, "Computed rate should match {:.6} within tolerance, delta was {}", expected, delta);
    assert!(rate > 0.0, "Interest rate should remain positive for positive gain scenarios.");
}

#[test]
fn shadow_temperature_reading_infers_new_type_without_mut() {
    let reading = 21.5;
    let (celsius, summary) = shadow_temperature_reading(reading);
    assert_eq!(celsius, reading, "Original Celsius reading should be preserved as the first tuple item.");
    let expected_fahrenheit = reading * 9.0 / 5.0 + 32.0;
    let formatted_fahrenheit = format!("{:.1}", expected_fahrenheit);
    assert!(summary.contains(&formatted_fahrenheit), "Summary should include the Fahrenheit value {}, but was {}", formatted_fahrenheit, summary);
    assert!(summary.contains('F'), "Summary should mention Fahrenheit to highlight the type change.");
}

#[test]
fn redeclare_unit_label_sanitizes_non_ascii_edge_case() {
    let raw = "°C-zone";
    let (original, sanitized) = redeclare_unit_label(raw);
    assert_eq!(original, raw, "Original raw label should remain unchanged to prove the outer binding's immutability.");
    assert!(sanitized.is_ascii(), "Sanitized label should consist solely of ASCII characters, but '{}' was returned.", sanitized);
    assert!(sanitized.contains("C"), "Sanitized label should keep a recognizable ASCII unit marker, received {}", sanitized);
    assert_ne!(sanitized, original, "Sanitized label should differ from the raw label when Unicode glyphs are removed.");
}

#[test]
fn scoped_counter_demo_isolates_mutation_in_inner_scope() {
    let start = 3;
    let (outer, inner) = scoped_counter_demo(start);
    assert_eq!(outer, start, "Outer immutable counter should remain {} even after inner scope mutations.", start);
    assert!(inner > outer, "Inner mutable counter should exceed the outer value to prove scoped mutation, got {}", inner);
}

#[test]
fn sum_mixed_integers_handles_signed_and_unsigned_pairs() {
    let case_one = sum_mixed_integers(-50, 200);
    assert_eq!(case_one, 150, "Unsigned result should subtract signed delta without underflow for baseline 200.");
    let case_two = sum_mixed_integers(125, 1_000);
    assert_eq!(case_two, 1_125, "Unsigned result should include positive signed delta for baseline 1_000.");
    assert!(case_one <= case_two, "Results should remain ordered with respect to the signed deltas applied.");
}

#[test]
fn split_tuple_components_returns_original_packet_order() {
    let packet = ('A', true, 42.5);
    let (c, flag, value) = split_tuple_components(packet);
    assert_eq!(c, packet.0, "Returned char component should match the input tuple's first element.");
    assert_eq!(flag, packet.1, "Returned bool component should match the input tuple's second element.");
    assert_eq!(value, packet.2, "Returned f64 component should match the input tuple's third element.");
}

#[test]
fn const_planck_ratio_matches_expected_literal_across_calls() {
    let first = const_planck_ratio();
    let second = const_planck_ratio();
    assert_eq!(first, EXPECTED_PLANCK_RATIO, "First access should return the declared Planck ratio literal.");
    assert_eq!(second, EXPECTED_PLANCK_RATIO, "Second access should return the same Planck ratio literal.");
    assert_eq!(first, second, "Subsequent reads of the const should match exactly.");
}
