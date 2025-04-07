// // content.js
// let isSelectionModeActive = false;
// let overlay = null;
// let highlightElement = null;

// // Listen for messages from the extension popup
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === 'toggleSelectionMode') {
//     isSelectionModeActive = !isSelectionModeActive;

//     if (isSelectionModeActive) {
//       activateSelectionMode();
//     } else {
//       deactivateSelectionMode();
//     }

//     sendResponse({
//       status: 'Selection mode: ' + (isSelectionModeActive ? 'ON' : 'OFF'),
//     });
//   }
//   return true;
// });

// function activateSelectionMode() {
//   // Create overlay and highlight elements
//   createOverlay();
//   createHighlightElement();

//   // Add event listeners
//   document.addEventListener('mousemove', handleMouseMove);
//   document.addEventListener('click', handleElementSelect, true);

//   // Change cursor to indicate selection mode
//   document.body.style.cursor = 'crosshair';
// }

// function deactivateSelectionMode() {
//   // Remove overlay and highlight
//   if (overlay) {
//     document.body.removeChild(overlay);
//     overlay = null;
//   }

//   if (highlightElement) {
//     document.body.removeChild(highlightElement);
//     highlightElement = null;
//   }

//   // Remove event listeners
//   document.removeEventListener('mousemove', handleMouseMove);
//   document.removeEventListener('click', handleElementSelect, true);

//   // Reset cursor
//   document.body.style.cursor = 'default';
// }

// function createOverlay() {
//   overlay = document.createElement('div');
//   overlay.style.position = 'fixed';
//   overlay.style.top = '0';
//   overlay.style.left = '0';
//   overlay.style.width = '100%';
//   overlay.style.height = '100%';
//   overlay.style.zIndex = '10000';
//   overlay.style.pointerEvents = 'none';
//   document.body.appendChild(overlay);
// }

// function createHighlightElement() {
//   highlightElement = document.createElement('div');
//   highlightElement.style.position = 'absolute';
//   highlightElement.style.border = '2px solid #ff0000';
//   highlightElement.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
//   highlightElement.style.zIndex = '10001';
//   highlightElement.style.pointerEvents = 'none';
//   document.body.appendChild(highlightElement);
// }

// function handleMouseMove(event) {
//   if (!isSelectionModeActive) return;

//   // Get element under cursor (ignore our overlay elements)
//   const elements = document.elementsFromPoint(event.clientX, event.clientY);
//   const targetElement = elements.find(
//     (el) => el !== overlay && el !== highlightElement
//   );

//   if (targetElement) {
//     // Get element bounds
//     const rect = targetElement.getBoundingClientRect();

//     // Position highlight over the element
//     highlightElement.style.top = `${rect.top}px`;
//     highlightElement.style.left = `${rect.left}px`;
//     highlightElement.style.width = `${rect.width}px`;
//     highlightElement.style.height = `${rect.height}px`;
//     highlightElement.style.display = 'block';
//   } else {
//     highlightElement.style.display = 'none';
//   }
// }

// function handleElementSelect(event) {
//   if (!isSelectionModeActive) return;

//   // Prevent default click behavior
//   event.preventDefault();
//   event.stopPropagation();

//   // Get element under cursor
//   const elements = document.elementsFromPoint(event.clientX, event.clientY);
//   const targetElement = elements.find(
//     (el) => el !== overlay && el !== highlightElement
//   );

//   if (targetElement) {
//     // Extract component information
//     const componentInfo = extractComponentInfo(targetElement);

//     // Send to background script
//     chrome.runtime.sendMessage({
//       action: 'elementSelected',
//       componentInfo: componentInfo,
//     });

//     // Turn off selection mode after selection
//     deactivateSelectionMode();
//     isSelectionModeActive = false;
//   }

//   return false;
// }

// function extractComponentInfo(element) {
//   // Basic information about the element
//   const info = {
//     tagName: element.tagName.toLowerCase(),
//     id: element.id,
//     className: element.className,
//     textContent: element.textContent.trim().substring(0, 50),
//     attributes: {},
//     rect: element.getBoundingClientRect().toJSON(),
//   };

//   // Extract all attributes
//   for (let i = 0; i < element.attributes.length; i++) {
//     const attr = element.attributes[i];
//     info.attributes[attr.name] = attr.value;
//   }

//   // Extract React component info if available
//   // This works for React apps with react-devtools
//   if (
//     element._reactRootContainer ||
//     element._reactInternalInstance ||
//     element[
//       Object.keys(element).find((key) =>
//         key.startsWith('__reactInternalInstance')
//       )
//     ]
//   ) {
//     info.isReact = true;

//     // Try to find component name from various properties in React 16+
//     const reactKey = Object.keys(element).find(
//       (key) =>
//         key.startsWith('__reactFiber') ||
//         key.startsWith('__reactInternalInstance')
//     );

//     if (reactKey && element[reactKey]) {
//       const fiberNode = element[reactKey];
//       if (fiberNode.return && fiberNode.return.type) {
//         // Extract component name
//         if (typeof fiberNode.return.type === 'function') {
//           info.componentName =
//             fiberNode.return.type.name || 'AnonymousComponent';
//         } else if (typeof fiberNode.return.type === 'string') {
//           info.componentName = fiberNode.return.type;
//         }
//       }
//     }
//   }

//   // Extract Vue.js component info if available
//   if (element.__vue__) {
//     info.isVue = true;
//     info.componentName =
//       element.__vue__.$options.name ||
//       element.__vue__.$options._componentTag ||
//       'AnonymousComponent';
//   }

//   // Try to extract more specific info from data attributes
//   const dataAttrs = {};
//   for (const key in element.dataset) {
//     dataAttrs[key] = element.dataset[key];
//   }
//   info.dataAttributes = dataAttrs;

//   return info;
// }

// content.js
let isSelectionModeActive = false;
let overlay = null;
let highlightElement = null;

// Listen for messages from the extension popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleSelectionMode') {
    isSelectionModeActive = !isSelectionModeActive;

    if (isSelectionModeActive) {
      activateSelectionMode();
    } else {
      deactivateSelectionMode();
    }

    sendResponse({
      status: 'Selection mode: ' + (isSelectionModeActive ? 'ON' : 'OFF'),
    });
  }
  return true;
});

