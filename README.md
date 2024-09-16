# NX Monorepo Boilerplate with Angular & Nest.js

This project is a fully-fledged software development boilerplate using Nx Dev Tools, designed for
scalable monorepo architecture. It supports both frontend (Angular) and backend (Nest.js)
development, with a focus on code consistency, maintainability, and smooth project management.

## Key Features

-   **Monorepo architecture** for managing both frontend and backend projects.
-   **Angular** as the primary frontend framework.
-   **Nest.js** as the primary backend framework.
-   Comprehensive **unit testing** and **E2E testing** for both frontend and backend.
-   **Environment management** for local, dev, UAT, and prod environments.
-   **Docker setup** with Docker Compose to run and test projects locally before release.
-   Strict **Prettier**, **ESLint**, **tsconfig**, and **VS Code** recommended settings for code
    consistency and clean, maintainable code.
-   Powerful **custom scripts** for validating Node.js and npm versions before setup.
-   **Environment file generation** if not already present.
-   A **single env file** for the entire project.
-   Automatic rollback on breaking dependency upgrades.
-   **Interactive commands** for serving and building the frontend, allowing the user to choose the
    environment before proceeding.
-   Sample base route and **health check implementation** in the backend.

## Prerequisites

Ensure that you have the following installed:

-   [Node.js (>= 20.17.0)](https://nodejs.org/en/download/package-manager)
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
    │   ├── frontend.inquirer.js
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

#### Common Environment Variables ####
PORT_BACKEND=8000
PORT_FRONTEND=4000
APP_ENV=LOCAL
MIN_NODE_VERSION='20.17.0'
MIN_NPM_VERSION='10.8.2'

#### Backend Environment Variables ####

# Application
ROUTE_PREFIX=api

# Key Vault
KEY_VAULT_URI=
TENANT_ID=
CLIENT_ID=
CLIENT_SECRET=

#### Frontend Environment Variables ####
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
