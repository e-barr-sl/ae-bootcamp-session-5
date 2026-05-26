---
description: "Create UI tests for required critical user journeys"
agent: "test-engineer"
tools: ['search', 'read', 'edit', 'execute', 'todo']
---

# Create UI Tests for Critical Journeys

Create Playwright UI tests for critical user journeys using Page Object Model pattern.

## Inputs

- **Journeys** (optional): ${input:journeys:Comma-separated journeys (leave blank for default: create, edit, toggle, delete, error-handling)}

## HARD LIMIT: Maximum 5 Playwright Tests

**CRITICAL CONSTRAINT**: This prompt MUST NOT create more than 5 Playwright test cases (`test(...)` or `it(...)`).

**Enforcement rules**:
1. Target creating 3-5 tests total (not per file)
2. Include at least 1 error-path test within the 3-5 total
3. If more than 5 candidate scenarios exist, select the 5 highest-risk scenarios
4. List deferred scenarios separately instead of creating additional tests
5. Before finishing, count all created/updated `test(...)` and `it(...)` blocks
6. If count exceeds 5, reduce the scope or report the blocker

**Why this limit exists**: UI tests are expensive to run and maintain. Focus on critical paths only.

## Instructions

### Step 1: Determine Journeys to Test

**Default journeys** (if none specified):
1. Create todo (happy path)
2. Toggle todo completion (happy path)
3. Delete todo (happy path)
4. Validation error (error path - e.g., empty todo)
5. (Optional 5th: Edit todo or another critical error state)

**Maximum 5 journeys total** - if more are needed, prioritize by risk:
- High risk: Core CRUD operations
- Medium risk: Bulk operations, filters
- Low risk: Edge cases, nice-to-have features

**Document prioritization**:
```markdown
## UI Test Scope for This Run

**Selected (High Priority)**:
1. Create todo - Core functionality, high user impact
2. Toggle completion - Frequently used, critical state change
3. Delete todo - Irreversible action, must work correctly
4. Empty todo validation - Prevents bad data
5. (5th test if applicable)

**Deferred (Lower Priority)**:
- Edit todo title - Less frequently used
- Bulk mark complete - Nice to have, not critical
- Filter todos - Enhancement feature
```

### Step 2: Check Existing Test Infrastructure

Before creating tests, check what exists:

1. **Check for Page Objects**:
   ```
   packages/frontend/tests/pages/
   packages/frontend/tests/helpers/
   ```

2. **Check existing UI tests**:
   ```
   packages/frontend/tests/ui/
   ```

3. **Check Playwright config**:
   ```
   packages/frontend/playwright.config.js
   ```

### Step 3: Create or Update Page Object Model

**CRITICAL**: Use Page Object Model to separate page interactions from test logic.

**Page Object structure**:

```javascript
// packages/frontend/tests/pages/TodoPage.js
export class TodoPage {
  constructor(page) {
    this.page = page;
    
    // Selectors (stable, accessibility-first)
    this.todoInput = page.getByRole('textbox', { name: /todo/i });
    this.addButton = page.getByRole('button', { name: /add/i });
    this.todoItems = page.getByRole('listitem');
    this.errorMessage = page.getByRole('alert');
  }

  // Reusable actions
  async goto() {
    await this.page.goto('http://localhost:3000');
  }

  async addTodo(title) {
    await this.todoInput.fill(title);
    await this.addButton.click();
    // State-based wait (not timeout)
    await this.page.waitForSelector(`text="${title}"`);
  }

  async getTodoCount() {
    return await this.todoItems.count();
  }

  async toggleTodo(title) {
    const todo = this.page.getByRole('listitem').filter({ hasText: title });
    await todo.getByRole('checkbox').click();
  }

  async deleteTodo(title) {
    const todo = this.page.getByRole('listitem').filter({ hasText: title });
    await todo.getByRole('button', { name: /delete/i }).click();
  }
}
```

**Selector priority** (most stable → least stable):
1. ✅ `getByRole`, `getByLabel`, `getByPlaceholder` (accessibility-first)
2. ✅ `getByTestId` (explicit test hooks)
3. ❌ CSS selectors (brittle, avoid unless necessary)

### Step 4: Create UI Test File(s)

**REMEMBER: Maximum 5 test cases across ALL files**

Create test file(s) in `packages/frontend/tests/ui/`:

```javascript
// packages/frontend/tests/ui/todo-crud.spec.js
import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

test.describe('Todo CRUD Operations', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  // Test 1: Create todo (happy path)
  test('should create a new todo', async () => {
    const todoText = 'Buy groceries';
    await todoPage.addTodo(todoText);
    
    expect(await todoPage.getTodoCount()).toBe(1);
    await expect(todoPage.page.getByText(todoText)).toBeVisible();
  });

  // Test 2: Toggle completion (happy path)
  test('should toggle todo completion', async () => {
    const todoText = 'Complete project';
    await todoPage.addTodo(todoText);
    await todoPage.toggleTodo(todoText);
    
    const todo = todoPage.page.getByRole('listitem').filter({ hasText: todoText });
    const checkbox = todo.getByRole('checkbox');
    await expect(checkbox).toBeChecked();
  });

  // Test 3: Delete todo (happy path)
  test('should delete a todo', async () => {
    const todoText = 'Delete me';
    await todoPage.addTodo(todoText);
    expect(await todoPage.getTodoCount()).toBe(1);
    
    await todoPage.deleteTodo(todoText);
    
    // State-based wait for removal
    await expect(todoPage.page.getByText(todoText)).not.toBeVisible();
    expect(await todoPage.getTodoCount()).toBe(0);
  });

  // Test 4: Validation error (error path)
  test('should prevent adding empty todo', async () => {
    await todoPage.addButton.click(); // Click without entering text
    
    // Should show error message
    await expect(todoPage.errorMessage).toBeVisible();
    await expect(todoPage.errorMessage).toContainText(/required|empty/i);
    
    // Should not add todo
    expect(await todoPage.getTodoCount()).toBe(0);
  });

  // Test 5: (Optional 5th test if needed)
  // Only add if staying under the 5-test limit
});
```

