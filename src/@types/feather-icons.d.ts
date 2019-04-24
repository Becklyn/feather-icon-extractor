declare namespace FeatherIcons
{
    /**
     * Attributes that can be passed when rendering an icon as SVG
     */
    interface RenderAttributes
    {
        [key: string]: null | boolean | string | number;
    }


    interface IconMap
    {
        /**
         * Map of names to icon objects
         */
        [name: string]: {
            toSvg (attrs?: RenderAttributes): string;
        };
    }
}
