#include <gtest/gtest.h>
#include "solution.h"
#include <limits>
#include <optional>
#include <stdexcept>
#include <string>
#include <type_traits>

namespace {
struct BaseFlag {
  int id = 0;
  virtual ~BaseFlag() = default;
};

struct DerivedFlag : BaseFlag {
  int extra = 0;
  DerivedFlag(int base_value, int extra_value) {
    id = base_value;
    extra = extra_value;
  }
};
}  // namespace

TEST(InferSumType, IntAndDoublePromotesToDouble) {
  auto result = type_workshop::inferSumType(4, 2.5);
  EXPECT_TRUE((std::is_same_v<decltype(result), double>));
  EXPECT_DOUBLE_EQ(result, 6.5);
}

TEST(InferSumType, IntPairStaysInteger) {
  auto result = type_workshop::inferSumType(3, 5);
  EXPECT_TRUE((std::is_same_v<decltype(result), int>));
  EXPECT_EQ(result, 8);
}

TEST(InferSumType, HandlesLargeIntegersSafely) {
  const long long near_max = std::numeric_limits<long long>::max() - 1;
  auto result = type_workshop::inferSumType(near_max, 1LL);
  EXPECT_TRUE((std::is_same_v<decltype(result), long long>));
  EXPECT_EQ(result, std::numeric_limits<long long>::max());
}

TEST(PreserveConstRef, ReturnsConstReferenceWithoutSlicing) {
  const DerivedFlag derived(42, 99);
  const auto& ref = type_workshop::preserveConstRef(derived);
  EXPECT_EQ(&ref, &derived);
  const BaseFlag& base_view = ref;
  EXPECT_EQ(base_view.id, 42);
  EXPECT_EQ(ref.extra, 99);
}

TEST(PreserveConstRef, RejectsTemporaries) {
  EXPECT_THROW(
      {
        const auto& ref =
            type_workshop::preserveConstRef(std::string{"temporary"});
        (void)ref;
      },
      std::logic_error);
}

TEST(PreserveConstRef, KeepsVolatileQualifier) {
  volatile int counter = 7;
  const volatile int& ref = type_workshop::preserveConstRef(counter);
  EXPECT_TRUE((std::is_same_v<decltype(ref), const volatile int&>));
  counter = 11;
  EXPECT_EQ(ref, 11);
}

TEST(BoolFlagFromChar, ZeroIsFalseOneIsTrue) {
  EXPECT_FALSE(type_workshop::boolFlagFromChar('0'));
  EXPECT_TRUE(type_workshop::boolFlagFromChar('1'));
}

TEST(BoolFlagFromChar, NonDigitsUseSafeDefault) {
  EXPECT_FALSE(type_workshop::boolFlagFromChar('x'));
  EXPECT_FALSE(type_workshop::boolFlagFromChar('/'));
}

TEST(CharFromBool, UsesExplicitLetters) {
  EXPECT_EQ(type_workshop::charFromBool(std::optional<bool>{true}), 'T');
  EXPECT_EQ(type_workshop::charFromBool(std::optional<bool>{false}), 'F');
}

TEST(CharFromBool, HandlesEmptyOptionalWithFallback) {
  EXPECT_EQ(type_workshop::charFromBool(std::nullopt), '?');
}
