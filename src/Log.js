const {yellow, green, black, bgGreen, blue, red, bgRed, white} = require("kleur");

/**
 *
 */
class Log
{
    /**
     * Renders a section
     *
     * @param {string} text
     */
    section (text)
    {
        console.log("");
        console.log(yellow(text));
        console.log("");
    }


    /**
     *
     */
    done ()
    {
        console.log(`  ... ${green("done")}`);
    }


    /**
     *
     * @param {string} text
     */
    comment (text)
    {
        console.log(`  // ${text}`);
        console.log("");
    }


    /**
     *
     */
    allDone ()
    {
        console.log("");
        console.log("");
        console.log(bgGreen(black("                  ")));
        console.log(bgGreen(black(" All done.        ")));
        console.log(bgGreen(black("                  ")));
    }


    /**
     * @param {string} message
     */
    error (message)
    {
        console.log("");
        console.log("");
        let emptyLine = " ".repeat(message.length + 2);
        console.log(bgRed(white(emptyLine)));
        console.log(bgRed(white(` ${message} `)));
        console.log(bgRed(white(emptyLine)));
    }


    /**
     * @param {string} name
     */
    iconStart (name)
    {
        console.log(`  Generating icon ${blue(name)}.svg`)
    }


    /**
     * @param {string} message
     */
    iconStep (message)
    {
        console.log(`    -> ${message}`);
    }


    /**
     *
     */
    iconDone ()
    {
        console.log(`    ${green("done")}`);
        console.log("");
    }


    /**
     * @param {string} message
     */
    iconError (message)
    {
        console.log(`    ${red("Error")}: ${message}`);
    }
}

module.exports = Log;
