# Code Patterns Discovered

## Purpose
This file documents recurring code patterns, conventions, and solutions established during development. Use these patterns to maintain consistency across the codebase.

## Pattern Template
Use this template when documenting new patterns:

```markdown
### Pattern: [Pattern Name]

**Context**: [When/where this pattern applies]

**Problem**: [What problem does this solve?]

**Solution**: [How to implement this pattern]

**Example**:
```[language]
// Code example showing the pattern
```

**Related Files**: [Files where this pattern is used]

**Notes**: [Additional context, gotchas, or variations]
```

---

## Established Patterns

### Pattern: Service Initialization with Empty Collections

**Context**: When initializing data structures in service modules (backend API)

**Problem**: Deciding between `null`, `undefined`, or empty collections for initial state. Inconsistent initialization can lead to null reference errors and defensive coding throughout the codebase.

**Solution**: Initialize collections with empty arrays or objects rather than null/undefined. This eliminates null checks and provides a consistent interface.

**Example**:
```javascript
// ✅ GOOD - Initialize with empty array
let todos = [];

// ❌ AVOID - Null/undefined requires checks everywhere
let todos = null;

// Usage with empty array - no null checks needed
const getTodos = () => todos;
const addTodo = (todo) => todos.push(todo);
const countTodos = () => todos.length;

// Usage with null - defensive checks required
const getTodos = () => todos || [];
const addTodo = (todo) => {
  if (!todos) todos = [];
  todos.push(todo);
};
const countTodos = () => todos ? todos.length : 0;
```

**Related Files**: 
- `packages/backend/src/app.js` - todos array initialization

**Notes**: 
- This pattern applies to in-memory data structures
- For database contexts, null may be appropriate to distinguish "no data loaded" from "loaded but empty"
- Simplifies test setup - no need to initialize state in every test

---

## Pattern Categories

As you discover more patterns, organize them into categories:

### API Patterns
- Request validation
- Error response format
- Status code usage
- Response structure

### Frontend Patterns
- Component structure
- State management
- Event handling
- API integration

### Testing Patterns
- Test setup/teardown
- Mock data creation
- Assertion style
- Test organization

### Error Handling Patterns
- Error detection
- Error logging
- User feedback
- Recovery strategies

---

## Contributing New Patterns

When you discover a pattern worth documenting:

1. **Identify the pattern**: Notice when you solve the same problem multiple times
2. **Generalize the solution**: Extract the core approach from specific implementations
3. **Document with example**: Show concrete code, not just descriptions
4. **Update existing code**: Apply the pattern consistently across the codebase
5. **Share with team**: Commit to git so others can follow the pattern

Remember: Good patterns emerge from experience, not upfront design. Document them as you discover them!
