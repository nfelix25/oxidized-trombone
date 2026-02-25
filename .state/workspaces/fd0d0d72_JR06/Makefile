CC = cc
CFLAGS = -Wall -Wextra -g -I src -I tests
LDFLAGS = -lpthread

SRC_FILES := $(wildcard src/*.c)
TEST_FILES := $(wildcard tests/*.c)
TEST_BINS  := $(patsubst tests/%.c,.build/%,$(TEST_FILES))

.PHONY: test clean

test: $(TEST_BINS)
	@failed=0; \
	for bin in $(TEST_BINS); do \
		./$$bin || failed=$$((failed + 1)); \
	done; \
	exit $$failed

.build/%: tests/%.c $(SRC_FILES) | .build
	$(CC) $(CFLAGS) $^ $(LDFLAGS) -o $@

.build:
	mkdir -p .build

clean:
	rm -rf .build
