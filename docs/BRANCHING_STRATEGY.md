# Branching Strategy for NX Monorepo

The recommended branching strategy is a hybrid GitFlow model with Trunk-Based Development
adjustments, allowing you to minimize conflicts, improve collaboration, and control what gets
deployed at each stage.

## Branch Structure

### Main Branches

-   **`main`**:

    -   **Purpose**: Holds the production-ready, stable code that is deployed to production
        environment.
    -   **CI/CD**: Deploys to the production environment, runs full end-to-end testing and quality
        checks.
    -   **Merging Rules**: Only code from `release/*` branches, which has passed stakeholder review
        in `uat`, is merged here.

-   **`uat`**:

    -   **Purpose**: For User Acceptance Testing (UAT) and stakeholder approval before code is
        promoted to production.
    -   **CI/CD**: Deploys to the UAT environment, running comprehensive regression and acceptance
        tests.
    -   **Merging Rules**: Code is merged into `uat` from `release/*` branches after stabilization
        in the `release/*` branch.

-   **`develop`**:

    -   **Purpose**: The primary branch for ongoing development. All feature development, bug fixes,
        and integrations occur here.
    -   **CI/CD**: Deploys to the development environment with automated builds and tests on every
        merge.
    -   **Merging Rules**: Feature and bugfix branches are merged here after passing code reviews
        and automated tests.

### Supporting Branches

-   **`feature/*`**:

    -   **Purpose**: For developing individual features. Each new feature is developed in its own
        branch.
    -   **Naming Convention**: `feature/feature-name` (e.g., `feature/user-authentication`).
    -   **Merging Rules**: Merged into `develop` after code review and successful testing.
        Incomplete features are managed with feature toggles.

-   **`bugfix/*`**:

    -   **Purpose**: For fixing bugs identified during development. Typically branched from
        `develop`.
    -   **Naming Convention**: `bugfix/bug-description` (e.g., `bugfix/fix-login-issue`).
    -   **Merging Rules**: Merged into `develop` after code review and successful testing.

-   **`hotfix/*`**:

    -   **Purpose**: For urgent fixes that need to be deployed directly to production.
    -   **Naming Convention**: `hotfix/hotfix-description` (e.g., `hotfix/fix-payment-gateway`).
    -   **Merging Rules**: Merged directly into `main`, then into `uat` and `develop` to keep all
        branches aligned.

-   **`release/*`**:

    -   **Purpose**: For stabilizing and finalizing a release. Created from `develop` once a set of
        features is ready for release.
    -   **Naming Convention**: `release/version-number` (e.g., `release/v1.2.0`).
    -   **Merging Rules**:
        -   Use this branch for final bug fixes and stabilization.
        -   Continuously merge any changes in `release/*` back into `develop` to keep it in sync.
        -   After stabilization, merge `release/*` into `uat` for stakeholder approval.
        -   Upon approval, merge `release/*` into `main` for production deployment.

## Feature Toggles

**Purpose**: Feature toggles allow partial or incomplete features to be deployed without being
active in production or UAT environments.

-   **Implementation**: Use environment variables or configuration files to manage feature toggles.
-   **Toggle Management**:
    -   Maintain an updated list of active feature toggles, including their purpose and planned
        removal.
    -   Regularly clean up toggles once features are fully deployed.
-   **Testing**:
    -   Ensure automated tests cover both scenarios: with toggles on and off.
-   **PR Descriptions**:
    -   Clearly state how to enable or disable feature toggles for testing purposes.

## Pull Request (PR) Guidelines

**PR Size**:

-   Keep PRs small, focused, and limited to a single feature or fix to minimize conflicts and
    simplify reviews.

**PR Titles**:

-   Use clear and descriptive titles (e.g., `#1234 Add user authentication`).

**PR Descriptions**:

-   Provide detailed explanations, including the problem addressed, the solution, and relevant
    context. Mention any feature toggles used.

**Review Process**:

-   Every PR must be reviewed by at least one other developer. For critical changes, involve a
    senior developer or architect.
-   QA engineers should review changes affecting user-facing functionality.

**Testing**:

-   Include comprehensive tests in your PR. All tests must pass before the PR is approved.

**Code Quality**:

-   Follow established coding standards. Automated linting and code quality checks should be part of
    the CI process.

## Merging Workflow

-   **Feature/Bugfix to Develop**:

    -   Merge feature and bugfix branches into `develop` after successful code reviews and testing.
        Regularly rebase feature branches with `develop` to avoid conflicts.

-   **Develop to Release**:

    -   Once a set of features is complete and tested, create a `release/*` branch from `develop`.
    -   Use the `release/*` branch for final bug fixes and stabilization.
    -   Continuously merge any changes in `release/*` back into `develop` to ensure they stay in
        sync.

-   **Release to UAT**:

    -   Merge the `release/*` branch into `uat` after stabilization. This branch is used for final
        testing and stakeholder review.

-   **Release to Main**:

    -   After stakeholder approval in `uat`, merge `release/*` into `main` for production
        deployment.

-   **Hotfix**:

    -   Hotfix branches are merged directly into `main` for urgent production issues. Then, merge
        the hotfix into `uat` and `develop` to keep all branches aligned.

## Versioning and Tags

-   Use semantic versioning (e.g., `v1.0.0`, `v1.1.0`) to tag every production release on `main`.
-   Each hotfix should increment the patch version (e.g., `v1.0.1`).

## Summary

This strategy ensures that `develop`, `release/*`, `uat`, and `main` branches remain synchronized,
reducing the risk of conflicts and ensuring a smooth, stable release process. The use of feature
toggles provides additional flexibility, allowing incomplete features to be deployed without
disrupting production or UAT environments. Following the outlined PR and merging rules will help
maintain high code quality and minimize the risk of issues during development and deployment.
