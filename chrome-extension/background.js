chrome.browserAction.onClicked.addListener(function(tab) {
  let vid = (tab.url.match(/v=([a-zA-Z0-9_-]{11})/) || [null, null])[1];
  if (vid) {
    chrome.tabs.create({ url: "http://majcn.herokuapp.com/" + vid });
    // chrome.downloads.download({
    //   url: "http://majcn.herokuapp.com/" + vid
    // });
  }
});