**Test structure**:
- Clear test names describing behavior
- Arrange-Act-Assert pattern
- State-based waits (NOT `waitForTimeout`)
- Independent tests (no shared state)

### Step 5: Verify Test Count

**Before finishing, count test cases**:

```bash
# Count test cases in created files
grep -r "test('\\|it('" packages/frontend/tests/ui/ | wc -l
```

**If count > 5**:
```
❌ BLOCKER: Created {count} tests, exceeds limit of 5

Action required:
1. Remove lowest-priority test cases to stay within limit, OR
2. Document this as a scope blocker and stop

Cannot proceed with more than 5 tests.
```

### Step 6: Document Test Coverage

Create or update documentation:

```markdown
## UI Test Coverage

**Tests Created** (5 max):
1. ✅ Create todo - Verifies todo appears in list
2. ✅ Toggle completion - Verifies checkbox state changes
3. ✅ Delete todo - Verifies todo removed from list
4. ✅ Empty validation - Verifies error message shown
5. ✅ (5th test if created)

**Deferred Tests** (beyond 5-test limit):
- Edit todo title
- Bulk mark all complete
- Filter by status
- Network error handling

**Page Objects**:
- TodoPage (packages/frontend/tests/pages/TodoPage.js)
  - Selectors: todoInput, addButton, todoItems, errorMessage
  - Actions: goto, addTodo, getTodoCount, toggleTodo, deleteTodo

**Test Files**:
- todo-crud.spec.js (5 tests covering core CRUD + validation)
```

### Step 7: Report Results

Provide a summary:

```
✅ UI tests created (within 5-test limit)

Test count: 5/5 tests
Files changed:
- packages/frontend/tests/pages/TodoPage.js (Page Object created)
- packages/frontend/tests/ui/todo-crud.spec.js (5 tests created)

Coverage:
✅ Create todo journey
✅ Toggle completion journey
✅ Delete todo journey
✅ Empty todo validation (error path)
✅ (5th journey if applicable)

Deferred scenarios (beyond scope):
- Edit todo
- Bulk operations
- Filtering

Next steps:
1. Run UI tests: /run-ui-tests
2. After tests pass: /validate-step {step-number}

DO NOT skip /run-ui-tests - must verify tests pass before validation.
```

## Best Practices

### State-Based Waits (Required)

```javascript
// ❌ BAD - Arbitrary timeout (flaky)
await page.click('button');
await page.waitForTimeout(2000);

// ✅ GOOD - Wait for specific state
await page.click('button');
await page.waitForSelector('text="Success"');

// ✅ GOOD - Wait for count change
const initialCount = await page.getByRole('listitem').count();
await page.getByRole('button', { name: 'Add' }).click();
await expect(page.getByRole('listitem')).toHaveCount(initialCount + 1);
```

### Test Isolation (Required)

```javascript
// ✅ GOOD - Each test is independent
test.beforeEach(async ({ page }) => {
  // Each test starts fresh
  await page.goto('http://localhost:3000');
});

// ❌ BAD - Tests depend on each other
test('test 1', async () => {
  // Creates data
});

test('test 2', async () => {
  // Assumes data from test 1 exists
});
```

### Descriptive Test Names (Required)

```javascript
// ✅ GOOD - Clear intent
test('should prevent adding empty todo', async () => { /* ... */ });

// ❌ BAD - Unclear intent
test('test1', async () => { /* ... */ });
```

## Memory System Updates

Document in `.github/memory/scratch/working-notes.md`:

```markdown
## Current Task
Creating UI tests for critical journeys (max 5 tests)

## Test Scope
**Priority 1 (Created)**:
- Create todo
- Toggle completion
- Delete todo
- Empty validation
- (5th if applicable)

**Deferred (Beyond limit)**:
- Edit todo
- Bulk operations

## Implementation Progress
- ✅ TodoPage Page Object created
- ✅ 5 tests created in todo-crud.spec.js
- ✅ Verified test count: 5/5 (within limit)

## Key Decisions
- Using accessibility-first selectors (getByRole)
- State-based waits (no timeouts)
- Tests isolated with beforeEach
```

## Success Indicators

✅ Maximum 5 Playwright test cases created
✅ At least 1 error-path test included
✅ Page Object Model used for reusable interactions
✅ Stable selectors (accessibility-first) used
✅ State-based waits (no arbitrary timeouts)
✅ Tests are isolated and independent
✅ Test count verified before finishing
✅ Deferred scenarios documented if scope limited
✅ Clear documentation provided
✅ Next steps clearly stated

## Failure Modes

**If more than 5 tests needed**:
```
⚠️  Scope Limitation

Requested: 8 journeys
Limit: 5 tests maximum

Action taken:
- Created 5 highest-priority tests
- Documented 3 deferred scenarios

Deferred scenarios can be added in future iterations.
```

**If unable to determine priority**:
```
⚠️  Need Clarification

Multiple journeys requested, but unclear which are highest priority.

Please specify the 5 most critical journeys, or I will use defaults:
1. Create todo
2. Toggle completion
3. Delete todo
4. Empty validation
5. (Your choice)
```
