# NX Monorepo Boilerplate with Angular & Nest.js

This versatile boilerplate accelerates medium to large-scale web development using NX Dev Tools,
Angular for the frontend, and NestJS for the backend. It streamlines setup with dynamic environment
parameterization for local, dev, UAT, and production stages, ensuring smooth transitions between
environments.

With strict code quality checkpoints, including ESLint and Prettier configurations, it enforces
consistency, detects syntax errors, and optimizes memory usage. Pre-configured Docker setups for
both frontend and backend ensure seamless containerized deployments, and Jest handles unit and
end-to-end testing across both applications for consistent, thorough test coverage.

A powerful upgrade command updates Angular, NestJS, NX Workspace, and npm dependencies, with
automatic rollback to a stable state in case of failures. The boilerplate includes a CI/CD pipeline
using GitHub Actions, automating deployments based on branch workflows. Additionally, two basic
Angular components, NestJS routes, and a functional API interaction demonstrate the integration
between frontend and backend.

It features a shared library for constants, interfaces, and other reusable elements, reducing
duplication. Useful package.json commands, like a dynamic npm install that checks Node.js and npm
versions and auto-installs essential VS Code extensions, simplify development. Interactive
scaffolding commands create frontend and backend modules with pre-configured setups to expedite
project scalability.

## Key Features

-   **Dynamic Environment Setup** Seamlessly supports local, dev, UAT, and production environments
    with parameterized configurations.

-   **Code Quality Enforcement** Integrates **ESLint** and **Prettier** for strict code consistency,
    syntax error detection, and memory optimization.

-   **Unified Testing** Utilizes **Jest** for both unit and end-to-end testing across frontend
    (Angular) and backend (NestJS).

-   **Docker Integration** Pre-configured **Docker** setup ensures smooth containerized development
    and deployment.

-   **Upgrade Command with Rollback** Automatically upgrades **Angular**, **NestJS**, **NX
    Workspace**, and npm modules with rollback on failure.

-   **CI/CD Pipeline** **GitHub Actions** pipeline automates deployments based on branch workflows.

-   **Pre-built Components and Routes** Includes basic **Angular** components and **NestJS** routes
    with a functional API call for full-stack demonstration.

-   **Shared Library** Provides a common library for constants, interfaces, and enumerations to
    reduce code duplication.

-   **Dynamic npm Install** Checks and verifies **Node.js** and **npm** versions, automatically
    installing essential **VS Code extensions**.

-   **Scaffolding Commands** Interactive scaffolding commands generate modules with all required
    files for both frontend and backend.

## Prerequisites

Ensure that you have the following installed:

