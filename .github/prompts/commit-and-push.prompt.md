---
description: "Analyze changes, generate commit message, and push to feature branch"
tools: ['read', 'execute', 'todo']
---

# Commit and Push Changes

Analyze workspace changes, generate a conventional commit message, and push to a feature branch.

## Inputs

- **Branch Name** (REQUIRED): ${input:branch-name:Feature branch name (e.g., feature/delete-functionality)}

## Instructions

### Step 1: Verify UI Tests (If Required)

**Before committing**, check if the current step requires UI workflow:

1. Review the step's success criteria
2. If UI tests are mentioned or implied:
   - Verify `/run-ui-tests` has been run successfully in this chat session, OR
   - Run UI tests now: `npm run test:ui --workspace=frontend`
3. Do NOT commit until UI tests pass (if required)

### Step 2: Analyze Changes

Review all changes made in the workspace:

```bash
git status
git diff
```

Understand:
- Which files were modified
- What functionality was added/changed
- What tests were added/modified

### Step 3: Generate Conventional Commit Message

Create a commit message following the conventional commit format (from `.github/copilot-instructions.md`):

**Format**: `<type>: <description>`

**Types**:
- `feat:` - New features
- `fix:` - Bug fixes
- `test:` - Test additions or modifications
- `chore:` - Maintenance tasks
- `docs:` - Documentation changes
- `refactor:` - Code refactoring without functional changes

**Guidelines**:
- Use present tense: "add feature" not "added feature"
- Be descriptive but concise
- Reference issue numbers when applicable: `feat: add delete button (#12)`

**Examples**:
```
feat: implement delete todo functionality
fix: correct toggle completion logic
test: add integration tests for delete endpoint
chore: update dependencies
```

### Step 4: Create or Switch to Branch

**CRITICAL**: Only commit to the user-provided branch name. Never commit to `main` or any other branch.

Check if branch exists and create/switch as needed:

```bash
# Check if branch exists
git branch --list <branch-name>

# If branch DOES NOT exist, create it
git checkout -b <branch-name>

# If branch EXISTS, switch to it
git checkout <branch-name>
```

**Verify you're on the correct branch**:
```bash
git branch --show-current
```

### Step 5: Stage All Changes

Stage all modified, new, and deleted files:

```bash
git add .
```

Verify what's staged:
```bash
git status
```

### Step 6: Commit with Generated Message

Commit the changes:

```bash
git commit -m "<generated-commit-message>"
```

### Step 7: Push to Branch

Push the commit to the specified branch on origin:

```bash
git push origin <branch-name>
```

If this is the first push to a new branch, the command will set up tracking automatically.

### Step 8: Report Results

Provide a summary:

```
✅ Changes committed and pushed!

Branch: feature/delete-functionality
Commit: feat: implement delete todo functionality
Files changed: 4
- packages/backend/src/app.js
- packages/backend/__tests__/app.test.js
- packages/frontend/src/App.js
- packages/frontend/src/__tests__/App.test.js

Next steps:
- Continue with next step, OR
- Create pull request: gh pr create
```

## Safety Checks

Before committing, verify:

- ✅ All tests passing (run `npm test`)
- ✅ If UI tests required, they are passing
- ✅ No linting errors (run `npm run lint` if available)
- ✅ On the correct feature branch (NOT main)
- ✅ Commit message follows conventional format
- ✅ Changes are related and cohesive

**Never commit**:
- ❌ Failing tests
- ❌ Debug code (console.log statements, commented code)
- ❌ Directly to `main` branch
- ❌ Unrelated changes mixed together

## Branch Naming Conventions

Use descriptive branch names:

- `feature/add-delete-button` - New feature
- `fix/toggle-completion-bug` - Bug fix
- `test/e2e-coverage` - Test additions
- `refactor/extract-helpers` - Code refactoring

## Example Execution

**Scenario**: Committing delete functionality implementation

**User provides**: `branch-name: feature/delete-todo`

**Execution**:

1. Check git status and diff
2. Generate commit message: `feat: implement delete todo functionality`
3. Check if `feature/delete-todo` exists
4. Branch doesn't exist → Create: `git checkout -b feature/delete-todo`
5. Stage: `git add .`
6. Commit: `git commit -m "feat: implement delete todo functionality"`
7. Push: `git push origin feature/delete-todo`

**Output**:
```
✅ Changes committed and pushed!

Branch: feature/delete-todo
Commit: feat: implement delete todo functionality
Files changed:
- packages/backend/src/app.js (DELETE endpoint)
- packages/backend/__tests__/app.test.js (tests for delete)
- packages/frontend/src/App.js (delete button UI)
- packages/frontend/src/__tests__/App.test.js (delete button tests)

Remote: https://github.com/user/repo/tree/feature/delete-todo

Next steps:
- Continue with next step
- Create PR: gh pr create --base main --head feature/delete-todo
```

## Troubleshooting

**If branch name not provided**:
```
❌ Branch name is required.

Please provide a feature branch name:
Example: /commit-and-push feature/delete-functionality
```

**If on wrong branch**:
```
⚠️  Currently on branch 'main'
Switching to feature branch...
```

**If tests are failing**:
```
❌ Cannot commit - tests are failing

Fix failing tests first:
- Run: npm test
- Fix issues
- Try /commit-and-push again
```

## Success Indicators

✅ All tests passing (including UI if required)
✅ Conventional commit message generated
✅ Committed to correct feature branch (not main)
✅ All changes staged and committed
✅ Successfully pushed to remote
✅ Clear summary provided with next steps
