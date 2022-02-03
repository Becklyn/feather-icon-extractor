2.2.0
=====

*   (internal) Use same changelog format as in all other Becklyn projects.
*   (improvement) Upgraded to the latest version of SVGO.
*   (improvement) Enabled `multipass` optimizations of SVGO.
*   (internal) Added new NPM scripts: `dev` and `test`.


2.1.0
=====

*   (improvement) Further simplified the internal IconsLibrary interface, so that possibly even more icon libraries are compatible.
*   (feature) `minify` is now optional and `true` by default.
*   (feature) Via the `svg` key custom SVG contents can now be passed instead of extracting it from feather by name. Omit the `name` parameter for this icon.


2.0.0
=====

*   (bc) `feather-icons` was removed from the project and is supposed to be loaded in the project itself.
*   (improvement) Port to TypeScript.

