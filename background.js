chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let url = tabs[0].url;
      console.log(url);
      chrome.contextMenus.removeAll();
      if (url.includes("https://tamu.collegescheduler.com/")) {
        chrome.contextMenus.create({
          title: "Aggie Search",
          id: "parent",
          contexts: ["selection"],
        });

        chrome.contextMenus.create({
          title: "Search Class",
          parentId: "parent",
          contexts: ["selection"],
          id: "SearchClass",
        });

        chrome.contextMenus.create({
          title: "Search Prof",
          parentId: "parent",
          contexts: ["selection"],
          id: "SearchProf",
        });
      } else {
        chrome.contextMenus.removeAll();
      }
    });
  }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    let url = tabs[0].url;
    console.log(url);
    chrome.contextMenus.removeAll();
    if (url.includes("https://tamu.collegescheduler.com/")) {
      chrome.contextMenus.create({
        title: "Aggie Search",
        id: "parent",
        contexts: ["selection"],
      });

      chrome.contextMenus.create({
        title: "Search Class",
        parentId: "parent",
        contexts: ["selection"],
        id: "SearchClass",
      });

      chrome.contextMenus.create({
        title: "Search Prof",
        parentId: "parent",
        contexts: ["selection"],
        id: "SearchProf",
      });
    } else {
      chrome.contextMenus.removeAll();
    }
  });
});

chrome.contextMenus.onClicked.addListener(function (onClickData) {
  if (onClickData.menuItemId === "SearchClass") {
    let classInfo = onClickData.selectionText.split(" ");
    chrome.tabs.create({
      url:
        "https://anex.us/grades/?dept=" +
        classInfo[0] +
        "&number=" +
        classInfo[1],
    });
  } else if (onClickData.menuItemId === "SearchProf") {
    chrome.tabs.create({
      url:
        " https://www.ratemyprofessors.com/search/professors/1003?q= " +
        onClickData.selectionText,
    });
  }
});
