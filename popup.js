// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', function () {
  // Fetch the entire bookmark tree and display it in the popup
  chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
    displayBookmarks(bookmarkTreeNodes);
  });

  // Add event listeners to export buttons for JSON, CSV, and HTML
  document.getElementById('export-json').addEventListener('click', function () {
    exportBookmarks('json');
  });

  document.getElementById('export-csv').addEventListener('click', function () {
    exportBookmarks('csv');
  });

  document.getElementById('export-html').addEventListener('click', function () {
    exportBookmarks('html');
  });
});

// Function to display bookmarks in the popup interface
function displayBookmarks(bookmarkNodes, parentElement = document.getElementById('bookmark-list')) {
  // Loop through each bookmark node and add it to the UI
  bookmarkNodes.forEach(function (node) {
    // Create a list item to display bookmark/folder
    const li = document.createElement('li');
    li.style.display = 'flex'; // Ensures elements are aligned horizontally
    li.style.alignItems = 'center';

    // If the node is a folder, add an expand button at the beginning
    if (node.children && node.children.length > 0) {
      const expandButton = document.createElement('button');
      expandButton.textContent = '+';
      expandButton.classList.add('expand-button'); // Add class for styling

      // Add click event listener for expanding/collapsing folders
      expandButton.addEventListener('click', function () {
        if (expandButton.textContent === '+') {
          expandButton.textContent = '-'; // Toggle the button text to indicate expanded state
          
          // Create a child list to display the children of the folder
          const childList = document.createElement('ul');
          childList.style.paddingLeft = '20px'; // Indent child elements for a hierarchical view
          
          // Append the child list directly under the current list item to keep the expand/collapse button at the top
          li.appendChild(childList);
          displayBookmarks(node.children, childList); // Recursively display child bookmarks
        } else {
          expandButton.textContent = '+'; // Toggle back to collapsed state
          li.removeChild(li.lastElementChild); // Remove the child list from UI
        }
      });

      // Insert the expand button at the beginning of the list item
      li.appendChild(expandButton);
    }

    // Add a checkbox for each bookmark/folder so user can select it for export
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = node.id;

    // Add the title of the bookmark/folder
    const titleSpan = document.createElement('span');
    titleSpan.textContent = node.title;

    // Append checkbox and title to the list item
    li.appendChild(checkbox);
    li.appendChild(titleSpan);
    parentElement.appendChild(li);
  });
}

// Function to handle exporting selected bookmarks in the specified format
function exportBookmarks(format) {
  const selectedBookmarks = [];

  // Get all checked checkboxes and add their associated bookmarks to selectedBookmarks
  document.querySelectorAll('#bookmark-list input:checked').forEach(function (checkbox) {
    const bookmarkId = checkbox.value;

    // Get details of each selected bookmark node
    chrome.bookmarks.getSubTree(bookmarkId, function (bookmarkNodes) {
      bookmarkNodes.forEach(function (node) {
        collectBookmarks(node, selectedBookmarks); // Collect bookmarks recursively from folders

        // Call the appropriate export function based on format selected
        if (selectedBookmarks.length > 0) {
          switch (format) {
            case 'json':
              exportToJSON(selectedBookmarks);
              break;
            case 'csv':
              exportToCSV(selectedBookmarks);
              break;
            case 'html':
              exportToHTML(selectedBookmarks);
              break;
          }
        }
      });
    });
  });
}

// Recursive function to collect all bookmarks from folders
function collectBookmarks(node, bookmarkList) {
  if (node.url) {
    // If the node is a bookmark (has a URL), add it to the list
    bookmarkList.push(node);
  }
  if (node.children) {
    // If the node is a folder, recursively collect all its children
    node.children.forEach(function (child) {
      collectBookmarks(child, bookmarkList);
    });
  }
}

// Function to export bookmarks in JSON format
function exportToJSON(bookmarks) {
  const jsonExport = JSON.stringify(bookmarks, null, 2);
  downloadFile(jsonExport, 'bookmarks.json', 'application/json');
}

// Function to export bookmarks in CSV format
function exportToCSV(bookmarks) {
  let csvExport = 'Title,URL\n'; // Header for CSV file

  // Add each bookmark as a new line in CSV
  bookmarks.forEach(function (bookmark) {
    if (bookmark.url) {
      csvExport += `"${bookmark.title}","${bookmark.url}"\n`;
    }
  });

  downloadFile(csvExport, 'bookmarks.csv', 'text/csv');
}

// Function to export bookmarks in HTML format
function exportToHTML(bookmarks) {
  let htmlExport = '<html><body><ul>';

  // Add each bookmark as a clickable link in HTML
  bookmarks.forEach(function (bookmark) {
    if (bookmark.url) {
      htmlExport += `<li><a href="${bookmark.url}">${bookmark.title}</a></li>`;
    }
  });

  htmlExport += '</ul></body></html>';
  downloadFile(htmlExport, 'bookmarks.html', 'text/html');
}

// Function to download the generated file
function downloadFile(data, filename, type) {
  const blob = new Blob([data], { type }); // Create a Blob with the data
  const url = URL.createObjectURL(blob); // Create a URL for the Blob
  const a = document.createElement('a'); // Create an anchor element
  a.href = url;
  a.download = filename; // Set the filename for the download
  document.body.appendChild(a);
  a.click(); // Programmatically click the anchor to trigger the download
  URL.revokeObjectURL(url); // Revoke the object URL after download
  a.remove(); // Remove the anchor from the DOM
}
