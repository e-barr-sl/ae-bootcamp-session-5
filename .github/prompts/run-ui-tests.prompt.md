---
description: "Run UI tests and summarize failures"
agent: "test-engineer"
tools: ['read', 'execute', 'todo']
---

# Run UI Tests and Analyze Results

Run Playwright UI tests and provide clear pass/fail summary with failure classification.

## Prerequisites

### REQUIRED: Install Playwright Dependencies (Ubuntu/Linux)

**CRITICAL FIRST STEP**: In Ubuntu/Linux environments (like this dev container), Playwright dependencies MUST be installed before running tests.

Run this command from the repository root:

```bash
npm run test:ui:install --workspace=frontend
```

**What this does**:
- Runs `playwright install --with-deps chromium` to install browser binaries and system dependencies
- Includes automatic Ubuntu repository remediation for common key import issues
- Performs bounded retry logic if key issues are detected
- **This is mandatory after container rebuild or in fresh environments**

**When to run**:
- ✅ First time running UI tests in this container
- ✅ After dev container rebuild
- ✅ When seeing "chromium not found" or similar errors
- ❌ Not needed every time (only after environment changes)

**What if it fails?**
- The `test:ui:install` script includes automatic remediation for the Yarn GPG key issue common in Ubuntu
- If it still fails after automatic retry, STOP immediately
- Report as an environment blocker with the failing command and key error lines
- DO NOT attempt ad-hoc package hunting or broad OS troubleshooting
- DO NOT continue to run Playwright tests after a failed dependency install

## Instructions

### Step 1: Verify Services are Running

Before running UI tests, ensure both backend and frontend are running.

**Check if services are running**:
```bash
# Check if processes are listening on required ports
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
```

**If services are NOT running, start them**:
```bash
# From repository root
npm start
```

Wait for both services to be ready before proceeding.

### Step 2: Run UI Test Suite

Run the Playwright UI tests:

```bash
cd packages/frontend && npm run test:ui
```

**Alternatively, from repository root**:
```bash
npm run test:ui --workspace=frontend
```

**Test execution will**:
- Launch headless browser(s)
- Execute all test cases
- Generate test report
- Return exit code (0 = success, non-zero = failures)

### Step 3: Capture Test Output

Parse the test results to understand outcomes:

**Successful run example**:
```
Running 5 tests using 1 worker

  ✓ todo-crud.spec.js:10:3 › should create a new todo (234ms)
  ✓ todo-crud.spec.js:18:3 › should toggle completion (189ms)
  ✓ todo-crud.spec.js:28:3 › should delete a todo (156ms)
  ✓ todo-crud.spec.js:38:3 › should prevent empty todo (98ms)
  ✓ todo-crud.spec.js:48:3 › should handle network error (203ms)

  5 passed (880ms)
```

**Failed run example**:
```
Running 5 tests using 1 worker

  ✓ todo-crud.spec.js:10:3 › should create a new todo (234ms)
  ✕ todo-crud.spec.js:18:3 › should toggle completion (5031ms)
  ✕ todo-crud.spec.js:28:3 › should delete a todo (5028ms)
  ✓ todo-crud.spec.js:38:3 › should prevent empty todo (98ms)
  ✓ todo-crud.spec.js:48:3 › should handle network error (203ms)

  3 passed
  2 failed
  
Error: todo-crud.spec.js:18 - should toggle completion
  Expected checkbox to be checked
  Received: unchecked
  
Error: todo-crud.spec.js:28 - should delete a todo
  Timeout: element did not become hidden within 5000ms
```

### Step 4: Summarize Results

Provide a clear summary in this format:

```
## UI Test Results

**Overall Status**: [PASS / FAIL]
**Tests Passed**: X/Y
**Tests Failed**: X/Y
**Duration**: Xms

### Passed Tests ✅
- ✅ Create todo - Todo appears in list correctly
- ✅ Empty validation - Error message shown
- ✅ Network error - Error handled gracefully

### Failed Tests ❌
- ❌ Toggle completion - Checkbox not updating
- ❌ Delete todo - Element not disappearing
```

### Step 5: Classify Failures

For EACH failed test, determine the likely root cause:

**Failure Category 1: Application Code Defect** 🐛
- **Symptoms**: Test expectations are correct, app behavior is wrong
- **Evidence**: Manual testing shows feature doesn't work
- **Examples**:
  - Toggle button doesn't update state
  - Delete API call returns 500
  - Form validation not working

**Failure Category 2: Test Code Defect** 🧪
- **Symptoms**: App works correctly, test expectations are wrong
- **Evidence**: Manual testing shows feature works fine
- **Examples**:
  - Test uses wrong selector (element moved)
  - Test doesn't wait for async operation
  - Test expects wrong value

