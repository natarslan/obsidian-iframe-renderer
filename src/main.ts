const { Plugin } = require('obsidian');

module.exports = class IframeRenderer extends Plugin {
    async onload() {
        // Register a Markdown post-processor
        this.registerMarkdownPostProcessor((element, context) => {
            // Find custom iframe syntax in the form of !iframe[filename.html]
            const matches = element.querySelectorAll('p');
            matches.forEach((p) => {
                const match = p.textContent?.match(/^!iframe\[(.+)\]$/);
                if (match) {
                    const fileName = match[1].trim();
                    const iframe = document.createElement('iframe');
                    iframe.src = this.app.vault.adapter.getResourcePath(fileName);
                    iframe.style.border = '2px solid red';
                    iframe.style.borderRadius = '4px';
                    iframe.style.minHeight = '300px';
                    iframe.style.width = '100%';
                    iframe.style.height = '500px';

                    // Replace the text with the iframe
                    p.replaceWith(iframe);
                }
            });
        });
    }
};