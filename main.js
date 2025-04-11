"use strict";

// src/main.ts
var { Plugin } = require("obsidian");
module.exports = class IframeRenderer extends Plugin {
  async onload() {
    this.registerMarkdownPostProcessor((element, context) => {
      const matches = element.querySelectorAll("p");
      matches.forEach((p) => {
        const match = p.textContent?.match(/^!iframe\[(.+)\]$/);
        if (match) {
          const fileName = match[1].trim();
          const iframe = document.createElement("iframe");
          iframe.src = this.app.vault.adapter.getResourcePath(fileName);
          iframe.style.border = "2px solid red";
          iframe.style.borderRadius = "4px";
          iframe.style.minHeight = "300px";
          iframe.style.width = "100%";
          iframe.style.height = "500px";
          p.replaceWith(iframe);
        }
      });
    });
  }
};
