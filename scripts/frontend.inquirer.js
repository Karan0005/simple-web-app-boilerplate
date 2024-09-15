const inquirer = require('inquirer');
const { execSync } = require('child_process');
const args = process.argv.slice(2);

if (!args.length || !args[0].trim()) {
    console.log('No valid argument provided. Exiting...');
    process.exit(1);
}

async function prompt() {
    const argument = args[0].trim();
    let answers;

    switch (argument) {
        case 'build':
            answers = await inquirer.default.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'What environment would you like to choose for building the frontend?',
                    choices: [
                        {
                            name: 'local',
                            value: 'npm run frontend:lint && nx build frontend --configuration local'
                        },
                        {
                            name: 'dev',
                            value: 'npm run frontend:lint && nx build frontend --configuration dev'
                        },
                        {
                            name: 'uat',
                            value: 'npm run frontend:lint && nx build frontend --configuration uat'
                        },
                        {
                            name: 'prod',
                            value: 'npm run frontend:lint && nx build frontend --configuration prod'
                        }
                    ]
                }
            ]);
            break;
        case 'serve':
            answers = await inquirer.default.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'What environment would you like to choose for serving the frontend?',
                    choices: [
                        { name: 'local', value: 'nx serve frontend --configuration local' },
                        { name: 'dev', value: 'nx serve frontend --configuration dev' },
                        { name: 'uat', value: 'nx serve frontend --configuration uat' },
                        { name: 'prod', value: 'nx serve frontend --configuration prod' }
                    ]
                }
            ]);
            break;
        default:
            console.log('Invalid argument provided. Exiting...');
            process.exit(1);
    }

    if (answers.action) {
        try {
            execSync(answers.action, { stdio: 'inherit' });
        } catch (error) {
            console.error('Command failed:', error.message);
            process.exit(1);
        }
    }
}

prompt();
