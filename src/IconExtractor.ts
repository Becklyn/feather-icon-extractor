import {Log} from "./Log";
import fs from "fs-extra";
import path from "path";
import {blue} from "kleur";
import SVGO from "svgo";


interface IconConfig
{
    name: string;
    minify: boolean;
}

interface IconMapping
{
    [name: string]: string | IconConfig;
}


/**
 *
 */
class IconExtractor
{
    private targetDirectory: string;
    private log: Log;
    private featherIcons: FeatherIcons.IconMap;
    private svgo: SVGO;


    /**
     *
     */
    constructor (featherIcons: FeatherIcons.IconMap, targetDirectory: string)
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
    public async extract (mapping: IconMapping): Promise<void>
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
    public async copyIcons (mapping: IconMapping): Promise<boolean>
    {
        let hadError = false;

        for (let newName in mapping)
        {
            if (!mapping.hasOwnProperty(newName))
            {
                continue;
            }

            let icon: IconConfig = (typeof mapping[newName] !== "string")
                ? mapping[newName] as IconConfig
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

            if (icon.minify)
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
