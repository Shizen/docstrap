"use strict";

/*
 *   (																									
 *   )\ )    )                                 )      	
 * (()/( ( /( (          (  (         (    ( /(      	
 *   /(_)))\()))\   (     )\))(    (   )(   )\()) (   	
 * (_)) ((_)\((_)  )\ ) ((_)()\   )\ (()\ ((_) )\  	
 * / __|| |(_)(_) _(_/( _(()((_) ((_) ((_)| |(_)((_) 	
 * \__ \| ' \ | || ' \))\ V  V // _ \| '_|| / / (_-< 	
 * |___/|_||_||_||_||_|  \_/\_/ \___/|_|  |_\_\ /__/	
 */

/**
 * @module template/publish
 * @type {*}
 * @desc
 * 
 * This is the primary export module for `shinstrap`.  `jsdoc` looks for this file in the referenced
 * `template/` directory when specified as a template in jsdoc's config file.
 * 
 * `shinstrap` is a fork of [`ink-docstrap`](https://github.com/docstrap/docstrap), and the bulk of 
 * *this* file remains untouched.  `shinstrap`, like `docstrap` before it follows the patterns set down 
 * in `jsdoc`'s default template.  See `jsdoc/templates/default/publish.js` (no link because, ironically,
 * jsdoc didn't comment their templates :) ).  
 * 
 * In addition to `docstrap`'s baseline of features, `shinstrap` primarily adds customization.  The order
 * and organization of default tags can be changed (from configuration settings), as well as new rules to 
 * allow for the rendering of custom tags.  The menus for tutorials can likewise be customized.  
 * `shinstrap` adds a few simple features to override the built-in templates even for complex reworks 
 * with a minimum amount of futzing.  Full details should be available in the `Usage.md` document in this
 * module's documentation (or in `design/Usage.md`) [{@tutorial Usage}].
 */

/*global env: true */

//#region Template Documentation

/**
 * @template container.tmpl
 * @memberof module:template/publish
 * @desc
 * The "root" level display template for `jsdoc`.  `container.tmpl` marhalls and displays most of the doclets which have their own landing page.
 * This includes modules, interfaces, classes, namespace, events, mixins, etc. displayed as `<article>`s.  This template is broken into two 
 * sections in `docstrap`, an "overview" section and what I am calling the body. 
 * 
 * Display of contents of the "overview" area are controlled in the `customizeOutput` area of the template's configuration by the specifier path:  
 * `"container:article:overview:..."`  
 * This specifier has three branches -- "class", "module-with-modules" and the default (every other case).  This is a legacy of `docstrap`
 *
 * The "body" portion of this template's display is controlled by the specifier path:  
 * `"container:article:body:default"`
 * 
 */

/**
 * @template method.tmpl
 * @memberof module:template/publish
 * @desc
 * One of the three workhorse templates for `jsdoc` display.  `method.tmpl` marshals and displays the common features of javascript entites
 * and is used for methods, classes (when not on their own landing page), typedefs, and events.  This is a common template to leverage for
 * complex custom tags as well.  By default it displays...    
 * `[ "description", "augments", "type", "this", "params", "details", "requires", "fires", "listens", "listeners", "exceptions", "returns", "examples" ]`
 * 
 */

/**
 * @template details.tmpl
 * @memberof module:template/publish
 * @desc
 * One of the three workhorse templates for `jsdoc` display.  `details.tmpl` marshals and displays the details of a doclet.  Specifically...  
 * `[ "properties", "version", "since", "inherits", "overrides", "implementations", "implements",
 *    "mixes", "deprecated", "author", "copyright", "license", "defaultvalue", "meta", "tutorials", "see", "todo" ]`
 * 
 */

 /**
 * @template tutorial.tmpl
 * @memberof module:template/publish
 * @desc
 * This template controls the presentation of tutorials by `jsdoc`.
 */

 /**
 * @template source.tmpl
 * @memberof module:template/publish
 * @desc
 * This template controls the presentation of source files by `jsdoc` (when `"outputSourceFiles": true`).
 */

 /**
  * @template attribs partial.scaffolded.attribs.tmpl
  * @memberof module:template/publish
  * @honors template.displayStyle {string} One of `buttons`, `badges` or `csl` describing how the doclet's attribs should be displayed.
  * @desc
  * The "first" scaffolded partial template, this template controls the display of attributes.  This partial is designed to fit in
  * with the display layout of docstrap, attempting to provide a "terse" easy rendering of the attributes for an entity.
  * 
  * By default, this template is called from `method.tmpl` and `members.tmpl`.
  */

 /**
  * @template KeyValue listing.scaffolded.kv.tmpl
  * @memberof module:template/publish
  * @honors {string} titleWrapper The tag to wrap the title in.
  * @honors {string} titleCaption A string with which to replace the normally auto-generated title text.  (See module:template/publish.handleScaffolding)
  * @honors {string} titleWrapperAttributes The attributes to associate with the title tag.
  * @honors {string} usePartial The template to display the tag's value with.
  * @honors {string} usePartialOnField When `usePartial` is set, allows the specification of which field on the doclet to supply to the 
  * partial as its `data`.
  * @honors {string} wrapper If `usePartial` is *not set*, `wrapper` indicates the tag in which to wrap the value of this listing.
  * @honors {string} wrapperAttributes The attributes to associate with the wrapping tag.
  * @desc
  * This template handles the display of key-value pairs.  For instance,  
  *     Type: {Object}
  * 
  */

