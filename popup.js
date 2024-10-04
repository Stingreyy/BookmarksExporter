document.addEventListener('DOMContentLoaded', function () {
    // Startar från roten av bokmärkesträdet
    chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
      displayBookmarks(bookmarkTreeNodes);
    });
  
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
  
  function displayBookmarks(bookmarkNodes, parentElement = document.getElementById('bookmark-list')) {
    bookmarkNodes.forEach(function (node) {
      // Skapa ett listobjekt för varje bokmärke eller mapp
      const li = document.createElement('li');
      li.textContent = node.title || 'No Title';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = node.id;
  
      li.appendChild(checkbox);
      parentElement.appendChild(li);
  
      // Om noden är en mapp, ge möjlighet att expandera den
      if (node.children && node.children.length > 0) {
        const expandButton = document.createElement('button');
        expandButton.textContent = '+';
        expandButton.addEventListener('click', function () {
          if (expandButton.textContent === '+') {
            expandButton.textContent = '-';
            const childList = document.createElement('ul');
            li.appendChild(childList);
            displayBookmarks(node.children, childList);
          } else {
            expandButton.textContent = '+';
            li.removeChild(li.lastElementChild); // Ta bort childList när du kollapsar
          }
        });
  
        li.insertBefore(expandButton, checkbox); // Placera expand-knappen innan checkboxen
      }
    });
  }
  
  function exportBookmarks(format) {
    const selectedBookmarks = [];
  
    // Hämta alla markerade bokmärken
    document.querySelectorAll('#bookmark-list input:checked').forEach(function (checkbox) {
      const bookmarkId = checkbox.value;
      chrome.bookmarks.getSubTree(bookmarkId, function (bookmarkNodes) {
        bookmarkNodes.forEach(function (node) {
          collectBookmarks(node, selectedBookmarks);
          
          // Exportera om vi har minst ett bokmärke
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
  
  function collectBookmarks(node, bookmarkList) {
    // Om det är ett bokmärke (inte en mapp), lägg till det
    if (node.url) {
      bookmarkList.push(node);
    }
    // Om det är en mapp, gå igenom alla barn
    if (node.children) {
      node.children.forEach(function (child) {
        collectBookmarks(child, bookmarkList);
      });
    }
  }
  
  function exportToJSON(bookmarks) {
    const jsonExport = JSON.stringify(bookmarks, null, 2);
    downloadFile(jsonExport, 'bookmarks.json', 'application/json');
  }
  
  function exportToCSV(bookmarks) {
    let csvExport = 'Title,URL\n';
    
    bookmarks.forEach(function (bookmark) {
      if (bookmark.url) {
        csvExport += `"${bookmark.title}","${bookmark.url}"\n`;
      }
    });
  
    downloadFile(csvExport, 'bookmarks.csv', 'text/csv');
  }
  
  function exportToHTML(bookmarks) {
    let htmlExport = '<html><body><ul>';
    
    bookmarks.forEach(function (bookmark) {
      if (bookmark.url) {
        htmlExport += `<li><a href="${bookmark.url}">${bookmark.title}</a></li>`;
      }
    });
  
    htmlExport += '</ul></body></html>';
    downloadFile(htmlExport, 'bookmarks.html', 'text/html');
  }
  
  function downloadFile(data, filename, type) {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }
  