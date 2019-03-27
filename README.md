Feather Icon Extractor
======================

Configuration
-------------

Import the configurator and pass the target directory (**attention:** the script will clear the directory before extraction!).

Then pass the mapping of icons as object:

*   key: `string` new name
*   value: one of 
    *   `string` – the name of the icon in feather-icons (will be minified).
    *   `{name: string, minify: boolean}` – name is the icon of the feather-icons, `minify` specifies whether the icon should be minified.


Implementing it in your project
-------------------------------

Add a executable file, which can look like this:

```js
#!/usr/bin/env node
const Extractor = require("@becklyn/feather-icons-extractor");
const path = require("path");

(new Extractor(path.join(__dirname, "../assets/icon"))).extract({
    add: "plus",
    blocked: "slash",
    help: {
        name: "help-circle",
        minify: false,
    },
    // ...
});

```
