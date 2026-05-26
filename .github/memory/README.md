# Development Memory System

## Purpose

This memory system tracks patterns, decisions, and lessons learned during development. It serves as a **living knowledge base** that both humans and AI can reference to maintain consistency and avoid repeating mistakes.

## Why Two Types of Memory?

### Persistent Memory (`.github/copilot-instructions.md`)
- **What**: Foundational principles, workflows, and stable guidelines
- **When to update**: Rarely - only when core standards or processes change
- **Committed to git**: ✅ Yes - shared with entire team
- **Examples**: TDD workflow, coding standards, agent usage patterns

### Working Memory (`.github/memory/`)
- **What**: Development discoveries, emerging patterns, session-specific learnings
- **When to update**: Frequently - during and after each development session
- **Committed to git**: ⚠️ Partial - historical summaries yes, active scratch notes no
- **Examples**: Bug fixes discovered, API patterns found, test strategies that worked

## Directory Structure

```
.github/memory/
├── README.md                    # This file - explains the memory system
├── session-notes.md             # Historical session summaries (COMMITTED)
├── patterns-discovered.md       # Accumulated code patterns (COMMITTED)
└── scratch/                     # Active session work (NOT COMMITTED)
    ├── .gitignore               # Ignores all scratch files
    └── working-notes.md         # Current session notes (EPHEMERAL)
```

## File Purposes

### `session-notes.md` (Historical Record)
**Purpose**: Document completed sessions for future reference

**When to update**: At the **end** of each development session

**What to capture**:
- Session name and date
- What was accomplished (features, fixes, refactors)
- Key findings and decisions made
- Outcomes and metrics (tests passing, issues resolved)

**Why it matters**: Provides historical context for why certain decisions were made. Helps AI understand the evolution of the codebase.

**Git status**: ✅ Committed - preserves institutional knowledge

### `patterns-discovered.md` (Pattern Library)
**Purpose**: Document recurring code patterns and solutions

**When to update**: When you discover a **reusable pattern** or establish a **project convention**

**What to capture**:
- Pattern name and context
- Problem it solves
- Solution approach
- Code example
- Related files

**Why it matters**: Ensures consistency across the codebase. Helps AI generate code that follows established patterns.

**Git status**: ✅ Committed - enforces project conventions

### `scratch/working-notes.md` (Active Work)
**Purpose**: Capture real-time notes during active development

**When to update**: **Throughout** the current development session

**What to capture**:
- Current task and approach
- Key findings as you discover them
- Decisions made and their rationale
- Blockers and open questions
- Next steps

**Why it matters**: Provides working memory during a session. Acts as a scratchpad for thoughts and discoveries before they're formalized.

**Git status**: ❌ NOT Committed - ephemeral, session-specific notes

## Workflow Integration

### During TDD Workflow

**When writing/fixing tests**:
1. Note failing tests in `scratch/working-notes.md` → Current Task
2. Document test strategy decisions → Decisions Made
3. After tests pass, note any patterns → Consider adding to `patterns-discovered.md`

**Example**:
```markdown
## Current Task
Implement POST /api/todos endpoint - failing test expects 201 status

## Key Findings
- Need to validate title is present and non-empty
- createdAt should be ISO string, not Date object

## Decisions Made
- Using array push() instead of database for MVP
- Generating IDs with Date.now() temporarily
```

### During Lint Error Resolution

**When fixing lint errors**:
1. Document common error categories in `scratch/working-notes.md`
2. Note any project-wide decisions (e.g., "We allow console.log in tests")
3. If a pattern emerges (e.g., "Always use const for non-reassigned variables"), add to `patterns-discovered.md`

**Example**:
```markdown
## Key Findings
- Had 12 no-unused-vars errors - all from incomplete refactoring
- 3 no-console warnings in test files - decided to suppress in test files only

## Decisions Made
- Added eslint-disable-next-line for console in tests
- Will use proper logger in production code
```

### During Debugging Workflow

**When debugging issues**:
1. Document the bug symptoms in `scratch/working-notes.md` → Current Task
2. Track hypotheses and test results → Notes
3. When fixed, document the root cause and solution
4. After session, summarize in `session-notes.md` for future reference

