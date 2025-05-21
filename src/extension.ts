// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	console.log('ConvertAgent extension is now active!');

	// Register the chat participant
	const handler: vscode.ChatRequestHandler = async (
		request: vscode.ChatRequest, 
		context: vscode.ChatContext, 
		stream: vscode.ChatResponseStream, 
		token: vscode.CancellationToken
	) => {		try {
			const config = vscode.workspace.getConfiguration('convertagent');
			const customPrompt = config.get<string>('customPrompt') || 
				`You are an expert TAL programmer tasked with documenting existing TAL code. Analyze the provided code and insert clear, concise inline comments before relevant lines or blocks to explain their purpose. Focus on clarity and accuracy. Do not add comments at the end of lines. Output the complete documented code strictly within a code block. Do not include any text outside this block.`;
			const preferredModel = config.get<string>('preferredModel') || 'Any Available';
			const fallbackMethod = config.get<string>('fallbackMethod') || 'Generic Chat';

			// Get active editor content
			let code = '';
			const editor = vscode.window.activeTextEditor;
			
			if (editor) {
				const document = editor.document;
				const selection = editor.selection;
				
				// Use selected text if there is a selection, otherwise use the entire document
				if (!selection.isEmpty) {
					code = document.getText(selection);
				} else {
					code = document.getText();
				}
			} else {
				// No editor is active, inform the user
				stream.markdown('Please open a file to use ConvertAgent.');
				return;
			}

			// Remove the @convertagent prefix from the request message
			let userQuery = request.prompt.replace(/@convertagent\s*/i, '').trim();
					// Construct the enhanced prompt with the custom prompt and user's code
			const enhancedPrompt = `${customPrompt}\n\nUser request: ${userQuery}\n\nHere is the code to work with:\n\`\`\`\n${code}\n\`\`\``;
			
			// Initialize the messages array with the system prompt
			const messages = [
				vscode.LanguageModelChatMessage.User(enhancedPrompt)
			];
					try {			// Get all available models first for proper decision making
			const availableModels = await vscode.lm.selectChatModels();
			console.log('Available models:', availableModels.map(m => `${m.name} (${m.family || 'unknown family'} ${m.version || 'unknown version'})`));
					// Check if the user wants a specific model
			if (preferredModel === 'GPT-4o') {
				try {
					// Try to get GPT-4o model from Copilot
					const gpt4oModels = await vscode.lm.selectChatModels({ 
						vendor: 'copilot',
						family: 'gpt-4o' 
					});
					
					// If GPT-4o is available, use it
					if (gpt4oModels.length > 0) {
						const gpt4oModel = gpt4oModels[0];
						stream.markdown(`Using ${gpt4oModel.name} model...`);
						
						const chatResponse = await gpt4oModel.sendRequest(messages, {}, token);
						
						// Stream the response
						for await (const fragment of chatResponse.text) {
							stream.markdown(fragment);
						}
						return;
					} else {
						// If GPT-4o is not available, let's try any Copilot model
						const copilotModels = await vscode.lm.selectChatModels({ vendor: 'copilot' });
						
						if (copilotModels.length > 0) {
							const copilotModel = copilotModels[0];
							stream.markdown(`GPT-4o not available. Using ${copilotModel.name} model instead...`);
							
							const chatResponse = await copilotModel.sendRequest(messages, {}, token);
							
							// Stream the response
							for await (const fragment of chatResponse.text) {
								stream.markdown(fragment);
							}
							return;
						} else {
							stream.markdown('No Copilot models available. Will try alternative model...');
						}
					}
				} catch (modelError) {
					console.error('GPT-4o model error:', modelError);
					stream.markdown('Error accessing GPT-4o. Will try any available model...');
					
					// Immediately try any available model
					if (availableModels.length > 0) {
						try {
							const anyModel = availableModels[0];
							stream.markdown(`Using available model: ${anyModel.name}...`);
							
							const chatResponse = await anyModel.sendRequest(messages, {}, token);
							
							// Stream the response
							for await (const fragment of chatResponse.text) {
								stream.markdown(fragment);
							}
							return;
						} catch (anyModelError) {
							console.error('Any model error:', anyModelError);
							stream.markdown(`Error with model: ${anyModelError instanceof Error ? anyModelError.message : String(anyModelError)}`);
						}
					}
				}			} else if (preferredModel === 'Any Available' || preferredModel === 'Default') {
				// Try to use the most powerful available model first
				if (availableModels.length > 0) {
					try {
						// For 'Default', first try to use the model provided in the request
						if (preferredModel === 'Default' && request.model) {
							stream.markdown(`Using default model: ${request.model.name}...`);
							
							const chatResponse = await request.model.sendRequest(messages, {}, token);
							
							// Stream the response
							for await (const fragment of chatResponse.text) {
								stream.markdown(fragment);
							}
							return;
						}
						
						// Otherwise, select the first available model
						const firstModel = availableModels[0];
						stream.markdown(`Using available model: ${firstModel.name}...`);
						
						const chatResponse = await firstModel.sendRequest(messages, {}, token);
						
						// Stream the response
						for await (const fragment of chatResponse.text) {
							stream.markdown(fragment);
						}
						return;
					} catch (anyModelError) {
						console.error('Model error:', anyModelError);
						stream.markdown(`Error with model: ${anyModelError instanceof Error ? anyModelError.message : String(anyModelError)}`);
						
						// If we failed with the first model, try the next one if available
						if (availableModels.length > 1) {
							try {
								const backupModel = availableModels[1];
								stream.markdown(`Trying backup model: ${backupModel.name}...`);
								
								const chatResponse = await backupModel.sendRequest(messages, {}, token);
								
								// Stream the response
								for await (const fragment of chatResponse.text) {
									stream.markdown(fragment);
								}
								return;
							} catch (backupModelError) {
								console.error('Backup model error:', backupModelError);
								stream.markdown(`Error with backup model: ${backupModelError instanceof Error ? backupModelError.message : String(backupModelError)}`);
							}
						}
					}
				} else {
					stream.markdown('No language models are available. Will try generic chat API...');
				}
			}
			} catch (modelError) {
				console.error('Model error:', modelError);
				stream.markdown(`Error using language model: ${modelError instanceof Error ? modelError.message : String(modelError)}`);
				// Final fallback - try using the Chat API based on user preference
			if (fallbackMethod === 'Generic Chat' || fallbackMethod === 'Direct') {
				try {
					stream.markdown('Using generic chat API as fallback...');
					
					if (fallbackMethod === 'Generic Chat') {
						// Use direct command execution as a workaround
						await vscode.commands.executeCommand('vscode.chat.open');
						await vscode.commands.executeCommand('vscode.chat.sendRequest', enhancedPrompt);
						
						// Inform the user that we're using the generic chat
						stream.markdown('Response will appear in the main chat window.');
					} else if (fallbackMethod === 'Direct' && request.model) {
						// Try the model provided in the request directly with different settings
						stream.markdown('Trying direct model access with modified settings...');
						const modelOptions = {
							temperature: 0.5,  // Lower temperature for more predictable output
							maxTokens: 2500,   // Allow for longer responses
							// Add other options that might help depending on the model
						};
						
						const chatResponse = await request.model.sendRequest(messages, { modelOptions }, token);
						
						// Stream the response
						for await (const fragment of chatResponse.text) {
							stream.markdown(fragment);
						}
					} else {
						stream.markdown('No fallback method available. Please check your extension settings.');
					}
				} catch (fallbackError) {
					console.error('Fallback error:', fallbackError);
					stream.markdown(`Error with fallback method: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`);
					stream.markdown('Please try a different query or check your Copilot configuration.');
				}
			} else {
				// User has disabled fallbacks
				stream.markdown('All model attempts failed and fallback is set to "None". Please try different settings or check your Copilot configuration.');
			}
			}
			
			return;
		} catch (error) {
			console.error('ConvertAgent error:', error);
			stream.markdown(`Error: ${error instanceof Error ? error.message : String(error)}`);
			return;
		}
	};
	
	// Create the chat participant
	const participant = vscode.chat.createChatParticipant('convertagent.convertagent', handler);
	
	// Register the command to activate the participant
	const disposableCommand = vscode.commands.registerCommand('convertagent.activate', async () => {
		try {
			// Get active editor content
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showErrorMessage('Please open a file to use ConvertAgent.');
				return;
			}
			
			// Prompt user for query
			const query = await vscode.window.showInputBox({
				placeHolder: 'Enter your request for ConvertAgent',
				prompt: 'What would you like to do with the current file?'
			});
			
			if (!query) {
				return; // User canceled
			}
			
			// Open chat view and send the query to our participant
			await vscode.commands.executeCommand('vscode.chat.open');
			await vscode.commands.executeCommand('vscode.chat.sendRequest', `@convertagent ${query}`);
		} catch (error) {
			console.error('ConvertAgent command error:', error);
			vscode.window.showErrorMessage(`ConvertAgent error: ${error instanceof Error ? error.message : String(error)}`);
		}
	});
	
	context.subscriptions.push(participant);
	context.subscriptions.push(disposableCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
