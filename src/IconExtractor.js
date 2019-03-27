const fs = require("fs-extra");
const path = require("path");
const Log = require("./Log");
const {blue} = require("kleur");
const feather = require("feather-icons");
const SVGO = require("svgo");

/**
 * @typedef {Object.<string, string|{name: string, minify: boolean}>} IconMapping
 */


/**
 *
 */
class IconExtractor
{
    /**
     * @param {string} targetDirectory
     */
    constructor (targetDirectory)
    {
        /**
         * @private
         * @type {string}
         */
        this.targetDirectory = targetDirectory;

        /**
         * @private
         * @type {Log}
         */
        this.log = new Log();

        /**
         * @private
         * @type {SVGO}
         */
        this.svgo = new SVGO({
            plugins: [
                {removeViewBox: false},
            ],
        });
    }


    /**
     * Extracts all given icons
     *
     * @param mapping
     * @returns {Promise<void>}
     */
    async extract (mapping)
    {
        this.log.section("Clearing the output directory");
        this.clearStorageDir();
        this.log.done();

        this.log.section("Generating the icons");
        this.log.comment(`Generating the icons in ${blue(path.relative(process.cwd(), this.targetDirectory))}`);
        await this.copyIcons(mapping);
        this.log.allDone();
    }


    /**
     * @private
     */
    clearStorageDir ()
    {
        fs.removeSync(this.targetDirectory);
        fs.ensureDirSync(this.targetDirectory);
    }


    /**
     * Copies all icons
     *
     * @param {IconMapping} mapping
     * @returns {Promise<void>}
     */
    async copyIcons (mapping)
    {
        for (let newName in mapping)
        {
            if (!mapping.hasOwnProperty(newName))
            {
                continue;
            }

            let featherName = mapping[newName];
            let minify = true;

            if (typeof mapping[newName] !== "string")
            {
                newName = mapping[newName].name;
                minify = mapping[newName].minify;
            }

            this.log.iconStart(newName);
            let featherIcon = feather.icons[featherName];

            if (undefined === featherIcon)
            {
                this.log.iconError(`Icon not found with feather name ${blue(featherName)}.`);
                continue;
            }

            let svg = featherIcon.toSvg();

            if (minify)
            {
                this.log.iconStep("minify");
                svg = (await this.svgo.optimize(svg)).data;
            }

            this.log.iconStep("remove classes");
            svg = svg.replace(/ class="([^"]*)"/,
                (fullMatch, classesMatch) =>
                {
                    let classes = classesMatch.split(/\s+/);

                    return classes.includes("feather")
                        ? ""
                        : fullMatch;
                }
            );

            await fs.outputFile(path.join(this.targetDirectory, `${newName}.svg`), svg);
            this.log.iconDone();
        }
    }
}

module.exports = IconExtractor;
