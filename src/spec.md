# Specification

## Summary
**Goal:** Configure and verify a GitHub Actions CI pipeline that automatically runs the test suite on push to main and pull requests.

**Planned changes:**
- Create GitHub Actions workflow at .github/workflows/ci.yml that starts dfx replica, deploys backend canister, installs test dependencies, and runs the test suite
- Configure workflow to use dfx 0.15.0+ and Node.js 18.x+ with caching for dfx and npm dependencies
- Add CI status badge to README.md with instructions for running tests locally
- Update frontend/src/__tests__/README.md with a Continuous Integration section explaining the CI setup, triggers, and troubleshooting
- Verify the CI pipeline executes successfully on GitHub with all jobs completing without errors

**User-visible outcome:** Developers can view automated test results in GitHub Actions on every push and pull request, with a status badge in the README showing current CI health.
