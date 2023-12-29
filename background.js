chrome.contextMenus.removeAll(
  function () {
    chrome.contextMenus.create({
      id: "downloadVideoContextMenu",
      title: "Search!",
      contexts: ["any"],
    });
  },
  () => chrome.runtime.lastError
);
