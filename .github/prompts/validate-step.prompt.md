---
description: "Validate that all success criteria for the current step are met"
agent: "code-reviewer"
tools: ['search', 'read', 'execute', 'web', 'todo']
---

# Validate Step Completion

Validate that all success criteria for the specified step are met.

## Inputs

- **Step Number** (REQUIRED): ${input:step-number:Step number (e.g., "5-0", "5-1")}

## Instructions

### Step 1: Find the Exercise Issue

Use GitHub CLI to find the main exercise issue:

```bash
gh issue list --state open
```

Look for the issue with "Exercise:" in the title.

### Step 2: Retrieve Issue with Comments

Get the full issue content including all comments:

```bash
gh issue view <issue-number> --comments
```

### Step 3: Locate the Specified Step

Search through the issue content to find the step that matches the provided step number.

**Step format in issue**:
```markdown
# Step {step-number}: {title}

## Instructions
...

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
```

Extract the "Success Criteria" section for the specified step.

### Step 4: Validate Each Criterion

For each success criterion, check the current workspace state:

**Types of criteria and how to validate**:

#### Code Implementation Criteria
- **Example**: "DELETE endpoint implemented in backend"
- **Validation**: Read the file, verify the endpoint exists
- **Command**: Check file content

#### Test Coverage Criteria
- **Example**: "Tests passing for delete functionality"
- **Validation**: Run test suite, verify passing
- **Command**: `npm test`

#### File Existence Criteria
- **Example**: "Delete button present in UI"
- **Validation**: Read component file, verify button exists
- **Command**: Check file content

#### Test Results Criteria
- **Example**: "All tests passing"
- **Validation**: Run full test suite
- **Command**: `npm test` (backend and frontend)

#### UI Test Criteria
- **Example**: "UI tests passing for critical journeys"
- **Validation**: Run UI test suite
- **Command**: `npm run test:ui --workspace=frontend`

#### Lint/Quality Criteria
- **Example**: "No ESLint errors"
- **Validation**: Run linter
- **Command**: `npm run lint`

#### Git Criteria
- **Example**: "Changes committed to feature branch"
- **Validation**: Check git status and branch
- **Command**: `git status`, `git branch --show-current`

### Step 5: Report Validation Results

Provide a clear summary with checkmarks:

**Format**:
```
## Step {step-number} Validation Results

### Success Criteria

✅ Criterion 1: [Description]
   - Status: Complete
   - Evidence: [specific evidence]

❌ Criterion 2: [Description]
   - Status: Incomplete
   - Issue: [what's missing or wrong]
   - Action: [specific steps to fix]

✅ Criterion 3: [Description]
   - Status: Complete
   - Evidence: [specific evidence]

### Overall Status: [COMPLETE / INCOMPLETE]

### Next Steps:
[Specific guidance based on validation results]
```

### Step 6: Provide Specific Guidance

**If ALL criteria met**:
```
🎉 Step {step-number} is complete!

All success criteria validated:
✅ [list all criteria]

Next steps:
- Proceed to next step
- Or create PR if this was the final step
```

**If ANY criteria NOT met**:
```
⚠️  Step {step-number} is incomplete

Completed:
✅ [list completed criteria]

Still needed:
❌ [list incomplete criteria with specific actions]

Recommended actions:
1. [Specific fix for first incomplete criterion]
2. [Specific fix for second incomplete criterion]
3. Re-run /validate-step {step-number} after fixes
```

## Validation Examples

### Example 1: Backend Implementation Step

**Step 5-1 Success Criteria**:
- [ ] DELETE endpoint implemented
- [ ] Tests written for DELETE
- [ ] All backend tests passing

**Validation Process**:

1. **Check DELETE endpoint**:
   - Read `packages/backend/src/app.js`
   - Search for `app.delete('/api/todos/:id'`
   - Result: ✅ Found

