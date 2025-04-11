# Step-by-Step Guide to Building the "Nat Iframe Renderer" Obsidian Plugin

## **Introduction**

### **Aim of the Project**

The goal of this project is to create an **Obsidian plugin** that allows users to **embed local HTML files into their Markdown notes using iframes**. This is particularly useful for displaying **interactive content** like maps, charts, or custom HTML pages directly within your Obsidian workspace.

### **Who This Guide is For**

This guide is written for **complete beginners**, including people who have **never used npm (like me), written TypeScript (like me), or built an Obsidian plugin (like me)** before. Each step is broken down clearly and includes **detailed explanations, comments, and online resources**. I heavily relied on co-pilot to write this plugin. 

### **Technologies Used**

1. **Languages**:
    
    - **TypeScript**: A superset of JavaScript that adds static types. It helps catch errors early and improves code clarity. [Learn more](https://www.typescriptlang.org/)
        
    - **CSS**: Used to style iframe elements.
        
    - **JSON**: A data format used for configuration files (e.g., manifest.json).
        
2. **Tools & Platforms**:
    
    - **Obsidian API**: Framework provided by Obsidian for writing plugins. [Obsidian API Docs](https://docs.obsidian.md/Plugins)
        
    - **npm**: Node Package Manager, used to install and manage JavaScript packages. Comes with [Node.js](https://nodejs.org/).
        
    - **esbuild**: A super-fast JavaScript bundler and compiler. [esbuild Docs](https://esbuild.github.io/)
        
    - **Node.js**: A JavaScript runtime environment. Required for running npm. [Node.js website](https://nodejs.org/)
        

---

## **Good to Know: What is the DOM?**

### 🧱 DOM = Document Object Model

The **DOM (Document Object Model)** is a representation of your web page and it lets you use JavaScript (or TypeScript) to **read or change** parts of the web page.

> 💡 Think of HTML as the blueprint of a house, and the DOM as the actual house that's built from that blueprint. Once the house is built, you can move walls, add furniture, or even change the layout — just like how the DOM allows you to interact with and modify the web page after it’s loaded.

### 🛠 DOM Methods (With Examples)

**DOM methods** are JavaScript functions used to create, find, or manipulate elements in the DOM.

#### ✅ Examples from this plugin:

- `document.createElement('iframe')` → Creates a new iframe element
    
- `element.querySelectorAll('p')` → Finds all `<p>` elements in the rendered Markdown
    
- `p.replaceWith(iframe)` → Replaces a paragraph node with the iframe
    

#### 🧪 Other Examples:

```ts
const heading = document.createElement('h1');
heading.textContent = "Welcome!";
document.body.appendChild(heading); // Adds the heading to the web page

const button = document.querySelector('button');
button.addEventListener('click', () => alert("Clicked!")); // Adds a click action

const div = document.getElementById('myDiv');
div.style.color = 'blue'; // Changes text color
```

### 📚 DOM Resources for Beginners

- [MDN: What is the DOM?](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)
    
- [DOM Manipulation for Beginners (freeCodeCamp)](https://www.freecodecamp.org/news/dom-manipulation-in-plain-javascript/)
    
- [querySelector vs querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)
    

---

## **Project Structure**

Here’s the folder structure for your plugin:

```
nat-iframe-renderer/
├── main.js               # Compiled JavaScript file (auto-generated)
├── main.js.map           # Source map (helps with debugging)
├── manifest.json         # Metadata that Obsidian reads
├── package.json          # Defines your project and dependencies
├── README.md             # Optional: plugin documentation
├── rollup.config.js      # Optional: config for Rollup bundler (if used)
├── styles.css            # CSS styles for the iframe
├── tsconfig.json         # TypeScript configuration
└── src/
    └── main.ts           # Main plugin logic (written in TypeScript)
```

---

## **Step 1: Setting Up the Project**

### 1.1 Create the Plugin Folder

First, you need to create a folder inside your Obsidian vault where plugins go.

```bash
cd /Users/nat/Dropbox/Nat_Arslan_Blog/.obsidian/plugins  # Navigate to your plugins folder
mkdir nat-iframe-renderer                                # Make a folder for your plugin
cd nat-iframe-renderer                                   # Go into that folder
```

> 🔍 **Tip**: Replace `/Users/nat/...` with your actual vault path.

### 1.2 Initialize a Node.js Project

This will create a `package.json` file, which defines your project.

```bash
npm init -y
```

> 📦 `npm` stands for **Node Package Manager**. It helps install and manage packages (tools/code) from the internet.
> 
> ✅ `-y` means “yes to all questions” — it skips the setup prompts and creates a basic `package.json` instantly.

---

## **Step 2: Install Dependencies**

These tools are required to build and run your plugin.

```bash
npm install obsidian                      # Gives access to Obsidian's API
npm install --save-dev typescript esbuild # Installs TypeScript + esbuild as development tools
```

- `obsidian`: Gives access to Obsidian's API.
    
- `typescript`: Allows us to write TypeScript code.
    
- `esbuild`: Compiles TypeScript into JavaScript very quickly.
    

---

## **Step 3: Write the Plugin Code**

### 3.1 Create `manifest.json`

This file tells Obsidian how to use your plugin.

It is essential for Obsidian to recognize the plugin and load its metadata correctly. Without this file, the plugin won’t appear in the Community Plugins section, even if the code is present.

Create a new file `manifest.json` and paste this:

```json
{
  "id": "nat-iframe-renderer",
  "name": "Nat Iframe Renderer",
  "version": "1.0.0",
  "minAppVersion": "0.12.0",
  "description": "An Obsidian plugin to render local HTML files in markdown files using iframes.",
  "author": "Nat",
  "authorUrl": "https://yourwebsite.com",
  "isDesktopOnly": false,
  "main": "main.js",
  "css": "styles.css"
}
```

### 3.2 Write Plugin Logic (`main.ts`)

If you haven't already, create a folder named `src` inside your `nat-iframe-renderer` project directory:

```bash
mkdir src
```

Then, create a new file `src/main.ts` and paste the following code.

---

### 🔍 Explanation of Important Code Concepts

- `const { Plugin } = require('obsidian');` — Imports the `Plugin` class from the Obsidian API so we can create our own plugin by extending it. [Learn more](https://docs.obsidian.md/Plugins/User+interface/Plugin+API+overview)
    
- `module.exports = class IframeRenderer extends Plugin { ... }` — This exports your custom plugin so Obsidian can recognize and use it. You're creating a class that _extends_ Obsidian's built-in Plugin class (i.e., it inherits its functionality).
    
- `async onload()` — This function is automatically called by Obsidian when your plugin starts. It's where you put all your plugin initialization logic. [Async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) let you use `await` inside them.
    
- `this.registerMarkdownPostProcessor(...)` — This method lets you add custom behavior _after_ Obsidian renders a note. We use it to detect and transform custom syntax like `!iframe[...]`. [Docs on post processors](https://docs.obsidian.md/Plugins/Plugin+API/MarkdownPostProcessor)
    
- `element.querySelectorAll('p')` — This finds all `<p>` tags (paragraphs) in the rendered note. [MDN reference](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)
    
- `iframe.src = this.app.vault.adapter.getResourcePath(fileName);` — This constructs the correct local file path for the iframe `src` using Obsidian’s API. It’s how you safely link to a file inside the vault.
    
- `p.replaceWith(iframe);` — This replaces the original paragraph (e.g., `!iframe[mychart.html]`) with the new iframe element.
    

> 🧠 These are all standard JavaScript/TypeScript and DOM methods. Once you’re comfortable reading this code, you can do much more with plugins!

---

```ts
const { Plugin } = require('obsidian'); // Import Plugin class from Obsidian

// Export our custom plugin class
module.exports = class IframeRenderer extends Plugin {
    // This function is called when the plugin loads in Obsidian
    async onload() {
        // Register a Markdown post-processor (runs after rendering a note)
        this.registerMarkdownPostProcessor((element) => {
            // Look through all paragraph tags (<p>)
            const matches = element.querySelectorAll('p');

            // Check each paragraph for the custom iframe syntax
            matches.forEach((p) => {
                // Match lines like: !iframe[my-file.html]
                const match = p.textContent?.match(/^!iframe\[(.+)\]$/);

                if (match) {
                    const fileName = match[1].trim(); // Extract the filename

                    // Create a new <iframe> HTML element
                    const iframe = document.createElement('iframe');

                    // Set the iframe's source to the file path in the vault
                    iframe.src = this.app.vault.adapter.getResourcePath(fileName);

                    // Apply some default styles
                    iframe.style.border = '2px solid red'; // Adds a red border around the iframe for debugging; you can remove or change this style later for production use
                    iframe.style.borderRadius = '4px';
                    iframe.style.minHeight = '300px';
                    iframe.style.width = '100%';
                    iframe.style.height = '500px';

                    // Replace the paragraph with the iframe
                    p.replaceWith(iframe);
                }
            });
        });
    }
};
```

> 🧠 **What’s Happening Here?**
> 
> - The plugin looks for lines like `!iframe[myfile.html]` in your notes.
>     
> - It replaces that line with an iframe showing the specified HTML file.
>     

---

## **Step 4: Configure TypeScript**

### 4.1 Create `tsconfig.json`

Create a `tsconfig.json` file to tell TypeScript how to compile your code:

```json
{
  "compilerOptions": {
    "target": "ES2020",                  // Which JavaScript version to compile to
    "module": "ESNext",                  // Module system to use
    "moduleResolution": "node",          // Use Node.js style module resolution
    "strict": true,                      // Enable all strict type checks
    "esModuleInterop": true,             // Allow mixing CommonJS and ES modules
    "skipLibCheck": true,                // Skip checking library types
    "forceConsistentCasingInFileNames": true,
    "outDir": "."                         // Output files in root
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## **Step 5: Build the Plugin**

### 5.1 Update `package.json` Build Script

Add a build script to compile the plugin (inside the `scripts` section of your `package.json` file):

```json
"scripts": {
  "build": "esbuild src/main.ts --bundle --format=cjs --platform=node --external:obsidian --target=es2020 --outfile=main.js"
}
```

> 🛠 This command compiles `src/main.ts` into `main.js` using esbuild.

### 5.2 Run the Build

```bash
npm run build  # This will compile your TypeScript into JavaScript
```

If everything works, you'll see a new `main.js` file.

---

## **Step 6: Load the Plugin in Obsidian**

1. Open **Obsidian**.
    
2. Go to **Settings > Community Plugins**.
    
3. Disable **Safe Mode** if it’s on.
    
4. Click **"Load Unpacked Plugin"**.
    
5. Select your `nat-iframe-renderer` folder.
    
6. Toggle the plugin ON.
    

---

## **Step 7: Test the Plugin**

1. Create a new Markdown note.
    
2. Type the following:
    

```markdown
!iframe[my-chart.html]
```

3. Make sure `my-chart.html` exists in your vault.
    
4. When you preview the note, it should show the HTML inside an iframe.
    

---

## ✅ You Did It!

You’ve built and installed your own Obsidian plugin from scratch. Nice work!

You now know how to:

- Use npm to manage dependencies.
    
- Write TypeScript and compile it.
    
- Use the Obsidian API.
    
- Use DOM methods to build interactive elements.
    
- Load and test custom plugins.
    

Feel free to explore and customize the plugin further. Add error handling, adjustable iframe size, or even support for remote URLs. The sky’s the limit.

---

> 🌐 **Further Reading & Resources**
> 
> - [Obsidian Plugin Docs](https://docs.obsidian.md/Plugins)
>     
> - [TypeScript Handbook](https://www.typescriptlang.org/docs/)
>     
> - [Node.js Documentation](https://nodejs.org/en/docs/)
>     
> - [esbuild Guide](https://esbuild.github.io/)
>     
> - [DOM for Beginners (freeCodeCamp)](https://www.freecodecamp.org/news/dom-manipulation-in-plain-javascript/)
>     
> - [What is the DOM (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)
>

### **Technologies Used**

1. **Languages**:
    
    - **TypeScript**: A superset of JavaScript that adds static types. It helps catch errors early and improves code clarity. [Learn more](https://www.typescriptlang.org/)
        
    - **CSS**: Used to style iframe elements.
        
    - **JSON**: A data format used for configuration files (e.g., manifest.json).
        
2. **Tools & Platforms**:
    
    - **Obsidian API**: Framework provided by Obsidian for writing plugins. [Obsidian Plugin Docs](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)
        
    - **npm**: Node Package Manager, used to install and manage JavaScript packages. Comes with Node.js.
        
    - **esbuild**: A super-fast JavaScript bundler and compiler. [esbuild Docs](https://esbuild.github.io/)
        
    - **Node.js**: A JavaScript runtime environment. Required for running npm. [Node.js website](https://nodejs.org/)
        

---

## **Project Structure**

Here’s the folder structure for your plugin:

```
nat-iframe-renderer/
├── main.js               # Compiled JavaScript file (auto-generated)
├── main.js.map           # Source map (helps with debugging)
├── manifest.json         # Metadata that Obsidian reads
├── package.json          # Defines your project and dependencies
├── README.md             # Optional: plugin documentation
├── rollup.config.js      # Optional: config for Rollup bundler (if used)
├── styles.css            # CSS styles for the iframe
├── tsconfig.json         # TypeScript configuration
└── src/
    └── main.ts           # Main plugin logic (written in TypeScript)
```

---

## **Step 1: Setting Up the Project**

### 1.1 Create the Plugin Folder

First, you need to create a folder inside your Obsidian vault where plugins go. Example:

```bash
cd /Users/my-blog/.obsidian/plugins  # Navigate to your plugins folder
mkdir nat-iframe-renderer                                # Make a folder for your plugin
cd nat-iframe-renderer                                   # Go into that folder
```

> 🔍 **Tip**: Replace `/Users/my-blog...` with your actual vault path.
> 🔍 **Tip 2**: Please, oh please, be more creative than I am & create a better folder-project name.

### 1.2 Initialize a Node.js Project

This will create a `package.json` file, which defines your project.

```bash
npm init -y
```

> 📦 `npm` stands for **Node Package Manager**. It helps install and manage packages (tools/code) from the internet.
> 
> ✅ `-y` means “yes to all questions” — it skips the setup prompts and creates a basic `package.json` instantly.

---

## **Step 2: Install Dependencies**

These tools are required to build and run your plugin.

```bash
npm install obsidian                      # Gives access to Obsidian's API
npm install --save-dev typescript esbuild # Installs TypeScript + esbuild as development tools
```

- `obsidian`: Gives access to Obsidian's API.
    
- `typescript`: Allows us to write TypeScript code.
    
- `esbuild`: Compiles TypeScript into JavaScript very quickly.
    

---

## **Step 3: Write the Plugin Code**

### 3.1 Create `manifest.json`

This file tells Obsidian how to use your plugin.

Create a new file `manifest.json` and paste this:

```json
{
  "id": "nat-iframe-renderer",
  "name": "Nat Iframe Renderer",
  "version": "1.0.0",
  "minAppVersion": "0.12.0",
  "description": "An Obsidian plugin to render local HTML files in markdown files using iframes.",
  "author": "Nat",
  "authorUrl": "https://yourwebsite.com",
  "isDesktopOnly": false,
  "main": "main.js",
  "css": "styles.css"
}
```

### 3.2 Write Plugin Logic (`main.ts`)

Create a new file `src/main.ts` and paste the following code.

---

### 🔍 Explanation of Important Code Concepts

- `const { Plugin } = require('obsidian');` — Imports the `Plugin` class from the Obsidian API so we can create our own plugin by extending it. [Learn more](https://docs.obsidian.md/Plugins/User+interface/Plugin+API+overview)
    
- `module.exports = class IframeRenderer extends Plugin { ... }` — This exports your custom plugin so Obsidian can recognize and use it. You're creating a class that _extends_ Obsidian's built-in Plugin class (i.e., it inherits its functionality).
    
- `async onload()` — This function is automatically called by Obsidian when your plugin starts. It's where you put all your plugin initialization logic. [Async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) let you use `await` inside them.
    
- `this.registerMarkdownPostProcessor(...)` — This method lets you add custom behavior _after_ Obsidian renders a note. We use it to detect and transform custom syntax like `!iframe[...]`. [Docs on post processors](https://docs.obsidian.md/Plugins/Plugin+API/MarkdownPostProcessor)
    
- `element.querySelectorAll('p')` — This finds all `<p>` tags (paragraphs) in the rendered note. [MDN reference](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)
    
- `iframe.src = this.app.vault.adapter.getResourcePath(fileName);` — This constructs the correct local file path for the iframe `src` using Obsidian’s API. It’s how you safely link to a file inside the vault.
    
- `p.replaceWith(iframe);` — This replaces the original paragraph (e.g., `!iframe[mychart.html]`) with the new iframe element.
    

> 🧠 These are all standard JavaScript/TypeScript and DOM methods!

---

```ts
const { Plugin } = require('obsidian'); // Import Plugin class from Obsidian

// Export our custom plugin class
module.exports = class IframeRenderer extends Plugin {
    // This function is called when the plugin loads in Obsidian
    async onload() {
        // Register a Markdown post-processor (runs after rendering a note)
        this.registerMarkdownPostProcessor((element) => {
            // Look through all paragraph tags (<p>)
            const matches = element.querySelectorAll('p');

            // Check each paragraph for the custom iframe syntax
            matches.forEach((p) => {
                // Match lines like: !iframe[my-file.html]
                const match = p.textContent?.match(/^!iframe\[(.+)\]$/);

                if (match) {
                    const fileName = match[1].trim(); // Extract the filename

                    // Create a new <iframe> HTML element
                    const iframe = document.createElement('iframe');

                    // Set the iframe's source to the file path in the vault
                    iframe.src = this.app.vault.adapter.getResourcePath(fileName);

                    // Apply some default styles
                    iframe.style.border = '2px solid red';
                    iframe.style.borderRadius = '4px';
                    iframe.style.minHeight = '300px';
                    iframe.style.width = '100%';
                    iframe.style.height = '500px';

                    // Replace the paragraph with the iframe
                    p.replaceWith(iframe);
                }
            });
        });
    }
};
```

> 🧠 **What’s Happening Here?**
> 
> - The plugin looks for lines like `!iframe[myfile.html]` in your notes.
>     
> - It replaces that line with an iframe showing the specified HTML file.
>     

---

## **Step 4: Configure TypeScript**

### 4.1 Create `tsconfig.json`

Create a `tsconfig.json` file to tell TypeScript how to compile your code:

```json
{
  "compilerOptions": {
    "target": "ES2020",                  // Which JavaScript version to compile to
    "module": "ESNext",                  // Module system to use
    "moduleResolution": "node",          // Use Node.js style module resolution
    "strict": true,                      // Enable all strict type checks
    "esModuleInterop": true,             // Allow mixing CommonJS and ES modules
    "skipLibCheck": true,                // Skip checking library types
    "forceConsistentCasingInFileNames": true,
    "outDir": "."                         // Output files in root
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## **Step 5: Build the Plugin**

### 5.1 Update `package.json` Build Script

Add a build script to compile the plugin:

```json
"scripts": {
  "build": "esbuild src/main.ts --bundle --format=cjs --platform=node --external:obsidian --target=es2020 --outfile=main.js"
}
```

> 🛠 This command compiles `src/main.ts` into `main.js` using esbuild.

### 5.2 Run the Build

```bash
npm run build  # This will compile your TypeScript into JavaScript
```

If everything works, you'll see a new `main.js` file.

---

## **Step 6: Load the Plugin in Obsidian**

1. Open **Obsidian**.
    
2. Go to **Settings > Community Plugins**.
    
3. Disable **Safe Mode** if it’s on.
    
4. Click **"Load Unpacked Plugin"**.
    
5. Select your `nat-iframe-renderer` folder.
    
6. Toggle the plugin ON.
    

---

## **Step 7: Test the Plugin**

1. Create a new Markdown note.
    
2. Type the following:
    

```markdown
!iframe[my-chart.html]
```

3. Make sure `my-chart.html` exists in your vault.
    
4. When you preview the note, it should show the HTML inside an iframe.
    

---

## ✅ You Did It!

---

🌐 **Further Reading & Resources**
- [Obsidian Plugin Docs](https://docs.obsidian.md/Plugins)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [esbuild Guide](https://esbuild.github.io/)

