// ==UserScript==
// @name         Gmail HTMaiL
// @namespace    https://github.com/genZrizzCode/Gmail-HTMaiL
// @version      1
// @description  Insert raw HTML into Gmail compose by simulating paste event!
// @icon         https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg
// @author       MaSoVaX
// @include      *://mail.google.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/genZrizzCode/Gmail-HTMaiL/main/htmail.user.js
// @downloadURL  https://raw.githubusercontent.com/genZrizzCode/Gmail-HTMaiL/main/htmail.user.js
// @license      Apache-2.0
// ==/UserScript==

/**
 * Gmail HTMaiL - HTML Insertion Helper for Gmail Compose
 * 
 * This userscript adds a "</>" button to Gmail's compose interface that allows
 * you to insert raw HTML content directly into your email composition.
 * 
 * HOW TO USE:
 * 1. Click the "</>" button in the compose toolbar
 * 2. Enter your HTML code in the prompt dialog
 * 3. The HTML will be inserted at your cursor position
 * 
 * EXAMPLES:
 * - <strong>Bold text</strong>
 * - <em>Italic text</em>
 * - <a href="https://example.com">Link</a>
 * - <img src="image.jpg" alt="Image">
 * - <div style="color: red;">Styled div</div>
 * 
 * TROUBLESHOOTING:
 * - Make sure to click inside the compose box before using the button
 * - Some HTML elements may be sanitized by Gmail's security filters
 * - Complex CSS styles might not render exactly as expected
 * 
 * TECHNICAL NOTES:
 * - Uses ClipboardEvent simulation to bypass Gmail's HTML restrictions
 * - Automatically tracks the last focused compose editor
 * - Includes fallback plain text for accessibility
 */

(function () {
    'use strict';
    console.log("✅ Gmail HTML Compose Helper loaded");

    // Store reference to the last compose editor the user interacted with
    // This is crucial because Gmail has multiple compose windows and we need
    // to know which one to insert HTML into
    let lastEditor = null;

    /**
     * Track the last compose editor the user clicked/focused
     * This event listener runs whenever focus changes on the page
     * We look for contenteditable elements (Gmail's compose boxes) and
     * remember the most recently focused one
     */
    document.addEventListener("focusin", e => {
        // Find the nearest contenteditable element (Gmail's compose editor)
        const editor = e.target.closest("[contenteditable='true']");
        if (editor) {
            lastEditor = editor;
            console.log("📝 Tracked compose editor:", editor);
        }
    });

    /**
     * Insert HTML content into the compose editor by simulating a paste event
     * This is the core function that bypasses Gmail's HTML restrictions
     * 
     * @param {string} html - The HTML content to insert
     */
    function insertHTMLViaPaste(html) {
        // Safety check: ensure we have a compose editor to work with
        if (!lastEditor) {
            alert("Please click inside the compose box first!");
            console.warn("⚠️ No compose editor tracked. User needs to click in compose box first.");
            return;
        }

        console.log("🔧 Inserting HTML:", html);

        // Restore focus to the compose editor so Gmail knows where to paste
        // This is essential for the paste event to work correctly
        lastEditor.focus();

        // Create a DataTransfer object to simulate clipboard data
        // This mimics what happens when you copy HTML content to clipboard
        const clipboardData = new DataTransfer();
        
        // Set the HTML data - this is what Gmail will process
        clipboardData.setData("text/html", html);
        
        // Set plain text fallback by stripping HTML tags
        // This ensures accessibility and provides a fallback if HTML fails
        clipboardData.setData("text/plain", html.replace(/<[^>]+>/g, ""));

        // Create a synthetic paste event with our clipboard data
        // The event bubbles up and can be cancelled (standard paste behavior)
        const pasteEvent = new ClipboardEvent("paste", {
            clipboardData,
            bubbles: true,
            cancelable: true,
        });

        // Dispatch the paste event to the compose editor
        // Gmail will process this as if the user pasted HTML content
        lastEditor.dispatchEvent(pasteEvent);
        
        console.log("✅ HTML insertion completed");
    }

    /**
     * Add the HTML insertion button to a Gmail compose box
     * This function finds the compose toolbar and adds our custom "</>" button
     * 
     * @param {Element} composeBox - The Gmail compose box element
     */
    function addHTMLButton(composeBox) {
        // Prevent duplicate buttons - check if button already exists
        if (composeBox.querySelector(".html-insert-btn")) {
            console.log("🔄 HTML button already exists in this compose box");
            return;
        }

        // Find the compose toolbar by looking for the "Files" button
        // The toolbar contains all the formatting options (Bold, Italic, etc.)
        let toolbar = composeBox.querySelector('[command="Files"]')?.parentElement;
        if (!toolbar) {
            console.warn("⚠️ Could not find compose toolbar in:", composeBox);
            return;
        }

        console.log("🔧 Adding HTML button to toolbar:", toolbar);

        // Create our custom HTML insertion button
        let btn = document.createElement("button");
        btn.textContent = "</>";  // HTML-like symbol to indicate HTML insertion
        btn.title = "Insert HTML";  // Tooltip text
        btn.className = "html-insert-btn";  // CSS class for styling/identification
        btn.style.marginLeft = "8px";  // Spacing from other toolbar buttons
        btn.style.cursor = "pointer";  // Visual feedback on hover

        // Add click handler to prompt for HTML input and insert it
        btn.onclick = () => {
            console.log("🖱️ HTML button clicked");
            let html = prompt("Enter raw HTML:");
            if (html) {
                console.log("📝 User entered HTML:", html);
                insertHTMLViaPaste(html);
            } else {
                console.log("❌ User cancelled HTML input");
            }
        };

        // Add the button to the toolbar
        toolbar.appendChild(btn);
        console.log("✅ HTML button added successfully");
    }

    /**
     * Set up a MutationObserver to automatically add HTML buttons to new compose boxes
     * Gmail dynamically creates compose windows, so we need to watch for DOM changes
     * and add our button whenever a new compose box appears
     */
    const observer = new MutationObserver(() => {
        // Look for Gmail compose box elements (these are Gmail's internal CSS classes)
        // .aoI = compose window, .AD = compose popup
        const composeBoxes = document.querySelectorAll(".aoI, .AD");
        
        if (composeBoxes.length > 0) {
            console.log(`🔍 Found ${composeBoxes.length} compose box(es), adding HTML buttons...`);
        }
        
        // Add our HTML button to each compose box
        composeBoxes.forEach(addHTMLButton);
    });

    // Start observing the entire document for changes
    // childList: true = watch for added/removed child elements
    // subtree: true = watch all descendants, not just direct children
    observer.observe(document.body, { childList: true, subtree: true });
    
    console.log("👀 MutationObserver started - watching for new compose boxes");
})();