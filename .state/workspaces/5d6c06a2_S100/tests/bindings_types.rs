use exercise::bindings::{const_identifier, freeze_level, init_temperature, shadow_demo, toggle_power_state, unit_logger};
use exercise::types::{avg_f64_readings, char_from_code, max_u64_sensor, tuple_swap};

#[test]
fn init_temperature_provides_consistent_default() {
    let baseline = init_temperature();
    assert_eq!(baseline, 72, "default indoor temperature should be 72F");
    let duplicated = baseline;
    let mut mutated = duplicated;
    mutated += 5;
    assert_eq!(baseline, init_temperature(), "immutable binding should remain stable across invocations");
    assert_ne!(baseline, mutated, "mutating a copy must not retroactively alter the original binding");
}

#[test]
fn toggle_power_state_flips_flag_and_persists() {
    assert_eq!(toggle_power_state(true), false, "mutable bool binding should flip from true to false");
    assert_eq!(toggle_power_state(false), true, "mutable bool binding should flip from false to true");
    for state in [true, false] {
        let flipped_once = toggle_power_state(state);
        let flipped_twice = toggle_power_state(flipped_once);
        assert_eq!(flipped_twice, state, "toggling twice should demonstrate state persistence on the mutable binding");
    }
}

#[test]
fn freeze_level_relies_on_constant_threshold() {
    let first = freeze_level();
    let second = freeze_level();
    assert_eq!(first, 32, "freeze level constant should be 32F");
    assert_eq!(first, second, "const value should return identically on every call");
}

#[test]
fn shadow_demo_converts_celsius_to_fahrenheit() {
    assert_eq!(shadow_demo(25), 77, "shadow workflow should convert 25C to 77F");
    assert_eq!(shadow_demo(-40), -40, "shadow workflow should preserve the unique -40C to -40F crossover");
    let freezing_point = shadow_demo(0);
    assert_eq!(freezing_point, 32, "shadow workflow should convert 0C to 32F");
    assert!(freezing_point > 0, "converted freezing point should be above zero thanks to the shadowed offset");
}

#[test]
fn const_identifier_uses_uppercase_literal() {
    let identifier = const_identifier();
    assert_eq!(identifier, "THERMOSTAT_CORE", "const identifier should expose the uppercase literal name");
    assert!(identifier.chars().all(|c| c.is_ascii_uppercase() || c == '_'), "identifier must remain uppercase snake case to signal const style");
}

#[test]
fn unit_logger_returns_unit_type() {
    let first = unit_logger("calibrating humidity sensor");
    assert_eq!(first, (), "unit_logger should return () to signal side-effect only behavior");
    let second = unit_logger("calibrating humidity sensor");
    assert_eq!(second, (), "unit_logger should consistently return () even across repeated invocations");
}

#[test]
fn max_u64_sensor_caps_extreme_values() {
    let readings = [u128::from(u64::MAX) + 42, 1, 99];
    let clamped = max_u64_sensor(&readings);
    assert_eq!(clamped, u64::MAX, "values beyond u64::MAX must clamp to the ceiling");
    assert!(clamped <= u64::MAX, "clamped output must never exceed the maximum representable bound");
    let safe_values = [42_u128, 1024_u128, 65535_u128];
    assert_eq!(max_u64_sensor(&safe_values), 65535, "when within range, the precise maximum should be returned");
}

#[test]
fn avg_f64_readings_handles_empty_and_precise_values() {
    assert_eq!(avg_f64_readings(&[]), None, "empty slice should return None to signal missing data");
    let values = [72.5_f64, 73.5_f64, 70.0_f64];
    let avg = avg_f64_readings(&values).expect("average should be present for non-empty slices");
    assert_eq!(avg, 72.0, "average of the provided readings should remain exactly 72.0");
    let min = values.iter().fold(f64::INFINITY, |acc, &v| acc.min(v));
    let max = values.iter().fold(f64::NEG_INFINITY, |acc, &v| acc.max(v));
    assert!(avg >= min && avg <= max, "average must land within the inclusive range of the inputs");
}

#[test]
fn char_from_code_validates_scalar_range() {
    assert_eq!(char_from_code(0x0041), Some('A'), "valid ASCII scalar should convert to its char representation");
    let highest = char::from_u32(0x10FFFF).expect("highest Unicode scalar should exist");
    assert_eq!(char_from_code(0x10FFFF), Some(highest), "highest Unicode scalar must be accepted");
    assert_eq!(char_from_code(0x110000), None, "values beyond Unicode range should return None");
}

#[test]
fn tuple_swap_is_involution() {
    assert_eq!(tuple_swap((7, true)), (true, 7), "tuple_swap should flip the i32 and bool positions");
    let original = (-12, false);
    assert_eq!(tuple_swap(tuple_swap(original)), original, "swapping twice should restore the original tuple without mutation");
}
