# ConvertAgent Troubleshooting Guide

This document provides solutions to common issues you might encounter when using the ConvertAgent extension.

## Common Issues and Solutions

### Issue: Extension does not show up in chat participants

**Solutions:**
1. Make sure the extension is installed and enabled
2. Restart VS Code
3. Check the Output panel (View > Output) and select "ConvertAgent" from the dropdown to see any error messages

### Issue: @convertagent doesn't trigger the chat participant

**Solutions:**
1. Make sure you're starting your message with exactly `@convertagent` (case sensitive)
2. Make sure the extension is activated - check the Output panel for activation messages
3. Restart VS Code and try again

### Issue: GPT-4o model is not used even when selected

**Solutions:**
1. GPT-4o may not be available in your VS Code setup - the extension will fall back to other models automatically
2. Check if you have access to GPT-4o in the standard VS Code chat
3. In settings, try changing `convertagent.preferredModel` to "Any Available" to let the extension pick the best available model
4. Check the Output panel for any model selection errors or messages
5. Make sure your GitHub Copilot subscription is active and properly configured

### Issue: Getting error messages about language models

**Solutions:**
1. Ensure GitHub Copilot is properly installed and configured
2. Try switching the `convertagent.preferredModel` setting to "Default" or "Any Available"
3. If you're using "GPT-4o" specifically but it's not working, try a different fallback method
4. Check the VS Code output panel for more detailed error messages that might help identify the issue
5. Restart VS Code to reset any cached model information

### Issue: Response appears in main chat instead of the ConvertAgent chat

**Cause:** This is expected behavior when using the "Generic Chat" fallback method.

**Solutions:**
1. If you prefer responses to stay in the ConvertAgent chat, change the fallback method to "Direct" in settings
2. Note that "Direct" fallback might not work with all models, so you may need to experiment with different settings

**Solutions:**
1. Make sure you have a file open in the editor before using ConvertAgent
2. Try selecting a portion of code before triggering ConvertAgent

### Issue: Error "Model is not supported for this request"

**Solutions:**
1. This usually happens when Claude 3.7 is not available in your VS Code environment
2. Go to Settings and change the `convertagent.preferredModel` to "Default"
3. If you want to use Claude 3.7, make sure you have the appropriate extensions and permissions to access it
4. Check the console logs (Help > Toggle Developer Tools) to see the list of available models

### Issue: Custom prompt doesn't update

**Solutions:**
1. After changing the setting, restart VS Code
2. Make sure you're editing the `convertagent.customPrompt` setting in your settings.json file

### Issue: No response from the model

**Solutions:**
1. Make sure GitHub Copilot is properly set up and functioning
2. Check your internet connection
3. The file might be too large - try selecting a smaller portion of code

## Debugging the Extension

If you're developing or debugging the extension:

1. Use the "Run Extension" launch configuration in VS Code
2. Check the Developer Tools console (Help > Toggle Developer Tools) for JavaScript errors
3. Add console.log statements in the extension.ts file and watch the output in the Debug Console

## Reporting Issues

If you encounter a bug or have a feature request, please report it on the GitHub repository's Issues page with:

1. A detailed description of the problem
2. Steps to reproduce the issue
3. Information about your VS Code version and operating system
4. Any error messages from the Output panel or Developer Tools console
