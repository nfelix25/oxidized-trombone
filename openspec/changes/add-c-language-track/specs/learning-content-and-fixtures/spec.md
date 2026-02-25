## ADDED Requirements

### Requirement: Fixture harness validates C-language fixture files
The system SHALL extend the fixture harness to scan and validate fixture files under `fixtures/valid/c-*/` and `fixtures/invalid/c-*/` directories, covering all four section schemas populated with C content.

#### Scenario: Valid C scaffold fixture passes harness
- **WHEN** the fixture harness runs against `fixtures/valid/c-scaffold/`
- **THEN** all files in that directory validate against `scaffold_v1` and the harness reports no errors

#### Scenario: Valid C starter section fixture passes harness
- **WHEN** the fixture harness runs against `fixtures/valid/c-starter-section/`
- **THEN** all files validate against `starter_section_v1`

#### Scenario: Valid C test section fixture passes harness
- **WHEN** the fixture harness runs against `fixtures/valid/c-test-section/`
- **THEN** all files validate against `test_section_v1`

#### Scenario: Valid C lesson section fixture passes harness
- **WHEN** the fixture harness runs against `fixtures/valid/c-lesson-section/`
- **THEN** all files validate against `lesson_section_v1`

#### Scenario: Invalid C fixtures fail validation with expected errors
- **WHEN** the fixture harness runs against `fixtures/invalid/c-*/`
- **THEN** each fixture fails validation for the reason documented in the fixture file

### Requirement: C fixture files demonstrate realistic C content
C fixture files SHALL contain realistic C systems-programming content (pointer arithmetic, POSIX calls, `#include` headers) rather than placeholder strings, so that the harness confirms the schemas accept real-world C content.

#### Scenario: C starter section fixture contains a C function stub
- **WHEN** a valid c-starter-section fixture is read
- **THEN** its `content` field contains a C function definition with a body using `return 0;` or similar placeholder

#### Scenario: C test section fixture contains test.h macro usage
- **WHEN** a valid c-test-section fixture is read
- **THEN** its `content` field contains `#include "test.h"` and at least one `TEST_ASSERT` macro call
