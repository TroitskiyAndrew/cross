# AI Workflow for Cross Project

This project follows a lightweight AI pipeline with clear roles and a strict step-by-step workflow.

## Roles

### 1. Product / Requirements
Defines what must be built and in what order.

Responsibilities:
- clarify the goal of the feature or task
- define acceptance criteria
- keep scope minimal and realistic
- separate MVP from future improvements

### 2. Architecture / Design
Decides the structure of the implementation without writing the full solution.

Responsibilities:
- choose components and responsibilities
- define state flow
- decide if a service is needed
- keep the solution simple and maintainable

### 3. Implementation
Writes the actual code for the agreed task.

Responsibilities:
- follow the agreed design
- keep changes small and focused
- avoid unrelated refactors
- work step by step

### 4. Review / QA
Validates the behavior against the requirements.

Responsibilities:
- check edge cases
- verify win/lose/draw logic
- confirm there are no regressions
- test real behavior, not assumptions

### 5. Documentation / Release
Explains the result and preserves context.

Responsibilities:
- update docs when needed
- summarize what changed
- keep project notes clear and short

## Workflow

1. Define the task clearly.
2. Agree on the minimal requirement.
3. Design the smallest possible implementation.
4. Create a dedicated branch for the task.
5. Build one step at a time.
6. Validate behavior with real scenarios.
7. Commit only when the step is stable.
8. Open a pull request for review.
9. Merge only after the pull request is approved.
10. Move to the next task.

## Project Rules

- Keep the MVP small and working.
- Do not mix unrelated tasks in one commit.
- Prefer simple, readable code over complex abstractions.
- Do not implement unasked premium features before MVP is complete.
- Validate gameplay logic before visual polish.
- Use short, explicit commit messages.

## Commit Message Convention

Use prefixes like:
- feat: new feature
- fix: bug fix
- refactor: code cleanup without behavior change
- docs: documentation update
- test: tests or validation

Examples:
- feat: create game board
- feat: add move validation
- fix: prevent move after win
- refactor: extract winner logic

## Current Project Goal

Build a Tic-Tac-Toe game in Angular with:
- a 3x3 board
- alternating turns
- win and draw detection
- restart/reset game action
- clear status messages

## Working Style

We will use a small, disciplined AI workflow:
- requirements first
- architecture second
- implementation third
- review fourth
- branch + PR fifth
- merge last

Each task must live in its own branch, with a pull request created before merging into main. This keeps the project under version control and avoids uncontrolled code drift.
