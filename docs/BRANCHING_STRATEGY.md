# Git Branching Strategy for Nx Monorepo with Angular and Nest.js

The recommended branching strategy is a hybrid GitFlow model with Trunk-Based Development
adjustments, allowing you to minimize conflicts, improve collaboration, and control what gets
deployed at each stage.

# Key Branches

## Main (`main`)

-   **Purpose**: This is the production branch containing only the most stable, verified code.
-   **CI/CD Pipeline**: The production deployment pipeline is attached to this branch.
-   **Rules**: Only merge from `release/*` branches, and enforce strict code review, testing,
    validation and stakeholder sign-off.

## UAT (`uat`)

-   **Purpose**: The UAT branch is for stakeholders to test staging features before they are
    released to production.
-   **CI/CD Pipeline**: The UAT pipeline is attached to this branch for manual and stakeholder
    testing.
-   **Rules**: Only merge from `release/*` branches for controlled UAT testing.

## Development (`develop`)

-   **Purpose**: The main branch for ongoing development, containing all features currently under
    development.
-   **CI/CD Pipeline**: The development pipeline is attached to this branch, running all automated
    tests and integration checks.
-   **Rules**: Developers merge feature branches after code reviews and successful tests.

## Feature Branches (`feature/*`)

-   **Purpose**: Developers create these branches from `develop` for new features or tasks.
-   **Naming Convention**: `feature/<feature-name>` (e.g., `feature/login-ui`).
-   **Rules**: Feature branches should be rebased regularly with `develop` to minimize conflicts.

## Release Branches (`release/*`)

-   **Purpose**: Prepare the codebase for a release. Bug fixes, last-minute testing, and adjustments
    are done here, this branch must be created from `develop` branch.
-   **Naming Convention**: `release/<version-number>` (e.g., `release/1.0.0`).
-   **Rules**: Only merge into `uat` and `main` after successful testing in UAT and final
    validation.

## Hotfix Branches (`hotfix/*`)

-   **Purpose**: For urgent bug fixes in production.
-   **Rules**: Hotfix branches are created from `main`, fixed, and then merged back into both `main`
    and `develop`.

# Feature-Based Release Management with Feature Toggles

## Feature Toggles

-   Feature flags allow unfinished features to be merged into `develop` without being exposed in UAT
    or production.
-   Feature flags can be controlled through environment variables or a feature management system
    such as LaunchDarkly or Unleash.
-   Only activate features in UAT or production that are fully tested and ready for release.

## Controlled Releases with Release Branches

-   When preparing for a release, a release branch (e.g., `release/1.0.0`) is created from
    `develop`.
-   Cherry-pick or selectively merge features into the release branch using feature flags to include
    only what is stable.
-   Run final QA and validation on the `release/*` branch before merging into `uat` and `main`.

# Workflow Overview

## 1. Feature Development

-   Each feature is developed in a dedicated `feature/*` branch.
-   Developers regularly merge from `develop` to keep the branch up-to-date.
-   Once the feature is ready, reviewed, and tested, it is merged into `develop`.

## 2. Continuous Integration on Develop

-   CI/CD pipelines ensure automated tests, linting, and build checks are run on `develop`.
-   **Feature Flags**: Use feature flags to ensure unfinished features remain hidden in `develop`
    until they are fully ready.

## 3. UAT Process

-   Once the release is stable, a `release/*` branch is created and merged into `uat` for final
    testing.
-   **UAT CI/CD**: The UAT pipeline automatically deploys this branch for manual testing by
    stakeholders.

## 4. Production Release

-   Once the `uat` branch is tested and approved, merge the `release/*` branch into `main` for
    production deployment.
-   Tag each release on `main` (e.g., `v1.0.0`).

## 5. Hotfix Management

-   For urgent production issues, create a `hotfix/*` branch from `main`, apply the fix, and merge
    it into both `main` and `develop`.

# CI/CD Integration

## Production Pipeline (main)

-   Restrict direct commits to `main`; only allow merges from `release/*`.
-   Run all automated tests (unit, integration, and end-to-end) before deployment.
-   Automatically deploy to production once CI checks pass.

## UAT Pipeline (uat)

-   Only merge from `release/*` for UAT testing.
-   Use the UAT pipeline for manual regression testing and stakeholder sign-off.

## Development Pipeline (develop)

-   Merge feature branches (`feature/*`) regularly.
-   Ensure code reviews, linting, and testing are done before merging.

# Conflict Management

-   **Rebase Regularly**: Developers should frequently rebase feature branches with the latest from
    `develop` to catch conflicts early.
-   **Small, Frequent Merges**: Encourage small, frequent merges to minimize large, complex
    conflicts.
-   **Feature Flags**: Use feature flags to safely merge unfinished features.

# Versioning and Tags

-   Use semantic versioning (e.g., `v1.0.0`, `v1.1.0`) to tag every production release on `main`.
-   Each hotfix should increment the patch version (e.g., `v1.0.1`).

# Branch Protection and Validation

## Main

-   Only merge from `release/*`.
-   Require passing CI checks, code reviews, and stakeholder sign-off.

## UAT

-   Only merge from `release/*`.
-   Require passing UAT validation before promoting to `main`.

## Develop

-   Require passing tests and linting checks for all feature merges.
-   Enforce code review before any merge.

# Conclusion

By following this branching strategy with feature flags and robust CI/CD integration, you can ensure
minimal conflicts, a smooth release process, and safe, stable deployments across development, UAT,
and production environments. This strategy is ideal for teams of your size, working in a monorepo
with both frontend and backend projects.