2. **Check DELETE tests**:
   - Read `packages/backend/__tests__/app.test.js`
   - Search for test cases covering DELETE
   - Result: ✅ Found 2 tests

3. **Run backend tests**:
   ```bash
   cd packages/backend && npm test
   ```
   - Result: ✅ 12/12 passing

**Report**:
```
## Step 5-1 Validation Results

### Success Criteria

✅ DELETE endpoint implemented
   - Location: packages/backend/src/app.js (line 45-52)
   - Handles DELETE /api/todos/:id
   - Returns 204 on success, 404 on not found

✅ Tests written for DELETE
   - Location: packages/backend/__tests__/app.test.js
   - Test 1: Should delete todo with 204 status
   - Test 2: Should return 404 if todo not found

✅ All backend tests passing
   - Results: 12/12 tests passing
   - Coverage: DELETE endpoint fully covered

### Overall Status: COMPLETE ✅

🎉 Step 5-1 is complete!

Next steps:
- Proceed to Step 5-2
- Or run /commit-and-push if ready
```

### Example 2: Incomplete Step

**Step 5-2 Success Criteria**:
- [ ] Delete button in UI
- [ ] Frontend tests passing
- [ ] UI tests covering delete journey

**Validation Process**:

1. **Check delete button**: ✅ Found in App.js
2. **Run frontend tests**: ❌ 2 tests failing
3. **Check UI tests**: ❌ No UI tests exist yet

**Report**:
```
## Step 5-2 Validation Results

### Success Criteria

✅ Delete button in UI
   - Location: packages/frontend/src/App.js
   - Button renders for each todo item

❌ Frontend tests passing
   - Status: 2 tests failing
   - Failed: "should remove todo on delete"
   - Failed: "should call API on delete"
   - Issue: Tests expect onClick handler but button uses wrong prop

❌ UI tests covering delete journey
   - Status: No UI tests found
   - Expected: tests/ui/ should contain delete journey test
   - Issue: UI tests not created yet

### Overall Status: INCOMPLETE ⚠️

Recommended actions:
1. Fix frontend tests:
   - Update button onClick handler in App.js
   - Run: npm test --workspace=frontend
   - Verify 2 failing tests now pass

2. Create UI tests:
   - Run: /create-ui-tests
   - Specify journey: delete todo workflow

3. Re-validate:
   - Run: /validate-step 5-2
```

## Advanced Validation

### Running Multiple Test Suites

When criteria require tests across multiple layers:

```bash
# Backend tests
cd packages/backend && npm test

# Frontend tests
cd packages/frontend && npm test

# UI tests
cd packages/frontend && npm run test:ui

# All tests (if root script exists)
npm test
```

### Checking Code Quality

If success criteria include code quality:

```bash
# Lint check
npm run lint

# Type check (if TypeScript)
npm run type-check
```

### Verifying Git State

If criteria include git/commit requirements:

```bash
# Check current branch
git branch --show-current

# Check if changes are committed
git status

# Check commit history
git log -1 --oneline
```

## Success Indicators

✅ Step number provided and found in issue
✅ All success criteria extracted from issue
✅ Each criterion validated against workspace
✅ Specific evidence provided for each check
✅ Clear COMPLETE or INCOMPLETE status
✅ Actionable guidance for incomplete items
✅ Next steps clearly stated

## Error Handling

**If step number not provided**:
```
❌ Step number is required

Usage: /validate-step {step-number}
Example: /validate-step 5-1
```

**If step not found in issue**:
```
❌ Step {step-number} not found in issue

Available steps:
- Step 5-0: Setup
- Step 5-1: Backend Implementation
- Step 5-2: Frontend Implementation

Please verify the step number and try again.
```

**If issue cannot be retrieved**:
```
❌ Cannot retrieve GitHub issue

Troubleshooting:
1. Verify gh CLI is authenticated: gh auth status
2. Check network connection
3. Verify issue exists: gh issue list
```