/**
  * @template General listing.scaffolded.general.tmpl
  * @memberof module:template/publish
  * @honors {string} entryWrapper The tag which the entire entry should be wrapped in.  For situations where you want to wrap both the title and
  * the contents.  For example, when making a `<details>` entry or a `<fieldset>` entry.
  * @honors {string} entryWrapperAttributes The attributes which should be rendered for the entityWrapper.  Only valid if entityWrapper has a 
  * value.
  * @honors {boolean} suppressTitle If true, no title will be generated.  This causes `title`, `titleCaption` and `titleAttributes` to be ignored.
  * @honors {string} outerTitleWrapper The "outer" wrapper for the title (title only supports two "tiers" of wrappers).
  * @honors {string} outerTitleAttributes The attributes to associate with the outer title tag.
  * @honors {string} titleWrapper The tag to wrap the title in.
  * @honors {string} titleCaption A string with which to replace the normally auto-generated title text.  (See module:template/publish.handleScaffolding)
  * @honors {object} titleContextPluralize Causes the title to be pluralized if the doclet is an array with more than one member.  This object
  * has two fields--`singular` and `plural`, the value for each is used as the title in their respective cases.
  * @honors {string} titleWrapperAttributes The attributes to associate with the title tag.
  * @honors {boolean} [suppressValue=false] If true, no value will be display for this entry.  This causes the various wrapper and use* 
  * descriptors to be ignored.
  * @honors {string} outermostWrapper `listing.scaffolded.general.tmpl` allows for up to three tiers of embedded html wrappers.  
  * This is the outermost wrapper.
  * @honors {string} outermostWrapperAttributes The attributes to assign to the outermostWrapper.
  * @honors {string} outerWrapper The "second tier" or outer html wrapper for an entry value.
  * @honors {string} outerWrapperAttributes The attributes to assign to the outerWrapper.
  * @honors {string} wrapper If `usePartial` is *not set*, `wrapper` indicates the tag in which to wrap the value of this listing.
  * @honors {string} wrapperAttributes The attributes to associate with the wrapping tag.
  * @honors {string} usePartial The template to display the tag's value with.
  * @honors {string} usePartialOnField When `usePartial` is set, allows the specification of which field on the doclet to supply to the 
  * partial as its `data`.
  * @honors {string} usePerItemPartial In the event that the entry's value is an array, `usePerItemPartial` allows the specification
  * of a partial template to be used *on each value* in this entry's value array.  This setting is overridden by `usePartial`.
  * @honors {object} perItemMapPartial If set, this setting allows the specification of an object, where each field name in the object is an
  * expression, which if it evaluates to true will cause this template to use as a partial the value of that field.  Conditions are tested in 
  * order and used on a first found basis.  If a "default" field is specified, it will be used in the event none of the other conditions 
  * evaluate to true.  `usePartial` and `usePerItemPartial` both override this setting.
  * @honors {string} alternateHandler 
  * @honors {array} itemMarshalling :advanced: This is an array of view helpers and parameters to execute on each entry's value before 
  * rendering it.  The format for each call is `["functionName", "param1", "param2", ...]`.  An arbitrary number of marshal calls may be
  * made, and they will be executed in order (e.g. `itemMarshalling: [ [ "linkto", "", "" ] ]`).  Param specifications are relative to the 
  * entry value itself (for brevity), so `""` references the entry value itself, and "kind" would reference `data.kind` (for instance).
  * @honors {object} find :advanced:
  * @honors {object} validate :advanced:
  * @desc
  * This is the general case listing handler for `shinstrap`.
  */
//#endregion

var template = require('jsdoc/template'),
  doop = require('jsdoc/util/doop'),
  fs = require('jsdoc/fs'),
  _ = require('underscore'),
  path = require('jsdoc/path'),

  taffy = require('taffydb').taffy,
  handle = require('jsdoc/util/error').handle,
  helper = require('jsdoc/util/templateHelper'),
  moment = require("moment"),
  htmlsafe = helper.htmlsafe,
  sanitizeHtml = require('sanitize-html'),
  linkto = helper.linkto,
  resolveAuthorLinks = helper.resolveAuthorLinks,
  scopeToPunc = helper.scopeToPunc,
  hasOwnProp = Object.prototype.hasOwnProperty,
  conf = env.conf.templates || {},
  shinHelpers = require("./shin-utils")(conf),
  data,
  view,
  outdir = env.opts.destination,
  searchEnabled = conf.search !== false;

var globalUrl = helper.getUniqueFilename('global');
var indexUrl = helper.getUniqueFilename('index');

var navOptions = {
  includeDate: conf.includeDate !== false,
  logoFile: conf.logoFile,
  systemName: conf.systemName || "Documentation",
  navType: conf.navType || "vertical",
  footer: conf.footer || "",
  copyright: conf.copyright || "",
  theme: conf.theme || "simplex",
  syntaxTheme: conf.syntaxTheme || "default",
  linenums: conf.linenums,
  collapseSymbols: conf.collapseSymbols || false,
  inverseNav: conf.inverseNav,
  outputSourceFiles: conf.outputSourceFiles === true,
  sourceRootPath: conf.sourceRootPath,
  disablePackagePath: conf.disablePackagePath,
  outputSourcePath: conf.outputSourcePath,
  dateFormat: conf.dateFormat,
  analytics: conf.analytics || null,
  methodHeadingReturns: conf.methodHeadingReturns === true,
  sort: conf.sort,
  search: searchEnabled
};
var searchableDocuments = {};

var navigationMaster = {
  index: {
    title: navOptions.systemName,
    link: indexUrl,
    members: []
  },
  namespace: {
    title: "Namespaces",
    link: helper.getUniqueFilename("namespaces.list"),
    members: []
  },
  module: {
    title: "Modules",
    link: helper.getUniqueFilename("modules.list"),
    members: []
  },
  class: {
    title: "Classes",
    link: helper.getUniqueFilename('classes.list'),
    members: []
  },

  mixin: {
    title: "Mixins",
    link: helper.getUniqueFilename("mixins.list"),
    members: []
  },
  event: {
    title: "Events",
    link: helper.getUniqueFilename("events.list"),
    members: []
  },
  interface: {
    title: "Interfaces",
    link: helper.getUniqueFilename("interfaces.list"),
    members: []
  },
  tutorial: {
    title: "Tutorials",
    link: helper.getUniqueFilename("tutorials.list"),
    members: []
  },
  global: {
    title: "Global",
    link: globalUrl,
    members: []

  },
  external: {
    title: "Externals",
    link: helper.getUniqueFilename("externals.list"),
    members: []
  }
};

