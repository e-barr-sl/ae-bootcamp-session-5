---
description: "Global workspace instructions for TODO application development"
---

# TODO Application Development Guidelines

## Project Context

This is a full-stack TODO application with a React frontend and Express backend. Development follows an iterative, feedback-driven approach with emphasis on:

- **Tech Stack**: React frontend + Express backend + Jest/Playwright testing
- **Development Philosophy**: Incremental changes with continuous validation
- **Current Phase**: Backend stabilization and frontend feature completion

## Documentation References

Navigate the project using these key documents:

- [docs/project-overview.md](../docs/project-overview.md) - Architecture, tech stack, and structure
- [docs/testing-guidelines.md](../docs/testing-guidelines.md) - Test patterns and standards
- [docs/workflow-patterns.md](../docs/workflow-patterns.md) - Development workflow guidance

## Development Principles

Follow these core principles for all development work:

- **Test-Driven Development**: Follow the Red-Green-Refactor cycle
- **Incremental Changes**: Make small, testable modifications
- **Systematic Debugging**: Use test failures as guides to identify root causes
- **Validation Before Commit**: Ensure all tests pass and no lint errors exist

## Testing Scope

This project uses multiple testing layers for comprehensive quality assurance:

**Testing Tools**:
- **Backend**: Jest + Supertest for API testing
- **Frontend**: React Testing Library for component unit/integration tests
- **UI Testing**: Playwright for critical user journey automation
- **Manual Testing**: Browser-based exploratory validation and visual checks

**Why Multiple Layers**: Combine fast feedback from unit/integration tests with end-to-end quality confidence from UI tests.

**Testing Approach by Context**:

- **Backend API changes**: Write Jest tests FIRST, then implement (RED-GREEN-REFACTOR)
- **Frontend component features**: Write React Testing Library tests FIRST for component behavior, then implement (RED-GREEN-REFACTOR). Follow with manual browser testing for full UI flows.
- **This is true TDD**: Test first, then code to pass the test

## Workflow Patterns

Follow these workflows for different development contexts:

1. **TDD Workflow**: Write/fix tests → Run tests → See failures (RED) → Implement code → Tests pass (GREEN) → Refactor → Re-validate
2. **Code Quality Workflow**: Run lint → Categorize issues → Fix systematically → Re-validate
3. **Integration Workflow**: Identify issue → Debug → Write/update tests → Fix → Verify end-to-end
4. **UI Testing Workflow**: Define critical journeys → Create UI tests → Run tests → Debug failures → Validate coverage

## Agent Usage

Use specialized agents for different aspects of development:

- **tdd-developer**: For implementation and unit/integration TDD cycles. Do NOT create or run Playwright UI tests in this mode.
- **code-reviewer**: For addressing lint errors and code quality improvements. Focus on clean code practices.
- **test-engineer**: Owns all Playwright UI test authoring, execution, failure triage, and isolation checks.

## Memory System

This project uses a two-tier memory system to capture and apply development knowledge:

**Persistent Memory** (this file):
- Foundational principles and workflows that rarely change
- Global coding standards and conventions
- Core development philosophy

**Working Memory** (`.github/memory/` directory):
- Development discoveries and patterns
- Session notes and historical context
- Active work-in-progress tracking

**How to Use**:
- During active development, take notes in `.github/memory/scratch/working-notes.md` (not committed)
- At end of session, summarize key findings into `.github/memory/session-notes.md` (committed)
- Document recurring code patterns in `.github/memory/patterns-discovered.md` (committed)
- Reference these files when providing context-aware suggestions

**Why This Matters**:
- AI can reference discovered patterns for consistent code generation
- Historical decisions inform current implementation choices
- Team knowledge is preserved and accessible
- Avoids repeating solved problems

See [`.github/memory/README.md`](.github/memory/README.md) for detailed usage instructions.

## Workflow Utilities

Use GitHub CLI commands for workflow automation (available in all modes):

**List open issues**:
```bash
gh issue list --state open
```

**Get issue details**:
```bash
gh issue view <issue-number>
```

**Get issue with comments**:
```bash
gh issue view <issue-number> --comments
```

**Notes**:
- The main exercise issue will have "Exercise:" in the title
- Steps are posted as comments on the main issue
- Use these commands when `/execute-step` or `/validate-step` prompts are invoked

## Git Workflow

Follow conventional commit format and branch strategies:

**Conventional Commits**:
- `feat:` - New features
- `fix:` - Bug fixes
- `chore:` - Maintenance tasks
- `docs:` - Documentation changes
- `test:` - Test additions or modifications
- `refactor:` - Code refactoring without functional changes

**Branch Strategy**:
- Feature branches: `feature/<descriptive-name>`
- Always stage all changes before committing: `git add .`
- Push to the correct branch: `git push origin <branch-name>`

**Best Practices**:
- Keep commits atomic and focused
- Write clear, descriptive commit messages
- Reference issue numbers when applicable: `feat: add delete button (#12)`
