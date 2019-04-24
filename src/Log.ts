const {yellow, green, black, bgGreen, blue, red, bgRed, white} = require("kleur");

/**
 *
 */
export class Log
{
    /**
     * Renders a section
     */
    public section (text: string) : void
    {
        console.log("");
        console.log(yellow(text));
        console.log("");
    }


    /**
     *
     */
    public done () : void
    {
        console.log(`  ... ${green("done")}`);
    }


    /**
     *
     */
    public comment (text: string) : void
    {
        console.log(`  // ${text}`);
        console.log("");
    }


    /**
     *
     */
    public allDone () : void
    {
        console.log("");
        console.log("");
        console.log(bgGreen(black("                  ")));
        console.log(bgGreen(black(" All done.        ")));
        console.log(bgGreen(black("                  ")));
    }


    /**
     *
     */
    public error (message: string) : void
    {
        console.log("");
        console.log("");
        let emptyLine = " ".repeat(message.length + 2);
        console.log(bgRed(white(emptyLine)));
        console.log(bgRed(white(` ${message} `)));
        console.log(bgRed(white(emptyLine)));
    }


    /**
     *
     */
    public iconStart (name: string) : void
    {
        console.log(`  Generating icon ${blue(name)}.svg`)
    }


    /**
     *
     */
    public iconStep (message: string) : void
    {
        console.log(`    -> ${message}`);
    }


    /**
     *
     */
    public iconDone () : void
    {
        console.log(`    ${green("done")}`);
        console.log("");
    }


    /**
     *
     */
    public iconError (message: string) : void
    {
        console.log(`    ${red("Error")}: ${message}`);
    }
}
