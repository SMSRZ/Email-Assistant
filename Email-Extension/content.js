/**
 * Email Assistant Script
 * -----------------------
 * This script enhances Gmail's web UI by injecting an "AI Reply" button into
 * the compose toolbar. When clicked, it sends the original email content to a
 * local backend to generate a professional reply and inserts the generated
 * response directly into the compose box.
 */

console.log("Email-Assistant Loaded");

/**
 * Finds Gmail's compose toolbar using a list of known selectors.
 * @returns {HTMLElement|null} The toolbar element or null if not found.
 */
function findComposeToolbar() {
    const selectors = ['.btC', '.aDh', '[role="toolbar"]', '.gU.Up'];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) return toolbar;
    }
    return null;
}

/**
 * Extracts content from the email you're replying to.
 * Tries several selectors to accommodate Gmail layout variations.
 * @returns {string} The email thread content in HTML, or an empty string if not found.
 */
function getEmailContent() {
    const selectors = ['.h7', '.a3h.ail', '.gmail_quote', '[role="presentation"]'];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) return content.innerHTML.trim();
    }
    return '';
}

/**
 * Creates a Gmail-style button labeled "AI Reply".
 * @returns {HTMLElement} A styled button element.
 */
function createAiButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.innerHTML = 'Ai-reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI reply');
    button.classList.add('ai-reply-button');
    return button;
}

/**
 * Injects the AI Reply button into the Gmail compose toolbar.
 * Also attaches a click event that sends content to a local API and inserts the reply.
 */
function injectButton() {
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) existingButton.remove();

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("Toolbar not found");
        return;
    }

    console.log("Toolbar found, creating AI button");
    const button = createAiButton();

    button.addEventListener('click', async () => {
        try {
            button.innerHTML = 'Generating...';
            button.disabled = true;

            const emailContent = getEmailContent();
            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailContent, tone: "professional" })
            });

            if (!response.ok) throw new Error('API request failed');

            const generateReply = await response.text();

            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generateReply);
            } else {
                console.error('Compose box not found');
            }
        } catch (error) {
            console.error('Failed to generate reply', error);
        } finally {
            button.innerHTML = 'Ai-reply';
            button.disabled = false;
        }
    });

    toolbar.insertBefore(button, toolbar.firstChild);
}

/**
 * Observes DOM mutations to detect when the Gmail compose window appears,
 * then calls `injectButton()` to add the AI reply button.
 */
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches?.('.aDh,.btC,[role="dialog"]') ||
             node.querySelector?.('.aDh,.btC,[role="dialog"]'))
        );
        if (hasComposeElements) {
            console.log("Compose window detected");
            setTimeout(injectButton, 500);
        }
    }
});

// Start observing the body for changes
observer.observe(document.body, {
    childList: true,
    subtree: true
});
