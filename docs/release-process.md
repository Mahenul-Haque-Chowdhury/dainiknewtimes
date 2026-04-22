# Release Process

## Branching
- Feature branches -> Pull Request -> `main`

## Required checks on PR
- Type check
- Lint
- Unit/integration tests
- Build

## Release candidate checklist
- E2E smoke tests pass
- Security audit reviewed
- Migration/seed impact reviewed
- Editorial workflow (draft/publish) validated

## Versioning
- Use semantic versioning tags (`vMAJOR.MINOR.PATCH`).
- Update `CHANGELOG.md` before tagging.

## Post-release
- Verify metrics and error rate for 30-60 minutes.
- Document incidents and follow-up tasks.
