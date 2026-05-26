---
description: "Execute instructions from the current GitHub Issue step"
agent: "tdd-developer"
tools: ['search', 'read', 'edit', 'execute', 'web', 'todo']
---

# Execute Current Step from GitHub Issue

Execute the instructions from the current step in the main GitHub Issue.

## Inputs

- **Issue Number** (optional): ${input:issue-number:Issue number (leave blank to auto-detect)}

## Instructions

### Step 1: Find the Exercise Issue

If issue number is not provided, use the GitHub CLI to find it:

```bash
gh issue list --state open
```

Look for the issue with "Exercise:" in the title. This is the main exercise issue.

### Step 2: Get Issue Content with Comments

Retrieve the full issue with all comments:

```bash
gh issue view <issue-number> --comments
```

### Step 3: Parse the Latest Step Instructions

From the issue content:
1. Identify the most recent step comment (steps are posted as comments)
2. Parse the step structure:
   - Step title (e.g., "# Step 5-1: Implement Delete Functionality")
   - Instructions section
   - `:keyboard: Activity:` sections
   - Success criteria

### Step 4: Execute Each Activity Systematically

For each `:keyboard: Activity:` section in the step:

1. **Read the activity instructions carefully**
2. **Follow TDD workflow** (this prompt runs as `@tdd-developer`):
   - Write tests FIRST (RED phase)
   - Implement minimal code to pass (GREEN phase)
   - Refactor while keeping tests green (REFACTOR phase)
3. **Run tests after each change** to verify progress
4. **Update memory system** in `.github/memory/scratch/working-notes.md` as you work

**CRITICAL SCOPE BOUNDARIES**:
- ✅ DO: Write unit tests (Jest + Supertest for backend, React Testing Library for frontend)
- ✅ DO: Implement features following TDD principles
- ✅ DO: Run integration tests
- ❌ DO NOT: Create or run Playwright UI tests in this prompt
- ❌ DO NOT: Commit or push changes (use `/commit-and-push` for that)

**Handoff Rules**:
- For Playwright UI test creation: Use `/create-ui-tests` (auto-switches to `@test-engineer`)
- For running UI tests: Use `/run-ui-tests` (auto-switches to `@test-engineer`)

### Step 5: Report Completion

After completing all activities:

1. **Summarize what was accomplished**
2. **Report test results** (how many tests passing)
3. **List any blockers or issues** encountered
4. **Provide next commands** in the correct order:

**If the current step requires UI workflow**:
```
✅ Step activities complete!

Next commands:
1. /create-ui-tests
2. /run-ui-tests
3. /validate-step {step-number}

DO NOT run /validate-step until UI tests are created and passing.
```

**If UI workflow is NOT required**:
```
✅ Step activities complete!

Next command:
1. /validate-step {step-number}
```

**IMPORTANT**: Never recommend `/validate-step` before required UI prompts. Always check the step's success criteria to determine if UI tests are required.

## Testing Scope Constraints

Follow the testing guidance from `.github/copilot-instructions.md`:

- **Backend changes**: Write Jest + Supertest tests FIRST, then implement
- **Frontend changes**: Write React Testing Library tests FIRST, then implement
- **Critical UI journeys**: Defer to `/create-ui-tests` and `/run-ui-tests` prompts
- **Manual validation**: Mention when manual browser testing is recommended after UI automation

## Memory System Updates

Document your work in `.github/memory/scratch/working-notes.md`:

```markdown
## Current Task
Executing Step {step-number}: {step-title}

## Activities Completed
- [x] Activity 1: {description}
- [ ] Activity 2: {description}

## Test Results
- Backend: X/Y tests passing
- Frontend: X/Y tests passing

## Key Findings
- {any important discoveries}

## Next Steps
- {what comes next}
```

## Example Execution

**For Step 5-1: Implement Delete Functionality**

1. Parse step from issue comment
2. Activity 1: Write test for DELETE endpoint
   - Write Jest test in `packages/backend/__tests__/app.test.js`
   - Run test, verify it fails (RED)
3. Activity 2: Implement DELETE route
   - Add DELETE route handler in `packages/backend/src/app.js`
   - Run test, verify it passes (GREEN)
4. Activity 3: Add delete button to UI
   - Write React test in `packages/frontend/src/__tests__/App.test.js`
   - Run test, verify it fails (RED)
   - Implement delete button in `packages/frontend/src/App.js`
   - Run test, verify it passes (GREEN)
5. Report completion and recommend next commands

**Output**:
```
✅ Step 5-1 activities complete!

Accomplished:
- ✅ DELETE endpoint implemented (backend)
- ✅ Delete button added to UI (frontend)
- ✅ All 15 tests passing (12 backend + 3 frontend)

Next commands:
1. /create-ui-tests (for delete journey validation)
2. /run-ui-tests
3. /validate-step 5-1

DO NOT run /validate-step until UI tests are created and passing.
```

## Success Indicators

✅ All `:keyboard: Activity:` sections completed
✅ Tests written BEFORE implementation (TDD)
✅ All tests passing
✅ Memory system updated
✅ Clear next steps provided
✅ Correct command sequence recommended (including UI prompts if needed)
