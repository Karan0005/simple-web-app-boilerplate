const { execSync } = require('child_process');
const args = process.argv.slice(2);
const dotenv = require('dotenv');
const path = require('path');

if (!args.length || !args[0].trim()) {
    console.log('No valid argument provided. Exiting...');
    process.exit(1);
}

// Setting environment variables from .env file
dotenv.config({ path: path.resolve(process.env.PWD || process.cwd(), '.env') });

async function ignite() {
    const argument = args[0].trim();
    const environment = process.env.APP_ENV;

    switch (argument) {
        case 'build': {
            let command = 'npm run frontend:lint && nx build frontend --configuration local';
            switch (environment) {
                case 'LOCAL': {
                    command = 'npm run frontend:lint && nx build frontend --configuration local';
                    break;
                }
                case 'DEV': {
                    command = 'npm run frontend:lint && nx build frontend --configuration dev';
                    break;
                }
                case 'UAT': {
                    command = 'npm run frontend:lint && nx build frontend --configuration uat';
                    break;
                }
                case 'PROD': {
                    command = 'npm run frontend:lint && nx build frontend --configuration prod';
                    break;
                }
            }
            execSync(command, { stdio: 'inherit' });
            break;
        }

        case 'serve': {
            let command = 'nx serve frontend --configuration local';
            switch (environment) {
                case 'LOCAL': {
                    command = 'nx serve frontend --configuration local';
                    break;
                }
                case 'DEV': {
                    command = 'nx serve frontend --configuration dev';
                    break;
                }
                case 'UAT': {
                    command = 'nx serve frontend --configuration uat';
                    break;
                }
                case 'PROD': {
                    command = 'nx serve frontend --configuration prod';
                    break;
                }
            }
            execSync(command, { stdio: 'inherit' });
            break;
        }

        default:
            console.log('Invalid argument provided. Exiting...');
            process.exit(1);
    }
}

ignite();