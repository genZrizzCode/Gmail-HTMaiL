# **GMAIL** **HTM**ai**L**

A powerful userscript that adds HTML insertion capabilities to Gmail's compose interface. Insert raw HTML directly into your emails with a simple click!

## 🚀 Features

- **Easy HTML Insertion**: Add a `</>` button to Gmail's compose toolbar
- **Raw HTML Support**: Insert any HTML content directly into your emails
- **Smart Editor Tracking**: Automatically detects which compose box you're working in
- **Paste Event Simulation**: Bypasses Gmail's HTML restrictions using clipboard events
- **Accessibility**: Includes plain text fallback for screen readers
- **Auto-Detection**: Works with both compose windows and popup compose boxes

## 📦 Installation

### Option 1: Tampermonkey/Violentmonkey (Recommended)

1. Install a userscript manager:
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Safari, Edge)
   - [Greasemonkey](https://www.greasespot.net/) (Firefox)
   - [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)

2. Click the "Raw" button on this file to install the script

3. The script will automatically update when you visit Gmail

### Option 2: Manual Installation

1. Copy the contents of `htmail.user.js`
2. Open your userscript manager
3. Create a new script and paste the code
4. Save the script

## 🎯 How to Use

1. **Open Gmail** and start composing a new email
2. **Click the `</>` button** in the compose toolbar (next to formatting options)
3. **Enter your HTML code** in the prompt dialog
4. **Click OK** - the HTML will be inserted at your cursor position

### Example HTML Code

```html
<!-- Bold text -->
<strong>This text will be bold</strong>

<!-- Italic text -->
<em>This text will be italic</em>

<!-- Links -->
<a href="https://example.com">Click here</a>

<!-- Images -->
<img src="https://example.com/image.jpg" alt="Description" width="300">

<!-- Styled content -->
<div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
  <h3 style="color: #333;">Styled Header</h3>
  <p style="color: #666;">This is a styled paragraph</p>
</div>

<!-- Tables -->
<table border="1" style="border-collapse: collapse;">
  <tr>
    <th>Header 1</th>
    <th>Header 2</th>
  </tr>
  <tr>
    <td>Data 1</td>
    <td>Data 2</td>
  </tr>
</table>
```

## 🔧 Technical Details

### How It Works

The script uses a clever technique to bypass Gmail's HTML restrictions:

1. **Editor Tracking**: Monitors focus events to track the active compose editor
2. **Paste Simulation**: Creates synthetic clipboard events with HTML data
3. **DOM Observation**: Uses MutationObserver to detect new compose boxes
4. **Button Injection**: Dynamically adds the HTML button to compose toolbars

### Browser Compatibility

- ✅ Chrome (with Tampermonkey)
- ✅ Firefox (with Tampermonkey/Greasemonkey)
- ✅ Safari (with Tampermonkey)
- ✅ Edge (with Tampermonkey)
- ✅ Opera (with Tampermonkey)

## 🐛 Troubleshooting

### Common Issues

**"Please click inside the compose box first!"**
- **Solution**: Click anywhere in the email composition area before using the HTML button

**HTML not rendering as expected**
- **Cause**: Gmail may sanitize certain HTML elements for security
- **Solution**: Try simpler HTML or check Gmail's HTML support

**Button not appearing**
- **Cause**: Script may not have loaded properly
- **Solution**: 
  1. Check browser console for errors
  2. Refresh Gmail page
  3. Reinstall the userscript

**Complex CSS not working**
- **Cause**: Gmail has limited CSS support
- **Solution**: Use inline styles and test simpler designs

### Debug Mode

Open your browser's developer console (F12) to see helpful debug messages:
- `✅ Gmail HTML Compose Helper loaded` - Script loaded successfully
- `📝 Tracked compose editor` - Editor tracking working
- `🔧 Inserting HTML` - HTML insertion in progress
- `✅ HTML insertion completed` - Success!

## 📝 Examples

### Basic Formatting
```html
<p><strong>Important:</strong> This is <em>urgent</em>!</p>
```

### Styled Content
```html
<div style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; padding: 20px; border-radius: 10px;">
  <h2>Beautiful Header</h2>
  <p>This content has a gradient background!</p>
</div>
```

### Email Signature
```html
<div style="border-top: 2px solid #ccc; margin-top: 20px; padding-top: 10px;">
  <p><strong>John Doe</strong><br>
  Software Developer<br>
  📧 john@example.com | 🌐 www.johndoe.com</p>
</div>
```

## 🤝 Contributing

Found a bug or have a feature request? We'd love your help!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE.txt](LICENSE.txt) file for details.

## 🙏 Acknowledgments

- Gmail team for the amazing email platform
- Tampermonkey/Greasemonkey for userscript support
- The open-source community for inspiration

---

**Made with ❤️ by MaSoVaX**

*Happy HTML composing!* 🎉