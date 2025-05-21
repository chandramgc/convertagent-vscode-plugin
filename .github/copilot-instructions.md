<!-- Use this file to provide workspace-specific custom instructions to GitHub Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# ConvertAgent VS Code Extension

This is a VS Code extension project that creates a custom chat participant for GitHub Copilot. The extension adds a chat participant that can be triggered with `@convertagent` and injects a custom expert prompt to enhance Copilot's responses.

## Key Components

- `extension.ts`: Contains the main extension logic including chat participant registration and handling.
- `package.json`: Contains extension metadata, contribution points, and settings.

## Technical Details

- This extension uses the VS Code Chat API to create a custom chat participant
- It leverages GitHub Copilot's language model via the VS Code API
- The extension modifies the user's prompt by prepending a custom expert prompt before sending it to the model

## Important Notes for Contributors

- When working with the VS Code Chat API, use `get_vscode_api` to fetch the latest reference
- The chat participant is registered with a unique ID in the format `publisher.extensionId.participantId`
- The extension must handle both direct chat queries and command activation
- Remember to properly handle errors and provide good user feedback

The extension modifies the prompt sent to Copilot by:
1. Getting the active editor's content (or selected text)
2. Prepending the custom expert prompt
3. Appending the user's query
4. Sending the enhanced prompt to the language model

When making changes, ensure you maintain this core functionality while improving the user experience.
