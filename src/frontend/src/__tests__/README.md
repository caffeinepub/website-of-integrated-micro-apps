# Test Suite for Shared Interoperability Layer

This directory contains documentation for the test suite for the shared interoperability layer APIs that provide consistent authentication, authorization, and multi-tenant access control across all micro-apps in the Arkly Portal.

## Important Note

**The test implementation files are not included in this build because `vitest` cannot be added to the read-only package.json file.** TypeScript compilation would fail if test files were present without the dependency installed.

To implement the full test suite locally, follow the instructions below to:
1. Install test dependencies
2. Create the test files
3. Configure vitest
4. Run the tests

---

## Quick Start

For experienced developers, here is the command sequence to set up and run tests:

