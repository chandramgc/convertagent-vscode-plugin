# Change Log

All notable changes to the "convertagent" extension will be documented in this file.

## [0.0.4] - 2025-05-21

### Added
- Enhanced error handling to immediately try any available model if GPT-4o fails

### Changed
- Removed Claude 3.7 option completely as it's not available
- Updated documentation to focus exclusively on GPT-4o and other available models

### Fixed
- Simplified model selection logic by removing unnecessary fallback paths

## [0.0.3] - 2025-05-21

### Added
- Added dedicated support for GPT-4o as the primary model
- Enhanced model selection logic with multiple fallback options
- Improved fallback mechanisms to better handle missing or unavailable models
- Better error messages and user feedback during model transitions
- Additional documentation in README and TROUBLESHOOTING

### Changed
- Switched from Claude 3.7 to GPT-4o as the default model
- Updated model selection strategy to prioritize Copilot's GPT-4o model
- Modified fallback behavior based on user preferences
- Improved configuration descriptions in settings

### Fixed
- Issue with preferred models not being detected correctly
- Improved error handling when preferred models are unavailable

## [0.0.2] - 2025-05-20

### Added
- Support for Claude 3.7 model integration
- Settings for model preference and fallback methods
- Enhanced error handling for model access issues

## [0.0.1] - 2025-05-15

### Added
- Initial release
- Basic chat participant functionality
- Custom prompt configuration