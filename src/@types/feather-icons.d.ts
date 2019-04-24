declare namespace FeatherIcons
{
    /**
     * Attributes that can be passed when rendering an icon as SVG
     */
    interface RenderAttributes
    {
        [key: string]: null | boolean | string | number;
    }

    interface Icon
    {
        /**
         * Renders the icon as SVG
         */
        toSvg (attrs?: RenderAttributes): string;
    }

    export interface Library
    {
        /**
         * The map of all icons
         */
        icons: {
            [name: string]: Icon;
        };

        /**
         * Renders the icon by name
         *
         * @deprecated
         */
        toSvg: (name: string, atts?: RenderAttributes) => string;

        /**
         * Replaces all `data-feather` elements globally.
         */
        replace: (attrs?: RenderAttributes) => void;
    }
}

declare type FeatherIcons = FeatherIcons.Library;
