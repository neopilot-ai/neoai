export const rspecRules = [
  {
    tags: ["Ruby", "Rails", "RSpec", "Testing"],
    title: "RSpec Testing Best Practices",
    libs: ["rspec", "ruby", "rails", "factorybot"],
    slug: "rspec-best-practices",
    content: `
When generating RSpec tests, follow these best practices to ensure they are comprehensive, readable, and maintainable:

### Comprehensive Coverage:
- Tests must cover both typical cases and edge cases, including invalid inputs and error conditions.
- Consider all possible scenarios for each method or behavior and ensure they are tested.

### Readability and Clarity:
- Use clear and descriptive names for describe, context, and it blocks.
- Prefer the expect syntax for assertions to improve readability.
- Keep test code concise; avoid unnecessary complexity or duplication.

### Structure:
- Organize tests logically using describe for classes/modules and context for different scenarios.
- Use subject to define the object under test when appropriate to avoid repetition.
- Ensure test file paths mirror the structure of the files being tested, but within the spec directory (e.g., app/models/user.rb → spec/models/user_spec.rb).

## Test Data Management:
- Use let and let! to define test data, ensuring minimal and necessary setup.
- Prefer factories (e.g., FactoryBot) over fixtures for creating test data.

## Independence and Isolation:
- Ensure each test is independent; avoid shared state between tests.
- Use mocks to simulate calls to external services (APIs, databases) and stubs to return predefined values for specific methods. Isolate the unit being tested, but avoid over-mocking; test real behavior when possible.

## Avoid Repetition:
- Use shared examples for common behaviors across different contexts.
- Refactor repetitive test code into helpers or custom matchers if necessary.

## Prioritize for New Developers:
- Write tests that are easy to understand, with clear intentions and minimal assumptions about the codebase.
- Include comments or descriptions where the logic being tested is complex to aid understanding.
    `,
    author: {
      name: "Karine Rostirola Ballardin",
      url: "https://github.com/ineBallardin",
      avatar: "https://github.com/ineBallardin.png",
    },
  },
];
