import * as vscode from 'vscode';
import { createDockerImage, runDockerContainer, downloadProject, attachToContainer, openProjectInVSCode } from '../utils/dockerUtils';

export function createNewProject() {
    const dockerImageName = 'ghcr.io/donghee/wearable_robot_eval';
    const containerName = 'wearable';
    const projectRepoUrl = 'https://github.com/donghee/wearable_robot_upper_limb';

    // Check if the Docker image or container already exists
    if (checkDockerImageExists(dockerImageName) && checkDockerContainerExists(containerName)) {
        vscode.window.showInformationMessage('Docker image and container already exist. Skipping creation.');
        attachToContainer(containerName);
        //openProjectInVSCode();
        return;
    }

    // Create Docker image and run the container
    // createDockerImage(dockerImageName)
    //     .then(() => runDockerContainer(containerName, dockerImageName))
    //     .then(() => downloadProject(containerName, projectRepoUrl))
    //     .then(() => {
    //         attachToContainer(containerName);
    //         openProjectInVSCode();
    //     })
    //     .catch(error => {
    //         vscode.window.showErrorMessage(`Failed to create new project: ${error.message}`);
    //     });
}

function checkDockerImageExists(imageName: string): boolean {
    // Implement logic to check if the Docker image exists
    return true; // Placeholder
}

function checkDockerContainerExists(containerName: string): boolean {
    // Implement logic to check if the Docker container exists
    return true; // Placeholder
}