function activateSelectionMode() {
  // Create overlay and highlight elements
  createOverlay();
  createHighlightElement();

  // Add event listeners
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('click', handleElementSelect, true);
  // Add scroll event listener to update highlight position when scrolling
  document.addEventListener('scroll', handleScroll, true);

  // Change cursor to indicate selection mode
  document.body.style.cursor = 'crosshair';
}

function deactivateSelectionMode() {
  // Remove overlay and highlight
  if (overlay) {
    document.body.removeChild(overlay);
    overlay = null;
  }

  if (highlightElement) {
    document.body.removeChild(highlightElement);
    highlightElement = null;
  }

  // Remove event listeners
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('click', handleElementSelect, true);
  document.removeEventListener('scroll', handleScroll, true);

  // Reset cursor
  document.body.style.cursor = 'default';
}

function createOverlay() {
  overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.zIndex = '10000';
  overlay.style.pointerEvents = 'none';
  document.body.appendChild(overlay);
}

function createHighlightElement() {
  highlightElement = document.createElement('div');
  highlightElement.style.position = 'absolute';
  highlightElement.style.border = '2px solid #ff0000';
  highlightElement.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
  highlightElement.style.zIndex = '10001';
  highlightElement.style.pointerEvents = 'none';
  document.body.appendChild(highlightElement);
}

// Keep track of the current target element
let currentTargetElement = null;

function handleMouseMove(event) {
  if (!isSelectionModeActive) return;

  // Get element under cursor (ignore our overlay elements)
  const elements = document.elementsFromPoint(event.clientX, event.clientY);
  const targetElement = elements.find(
    (el) => el !== overlay && el !== highlightElement
  );

  // Update current target element
  currentTargetElement = targetElement;

  updateHighlight(targetElement);
}

function updateHighlight(targetElement) {
  if (targetElement) {
    // Get element bounds
    const rect = targetElement.getBoundingClientRect();

    // Position highlight over the element - use fixed positioning with client coordinates
    highlightElement.style.position = 'fixed';
    highlightElement.style.top = `${rect.top}px`;
    highlightElement.style.left = `${rect.left}px`;
    highlightElement.style.width = `${rect.width}px`;
    highlightElement.style.height = `${rect.height}px`;
    highlightElement.style.display = 'block';
  } else {
    highlightElement.style.display = 'none';
  }
}

function handleScroll(event) {
  if (!isSelectionModeActive) return;

  // When scrolling, update the highlight if we have a target element
  if (currentTargetElement) {
    updateHighlight(currentTargetElement);
  }
}

function handleElementSelect(event) {
  if (!isSelectionModeActive) return;

  // Prevent default click behavior
  event.preventDefault();
  event.stopPropagation();

  // Get element under cursor
  const elements = document.elementsFromPoint(event.clientX, event.clientY);
  const targetElement = elements.find(
    (el) => el !== overlay && el !== highlightElement
  );

  if (targetElement) {
    // Extract component information
    const componentInfo = extractComponentInfo(targetElement);

    // Send to background script
    chrome.runtime.sendMessage({
      action: 'elementSelected',
      componentInfo: componentInfo,
    });

    // Turn off selection mode after selection
    deactivateSelectionMode();
    isSelectionModeActive = false;
  }

  return false;
}

function extractComponentInfo(element) {
  // Basic information about the element
  const info = {
    tagName: element.tagName.toLowerCase(),
    id: element.id,
    className: element.className,
    textContent: element.textContent.trim().substring(0, 50),
    attributes: {},
    rect: element.getBoundingClientRect().toJSON(),
  };

  // Extract all attributes
  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    info.attributes[attr.name] = attr.value;
  }

  // Extract React component info if available
  // This works for React apps with react-devtools
  if (
    element._reactRootContainer ||
    element._reactInternalInstance ||
    element[
      Object.keys(element).find((key) =>
        key.startsWith('__reactInternalInstance')
      )
    ]
  ) {
    info.isReact = true;

    // Try to find component name from various properties in React 16+
    const reactKey = Object.keys(element).find(
      (key) =>
        key.startsWith('__reactFiber') ||
        key.startsWith('__reactInternalInstance')
    );

    if (reactKey && element[reactKey]) {
      const fiberNode = element[reactKey];
      if (fiberNode.return && fiberNode.return.type) {
        // Extract component name
        if (typeof fiberNode.return.type === 'function') {
          info.componentName =
            fiberNode.return.type.name || 'AnonymousComponent';
        } else if (typeof fiberNode.return.type === 'string') {
          info.componentName = fiberNode.return.type;
        }
      }
    }
  }

  // Extract Vue.js component info if available
  if (element.__vue__) {
    info.isVue = true;
    info.componentName =
      element.__vue__.$options.name ||
      element.__vue__.$options._componentTag ||
      'AnonymousComponent';
  }

  // Try to extract more specific info from data attributes
  const dataAttrs = {};
  for (const key in element.dataset) {
    dataAttrs[key] = element.dataset[key];
  }
  info.dataAttributes = dataAttrs;

  return info;
}
