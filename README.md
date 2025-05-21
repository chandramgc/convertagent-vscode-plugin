# ConvertAgent

A VS Code extension that creates a custom chat participant for GitHub Copilot, enhancing it with expert-level prompts using Copilot's GPT-4o model.

## Features

- Adds a chat participant that can be triggered with `@convertagent` anywhere in the chat
- Injects a custom prompt before sending your query to GitHub Copilot
- Works with the current active file or selected code
- Configurable custom prompt via extension settings
- Uses GPT-4o model by default (with intelligent fallbacks to other available models)
- Can be activated via command palette: `ConvertAgent: Activate Chat Participant`

## Requirements

- Visual Studio Code version 1.100.0 or higher
- GitHub Copilot extension must be installed and configured
- Access to Copilot's GPT-4o model (optional - will fallback to other models if not available)

## Installation

1. Download the VSIX file from the releases page
2. Open VS Code and go to Extensions view (`Ctrl+Shift+X`)
3. Click on the "..." menu in the top right of the Extensions view
4. Select "Install from VSIX..." and choose the downloaded file
5. Reload VS Code when prompted

## Usage

There are two ways to use ConvertAgent:

### 1. Using the Chat Participant

1. Open a file you want to work with in the editor
2. Open the VS Code Chat (via `Ctrl+Shift+I` or clicking the chat icon)
3. Type `@convertagent` followed by your request, e.g., `@convertagent Convert this file to pseudo code`
4. The extension will process your request with the current file and display the result in the chat

### 2. Using the Command Palette

1. Open a file you want to work with in the editor
2. Press `Ctrl+Shift+P` to open the Command Palette
3. Search for and select `ConvertAgent: Activate Chat Participant`
4. When prompted, enter your request
5. The chat will open automatically with your query

## Configuration

You can customize the expert prompt and model preference through the extension settings:

1. Go to File > Preferences > Settings
2. Search for "ConvertAgent" to see all available settings
3. Modify any of the following settings:

### Settings

#### `convertagent.customPrompt`
The custom expert prompt that will be prepended to your queries. By default, it's configured for TAL code documentation but can be customized for any purpose.

#### `convertagent.preferredModel`
Choose which language model to use:
- `GPT-4o`: Uses Copilot's GPT-4o model specifically (recommended for best results)
- `Default`: Uses VS Code's default model (typically the one selected in the chat UI)
- `Any Available`: Uses the first available model (best for reliability)

#### `convertagent.fallbackMethod`
Choose what happens if the preferred model is unavailable:
- `Direct`: Attempts to use the default model with modified settings
- `Generic Chat`: Sends your query to the main VS Code chat
- `None`: Disables fallbacks (will show an error if preferred model fails)
2. Search for "convertagent"
3. Find the "ConvertAgent: Custom Prompt" setting to edit the prompt
4. Find the "ConvertAgent: Preferred Model" setting to choose between Claude 3.7 or Default model

The default prompt is:

```
You are an expert TAL programmer tasked with documenting existing TAL code. Analyze the provided code and insert clear, concise inline comments before relevant lines or blocks to explain their purpose. Focus on clarity and accuracy. Do not add comments at the end of lines. Output the complete documented code strictly within a code block. Do not include any text outside this block.
```

## Extension Settings

This extension contributes the following settings:

* `convertagent.customPrompt`: The custom prompt that will be injected before the user's query
* `convertagent.preferredModel`: The preferred language model to use (Claude 3.7 or Default)

## Release Notes

### 0.0.2

- Added support for Claude 3.7 language model
- Added model selection preference in settings
- Improved error handling for model requests
- Added logging of available models for debugging

### 0.0.1

- Initial release of ConvertAgent
- Added custom chat participant functionality with expert-level prompt injection
- Added command to activate the participant from the command palette
- Added configurable custom prompt

## Known Issues

- May not work correctly with long files due to token limitations in language models
- Only tested with VS Code 1.100.0 and above
- Claude 3.7 model availability depends on your VS Code environment configuration

**Enjoy!**
