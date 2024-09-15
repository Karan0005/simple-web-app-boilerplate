/* eslint-disable */
const { spawn, ChildProcess } = require('child_process');

let backendProcess: typeof ChildProcess | undefined;
module.exports = async function () {
    console.log('\nSetting up...\n');
    try {
        backendProcess = spawn('nx', ['serve', 'backend'], {
            stdio: 'pipe',
            shell: true
        });

        await new Promise((resolve) => setTimeout(resolve, 15000));
        console.log('Backend server started successfully.');
    } catch (error) {
        console.error('Error starting the backend server:', error);
        process.exit(1);
    }
};

module.exports.teardown = function () {
    console.log('\nTearing down...\n');
    backendProcess.kill();
    console.log('Backend server stopped successfully.');
};
