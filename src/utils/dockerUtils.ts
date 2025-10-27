// This file contains utility functions for managing Docker containers and images.

import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

//let dockerHost: string | undefined = process.env.DOCKER_HOST || 'ssh://wearable.lan';
let dockerHost: string | undefined = process.env.DOCKER_HOST || 'ssh://bari.lan';
const dockerEnv = dockerHost ? { DOCKER_HOST: dockerHost } : {};

export function getDockerHost(): string | undefined {
    return dockerHost;
}

export async function checkDockerImageExists(imageName: string): Promise<boolean> {
    try {
        const { stdout } = await execPromise(`docker images -q ${imageName}`, { env: { ...process.env, ...dockerEnv } });
        return stdout.trim() !== '';
    } catch (error) {
        console.error(`Error checking for Docker image: ${error}`);
        return false;
    }
}

export async function checkDockerContainerExists(containerName: string): Promise<boolean> {
    try {
        const { stdout } = await execPromise(`docker ps -a -q --filter "name=${containerName}"`, { env: { ...process.env, ...dockerEnv } });
        return stdout.trim() !== '';
    } catch (error) {
        console.error(`Error checking for Docker container: ${error}`);
        return false;
    }
}

export async function createDockerImage(imageName: string, dockerfilePath: string): Promise<void> {
    try {
        await execPromise(`docker build -t ${imageName} ${dockerfilePath}`, { env: { ...process.env, ...dockerEnv } });
    } catch (error) {
        console.error(`Error creating Docker image: ${error}`);
        throw error;
    }
}

export async function runDockerContainer(containerName: string, imageName: string): Promise<void> {
    try {
        await execPromise(`docker run -d --name ${containerName} ${imageName}`, { env: { ...process.env, ...dockerEnv } });
    } catch (error) {
        console.error(`Error running Docker container: ${error}`);
        throw error;
    }
}

export async function attachToContainer(containerName: string): Promise<void> {
    try {
        const { stdout } = await execPromise(`docker exec -it ${containerName} bash`, { env: { ...process.env, ...dockerEnv } });
    } catch (error) {
        console.error(`Error attaching to Docker container: ${error}`);
        throw error;
    }
}

export async function downloadProject(containerName: string, repoUrl: string): Promise<void> {
    try {
        await execPromise(`docker exec ${containerName} git clone ${repoUrl}`);
    } catch (error) {
        console.error(`Error downloading project to container: ${error}`);
        throw error;
    }
}


export async function openProjectInVSCode(containerName: string, workspacePath: string): Promise<void> {
    try {
        await execPromise(`code --remote docker+${containerName} ${workspacePath}`);
    } catch (error) {
        console.error(`Error opening project in VSCode: ${error}`);
        throw error;
    }
}