**Example**:
```markdown
## Current Task
Bug: Toggle always sets completed to true (should toggle both ways)

## Key Findings
- Line 45 has `todo.completed = true` instead of `todo.completed = !todo.completed`
- Missing test for toggling completed→incomplete direction

## Decisions Made
- Fixed toggle logic
- Added bidirectional test to prevent regression
```

### During Implementation Planning

**When building new features**:
1. Write implementation plan in `scratch/working-notes.md` → Approach
2. Document each step's outcome → Key Findings
3. Note any architectural decisions → Decisions Made
4. If you establish a new pattern, add to `patterns-discovered.md`

**Example**:
```markdown
## Approach
DELETE /api/todos/:id endpoint
1. Parse ID from params
2. Find todo by ID
3. Return 404 if not found
4. Remove from array
5. Return 204 No Content

## Decisions Made
- Using 204 (No Content) instead of 200 for successful delete
- Returning 404 with error message object for consistency
```

## How AI Reads and Applies Memory

### Pattern Recognition
When AI sees a request like "Add a new API endpoint", it:
1. Checks `patterns-discovered.md` for API endpoint patterns
2. Follows the established structure (error handling, status codes, response format)
3. Generates code consistent with existing patterns

### Context Awareness
When AI encounters an error or question, it:
1. Reviews `session-notes.md` for similar issues solved in the past
2. Checks `scratch/working-notes.md` for current session context
3. Applies lessons learned to current problem

### Decision Consistency
When AI makes suggestions, it:
1. Considers decisions documented in memory files
2. Avoids suggesting approaches that were tried and failed
3. Maintains consistency with project conventions

## End-of-Session Workflow

At the end of each development session:

1. **Review `scratch/working-notes.md`**
   - What were the key discoveries?
   - What decisions should be remembered?
   - What patterns emerged?

2. **Update `session-notes.md`**
   - Add a new session entry
   - Summarize accomplishments and findings
   - Document outcomes

3. **Update `patterns-discovered.md`** (if applicable)
   - Add any new patterns discovered
   - Update existing patterns with new insights

4. **Clear `scratch/working-notes.md`** (optional)
   - Reset for next session OR
   - Leave for continuity if resuming soon

## Example: From Scratch to Session Notes

### During Session (in `scratch/working-notes.md`):
```markdown
## Current Task
Fix failing tests for POST /api/todos

## Key Findings
- Missing title validation
- CreatedAt timestamp format inconsistent
- Need unique ID generation strategy

## Decisions Made
- Using Date.now() for IDs temporarily
- Validating title exists and is non-empty string
- Returning ISO string for createdAt
```

### After Session (added to `session-notes.md`):
```markdown
### Session: POST Endpoint Implementation - 2026-05-26

**Accomplished**:
- Implemented POST /api/todos endpoint
- Added title validation
- Fixed timestamp formatting

**Key Findings**:
- Discovered need for unique ID generation (using Date.now() temporarily)
- Established validation pattern: check required fields before processing

**Outcomes**:
- 5/5 POST endpoint tests passing
- No lint errors
```

## Best Practices

### DO ✅
- **Write as you work** - Don't wait until end of session
- **Be specific** - "Changed validation logic" → "Added non-empty string check for title"
- **Document "why"** - Explain reasoning behind decisions
- **Update patterns** - Formalize recurring solutions
- **Review regularly** - Refresh your memory before starting work

### DON'T ❌
- **Don't write novels** - Keep notes concise and scannable
- **Don't duplicate** - If it's in copilot-instructions.md, don't repeat in memory
- **Don't commit scratch** - Keep active notes ephemeral
- **Don't forget to summarize** - Working notes lose value if not preserved

## Getting Started

1. **Start your session**: Open `scratch/working-notes.md` and note your current task
2. **Work and document**: Add findings and decisions as you go
3. **Ask AI for help**: Reference memory files in your prompts ("Check patterns-discovered.md for API patterns")
4. **End your session**: Summarize key points from scratch into `session-notes.md`
5. **Commit historical memory**: `git add .github/memory/session-notes.md .github/memory/patterns-discovered.md`

## Questions?

This memory system evolves with your project. If you discover better ways to organize or capture knowledge, update this README!

---

**Remember**: The goal is to build a knowledge base that makes you and your AI assistant more effective over time. Start simple, refine as needed.