-   [Node.js (>= 20.17.0)](https://nodejs.org/en/download/package-manager)
-   [Visual Studio Code (Recommended)](https://code.visualstudio.com/Download)
-   [Docker Desktop (Optional)](https://www.docker.com/products/docker-desktop)

## Repository Structure

```sh
└── simple-web-app-boilerplate/
    ├── .github
    │   └── workflows
    ├── LICENSE
    ├── README.md
    ├── apps
    │   ├── backend
    │   ├── backend-e2e
    │   ├── frontend
    │   └── frontend-e2e
    ├── devops
    │   ├── backend
    │   └── frontend
    ├── docker-compose.yml
    ├── jest.config.ts
    ├── jest.preset.js
    ├── libs
    │   └── shared
    ├── nx.json
    ├── package-lock.json
    ├── package.json
    ├── scripts
    │   ├── dependency.verifier.js
    │   ├── env.builder.js
    │   ├── frontend.ignite.js
    │   ├── generate.module.js
    │   ├── upgrade.js
    │   └── vs.extensions.setup.js
    └── tsconfig.base.json
```

## Setup Instructions

1. Clone the repository.
2. Install the project dependencies using the following command:

    ```bash
    npm install
    ```

    This will:

    - Validate your Node.js and npm versions.
    - Install recommended VS Code extensions.
    - Create an environment file from the sample if one does not exist.

3. Run the project using Docker (optional):

    ```bash
    npm run docker:up
    ```

    This is optional, you can run the project even without Docker:

    - Use `npm run frontend:serve` command to run **frontend**.
    - Use `npm run backend:serve` command to run **backend**.

### Frontend Commands

-   **Build**: Builds the frontend project after prompting for the environment.

    ```bash
    npm run frontend:build
    ```

-   **Unit Tests**: Runs unit tests for the frontend.

    ```bash
    npm run frontend:test
    ```

-   **E2E Tests**: Runs E2E tests for the frontend.

    ```bash
    npm run frontend:e2e
    ```

-   **Serve**: Serves the frontend project after prompting for the environment.

    ```bash
    npm run frontend:serve
    ```

### Backend Commands

-   **Build**: Builds the backend project.

    ```bash
    npm run backend:build
    ```

-   **Unit Tests**: Runs unit tests for the backend.

    ```bash
    npm run backend:test
    ```

-   **E2E Tests**: Runs E2E tests for the backend.

    ```bash
    npm run backend:e2e
    ```

-   **Serve**: Serves the backend project.

    ```bash
    npm run backend:serve
    ```

### Upgrade Project Dependencies

There is a custom script to upgrade all project dependencies. If an error occurs during the upgrade,
the script will automatically rollback the changes.

```bash
npm run upgrade
```

### Generate module for frontend or backend

This custom script streamlines the creation of new modules for either frontend or backend projects.
It prompts the user for input on module and component/controller names, generates the necessary
files and directories.

```bash
npm run generate:module
```

## Sample Environment Variables

Below is a sample `.env` file. This file should not contain sensitive or production-specific values.
For real environment variables, ensure they are managed securely.

```env
# ====================== DISCLAIMER =======================
# This file is a sample configuration for environment variables.
# It should be committed to version control to provide a reference
# for required variables and their names. However, it should not
# contain sensitive or production-specific values.
#
# The actual `.env` file should contain real values and must be
# added to .gitignore to prevent it from being tracked in the
# repository. Ensure that sensitive information is securely managed
# and kept private.
# =========================================================

######################################
#### Common Environment Variables ####
######################################
PORT_FRONTEND=4000

# Note: PORT_BACKEND change required inside apps/frontend/src/config/config.ts too
PORT_BACKEND=8000

# Note: APP_ENV can be only LOCAL, DEV, UAT, or PROD
APP_ENV=LOCAL

MIN_NODE_VERSION='20.17.0'
MIN_NPM_VERSION='10.8.2'

#######################################
#### Backend Environment Variables ####
#######################################

# Note: ROUTE_PREFIX change required inside apps/frontend/src/config files and spec file too
ROUTE_PREFIX=api

KEY_VAULT_URI=
TENANT_ID=
CLIENT_ID=
CLIENT_SECRET=

########################################
#### Frontend Environment Variables ####
########################################
```

## Sample Backend Response Format

```json
{
    "IsSuccess": true,
    "Message": "Record created.",
    "Data": null,
    "Errors": []
}
```

## Default Ports

-   Frontend: http://localhost:4000
-   Backend: http://localhost:8000

## Recommended Branching Strategy

This document outlines a solid branching strategy for your Nx monorepo architecture, considering
from medium to large development team and CI/CD pipelines attached to the main (production), uat
(user acceptance testing), and develop (development) branches. Checkout link below for detailed
information about the branching strategy

[Branching Strategy](docs/BRANCHING_STRATEGY.md)

## Author Information

-   **Author**: Karan Gupta
-   **LinkedIn**: [Karan Gupta](https://www.linkedin.com/in/karangupta0005)
-   **GitHub**: [Karan Gupta](https://github.com/Karan0005)
-   **Contact**: +91-8396919047
-   **Email**: [karangupta0005@gmail.com](mailto:karangupta0005@gmail.com)

## Contribution

Contributions are welcome! Here are several ways you can contribute:

1. **Fork the Repository**: Start by forking the project repository to your github account.

2. **Clone Locally**: Clone the forked repository to your local machine using a git client.

    ```sh
    git clone https://github.com/Karan0005/simple-web-app-boilerplate
    ```

3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.

    ```sh
    git checkout -b new-feature-x
    ```

4. **Make Your Changes**: Develop and test your changes locally.

5. **Commit Your Changes**: Commit with a clear message describing your updates.

    ```sh
    git commit -m 'Implemented new feature x.'
    ```

6. **Push to github**: Push the changes to your forked repository.

    ```sh
    git push origin new-feature-x
    ```

7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe
   the changes and their motivations.

8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch.
   Congratulations on your contribution!

-   **[Report Issues](https://github.com/Karan0005/simple-web-app-boilerplate/issues)**: Submit bugs
    found or log feature requests for the `simple-web-app-boilerplate` project.

## License

This project is licensed under the MIT License.
