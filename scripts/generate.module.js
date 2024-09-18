const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');

// Helper function to make capitalize class name from module name or component name
const makeClassName = (name) => {
    return name
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
};

const format = async (path) => {
    execSync(
        `prettier ${path}/**/*.{js,ts,scss,html,json} --write  && eslint ${path}/**/*.{ts,js} --fix`,
        { stdio: 'pipe' }
    );
};

// Main function to scaffold the module
const generateModule = async () => {
    let absoluteModulePath = '';
    try {
        const answers = await inquirer.default.prompt([
            {
                type: 'list',
                name: 'projectName',
                message: 'Where would you like to place the module?',
                choices: ['frontend', 'backend']
            },
            {
                type: 'input',
                name: 'moduleName',
                message: 'Enter the name of the new module (e.g., file-manager):',
                validate: (input) =>
                    /^[a-z][a-z0-9-]*$/.test(input) ||
                    'Module name must be in kebab-case and not empty.'
            },
            {
                type: 'input',
                name: 'componentName',
                message: 'Enter the name of the new component (e.g., trash):',
                validate: (input) =>
                    /^[a-z][a-z0-9-]*$/.test(input) ||
                    'Component name must be in kebab-case and not empty.',
                when: (answers) => answers.projectName === 'frontend'
            },
            {
                type: 'input',
                name: 'controllerName',
                message: 'Enter the name of the new controller (e.g., trash):',
                validate: (input) =>
                    /^[a-z][a-z0-9-]*$/.test(input) ||
                    'Controller name must be in kebab-case and not empty.',
                when: (answers) => answers.projectName === 'backend'
            }
        ]);

        const { projectName, moduleName, componentName, controllerName } = answers;
        const relativeModulePath = path.posix.join('apps', projectName, 'src', 'modules');
        absoluteModulePath = path.posix.join(process.cwd(), relativeModulePath, moduleName);

        // Check if the directory already exists
        if (fs.existsSync(absoluteModulePath)) {
            console.error(
                chalk.red(`The module '${moduleName}' already exists in the app: ${projectName}`)
            );
            process.exit(1); // Exit the process with a failure code
        }

        if (projectName === 'frontend') {
            await createFrontendModule(
                absoluteModulePath,
                relativeModulePath,
                moduleName,
                componentName
            );
        } else {
            // Backend TODO
        }

        await format(path.posix.join(relativeModulePath, moduleName));
        console.log(chalk.green(`Module ${moduleName} has been successfully scaffolded!`));
    } catch (error) {
        fs.rmSync(absoluteModulePath, { recursive: true, force: true });
        console.error(chalk.red(`An error occurred: ${error.message}`));
    }
};

// Function to handle frontend-specific module creation (Angular)
const createFrontendModule = async (
    absoluteModulePath,
    relativeModulePath,
    moduleName,
    componentName
) => {
    const directories = {
        components: 'components',
        services: 'services',
        interfaces: 'interfaces',
        service: path.posix.join('services', componentName)
    };

    // Create necessary directories
    await Promise.all(
        Object.values(directories).map((directory) =>
            fs.ensureDir(path.posix.join(absoluteModulePath, directory))
        )
    );

    // Files to create for frontend modules
    const filesToCreate = [
        {
            directory: '',
            filename: `${moduleName}.module.ts`
        },
        {
            directory: directories.components,
            filename: 'index.ts'
        },
        {
            directory: directories.service,
            filename: `${componentName}.service.ts`
        },
        {
            directory: directories.service,
            filename: `${componentName}.service.spec.ts`
        },
        {
            directory: directories.services,
            filename: 'index.ts'
        },
        {
            directory: directories.interfaces,
            filename: `${componentName}.interface.ts`
        },
        {
            directory: directories.interfaces,
            filename: 'index.ts'
        }
    ];

    for (const file of filesToCreate) {
        await createFile(
            'frontend',
            file,
            absoluteModulePath,
            relativeModulePath,
            moduleName,
            componentName
        );
    }
};

// Function to create files with specific content based on type (frontend/backend)
const createFile = async (
    projectName,
    file,
    absoluteModulePath,
    relativeModulePath,
    moduleName,
    componentName
) => {
    const { filename, directory } = file;
    const filePath = path.posix.join(absoluteModulePath, directory, filename);
    const fileContent = await getFileContent(
        projectName,
        directory,
        filename,
        moduleName,
        componentName
    );

    await fs.writeFile(filePath, fileContent);
    console.log(
        chalk.green('CREATE ') +
            path.posix.join(
                relativeModulePath,
                moduleName,
                directory ? path.posix.join(directory, filename) : filename
            )
    );
};

// Generate appropriate content for files based on type and filename
const getFileContent = async (projectName, directory, filename, moduleName, componentName) => {
    if (projectName === 'frontend') {
        const moduleClassName = makeClassName(moduleName) + 'Module';
        const componentClassName = makeClassName(componentName) + 'Component';
        const serviceClassName = makeClassName(componentName) + 'Service';
        switch (directory) {
            case '': {
                return `
                    import { CommonModule } from '@angular/common';
                    import { NgModule } from '@angular/core';
                    import { ${componentClassName} } from './components';
                    import { ${serviceClassName} } from './services';

                    @NgModule({
                        declarations: [${componentClassName}],
                        imports: [CommonModule],
                        providers: [${serviceClassName}]
                    })
                    export class ${moduleClassName} {}
                `;
            }
            case 'components': {
                execSync(
                    `npx nx g @nrwl/angular:component ${componentName} --directory=apps/frontend/src/modules/${moduleName}/components/${componentName}  --style=scss --nameAndDirectoryFormat=as-provided --standalone=false --skipImport`,
                    { stdio: 'inherit' }
                );

                return `
                    import { ${componentClassName} } from './${componentName}/${componentName}.component';

                    export { ${componentClassName} };
                `;
            }
            case path.posix.join('services', componentName): {
                if (filename.includes('spec.ts')) {
                    return `
                        import { TestBed } from '@angular/core/testing';
                        import { ${serviceClassName} } from './${componentName}.service';

                        describe('${serviceClassName}', () => {
                            let service: ${serviceClassName};

                            beforeEach(() => {
                                TestBed.configureTestingModule({});
                                service = TestBed.inject(${serviceClassName});
                            });

                            it('should be created', () => {
                                expect(service).toBeTruthy();
                            });
                        });
                    `;
                } else {
                    return `
                        import { Injectable } from '@angular/core';

                        @Injectable({
                            providedIn: 'root'
                        })
                        export class ${serviceClassName} {}
                    `;
                }
            }
            case 'services': {
                return `
                    import { ${serviceClassName} } from './${componentName}/${componentName}.service';

                    export { ${serviceClassName} };
                `;
            }
            default: {
                return '';
            }
        }
    } else {
        //Backend TODO
    }
};

generateModule();
