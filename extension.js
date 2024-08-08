const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    const disposable = vscode.commands.registerCommand('BuildENV.BuildENV', async function () {
        const sourceFileName = 'env.json';
        const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const sourceFilePath = path.join(workspaceFolder, sourceFileName);

        try {
            if (!await fileExists(sourceFilePath)) {
                vscode.window.showErrorMessage(`BuildENV : Source file not found: ${sourceFilePath}`);
                return;
            }

            const jsonObject = await readJsonFile(sourceFilePath);

            const envNames = extractEnvNames(jsonObject);

            await Promise.all(envNames.map(envName => {
                const fileName = `.env.${envName}`;
                return createEnvFile(workspaceFolder, fileName, jsonObject, envName);
            }));

            const document = await vscode.workspace.openTextDocument(path.join(workspaceFolder, `.env.${envNames[0]}`));
            await vscode.window.showTextDocument(document);

            vscode.window.showInformationMessage('BuildENV : Environment files created successfully!');
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error.message}`);
            console.error(`Error: ${error.message}`);
        }
    });

    context.subscriptions.push(disposable);

}

function deactivate() {}

/**
 * Checks if a file exists
 * @param {string} filePath - Path to the file
 * @returns {Promise<boolean>} - True if file exists, false otherwise
 */
async function fileExists(filePath) {
    return fs.promises.access(filePath, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);
}

/**
 * Reads and parses a JSON file
 * @param {string} filePath - Path to the JSON file
 * @returns {Promise<Object>} - Parsed JSON object
 */
async function readJsonFile(filePath) {
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
}

/**
 * Extracts environment names from the JSON object
 * @param {Object} jsonObject - JSON data
 * @returns {Array<string>} - Array of environment names
 */
function extractEnvNames(jsonObject) {
    const envNames = new Set();
    for (const items of Object.values(jsonObject)) {
        items.forEach(item => {
            Object.keys(item).forEach(key => {
                if (key !== 'Name') {
                    envNames.add(key);
                }
            });
        });
    }
    return Array.from(envNames);
}

/**
 * Creates an .env file with content based on JSON data
 * @param {string} workspaceFolder - Path to the workspace folder
 * @param {string} fileName - Name of the .env file
 * @param {Object} jsonObject - JSON data to be written to the file
 * @param {string} environment - The environment (e.g., 'dev', 'stg', 'prod')
 * @returns {Promise<void>}
 */
async function createEnvFile(workspaceFolder, fileName, jsonObject, environment) {
    const envFilePath = path.join(workspaceFolder, fileName);
    let envContent = [];

    for (const [section, items] of Object.entries(jsonObject)) {
        // Add a comment for the section
        envContent.push(`# ${section}`);

        items.forEach((item) => {
            if (item[environment] !== undefined) {
                // Add each environment variable
                envContent.push(`${item.Name.replace(/\s+/g, '_').toUpperCase()}=${item[environment]}`);
            }
        });

        // Add a blank line for separation
        envContent.push('');
    }

    // Write to the .env file
    await fs.promises.writeFile(envFilePath, envContent.join('\n').trim(), 'utf8');
}

module.exports = {
    activate,
    deactivate
}