//----------------------------------------------------
// Helper function wrappers used by `docstrap` for `view`
//#region view helper (wrapper declations)
function find(spec) {
  return helper.find(data, spec);
}

function tutoriallink(tutorial) {
  return helper.toTutorial(tutorial, null, {
    tag: 'em',
    classname: 'disabled',
    prefix: 'Tutorial: '
  });
}

function getAncestorLinks(doclet) {
  return helper.getAncestorLinks(data, doclet);
}

function hashToLink(doclet, hash) {
  if (!/^(#.+)/.test(hash)) {
    return hash;
  }

  var url = helper.createLink(doclet);

  url = url.replace(/(#.+|$)/, hash);
  return '<a href="' + url + '">' + hash + '</a>';
}

//#endregion
// End view helper wrapping
//----------------------------------------------------


//----------------------------------------------------
// Task utilities for `docstrap`
//#region task utilities
function needsSignature(doclet) {
  var needsSig = false;

  // function and class definitions always get a signature
  if (doclet.kind === 'function' || doclet.kind === 'class') {
    needsSig = true;
  }
  // typedefs that contain functions get a signature, too
  else if (doclet.kind === 'typedef' && doclet.type && doclet.type.names &&
    doclet.type.names.length) {
    for (var i = 0, l = doclet.type.names.length; i < l; i++) {
      if (doclet.type.names[i].toLowerCase() === 'function') {
        needsSig = true;
        break;
      }
    }
  }

  return needsSig;
}

function addSignatureParams(f) {
  var optionalClass = 'optional';
  var params = helper.getSignatureParams(f, optionalClass);

  f.signature = (f.signature || '') + '(';

  for (var i = 0, l = params.length; i < l; i++) {
    var element = params[i];
    var seperator = (i > 0) ? ', ' : '';

    if (!new RegExp("class=[\"|']"+optionalClass+"[\"|']").test(element)) {
      f.signature += seperator + element;
    } else {
      var regExp = new RegExp("<span class=[\"|']"+optionalClass+"[\"|']>(.*?)<\\/span>", "i");
      f.signature += element.replace(regExp, " $`["+seperator+"$1$']");
    }

  }

  f.signature += ')';
}

function addSignatureReturns(f) {
  if (navOptions.methodHeadingReturns) {
    var returnTypes = helper.getSignatureReturns(f);

    f.signature = '<span class="signature">' + (f.signature || '') + '</span>' + '<span class="type-signature">' + (returnTypes.length ? ' &rarr; {' + returnTypes.join('|') + '}' : '') + '</span>';
  }
  else {
    f.signature = f.signature || '';
  }
}

function addSignatureTypes(f) {
  var types = helper.getSignatureTypes(f);

  f.signature = (f.signature || '') + '<span class="type-signature">' + (types.length ? ' :' + types.join('|') : '') + '</span>';
}

function addAttribs(f) {
  var attribs = helper.getAttribs(f);
  f.attribs = attribs;
  //Shin: Moved to `partial.scaffolded.attribs.tmpl`
}

function shortenPaths(files, commonPrefix) {
  //	// always use forward slashes
  //	var regexp = new RegExp( '\\\\', 'g' );
  //
  //	var prefix = commonPrefix.toLowerCase().replace( regexp, "/" );
  //
  //	Object.keys( files ).forEach( function ( file ) {
  //		files[file].shortened = files[file]
  //			.resolved
  //			.toLowerCase()
  //			.replace( regexp, '/' )
  //			.replace( prefix, '' );
  //	} );

  Object.keys(files).forEach(function(file) {
    files[file].shortened = files[file].resolved.replace(commonPrefix, '')
    // always use forward slashes
    .replace(/\\/g, '/');
  });


  return files;
}

function getPathFromDoclet(doclet) {
  if (!doclet.meta) {
    return;
  }

  return path.normalize(doclet.meta.path && doclet.meta.path !== 'null' ?
    doclet.meta.path + '/' + doclet.meta.filename :
    doclet.meta.filename);
}

function searchData(html) {
  var startOfContent = html.indexOf("<div class=\"container\">");
  if (startOfContent > 0) {
    var startOfSecondContent = html.indexOf("<div class=\"container\">", startOfContent + 2);
    if (startOfSecondContent > 0) {
      startOfContent = startOfSecondContent;
    }
    html = html.slice(startOfContent);
  }
  var endOfContent = html.indexOf("<span class=\"copyright\">");
  if (endOfContent > 0) {
    html = html.substring(0, endOfContent);
  }
  var stripped = sanitizeHtml(html, {allowedTags: [], allowedAttributes: []});
  stripped = stripped.replace(/\s+/g, ' ');
  return stripped;
}
//#endregion
// "End" task utilities declarations...
// In that the generate* functions are more core functionality ;)
//----------------------------------------------------

function generate(docType, title, docs, filename, resolveLinks) {
  resolveLinks = resolveLinks === false ? false : true;

  var docData = {
    title: title,
    docs: docs,
    docType: docType
  };

  var outpath = path.join(outdir, filename),
    html = view.render('container.tmpl', docData);

  if (resolveLinks) {
    html = helper.resolveLinks(html); // turn {@link foo} into <a href="foodoc.html">foo</a>
  }

  if (searchEnabled) {
    searchableDocuments[filename] = {
      "id": filename,
      "title": title,
      "body": searchData(html)
    };
  }

  fs.writeFileSync(outpath, html, 'utf8');
}


function generateSourceFiles(sourceFiles) {
  Object.keys(sourceFiles).forEach(function(file) {
    var source;
    // links are keyed to the shortened path in each doclet's `meta.shortpath` property
    var sourceOutfile = helper.getUniqueFilename(sourceFiles[file].shortened);
    helper.registerLink(sourceFiles[file].shortened, sourceOutfile);

    try {
      source = {
        kind: 'source',
        code: helper.htmlsafe(fs.readFileSync(sourceFiles[file].resolved, 'utf8'))
      };
    } catch (e) {
      handle(e);
    }

    generate('source', 'Source: ' + sourceFiles[file].shortened, [source], sourceOutfile,
      false);
  });
}

/**
 * Look for classes or functions with the same name as modules (which indicates that the module
 * exports only that class or function), then attach the classes or functions to the `module`
 * property of the appropriate module doclets. The name of each class or function is also updated
 * for display purposes. This function mutates the original arrays.
 *
 * @private
 * @param {Array.<module:jsdoc/doclet.Doclet>} doclets - The array of classes and functions to
 * check.
 * @param {Array.<module:jsdoc/doclet.Doclet>} modules - The array of module doclets to search.
 */
function attachModuleSymbols(doclets, modules) {
  var symbols = {};

  // build a lookup table
  doclets.forEach(function(symbol) {
    symbols[symbol.longname] = symbols[symbol.longname] || [];
    symbols[symbol.longname].push(symbol);
  });

  return modules.map(function(module) {
    if (symbols[module.longname]) {
      module.modules = symbols[module.longname]
      // Only show symbols that have a description. Make an exception for classes, because
      // we want to show the constructor-signature heading no matter what.
      .filter(function(symbol) {
        return symbol.description || symbol.kind === 'class';
      })
        .map(function(symbol) {
          symbol = doop(symbol);

          if (symbol.kind === 'class' || symbol.kind === 'function') {
            symbol.name = symbol.name.replace('module:', '(require("') + '"))';
          }

          return symbol;
        });
    }
  });
}

/**
 * Create the navigation sidebar.
 * @param {object} members The members that will be used to create the sidebar.
 * @param {array<object>} members.classes
 * @param {array<object>} members.externals
 * @param {array<object>} members.globals
 * @param {array<object>} members.mixins
 * @param {array<object>} members.interfaces
 * @param {array<object>} members.modules
 * @param {array<object>} members.namespaces
 * @param {array<object>} members.tutorials
 * @param {array<object>} members.events
 * @return {string} The HTML for the navigation sidebar.
 */
function buildNav(members) {

  var seen = {};
  var nav = navigationMaster;
  if (members.modules.length) {

    members.modules.forEach(function(m) {
      if (!hasOwnProp.call(seen, m.longname)) {

        nav.module.members.push(linkto(m.longname, m.longname.replace("module:", "")));
      }
      seen[m.longname] = true;
    });
  }

  if (members.externals.length) {

    members.externals.forEach(function(e) {
      if (!hasOwnProp.call(seen, e.longname)) {

        nav.external.members.push(linkto(e.longname, e.name.replace(/(^"|"$)/g, '')));
      }
      seen[e.longname] = true;
    });
  }

  if (members.classes.length) {

    members.classes.forEach(function(c) {
      if (!hasOwnProp.call(seen, c.longname)) {

        nav.class.members.push(linkto(c.longname, c.longname.replace("module:", "")));
      }
      seen[c.longname] = true;
    });

  }

  if (members.events.length) {

    members.events.forEach(function(e) {
      if (!hasOwnProp.call(seen, e.longname)) {

        nav.event.members.push(linkto(e.longname, e.longname.replace("module:", "")));
      }
      seen[e.longname] = true;
    });

  }

  if (members.namespaces.length) {

    members.namespaces.forEach(function(n) {
      if (!hasOwnProp.call(seen, n.longname)) {

        nav.namespace.members.push(linkto(n.longname, n.longname.replace("module:", "")));
      }
      seen[n.longname] = true;
    });

  }

  if (members.mixins.length) {

    members.mixins.forEach(function(m) {
      if (!hasOwnProp.call(seen, m.longname)) {

        nav.mixin.members.push(linkto(m.longname, m.longname.replace("module:", "")));
      }
      seen[m.longname] = true;
    });

  }

  if (members.interfaces && members.interfaces.length) {

    members.interfaces.forEach(function(m) {
      if (!hasOwnProp.call(seen, m.longname)) {

        nav.interface.members.push(linkto(m.longname, m.longname.replace("module:", "")));
      }
      seen[m.longname] = true;
    });

  }

  if (members.tutorials.length) {

    members.tutorials.forEach(function(t) {

      nav.tutorial.members.push(tutoriallink(t.name));
    });

  }

  if (members.menu) {
    nav.menu = {};
    for(var menuName in members.menu) {
      nav.menu[menuName] = {
        title: conf.customizeOutput.menus[menuName].title,
        link: helper.getUniqueFilename(menuName + ".list") // fallback page
      };
      nav.menu[menuName].members = [];
      if(members.menu[menuName].length) {
        members.menu[menuName].forEach(function (t) {
          nav.menu[menuName].members.push(tutoriallink(t.name));
        });
      }
    }
  }

  if (members.globals.length) {
    members.globals.forEach(function(g) {
      if (g.kind !== 'typedef' && !hasOwnProp.call(seen, g.longname)) {

        nav.global.members.push(linkto(g.longname, g.longname.replace("module:", "")));
      }
      seen[g.longname] = true;
    });

    // even if there are no links, provide a link to the global page.
    if (nav.global.members.length === 0) {
      nav.global.members.push(linkto("global", "Global"));
    }
  }

  var topLevelNav = [];
  _.each(nav, function(entry, name) {
    if (name !== "menu" && entry.members.length > 0 && name !== "index") {
      topLevelNav.push({
        title: entry.title,
        link: entry.link,
        members: entry.members
      });
    } else if (name === "menu") {
      for(var menuName in entry) {
        if(entry[menuName].members.length > 0) {
          topLevelNav.push({
            title: entry[menuName].title,
            link: entry[menuName].link,
            members: entry[menuName].members
          });
        }
      }
    }
  });
  nav.topLevelNav = topLevelNav;
}

/**
 * @desc
 * This is the primary entry point into `docstrap` (and `shinstrap`).  
 @param {TAFFY} taffyData See <http://taffydb.com/>.
 @param {object} opts
 @param {Tutorial} tutorials
 */
exports.publish = function(taffyData, opts, tutorials) {
  data = taffyData;

  conf['default'] = conf['default'] || {};
  var def = require("./defaults.json");
  if(conf.customizeOutput) {
    shinHelpers.leafMerge(conf.customizeOutput, def);
  } else {
    conf.customizeOutput = def;
  }

  var templatePath = opts.template;
  /**
   * @inner
   * @namespace view
   * @desc
   * This is the `jsdoc` template handler.  It deals with and acts as the namespace for all templates executed
   * by `shinstrap` in pursuit of rendering documentation for the doclets generated by jsdoc.
   */
  view = new template.Template(templatePath + '/tmpl');

  // claim some special filenames in advance, so the All-Powerful Overseer of Filename Uniqueness
  // doesn't try to hand them out later
  //	var indexUrl = helper.getUniqueFilename( 'index' );
  // don't call registerLink() on this one! 'index' is also a valid longname

  //	var globalUrl = helper.getUniqueFilename( 'global' );
  helper.registerLink('global', globalUrl);

  // set up templating
  /**
   * @desc
   * The layout to use for all templates rendered via `shinstrap`.
   */
  view.layout = conf['default'].layoutFile ?
    path.getResourcePath(path.dirname(conf['default'].layoutFile),
    path.basename(conf['default'].layoutFile) ) : 'layout.tmpl';

  //! ShinExt: Patch `partial()` to allow for overrides & custom `tmpl` files.
  /**
   * @desc
   * This is an instance "patch" override of `jsdoc`'s core `Template` class's `partial()` function.  This patch
   * implements the `templateOverrideDir` functionality.  `partial()` in turn handles the caching and invocation of 
   * a template in `jsdoc`. {@see jsdoc/template.Template#partial}
   * @algorithm
   * Implemented as an instance patch to avoid conflict with other parts of the `jsdoc` system.
   * @param {string} _file Name of the template file to render.
   * @param {object} _data If the template is *not* scaffolded this is the doclet or doclet-shard (typically called
   * `data` in this framework) which is to be rendered.  A "scaffolded" template expects an object with, minimally
   * the doclet/data in a field called `contents` and the rendering rules in a field called `scaffolding`. 
   * @todo Originally I thought this made more sense and was less invasive as an instance override, but now I'm 
   * coming around to the idea that it should probably be a direct patch on `Template`, given I really am the only
   * client of that class in the framework.
   */
  view.partial = function overridePartial(_file, _data) {
    // The issue here, primarily is that I haven't analyzed the code to know if I specialize Template if something will break
    // So we're going to do a simple intercept 8)

    // The reason for this intercept is to insert a new search directory for templates.
    if(conf.templateOverrideDir) {
      var file = path.resolve(this.path, _file);
      // There is an override directory
      if (!(file in this.cache)) {
        // And this `_file` is not already in the cache...
        
        // We could use getResourcePath to do the search, but this is maybe overly broad.
        var override = path.join(process.cwd(), conf.templateOverrideDir, _file);
        if(fs.existsSync(override)) {
          console.log("Overriding %s with %s", _file, override);
          // Override detected, we'll cache our override under the default name
          this.cache[file] = this.load(override);
        }
      }
    }
    // This will repeat the cache test, but it's *slightly* less intrusive then just replacing `partial()` entirely.
    return template.Template.prototype.partial.call(this, _file, _data);
  };
  // view.rules = conf.customizeOutput.tags || {}; // Here I could do defaults

  function justTheFilenames(_asPaths) {
    var result = [];
    if(Array.isArray(_asPaths)) {
      _asPaths.forEach(function(_el) { result.push(path.basename(_el)); });
    } else if(_asPaths) {
      result.push(path.basename(_asPaths));
    }
    return result;
  }
  /**
   * @desc
   * The supplemental css resource file.  Yes, we only allow one.  Discovered via `jsdoc`'s standard resource discovery
   * mechanism.
   */
  view.supplementalCSS = justTheFilenames(conf.supplementalCSS);  // We don't verify existance here, although we do when we try to copy them

  view.supplementalJS = justTheFilenames(conf.supplementalJS);


  if(conf.favicon) {
    var Datauri = require('datauri');
    // Search paths
    var p = path.getResourcePath(path.dirname(conf.favicon), path.basename(conf.favicon));
    if(p) {
      var datauri = new Datauri(p);
      view.favicon = datauri;
    } else {
      // warn("Failed to find specified favicon `%s`", conf.favicon);
    }
  }

  // set up tutorials for helper
  helper.setTutorials(tutorials);

  data = helper.prune(data);

  var sortOption = navOptions.sort === undefined ? opts.sort : navOptions.sort;
  sortOption = sortOption === undefined ? true : sortOption;
  sortOption = sortOption === true ? 'longname, version, since' : sortOption;
  if (sortOption) {
    data.sort(sortOption);
  }
  helper.addEventListeners(data);

  var sourceFiles = {};
  var sourceFilePaths = [];
  data().each(function(doclet) {
    doclet.attribs = '';

    if (doclet.examples) {
      doclet.examples = doclet.examples.map(function(example) {
        var caption, lang;

        // allow using a markdown parser on the examples captions (surrounded by useless HTML p tags)
        if (example.match(/^\s*(<p>)?<caption>([\s\S]+?)<\/caption>(\s*)([\s\S]+?)(<\/p>)?$/i)) {
          caption = RegExp.$2;
          example = RegExp.$4 + (RegExp.$1 ? '' : RegExp.$5);
        }

        var lang = /{@lang (.*?)}/.exec(example);

        if (lang && lang[1]) {
          example = example.replace(lang[0], "");
          lang = lang[1];

        } else {
          lang = null;
        }

        return {
          caption: caption || '',
          code: example,
          lang: lang || "javascript"
        };
      });
    }
    if (doclet.see) {
      doclet.see.forEach(function(seeItem, i) {
        doclet.see[i] = hashToLink(doclet, seeItem);
      });
    }

    // build a list of source files
    var sourcePath;
    if (doclet.meta) {
      sourcePath = getPathFromDoclet(doclet);
      sourceFiles[sourcePath] = {
        resolved: sourcePath,
        shortened: null
      };

      //Check to see if the array of source file paths already contains
      // the source path, if not then add it
      if (sourceFilePaths.indexOf(sourcePath) === -1) {
          sourceFilePaths.push(sourcePath)
      }
    }
  });

  // update outdir if necessary, then create outdir
  var packageInfo = (find({
    kind: 'package'
  }) || [])[0];
  if (navOptions.disablePackagePath !== true && packageInfo && packageInfo.name) {
    if (packageInfo.version) {
      outdir = path.join(outdir, packageInfo.name, packageInfo.version);
    } else {
      outdir = path.join(outdir, packageInfo.name);
    }
  }
  fs.mkPath(outdir);

  /**
   * 
   * @remarks
   * Unnatural param ordering to allow for ease of `partial` binding.  `lodash` has `partialRight`.
   * @param {string} _sStaticDirName The destination directory in the `docs/` into which this file should be copied.
   * @param {string} _sName The resource path.
   */
  function grabResource(_sStaticDirName, _sName) { 
    var sResource = path.getResourcePath(path.dirname(_sName),
    path.basename(_sName));
    
    if(sResource) { // If the resource exists...
      var toFile = sResource.replace(path.dirname(sResource), path.join(outdir, _sStaticDirName));
      var toDir = fs.toDir( toFile );
      fs.mkPath( toDir );
      fs.copyFileSync( sResource, '', toFile);
    } else {
      // warn("Could not find resource %s (%s)", _sName, _sStaticDirName);
    }
  }

	// copy the template's static files to outdir
	var fromDir = path.join( templatePath, 'static' );
  var staticFiles = fs.ls( fromDir, 3 );
  //! Shin: Add in supplementalCSS if present
  if(conf.supplementalCSS) {
    if(conf.supplementalCSS.forEach) {
      conf.supplementalCSS.forEach(_.partial(grabResource, "styles"));
    } else {
      grabResource("styles", conf.supplementalCSS);
    }
  }
  
  //! Shin: Add in supplementalJS if present
  if(conf.supplementalJS) {
    if(conf.supplementalJS.forEach) {
      conf.supplementalJS.forEach(_.partial(grabResource, "scripts"));
    } else {
      grabResource("scripts", conf.supplementalJS);
    }
  }

  //! Shin: Add in supplementalFonts if present
  if(conf.supplementalFonts) {
    if(conf.supplementalFonts.forEach) {
      conf.supplementalFonts.forEach(_.partial(grabResource, "fonts"));
    } else {
      grabResource("fonts", conf.supplementalFonts);
    }
  }

  //# Copy over static files used by the auto-genned documentation
  // - images
  // - scripts
  // - fonts
  // - etc.
	staticFiles.forEach( function ( fileName ) {
		var toFile = fileName.replace( fromDir, outdir );
		var toDir = fs.toDir( toFile );
		fs.mkPath( toDir );
		fs.copyFileSync( fileName, '', toFile );
	} );

    // copy user-specified static files to outdir
    var staticFilePaths;
    var staticFileFilter;
    var staticFileScanner;
    if (conf.default.staticFiles) {
        // The canonical property name is `include`. We accept `paths` for backwards compatibility
        // with a bug in JSDoc 3.2.x.
        staticFilePaths = conf.default.staticFiles.include ||
            conf.default.staticFiles.paths ||
            [];
        staticFileFilter = new (require('jsdoc/src/filter')).Filter(conf.default.staticFiles);
        staticFileScanner = new (require('jsdoc/src/scanner')).Scanner();

        staticFilePaths.forEach(function(filePath) {
            var extraStaticFiles = staticFileScanner.scan([filePath], 10, staticFileFilter);

            extraStaticFiles.forEach(function(fileName) {
                var sourcePath = fs.toDir(filePath);
                var toDir = fs.toDir( fileName.replace(sourcePath, outdir) );
                fs.mkPath(toDir);
                fs.copyFileSync(fileName, toDir);
            });
        });
    }

  if (sourceFilePaths.length) {
    var payload = navOptions.sourceRootPath;
    if (!payload) {
      payload = path.commonPrefix(sourceFilePaths);
    }
    sourceFiles = shortenPaths(sourceFiles, payload);
  }
  data().each(function(doclet) {
    var url = helper.createLink(doclet);
    helper.registerLink(doclet.longname, url);

    // add a shortened version of the full path
    var docletPath;
    if (doclet.meta) {
      docletPath = getPathFromDoclet(doclet);
      if (!_.isEmpty(sourceFiles[docletPath])) {
        docletPath = sourceFiles[docletPath].shortened;
        if (docletPath) {
          doclet.meta.shortpath = docletPath;
        }
      }
    }
  });

  data().each(function(doclet) {
    var url = helper.longnameToUrl[doclet.longname];

    if (url.indexOf('#') > -1) {
      doclet.id = helper.longnameToUrl[doclet.longname].split(/#/).pop();
    } else {
      doclet.id = doclet.name;
    }

    if (needsSignature(doclet)) {
      addSignatureParams(doclet);
      addSignatureReturns(doclet);
      addAttribs(doclet);
    }
  });

  // do this after the urls have all been generated
  data().each(function(doclet) {
    doclet.ancestors = getAncestorLinks(doclet);

    if (doclet.kind === 'member') {
      addSignatureTypes(doclet);
      addAttribs(doclet);
    }

    if (doclet.kind === 'constant') {
      addSignatureTypes(doclet);
      addAttribs(doclet);
      doclet.kind = 'member';
    }

    if(conf.customizeOutput.doclets && conf.customizeOutput.doclets[doclet.kind] && conf.customizeOutput.doclets[doclet.kind].processing) {
      conf.customizeOutput.doclets[doclet.kind].processing.map(function(_fnName) {
        // weaksauce; also at the point where I'm doing this, maybe I should just have an array of processing fragments?  The temptation 
        // for users to break the system by overloading this "feature" with excess code... idk
        eval(_fnName+"(doclet)");
      });
    }
  });

  // This is where docstrap generates the list of linked documents for the menus
  var members = helper.getMembers(data);

  // menu members...
  var used = [];
  if(conf.customizeOutput.menus) {
    // No error handling
    members.menu = {};
    for(var menuName in conf.customizeOutput.menus) {
      members.menu[menuName] = [];
      var menuSettings = conf.customizeOutput.menus[menuName];
      for(var idx in conf.customizeOutput.menus[menuName].members) {
        var tut = _.findWhere(tutorials.children, { longname: conf.customizeOutput.menus[menuName].members[idx] });
        if(tut) {
          used.push(tut); // Clear from "normal" tutorial list
          // Filter by access specification
          if(menuSettings.access) {
            // public, private, protected, undefined or all
            if(opts.access === "public" && menuSettings.access !== "public") {
              continue;
            } 
            if(opts.access === "private" && menuSettings.access !== "private") {
              continue;
            } 
            if(opts.access === "protected" && menuSettings.access !== "protected") {
              continue;
            }
            if(opts.access === "undefined") {
              continue;
            }
            if(menuSettings.access === "private" && opts.private !== true && opts.access !== "all" && opts.access !== "private") {
              continue;
            }
          } 
          members.menu[menuName].push(tut);
        }
      }
    }
    // This could be faster :)
    members.tutorials = tutorials.children.filter(function(t) { return _.findWhere(used, { longname: t.longname }) === undefined; });
  } else {
    members.tutorials = tutorials.children;
  }


  //# Setup Template helpers
  /**
   * @func 
   * @redirect jsdoc/util/templateHelper.find
   * @see jsdoc/util/templateHelper.find
   */
  view.find = find;
  // var linktoProxy = function() {
  //   console.log("Linkto! (%s)", arguments[0]);
  //   return linkto(...arguments);
  // };
  /**
   * @func 
   * @redirect jsdoc/util/templateHelper.linkto
   * @see jsdoc/util/templateHelper.linkto
   */
  view.linkto = linkto;
  // view.linkto = linktoProxy;
  // view.contentOrLink = shinHelpers.buildLinktoProxy(linkto, htmlsafe);
  /**
   * @func 
   * @redirect jsdoc/util/templateHelper.resolveAuthorLinks
   * @see jsdoc/util/templateHelper.resolveAuthorLinks
   */
  view.resolveAuthorLinks = resolveAuthorLinks;
  /**
   * @func 
   * @redirect jsdoc/util/templateHelper.tutoriallink
   * @see jsdoc/util/templateHelper.tutoriallink
   */
  view.tutoriallink = tutoriallink;
  /**
   * @func 
   * @see `sanitize-html`
   */
  view.htmlsafe = htmlsafe;
  /**
   * @func 
   * @see `moment`
   */
  view.moment = moment;
  
  //## Shinstrap helpers
  /**
   * @func 
   * @redirect module:template/publish.utils.handleScaffolding
   * @see module:template/publish.utils.handleScaffolding
   */
  view.scaffoldPartial = shinHelpers.handleScaffolding;
  /**
   * @func 
   * @redirect module:template/publish.utils.scaffoldFromSpecifier
   * @see module:template/publish.utils.scaffoldFromSpecifier
   */
  view.scaffoldPartialBySpec = shinHelpers.scaffoldFromSpecifier;
  /**
   * @func 
   * @redirect module:template/publish.utils.resolveArrangement
   * @see module:template/publish.utils.resolveArrangement
   */
  view.resolveArrangement = shinHelpers.resolveArrangement;
  /**
   * @func 
   * @redirect module:template/publish.utils.marshalItemDisplay
   * @see module:template/publish.utils.marshalItemDisplay
   */
  view.marshalItemDisplay = shinHelpers.marshalItemDisplay;
  /**
   * @func 
   * @redirect module:template/publish.utils.renderDoclet
   * @see module:template/publish.utils.renderDoclet
   */
  view.renderDoclet = shinHelpers.renderDoclet;
  // view.namespacelink = shinHelpers.buildNamespaceLink;
  // view.resolveCSL = shinHelpers.buildCSL;

  //# Buildout members arrays for the nav menus
  // once for all
  buildNav(members);
  view.nav = navigationMaster;
  view.navOptions = navOptions;
  attachModuleSymbols(find({
      kind: ['class', 'function'],
      longname: {
        left: 'module:'
      }
    }),
    members.modules);

  //# Generate source files
  // only output pretty-printed source files if requested; do this before generating any other
  // pages, so the other pages can link to the source files
  if (navOptions.outputSourceFiles) {
    generateSourceFiles(sourceFiles);
  }

  if (members.globals.length) {
    generate('global', 'Global', [{
      kind: 'globalobj'
    }], globalUrl);
  }

  //# Setup menu fallback shims
  // some browsers can't make the dropdown work
  if (view.nav.module && view.nav.module.members.length) {
    generate('module', view.nav.module.title, [{
      kind: 'sectionIndex',
      contents: view.nav.module
    }], navigationMaster.module.link);
  }

  if (view.nav.class && view.nav.class.members.length) {
    generate('class', view.nav.class.title, [{
      kind: 'sectionIndex',
      contents: view.nav.class
    }], navigationMaster.class.link);
  }

  if (view.nav.namespace && view.nav.namespace.members.length) {
    generate('namespace', view.nav.namespace.title, [{
      kind: 'sectionIndex',
      contents: view.nav.namespace
    }], navigationMaster.namespace.link);
  }

  if (view.nav.mixin && view.nav.mixin.members.length) {
    generate('mixin', view.nav.mixin.title, [{
      kind: 'sectionIndex',
      contents: view.nav.mixin
    }], navigationMaster.mixin.link);
  }

  if (view.nav.interface && view.nav.interface.members.length) {
    generate('interface', view.nav.interface.title, [{
      kind: 'sectionIndex',
      contents: view.nav.interface
    }], navigationMaster.interface.link);
  }

  if (view.nav.external && view.nav.external.members.length) {
    generate('external', view.nav.external.title, [{
      kind: 'sectionIndex',
      contents: view.nav.external
    }], navigationMaster.external.link);
  }

  if (view.nav.tutorial && view.nav.tutorial.members.length) {
    generate('tutorial', view.nav.tutorial.title, [{
      kind: 'sectionIndex',
      contents: view.nav.tutorial
    }], navigationMaster.tutorial.link);
  }

  // Build fallback menu pages for custom menus
  if (view.nav.menu) {
    for(var menuName in view.nav.menu) {
      var menu = view.nav.menu[menuName];
      if(menu.members.length) {
        generate('tutorial', menu.title, [{
          kind: 'sectionIndex',
          contents: menu
        }], navigationMaster.menu[menuName].link);
      }
    }
  }

  // index page displays information from package.json and lists files
  var files = find({
      kind: 'file'
    }),
    packages = find({
      kind: 'package'
    });

  generate('index', 'Index',
    packages.concat(
      [{
        kind: 'mainpage',
        readme: opts.readme,
        longname: (opts.mainpagetitle) ? opts.mainpagetitle : 'Main Page'
      }]
    ).concat(files),
    indexUrl);

  // set up the lists that we'll use to generate pages
  var classes = taffy(members.classes);
  var modules = taffy(members.modules);
  var namespaces = taffy(members.namespaces);
  var mixins = taffy(members.mixins);
  var interfaces = taffy(members.interfaces);
  var externals = taffy(members.externals);

  for (var longname in helper.longnameToUrl) {
    if (hasOwnProp.call(helper.longnameToUrl, longname)) {
      var myClasses = helper.find(classes, {
        longname: longname
      });
      if (myClasses.length) {
        generate('class', 'Class: ' + myClasses[0].name, myClasses, helper.longnameToUrl[longname]);
      }

      var myModules = helper.find(modules, {
        longname: longname
      });
      if (myModules.length) {
        generate('module', 'Module: ' + myModules[0].name, myModules, helper.longnameToUrl[longname]);
      }

      var myNamespaces = helper.find(namespaces, {
        longname: longname
      });
      if (myNamespaces.length) {
        generate('namespace', 'Namespace: ' + myNamespaces[0].name, myNamespaces, helper.longnameToUrl[longname]);
      }

      var myMixins = helper.find(mixins, {
        longname: longname
      });
      if (myMixins.length) {
        generate('mixin', 'Mixin: ' + myMixins[0].name, myMixins, helper.longnameToUrl[longname]);
      }

      // This always fails.
      var myInterfaces = helper.find(interfaces, {
        longname: longname
      });
      if (myInterfaces.length) {
        generate('interface', 'Interface: ' +
         myInterfaces[0].name, myInterfaces, helper.longnameToUrl[longname]);
      }

      var myExternals = helper.find(externals, {
        longname: longname
      });
      if (myExternals.length) {
        generate('external', 'External: ' + myExternals[0].name, myExternals, helper.longnameToUrl[longname]);
      }
    }
  }

  // TODO: move the tutorial functions to templateHelper.js
  /**
   * @desc 
   * Render the html page for a tutorial
   * @private
   * @param {string} title The title for the tutorial.  This is either auto-generated by jsdoc from the file name
   * or pulled from a json config file.
   * @param {*} tutorial 
   * @param {*} filename 
   */
  function generateTutorial(title, tutorial, filename) {
    var tutorialData = {
      title: title,
      header: tutorial.title,
      content: tutorial.parse(),
      children: tutorial.children,
      docs: null
    };

    var tutorialPath = path.join(outdir, filename),
      html = view.render('tutorial.tmpl', tutorialData);

    // yes, you can use {@link} in tutorials too!
    html = helper.resolveLinks(html); // turn {@link foo} into <a href="foodoc.html">foo</a>

    if (searchEnabled) {
      searchableDocuments[filename] = {
        "id": filename,
        "title": title,
        "body": searchData(html)
      };
    }

    fs.writeFileSync(tutorialPath, html, 'utf8');
  }

  // tutorials can have only one parent so there is no risk for loops
  function saveChildren(node) {
    node.children.forEach(function(child) {
      generateTutorial('Tutorial: ' + child.title, child, helper.tutorialToUrl(child.name));
      saveChildren(child);
    });
  }

  function generateQuickTextSearch(templatePath, searchableDocuments, navOptions) {
      var data = {
          searchableDocuments: JSON.stringify(searchableDocuments),
          navOptions: navOptions
      };

      var tmplString = fs.readFileSync(templatePath + "/quicksearch.tmpl").toString(),
            tmpl = _.template(tmplString);

      var html = tmpl(data),
            outpath = path.join(outdir, "quicksearch.html");

      fs.writeFileSync(outpath, html, "utf8");
  }

  saveChildren(tutorials);

  if (searchEnabled) {
      generateQuickTextSearch(templatePath + '/tmpl', searchableDocuments, navOptions);
  }
};
