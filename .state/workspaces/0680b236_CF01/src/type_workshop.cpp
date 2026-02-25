#include "type_workshop.h"

namespace type_workshop {

/// Demonstrates how `auto` deduces a common arithmetic type for sums and what learners must implement to avoid narrowing.
/// @param lhs First operand showcasing integral inputs.
/// @param rhs Second operand showcasing floating inputs.
/// @return The deduced promoted type representing lhs + rhs.
/// @note Learners must implement precise addition without truncation.
template <typename T, typename U>
auto inferSumType(const T& lhs, const U& rhs) -> decltype(lhs + rhs) {
  // TODO: implement mixed-type addition respecting auto promotions.
  return {};
}

/// Highlights const-reference binding rules so learners can practice preserving qualifiers end-to-end.
/// @param value Immutable source tied to diagnostics.
/// @return A const reference mirroring the input qualifiers.
/// @note Learners must ensure temporaries are rejected to avoid dangling references.
template <typename T>
const T& preserveConstRef(const T& value) {
  // TODO: implement qualifier-preserving reference forwarding.
  return value;
}

/// Explains mapping ASCII digits to boolean flags to reinforce defensive parsing with `auto` deduction of conditionals.
/// @param digit Character inspected for '0' or '1'.
/// @return Boolean describing the interpreted flag state.
/// @note Learners must validate characters before toggling flags.
bool boolFlagFromChar(const char digit) {
  // TODO: implement digit validation and boolean mapping.
  return false;
}

/// Connects std::optional<bool> with explicit character outputs to avoid implicit conversions when using auto in control flow.
/// @param flag Optional input that may be engaged or empty.
/// @return 'T', 'F', or a fallback char for std::nullopt.
/// @note Learners must cover empty optionals without UB.
char charFromBool(const std::optional<bool>& flag) {
  // TODO: implement optional handling with explicit character mapping.
  return {};
}

}  // namespace type_workshop
