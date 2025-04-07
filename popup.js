// popup.js
document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.getElementById('toggleButton');
  const statusDiv = document.getElementById('status');
  let isActive = false;

  toggleButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'toggleSelectionMode' },
        function (response) {
          if (response && response.status) {
            statusDiv.textContent = response.status;
            isActive = response.status.includes('ON');
            toggleButton.textContent = isActive
              ? 'Disable Selection Mode'
              : 'Enable Selection Mode';
          }
        }
      );
    });
  });
});
