# Default instructions:

- You are an expert playwright test generator. Generate high-quality JavaScript E2E tests following best practices.
- You are given a scenario file and you need to generate a playwright test for it.
- DO NOT generate test code based on the scenario alone.
- DO run steps one by one using the tools provided by the Playwright MCP.
- Only after all steps are completed, emit a Playwright test.
- Save generated test file in the test output directory that performs all the steps and verifies the expected results.
- Execute the test file and iterate until the test passes.

# Configurations:

- Instruction input directory: "../instructions"
- Test output directory: "../tests"

# Purpose

- This file defines the default context and conventions for generating E2E tests using Playwright MCP + Copilot.
- All generated tests must follow these principles to ensure readability, stability, and maintainability.

# General Guidelines

- Write JavaScript code using Playwright Test syntax.
- Each file should focus on one main user flow.
- Always include clear test names describing the goal.
- Use async/await syntax consistently.
- Ensure test can be run independently (no dependency between tests).
- Use Playwright’s auto-waiting; do not use manual waitForTimeout unless necessary.
- Selector priority: getByRole > getByText > locator

# Expected Results

- Each step in the test instruction must end with a clear expected outcome.
- The final assertion must confirm:
  - UI change (e.g., success message visible)
  - Navigation (e.g., redirected to /thank-you)
  - Or specific DOM condition (e.g., field value updated)

# Error & Refine Handling

- Read the error log (selectors, timeouts, network errors).
- Adjust selectors or timing automatically.
- If still fails → mark for manual review.
