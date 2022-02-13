import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';

import * as vscode from 'vscode';
class WordsViewProvider implements vscode.WebviewViewProvider {

  public static readonly viewType = 'vscode-word.view';

  private _view?: vscode.WebviewView;

  // emitter and its event
  onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
  onDidChange = this.onDidChangeEmitter.event;

  private uri: vscode.Uri | undefined = undefined;

  constructor(private readonly _extensionUri: vscode.Uri) { }

  resolveWebviewView( webviewView: vscode.WebviewView,
                      context: vscode.WebviewViewResolveContext<unknown>,
                      token: vscode.CancellationToken): void | Thenable<void> {
    this._view = webviewView;

    // Revive the view
    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible) {
      }
    });

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: [
        this._extensionUri
      ]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(data => {
      switch (data.command) {
        case 'settings':
            this.settings();
            break;
      }
    });
  }

  settings() {
    vscode.commands.executeCommand('workbench.action.openSettings', `@ext:sandipchitale.vscode-wordl`);
  }

  setColorTheme(colorTheme: vscode.ColorTheme) {
    this._view?.webview.postMessage({
      command: 'colorTheme',
      colorTheme
    });
  }

  refreshView() {
    this._view?.webview.postMessage({
      command: 'refreshView'
    });
  }

  // HTML Stuff
  /**
   * Returns html of the start page (index.html)
   */
  private _getHtmlForWebview(webview: vscode.Webview) {
    // URI to dist folder
    const appDistUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist'));;

    // path as uri
    const baseUri = webview.asWebviewUri(appDistUri);

    // get path to index.html file from dist folder
    const indexPath = path.join(appDistUri.fsPath, 'index.html');

    // read index file from file system
    let indexHtml = fs.readFileSync(indexPath, { encoding: 'utf8' });

    // update the base URI tag
    indexHtml = indexHtml.replace('<base href="/">', `<base href="${String(baseUri)}/">`);

    return indexHtml;
  }
}

let extensionPath: string;
let outputChannel: vscode.OutputChannel;

/**
 * Activates extension
 * @param context vscode extension context
 */
export function activate(context: vscode.ExtensionContext) {
  extensionPath = context.extensionPath;

  outputChannel = vscode.window.createOutputChannel(context.extension.id.replace('sandipchitale.', ''));

  const provider = new WordsViewProvider(context.extensionUri);

  context.subscriptions.push(vscode.window.registerWebviewViewProvider(WordsViewProvider.viewType, provider));

  vscode.window.onDidChangeActiveColorTheme((colorTheme: vscode.ColorTheme) => {
    provider.setColorTheme(colorTheme);
  });
}


