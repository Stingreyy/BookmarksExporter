# Chrome Bookmark Exporter Extension

This is a Chrome extension that allows you to selectively export your bookmarks or bookmark folders to multiple formats, including JSON, CSV, and HTML. You can navigate through your bookmarks, choose the specific items you want, and easily download them in the desired format.

## Features

- Export selected bookmarks or entire folders.
- Supports exporting in **JSON**, **CSV**, and **HTML** formats.
- Interactive UI to browse and choose bookmarks or folders.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Code Overview](#code-overview)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone or download the repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer Mode** by toggling the switch in the upper right-hand corner.
4. Click on **Load unpacked** and select the folder where you cloned the repository.
5. You should now see the extension installed, and its icon should appear in the Chrome toolbar.

## Usage

1. Click the extension icon in the Chrome toolbar to open the extension popup.
2. You will see a list of your bookmarks and folders.
3. Use the **+** button to expand folders and explore bookmarks within them.
4. Select the bookmarks or folders you want to export by checking their checkboxes.
5. Choose your desired format by clicking on one of the buttons: **Export to JSON**, **Export to CSV**, or **Export to HTML**.
6. The selected bookmarks will be exported, and the file will be downloaded.

## Code Overview

This project is composed of three primary files:

### 1. `manifest.json`

Defines the Chrome extension's permissions, name, and version.

### 2. `popup.html`

The HTML file that defines the user interface for the extension popup, including buttons and list containers.

### 3. `popup.js`

Contains the JavaScript code to interact with the Chrome Bookmarks API, generate the export files, and manage the user interface.

#### `manifest.json`
- **manifest_version**: Specifies the version of the Chrome extension schema being used.
- **name**: The name of the extension as it will appear in Chrome Web Store.
- **version**: Version of the extension. Update with new versions.
- **permissions**: Requests access to Chrome bookmarks.
- **action**: Specifies `popup.html` as the user interface for the extension.

## Contributing

Feel free to submit issues or pull requests if you find any bugs or have suggestions for new features. Contributions are always welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.