**Failure Category 3: Environment Issue** 🔧
- **Symptoms**: Test and app both correct, but environment is broken
- **Evidence**: Tests pass sometimes but not others
- **Examples**:
  - Backend not running
  - Port conflict
  - Race condition in test setup
  - Missing Playwright dependencies (if install wasn't run)

### Step 6: Provide Detailed Failure Analysis

For each failed test, provide classification and recommended action:

```
### Failed Test Analysis

#### Test: "should toggle completion"

**Error**:
```
Expected checkbox to be checked
Received: unchecked
```

**Classification**: 🐛 Application Code Defect

**Evidence**:
- Test logic is correct (adds todo, clicks checkbox, expects checked)
- Manual test: Clicking checkbox in browser doesn't update state
- Backend API: PATCH endpoint not implemented

**Root Cause**: Toggle functionality not implemented in app

**Recommended Action**:
1. Implement PATCH /api/todos/:id endpoint in backend
2. Connect frontend toggle to API call
3. Re-run tests: /run-ui-tests

---

#### Test: "should delete a todo"

**Error**:
```
Timeout: element did not become hidden within 5000ms
```

**Classification**: 🧪 Test Code Defect

**Evidence**:
- Test logic has race condition
- Manual test: Delete works correctly in browser
- Test doesn't wait for API response before checking visibility

**Root Cause**: Test expects immediate removal, but should wait for API call

**Recommended Action**:
1. Add proper wait in test:
   ```javascript
   await expect(todoItem).not.toBeVisible({ timeout: 5000 });
   ```
2. Fix test code in packages/frontend/tests/ui/todo-crud.spec.js
3. Re-run tests: /run-ui-tests
```

### Step 7: Provide Next Steps

Based on results, recommend clear actions:

**If ALL tests pass**:
```
🎉 All UI tests passing!

Test Results: 5/5 passed ✅

Next steps:
- Proceed with /validate-step {step-number}
- Or commit changes: /commit-and-push {branch-name}
```

**If ANY tests fail**:
```
⚠️  UI tests have failures

Test Results: 3/5 passed, 2/5 failed ❌

Failures classified:
- 1 application code defect (needs feature implementation)
- 1 test code defect (needs test fix)

Recommended actions:
1. Fix application code defect:
   - Implement toggle functionality
   - Switch to @tdd-developer: Implement PATCH endpoint
   
2. Fix test code defect:
   - Update test wait logic in todo-crud.spec.js
   
3. Re-run after fixes:
   - /run-ui-tests

DO NOT proceed to /validate-step until all UI tests pass.
```

## Test Output Interpretation

### Understanding Playwright Output

**Test states**:
- ✓ (checkmark) = Test passed
- ✕ (X) = Test failed
- ⊘ (circle with slash) = Test skipped

**Common error patterns**:

**Timeout errors**:
```
Timeout: element not found within 5000ms
```
→ Usually test code issue (selector wrong or missing wait)

**Assertion errors**:
```
Expected: "value"
Received: "different value"
```
→ Could be app or test issue, requires investigation

**Connection errors**:
```
ECONNREFUSED 127.0.0.1:3000
```
→ Environment issue (frontend not running)

**Browser errors**:
```
chromium not found
```
→ Environment issue (need to run test:ui:install)

### Failure Pattern Recognition

**Application Code Patterns**:
- Multiple tests failing for same feature
- Error messages indicating server errors (500, etc.)
- Feature doesn't work in manual testing

**Test Code Patterns**:
- Test failure messages about selectors not found
- Timeout errors (test not waiting properly)
- Tests failing after UI changes but feature works

**Environment Patterns**:
- All tests failing with connection errors
- Random/intermittent failures
- "Browser not installed" or dependency errors

## Common Issues and Solutions

### Issue: "chromium not found"

**Cause**: Playwright browser dependencies not installed

**Solution**: Run the install script first
```bash
npm run test:ui:install --workspace=frontend
```

### Issue: Connection refused errors

**Cause**: Frontend or backend not running

**Solution**: Start services
```bash
# From repository root
npm start
```

### Issue: All tests timing out

**Cause**: Services might be running on wrong ports

**Solution**: Check Playwright config and service ports match
```javascript
// playwright.config.js
use: {
  baseURL: 'http://localhost:3000',  // Must match frontend port
}
```

### Issue: Random failures

**Cause**: Tests not properly isolated or race conditions

**Solution**: Review test code for:
- Proper beforeEach hooks
- State-based waits (not timeouts)
- Independent test data

## Memory System Updates

Document in `.github/memory/scratch/working-notes.md`:

```markdown
## UI Test Run - [timestamp]

**Test Results**: X/Y passing

**Passed Tests**:
- ✅ Create todo
- ✅ Empty validation

**Failed Tests**:
- ❌ Toggle completion

**Failure Analysis**:

### Toggle Completion Failure
**Classification**: Application Code Defect 🐛
**Root Cause**: PATCH endpoint not implemented
**Action**: Implement toggle endpoint in backend

**Next Steps**:
1. Switch to @tdd-developer
2. Implement PATCH endpoint
3. Re-run /run-ui-tests
```

## Success Indicators

✅ Playwright dependencies installed (if first run)
✅ Services verified running before test execution
✅ Tests executed successfully (command completed)
✅ Clear pass/fail summary provided
✅ Each failure classified with evidence
✅ Root causes identified
✅ Specific remediation actions provided
✅ Next steps clearly stated
✅ Memory system updated

## Output Template

```
## UI Test Execution Results

### Environment Check
✅ Playwright dependencies installed
✅ Backend running on port 3001
✅ Frontend running on port 3000

### Test Results
**Overall**: [X/Y passing]
**Duration**: Xms

**Passed** (X tests):
- ✅ Test name - What it validates
- ✅ Test name - What it validates

**Failed** (X tests):
- ❌ Test name - What it validates

### Failure Analysis

[For each failure: classification, evidence, root cause, action]

### Next Steps

[Specific actions based on results]
```
