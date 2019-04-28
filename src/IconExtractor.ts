import {Log} from "./Log";
import fs from "fs-extra";
import path from "path";
import {blue} from "kleur";
import SVGO from "svgo";


/**
 * The config of a single icon to generate.
 */
interface IconCompilationConfig
{
    name: string;
    minify?: boolean;
}

/**
 * The mapping which icons should be generated and what icons from the library should be used.
 */
interface IconCompilationMapping
{
    [name: string]: string | IconCompilationConfig;
}

/**
 * The library of existing icons.
 */
interface IconsLibrary
{
    /**
     * Map of names to icon objects
     */
    [name: string]: {
        toSvg (): string;
    };
}


/**
 *
 */
class IconExtractor
{
    private targetDirectory: string;
    private log: Log;
    private featherIcons: IconsLibrary;
    private svgo: SVGO;


    /**
     *
     */
    constructor (featherIcons: IconsLibrary, targetDirectory: string)
    {
        this.targetDirectory = targetDirectory;
        this.log = new Log();
        this.featherIcons = featherIcons;
        this.svgo = new SVGO({
            plugins: [
                {removeViewBox: false},
            ],
        });
    }


    /**
     * Extracts all given icons
     */
    public async extract (mapping: IconCompilationMapping): Promise<void>
    {
        this.log.section("Clearing the output directory");
        this.clearStorageDir();
        this.log.done();

        this.log.section("Generating the icons");
        this.log.comment(`Generating the icons in ${blue(path.relative(process.cwd(), this.targetDirectory))}`);
        let copiedSuccessful = await this.copyIcons(mapping);

        if (copiedSuccessful)
        {
            this.log.allDone();
        }
        else
        {
            this.log.error("Not all icons were created successfully.");
        }
    }


    /**
     * Cleans the output dir where the files should be stored
     */
    private clearStorageDir (): void
    {
        fs.removeSync(this.targetDirectory);
        fs.ensureDirSync(this.targetDirectory);
    }


    /**
     * Copies all icons
     */
    public async copyIcons (mapping: IconCompilationMapping): Promise<boolean>
    {
        let hadError = false;

        for (let newName in mapping)
        {
            if (!mapping.hasOwnProperty(newName))
            {
                continue;
            }

            let icon: IconCompilationConfig = (typeof mapping[newName] !== "string")
                ? mapping[newName] as IconCompilationConfig
                : {
                    name: mapping[newName] as string,
                    minify: true,
                };

            this.log.iconStart(newName);
            let featherIcon = this.featherIcons[icon.name];

            if (undefined === featherIcon)
            {
                this.log.iconError(`Icon not found with feather name ${blue(icon.name)}.`);
                hadError = true;
                continue;
            }

            let svg = featherIcon.toSvg();

            if (false !== icon.minify)
            {
                this.log.iconStep("minify");
                svg = (await this.svgo.optimize(svg)).data;
            }

            this.log.iconStep("remove classes");
            svg = svg.replace(/ class="([^"]*)"/,
                (fullMatch: string, classesMatch: string) =>
                {
                    let classes = classesMatch.split(/\s+/);

                    return classes.includes("feather")
                        ? ""
                        : fullMatch;
                },
            );

            await fs.outputFile(path.join(this.targetDirectory, `${newName}.svg`), svg);
            this.log.iconDone();
        }

        return !hadError;
    }
}

module.exports = IconExtractor;
