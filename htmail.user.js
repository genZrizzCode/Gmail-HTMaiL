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
// @downloadURL  https://update.greasyfork.org/scripts/550920/Gmail%20HTMaiL.user.js
// @license      Apache-2.0
// ==/UserScript==

(function () {
    'use strict';
    console.log("✅ Gmail HTML Compose Helper loaded");

    let lastEditor = null;

    document.addEventListener("focusin", e => {
        const editor = e.target.closest("[contenteditable='true']");
        if (editor) {
            lastEditor = editor;
            console.log("📝 Tracked compose editor:", editor);
        }
    });

    function styledPrompt(message) {
    return new Promise((resolve) => {
        const dialog = document.createElement('dialog');
        dialog.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); border:1px solid #3c3c3c; border-radius:8px; padding:20px; background:#1e1e1e; color:#d4d4d4; z-index:99999; box-shadow:0 10px 30px rgba(0,0,0,0.5); font-family:'Fira Code', 'Courier New', Courier, monospace; min-width: 500px; box-sizing: border-box;";

        const form = document.createElement('form');
        form.method = 'dialog';

        const p = document.createElement('p');
        p.style.cssText = "margin:0 0 12px 0; font-size:13px; color:#6a9955; font-weight:normal;";
        p.textContent = `// ${message}`;
        form.appendChild(p);

        const inputEl = document.createElement('textarea');
        inputEl.id = 'diagIn';
        inputEl.rows = 8;
        inputEl.placeholder = '<!-- Paste your HTML here -->\n<div>\n  <p>Hello World</p>\n</div>';
        inputEl.style.cssText = "width:100%; box-sizing:border-box; padding:12px; margin-bottom:18px; border:1px solid #3c3c3c; border-radius:4px; background:#2d2d2d; color:#9cdcfe; font-family:inherit; font-size:13px; line-height:1.5; outline:none; box-shadow: inset 0 1px 3px rgba(0,0,0,0.3); resize: vertical; white-space: pre; tab-size: 4;";

        inputEl.onfocus = () => { inputEl.style.borderColor = '#007acc'; };
        inputEl.onblur = () => { inputEl.style.borderColor = '#3c3c3c'; };

        form.appendChild(inputEl);

        const actionsDiv = document.createElement('div');
        actionsDiv.style.textAlign = 'right';

        const cancelBtn = document.createElement('button');
        cancelBtn.value = 'cancel';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = "padding:6px 14px; background:#3a3a3a; color:#cccccc; border:none; border-radius:4px; cursor:pointer; font-family:inherit; font-size:12px; transition: background 0.2s;";
        cancelBtn.onmouseover = () => { cancelBtn.style.background = '#4a4a4a'; };
        cancelBtn.onmouseout = () => { cancelBtn.style.background = '#3a3a3a'; };
        actionsDiv.appendChild(cancelBtn);

        const submitBtn = document.createElement('button');
        submitBtn.value = 'ok';
        submitBtn.textContent = 'Execute';
        submitBtn.style.cssText = "padding:6px 14px; background:#0e639c; color:#ffffff; border:none; border-radius:4px; cursor:pointer; margin-left:8px; font-family:inherit; font-size:12px; transition: background 0.2s;";
        submitBtn.onmouseover = () => { submitBtn.style.background = '#1177bb'; };
        submitBtn.onmouseout = () => { submitBtn.style.background = '#0e639c'; };
        actionsDiv.appendChild(submitBtn);

        form.appendChild(actionsDiv);
        dialog.appendChild(form);

        (document.body || document.documentElement).appendChild(dialog);
        dialog.showModal();

        inputEl.focus();

        dialog.onclose = () => {
            const value = dialog.returnValue === 'ok' ? inputEl.value : null;
            dialog.remove();
            resolve(value);
        };
    });
    }

    function insertHTMLViaPaste(html) {
        if (!lastEditor) {
            alert("Please click inside the compose box first!");
            console.warn("⚠️ No compose editor tracked. User needs to click in compose box first.");
            return;
        }

        console.log("🔧 Inserting HTML:", html);

        lastEditor.focus();

        const clipboardData = new DataTransfer();

        clipboardData.setData("text/html", html);

        clipboardData.setData("text/plain", html.replace(/<[^>]+>/g, ""));

        const pasteEvent = new ClipboardEvent("paste", {
            clipboardData,
            bubbles: true,
            cancelable: true,
        });

        lastEditor.dispatchEvent(pasteEvent);

        console.log("✅ HTML insertion completed");
    }

    function addHTMLButton(composeBox) {
        if (composeBox.querySelector(".html-insert-btn")) {
            console.log("🔄 HTML button already exists in this compose box");
            return;
        }

        let toolbar = composeBox.querySelector('[command="Files"]')?.parentElement;
        if (!toolbar) {
            console.warn("⚠️ Could not find compose toolbar in:", composeBox);
            return;
        }

        console.log("🔧 Adding HTML button to toolbar:", toolbar);

        let btn = document.createElement("button");
        btn.textContent = "</>";
        btn.title = "Insert HTML";
        btn.className = "html-insert-btn";
        btn.style.marginLeft = "8px";
        btn.style.cursor = "pointer";

        btn.onclick = async () => {
            console.log("🖱️ HTML button clicked");

            let html = await styledPrompt("Enter raw HTML:");

            if (html) {
                console.log("📝 User entered HTML:", html);
                insertHTMLViaPaste(html);
            } else {
                console.log("❌ User cancelled HTML input");
            }
        };

        toolbar.appendChild(btn);
        console.log("✅ HTML button added successfully");
    }

    const observer = new MutationObserver(() => {
        const composeBoxes = document.querySelectorAll(".aoI, .AD");

        if (composeBoxes.length > 0) {
            console.log(`🔍 Found ${composeBoxes.length} compose box(es), adding HTML buttons...`);
        }

        composeBoxes.forEach(addHTMLButton);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    console.log("👀 MutationObserver started - watching for new compose boxes");
})();