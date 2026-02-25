#pragma once

#include <optional>

namespace type_workshop {

/// Demonstrates `auto` return type deduction by summing mixed primitive values.
/// @param lhs First addend supplied as any arithmetic type to show template argument deduction.
/// @param rhs Second addend supplied as any arithmetic type, possibly with higher precision.
/// @return The deduced common type produced by lhs + rhs, letting learners trace promotions.
/// @note Learners must implement safe addition logic that preserves precision without narrowing.
template <typename T, typename U>
auto inferSumType(const T& lhs, const U& rhs) -> decltype(lhs + rhs);

/// Highlights const-correctness by forwarding stable references and preventing dangling bindings.
/// @param value Immutable source object that should be returned as a const reference.
/// @return A const reference that keeps every qualifier (const, volatile, reference) intact.
/// @note Learners must ensure temporaries are rejected or extended safely while preserving qualifiers.
template <typename T>
const T& preserveConstRef(const T& value);

/// Explores character-to-boolean inference rules with ASCII digits and defensive defaults.
/// @param digit Character that may describe a '0'/'1' flag or other sentinel input.
/// @return True/false according to the learner-defined mapping, defaulting safely for invalid chars.
/// @note Learners must guard against undefined behavior by validating digits before deduction.
bool boolFlagFromChar(char digit);

/// Connects `std::optional` with explicit character outputs to avoid implicit bool-to-char casts.
/// @param flag Optional boolean sourced from diagnostics or configuration data.
/// @return 'T'/'F' (or a learner-chosen fallback) conveying the optional state without ambiguity.
/// @note Learners must cover engaged/empty optionals and document how auto interacts with conditionals.
char charFromBool(const std::optional<bool>& flag);

}  // namespace type_workshop
