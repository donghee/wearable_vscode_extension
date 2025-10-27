// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { createNewProject } from './commands/newProject';

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

	context.subscriptions.push(helloWorldCommand);
	context.subscriptions.push(newProjectCommand);

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
        	{ enableScripts: true }
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

		const simulatorButton = new TutorialItem('Simulator: Gazebo', vscode.TreeItemCollapsibleState.None);
		simulatorButton.command = {
			command: 'wearable-vscode-extension.openTutorialInEditor',
			title: 'Run Simulator',
			arguments: ['Simulator', 'https://wearable.baribarilab.com/novnc/vnc.html?path=novnc/websockify?resize=remote&autoconnect=true']
		};

		return Promise.resolve([
			newProjectButton,
			new ProjectItem('Project Build', vscode.TreeItemCollapsibleState.None),
			simulatorButton,
			new ProjectItem('Open Terminal', vscode.TreeItemCollapsibleState.None)
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


class TutorialsProvider implements vscode.TreeDataProvider<TutorialItem> {
	getTreeItem(element: TutorialItem): vscode.TreeItem {
		return element;
	}

	getChildren(): Thenable<TutorialItem[]> {
		const tutorial1 = new TutorialItem('Tutorial: Getting Started Wearable Robot', vscode.TreeItemCollapsibleState.None);
		tutorial1.command = {
			command: 'wearable-vscode-extension.openTutorialInEditor',
			title: 'Open Tutorial',
			arguments: ['Getting Started', 'https://google.com/webhp?igu=1']
		};

		const tutorial2 = new TutorialItem('Tutorial: ROS', vscode.TreeItemCollapsibleState.None);
		tutorial2.command = {
			command: 'wearable-vscode-extension.openTutorialInEditor',
			title: 'Open Tutorial',
			arguments: ['ROS', 'https://wiki.ros.org']
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