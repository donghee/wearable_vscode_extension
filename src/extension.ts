// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { createNewProject } from './commands/newProject';
import { Script } from 'vm';

function getWebviewContent(title: string, url: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body, html, iframe { margin: 0; padding: 0; height: 100%; width: 100%; border: none; }
      </style>
    </head>
    <body>
     <iframe src="${url}"></iframe>
    </body>
    </html>
  `;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "wearable-vscode-extension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const helloWorldCommand = vscode.commands.registerCommand('wearable-vscode-extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from wearable_vscode_extension!');
	});

	const newProjectCommand = vscode.commands.registerCommand('wearable-vscode-extension.createNewProject', createNewProject);

	const runScriptCommand = vscode.commands.registerCommand('wearable-vscode-extension.runScript', async (scriptPath: string) => {
		const terminal = vscode.window.createTerminal('Script Execution');
		terminal.show();
		terminal.sendText(`bash ${scriptPath}`);
	});

	const runScriptHiddenCommand = vscode.commands.registerCommand('wearable-vscode-extension.runScriptHidden', async (scriptPath: string) => {
		const terminal = vscode.window.createTerminal({
			name: 'Background Script',
			hideFromUser: true
		});
		terminal.sendText(`bash ${scriptPath}`);
		vscode.window.showInformationMessage(`Successfully executed script: ${scriptPath}`);
	});

	context.subscriptions.push(helloWorldCommand);
	context.subscriptions.push(newProjectCommand);
	context.subscriptions.push(runScriptCommand);
	context.subscriptions.push(runScriptHiddenCommand);

	const projectsProvider = new ProjectsProvider();
	const tutorialsProvider = new TutorialsProvider();
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('wearable-explorer-projects', projectsProvider),
    vscode.window.registerTreeDataProvider('wearable-explorer-tutorials', tutorialsProvider)
  );

	context.subscriptions.push(
		vscode.commands.registerCommand('wearable-vscode-extension.openTutorialInEditor', 
    	(title: string, url: string) => {
      	const panel = vscode.window.createWebviewPanel(
        	'tutorialView',
        	title,
        	vscode.ViewColumn.One,
        	{ enableScripts: true, retainContextWhenHidden: true }
      	);
      	panel.webview.html = getWebviewContent(title, url);
    	}
  		)
	);

}

// This method is called when your extension is deactivated
export function deactivate() {}


class ProjectsProvider implements vscode.TreeDataProvider<ProjectItem> {
    getTreeItem(element: ProjectItem): vscode.TreeItem {
        return element;
    }

	getChildren(): Thenable<ProjectItem[]> {
		const newProjectButton = new ProjectItem('New Project', vscode.TreeItemCollapsibleState.None);
		newProjectButton.command = {
			command: 'wearable-vscode-extension.createNewProject',
			title: 'Create New Project',
		};
		newProjectButton.iconPath = new vscode.ThemeIcon('add'); // 플러스 아이콘 추가

		const buildSimulatorButton = new ScriptItem('Build', vscode.TreeItemCollapsibleState.None, './docker/build_simulation.sh');
		buildSimulatorButton.command = {
			command: 'wearable-vscode-extension.runScript',
			title: 'Build',
			arguments: ['./docker/build_simulation.sh']
		};
		buildSimulatorButton.iconPath = new vscode.ThemeIcon('gear'); // 기어 아이콘 추가

		const simulatorButton = new ScriptItem('Start Simulation', vscode.TreeItemCollapsibleState.None, './docker/simulation.sh');
		simulatorButton.command = {
			command: 'wearable-vscode-extension.runScriptHidden',
			title: 'Start Simulation',
			arguments: ['./docker/simulation.sh']
		};
		simulatorButton.iconPath = new vscode.ThemeIcon('check'); // 체크 아이콘 추가

		const controllerButton = new ScriptItem('Run Simulation', vscode.TreeItemCollapsibleState.None, './docker/controller.sh');
		controllerButton.command = {
			command: 'wearable-vscode-extension.runScript',
			title: 'Run Simulation',
			arguments: ['./docker/controller.sh']
		};
		controllerButton.iconPath = new vscode.ThemeIcon('run'); // 재생 아이콘 추가
		new vscode.ThemeIcon('')

		const stopButton = new ScriptItem('Stop Simulation', vscode.TreeItemCollapsibleState.None, './docker/stop.sh');
		stopButton.command = {
			command: 'wearable-vscode-extension.runScriptHidden',
			title: 'Stop Simulation',
			arguments: ['./docker/stop.sh']
		};
		stopButton.iconPath = new vscode.ThemeIcon('debug-stop'); // 정지 아이콘 추가

		const deployButton = new ScriptItem('Upload', vscode.TreeItemCollapsibleState.None, './docker/deploy.sh');
		deployButton.command = {
			command: 'wearable-vscode-extension.runScriptHidden',
			title: 'Upload',
			arguments: ['./docker/deploy.sh']
		};
		deployButton.iconPath = new vscode.ThemeIcon('arrow-right'); // 화살표 아이콘 추가

		const TwinButton = new ScriptItem('DigitalTwin', vscode.TreeItemCollapsibleState.None, './docker/digital-twin.sh');
		TwinButton.command = {
			command: 'wearable-vscode-extension.runScriptHidden',
			title: 'DigitalTwin',
			arguments: ['./docker/digital-twin.sh']
		};
		TwinButton.iconPath = new vscode.ThemeIcon('person'); // 사람 아이콘 추가



		return Promise.resolve([
			newProjectButton,
			buildSimulatorButton,
			simulatorButton,
			controllerButton,
			stopButton,
			deployButton,
      TwinButton
		]);
	}
}

class ProjectItem extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState
	) {
		super(label, collapsibleState);
		this.tooltip = `${this.label}`;
		this.description = '';
	}

	declare command?: vscode.Command;
	declare iconPath?: string | vscode.IconPath;
}

class ScriptItem extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly scriptPath: string
	) {
		super(label, collapsibleState);
		this.tooltip = `${this.label}`;
		this.description = '';
	}

	declare command?: vscode.Command;
	declare iconPath?: string | vscode.IconPath;
}


class TutorialsProvider implements vscode.TreeDataProvider<TutorialItem> {
	getTreeItem(element: TutorialItem): vscode.TreeItem {
		return element;
	}

	getChildren(): Thenable<TutorialItem[]> {
		const tutorial1 = new TutorialItem('New Wearable Robot', vscode.TreeItemCollapsibleState.None);
		tutorial1.command = {
			command: 'wearable-vscode-extension.openTutorialInEditor',
			title: 'New Wearable Robot',
			arguments: ['New Wearable Robot', 'http://localhost:5005']
		};

		const tutorial2 = new TutorialItem('Wearable Robot API', vscode.TreeItemCollapsibleState.None);
		tutorial2.command = {
			command: 'wearable-vscode-extension.openTutorialInEditor',
			title: 'Open Wearable Robot API',
			arguments: ['Wearable Robot API', 'http://localhost:5000/api/docs']
		};
	
		/*
		const tutorial2 = new TutorialItem('Simulator: Gazebo', vscode.TreeItemCollapsibleState.None);
		tutorial2.command = {
			command: 'wearable-vscode-extension.openTutorialInEditor',
			title: 'Open Simulator',
			arguments: ['Simulator', 'https://wearable.baribarilab.com/novnc/vnc.html?path=novnc/websockify?resize=remote&autoconnect=true']
		};
		*/

		return Promise.resolve([tutorial1, tutorial2]);
	}
}


class TutorialItem extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState
	) {
		super(label, collapsibleState);
		this.tooltip = `${this.label}`;
		this.description = '';
	}

	declare command?: vscode.Command;
	declare iconPath?: string | vscode.IconPath;
}	
