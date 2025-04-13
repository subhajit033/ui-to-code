// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'elementSelected') {
    // Forward component info to VS Code
    sendToVSCode(message.componentInfo);
  }
  return true;
});

function sendToVSCode(componentInfo) {
  // Option 1: Use custom URL protocol to communicate with VS Code
  const jsonData = encodeURIComponent(JSON.stringify(componentInfo));
  const vsCodeUrl = `vscode://subhajitkundu.ui-to-code-generator?data=${jsonData}`;

  // Open the URL which will be handled by the VS Code extension
  chrome.tabs.create({ url: vsCodeUrl, active: false }, (tab) => {
    // Close the tab after a moment - it's just for triggering the protocol
    // setTimeout(() => {
    //   chrome.tabs.remove(tab.id);
    // }, 500);
  });

  // Option 2: Use WebSockets (would need a WebSocket server)
  // If implementing WebSockets, you would connect and send data here
}
