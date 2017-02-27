/**
 * Component x-page
 */

exports.tags = ["x-page"];
exports.priority = 0;

/**
 * Compile a node of the HTML tree.
 */
exports.compile = function(root, libs) {
    var key = root.attribs.key;
    if( !key ) {
        libs.fatal( "Missing mandatory attribute: `key`!" );
    }
    var src = "page." + key + ".htm";
    if( !libs.fileExists( src ) ) {
        libs.fatal( "File not found: \"" + src + "\"!" );
    }
    libs.addInclude( src );
    console.log( "Include Page: ", src );
    var node = libs.parseHTML(
        libs.readFileContent( src )
    );
    libs.compile( node );
    root.children = node.children;
    root.children.forEach(function (child) {
        if (child.name && child.name.toLowerCase() == 'header') {
            child.attribs.class = 'theme-color-bg-B2';
        }
    });
    root.attribs.class = 'x-page'; // theme-color-bg-B3';
    root.attribs.$$key = key;
    root.name = 'div';
};
