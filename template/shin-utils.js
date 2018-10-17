
/**
 * @fileOverview 
 * This won't show up anywhere, but...
 * 
 * These are the helper functions introduced by me to supplement the features of `ink-docstrap` to "become" 
 * `shinstrap`.  There are still quite a few piecemeal code insertions in `publish.js` (I wasn't particularly 
 * trying to create an innoculated or patch apparent version).  This file contains my custom helpers and 
 * utilities in the same vein as jsdoc's own `templateHelpers.js`. (jsdoc/lib/jsdoc/util/templateHelper.js).
 * 
 *   (																									
 *   )\ )    )                                 )      	
 * (()/( ( /( (          (  (         (    ( /(      	
 *   /(_)))\()))\   (     )\))(    (   )(   )\()) (   	
 * (_)) ((_)\((_)  )\ ) ((_)()\   )\ (()\ ((_) )\  	
 * / __|| |(_)(_) _(_/( _(()((_) ((_) ((_)| |(_)((_) 	
 * \__ \| ' \ | || ' \))\ V  V // _ \| '_|| / / (_-< 	
 * |___/|_||_||_||_||_|  \_/\_/ \___/|_|  |_\_\ /__/		
 *
 * @author Shin <shin@shinworks.co>
 * @memberof module:template/publish
 * @param {object} conf Configuration object
 * 
 */

module.exports = function(conf) {

  var utils = {};

  utils.test = function test() {
    return "<p>Tested</p>";
  };
  
  /**
   * @desc 
   * This is the primary helper function for the new custom listing mechanism.  All listings are now routed through this method and, 
   * in conjunction with `listing.scaffolded.general.tmpl`, the capabilities of the custom listing declarations are enabled.
   * @tags Chokepoint, Shinzen, Listing-Display 
   * @tags chokepoint, test
   * @memberof module:template/publish
   * @param {object} _tmpl The template object for which this function is doing the scaffolding
   * @param {object} _doclet Doclet object being described
   * @param {object} _arrangement Describes how the listing should be displayed 
   * @param {string} _listing The portion of the doclet being documented
   * @param {string} _title The doclet title as understood in the current template.  *Not* the title of the listing being documented.
   * @returns {string} The rendered HTML for the doclet or doclet fragment passed in.
   */
  utils.handleScaffolding = function handleScaffolding(_tmpl, _doclet, _arrangement, _listing) {
    var rules = _arrangement.tags[_listing] || {};
    //# Gather
    var contents = _doclet[_listing];
    var bRequireLength = false;

    if(rules.find) {
      // if(rules.find.kind && rules.find.memberof) {
      //   contents = _tmpl.find({kind: rules.find.kind, memberof: eval(rules.find.memberof)});
      //   bRequireLength = true;
      // }
      // As always I shiver at the precedent of no error checking/validation in jsdoc
      var findSpec = {};
      bRequireLength = true;
      for(var key in rules.find) {
        // Because I'm not doing a real interpolator due to lazy. and bad.
        try {
          findSpec[key] = eval(rules.find[key]);
        } catch(e) {
          // If we get an error during eval, we'll assume you meant to treat the value literally
          findSpec[key] = rules.find[key];
        }
      }
      contents = _tmpl.find(findSpec);
    }

    if(rules.defer) {
      return _tmpl.partial(rules.defer, _doclet);
    } else {
      //# Validate
      if(!contents || !(rules.validate? eval(rules.validate) : true) || (bRequireLength && !contents.length)) {   // contents.forEach
        return "";
      }

      //# Display
      var displayTitle = rules.titleCaption || _listing;
      if(rules.titleContextPluralize) {
        if(contents.length && contents.length > 1) {
          //displayTitle = displayTitle + (contents.length > 1? 's':'');
          displayTitle = rules.titleContextPluralize.plural;
        } else {
          displayTitle = rules.titleContextPluralize.singular;
        }
      }

      //!Shin hax
      // I could do a proper caps setup, but for the moment...
      if(rules.titleInterpolation) {
        try {
          // var e = `We have template literals`;
          displayTitle = eval("`"+ rules.titleInterpolation +"`");
        } catch(e) {
          // no we don't.
        }
      }

      var handler = rules.alternateHandler || 'listing.scaffolded.general.tmpl';
      // { env: rules, data: contents, title: displayTitle }
      return _tmpl.partial(handler, { scaffolding: rules, contents: contents, title: displayTitle });
    }
  };

  /**
   * @desc
   * This is a simple wrapper on {@link module:template/publish.utils.handleScaffolding} which will retrieve the rules for a listing
   * from a specifier (and then call `handleScaffolding` with those rules for the specified listing).
   * @memberof module:template/publish
   * @param {object} _tmpl The template object for which this function will be doing the scaffolding.
   * @param {object} _doclet The doclet or fragment being rendered.
   * @param {string} _tagSpecifier A colon-delimeted specifier to the rules which dictate the rendering
   * pattern for the doclet.
   * @returns {string} HTML for the doclet or doclet fragment passed in.
   */
  utils.scaffoldFromSpecifier = function scaffoldFromSpecifier(_tmpl, _doclet, _tagSpecifier) {
    var aSpec = _tagSpecifier.split(":");
    var arrangement = aSpec.splice(0,aSpec.length -1);
    arrangement = utils.resolveArrangement(arrangement);
    return utils.handleScaffolding(_tmpl, _doclet, arrangement, aSpec[0]);
  };
  
  /**
   * @desc 
   * This is a simple helper function to capitalize a string.  It is currently not wired into the system, being "pre" deprecated ;).
   * @memberof module:template/publish
   * @param {string} _string The string to capitalize
   */
  utils.capitalize = function capitalize(_string) {
    // text-transform: capitalize
    if(_string.length > 0) {
    return _string[0].toUpperCase() + _string.substring(1);
    }
    return "";
  };

  /**
   * @desc
   * This function resolves two sets of information for doclets of the specified selectors...  
   * 1. It will determine the order which tags are intended to be displayed in the listing.
   * 2. It will generate the tags descriptor object for all tags.  
   * This information is derived from the conf settings passed into the publish module.
   * @memberof module:template/publish
   * @remarks
   * I debate here whether I should capture in the closure the entirety of `conf.customizeOutput` or if I should instead
   * pass it in on the stack (which might also allow for some recursive/contextual resolution in the future)...
   * @param {Array} _aSelectors An array of selectors indicating for which context to resolve the arrangement information.
   * The last (most specific) specifier in the array may be replaced by "default"  (although because of the
   * behavior for unrecognized specifiers, this is just a convention)
   * @returns {object} An object consisting of two fields--An `order` field as an array of listings to be displayed, and a 
   * `tags` field containing any custom listing specifications for that section.  If the specified path is not found, the 
   * default arrangment will be returned (`{ order: [ "*" ] , tags: {} }`).  If the specified path exists, but the specific
   * specifier does not (e.g. `container:article:body:module-with-modules`) this function will return the default arrangement
   * *for that path*, as specified in the `all` keyword, if present.
   * 
   * {
   *  order: [ "description", "notes", "remarks", "*" ],
   *  tags: {}
   * }
   * 
   * @example
   * var arrangement = resolveArrangement([ "container", "article", "body", "default" ]);
   */
  utils.resolveArrangement = function resolveArrangement(_aSelectors) {
    if(!Array.isArray(_aSelectors) || _aSelectors.length === 0) {
      return { order: [ "*" ] , tags: {} };
    }

    var cursor = conf.customizeOutput;
    while(_aSelectors.length > 1) {
      cursor = cursor[_aSelectors.shift()];
      if(cursor === undefined) {
        return { order: [ "*" ] , tags: {} };
      }
    }

    // Now we are at the descriptive node for the selector space in the `customizeOutput` settings
    var order = cursor[_aSelectors[0]] || cursor.all || [ "*" ];
    var tags = cursor.tags || {}; // I can of course
    return { order: order, tags: tags };
  };


  /**
   * @desc 
   * Simple routine to resolve applying an accessor rule to a doclet.
   * @private
   * @memberof module:template/publish
   * @param {object} _doclet The listing doclet upon which we are applying the accessor rule.
   * @param {string} _rule A simple accessor rule.  It may not be null.  The value is taken as the field of the doclet which should be
   * provided.  `""` indicates the doclet itself should be returned.
   * @futures This format could be augmented to be a specifier of sorts, recursively resolved to allow arbitrarily deep accessors
   * @futures A bit redundent, but once more I point out the lack of error handling in this package.
   */
  function resolveParam(_doclet, _rule) {
    if(_rule === "") {
      return _doclet;
    } else {
      return _doclet[_rule];
    }
  }

  /**
   * @desc
   * Another "pre"-deprecated function.  This was a factory function for creating a pass through proxy to jsdoc's `templateHelper~linkto`
   * function to allow that function to be used with what became the `itemMarshaling` configuration option.
   * @private
   * @memberof module:template/publish
   * @param {function} _linkto The jsdoc helper `linkto` function
   * @param {function} _htmlsafe The jsdoc helper `htmlsafe` function.
   * @deprecated
   */
  utils.buildLinktoProxy = function buildLinktoProxy(_linkto, _htmlsafe) {
    /**
     * @desc
     * The `linkto` proxy function generated by `buildLinktoProxy` which has been deprecated.
     * @remarks 
     * I'm not sure that _htmlsafe is appropriate in all cases.
     * @param {object} _doclet The doclet to operate on.
     * @param {array} _linktoRule An array of exactly two accessor strings.  These are used to determine what to pass into `linkto` in order
     * to generate the link.  If this parameter is null, no link is generated. 
     */
    var proxy = function(_doclet, _linktoRule) {
      if(_linktoRule === undefined) {
        return _doclet;
      }
      // _linkto must be an array, we have no error handling, so...
      return _linkto(resolveParam(_doclet, _linktoRule[0]), _htmlsafe(resolveParam(_doclet, _linktoRule[1])));
    };

    return proxy;
  };

  /**
   * @desc
   * This is the handler function for the `itemMarshalling` rule.  This function will interpret the arrangment and the marshalling rules
   * in the context of the indicated `_item` to derive the appropriate parameters, invoke the indicated function and return the result 
   * to the calling template.
   * @memberof module:template/publish
   * @param {object} _item The display item or doclet being marshalled.
   * @param {object} _marshallingRules The marshalling rules which dictate the handling of this item's marshalling.
   * @param {object} _view The template view which is handing the rendering of this listing.
   * @returns {string} "marshalled" html representation for `_item` as indicated in the `_marshallingRules`.
   */
  utils.marshalItemDisplay = function marshalItemDisplay(_item, _marshallingRules, _view) {
    var out = _item;
    if(_marshallingRules) {
      _marshallingRules.forEach(function(r) {
        // Still struggling with the no error handling...
        var params = [];
        for(var idx = 1; idx <= r.length; idx ++) {
          params.push(resolveParam(_item, r[idx]));
        }
        out = _view[r[0]](...params);
      });
    }

    return out;
  };

  /**
   * @desc
   * Stub marshalling function to build namespace links.
   * @notimplemented
   * @memberof module:template/publish
   */
  utils.buildNamespaceLink = function buildNamespaceLink() {
    // build function with closure reference to linkto
    // return `<a href="namespaces.html#<?js= n.longname ?>"><?js= self.linkto(n.longname, n.name) ?></a>`;
  };

  /**
   * @desc
   * This is a simple helper function which simple adds a doclet's scope to its `attribs` collection.  This
   * is normally done in publish by calling {@link jsdoc/util/templateHelper.getAttribs} but that helper function
   * only adds scope attribs for doclets of specific `kind`s.  For custom doclet types, we have this function.
   * @memberof module:template/publish
   * @param {object} _doclet The doclet for which to accumulate attributes.
   */
  utils.addScopeToAttribs = function addScopeToAttribs(_doclet) {
    if (_doclet.scope) {    //  && _doclet.scope !== 'instance' && _doclet.scope !== name.SCOPE.NAMES.GLOBAL
      _doclet.attribs.push(_doclet.scope);
    }
  };

  /**
   * @desc
   * This is a recursive `_.defaults` for `conf.customizeOutput`.  Perhaps controversially, I take the settings
   * for a tag only if `customizeOutput` does not contain *any* settings for that tag.  I.e. they are not 
   * "merged".  To be more explicit, given a `customizeOutput` entry for "description"...
   * 
   *  "description": {
   *    "wrapperAttributes": "class='description, jsdoc-description-method'"
   *  }
   * 
   * and a default of
   * 
   *  "description" : {
   *    "suppressTitle": true,
   *    "wrapper": "div",
   *    "wrapperAttributes": "class=description"
   *  }
   * 
   * You might expect to end up with 
   * 
   *  "description" : {
   *    "suppressTitle": true,
   *    "wrapper": "div",
   *    "wrapperAttributes": "class='description, jsdoc-description-method'"
   *  }
   * 
   * But you do not, you end up with 
   * 
   *  "description": {
   *    "wrapperAttributes": "class='description, jsdoc-description-method'"
   *  }
   * 
   * Because defaults are taken on a tag-level basis.  This is purposeful to avoid confusion (imo).  Take as
   * an alternate example...
   * 
   *  "description": {
   *    "title": "h5",
   *    "titleAttributes": "class=jsdoc-description"
   *  }
   * 
   * You might expect this to work in the naive merge approach, but instead you would end up with 
   * 
   *  "description" : {
   *    "title": "h5",
   *    "titleAttributes": "class=jsdoc-description",
   *    "suppressTitle": true,
   *    "wrapper": "div",
   *    "wrapperAttributes": "class='description, jsdoc-description-method'"
   *  }
   * 
   * @remarks
   * Given the explanation above, it is, of course, possible to consider an "intelligent" merge.  The example
   * case given could actually be tested for in a semantically aware merge.  I think it would still be a bit
   * cloudy.  If one modifies `wrapper`, I assume I keep the default `wrapperAttributes`.  Would I still inherit
   * `outerWrapper`?  If I add an `outermostWrapper` but there is no `outerWrapper` or `wrapper` set...
   * 
   * Presumably `title` would override `suppressTitle`, but what if one simply sets a `titleCaption`.  There *are*
   * "global" defaults, effectively in `listing.scaffolded.general` and `listing.scaffolded.kv`.  
   * 
   * `usePartial` and the like will already automatically override `wrapper`, but what if I set a `usePartial` on
   * a tag which has an `outerWrapper`.  Do I wipe it out?  That's not desireable if it is a list.  It gets sticky
   * 
   * @memberof module:template/publish
   * @private
   * @param {object} _confCurs The object being merged into.
   * @param {object} _defCurs The default object which is acting as the source.
   * @todo This algorithm is perhaps a bit funny with tags that have a `template` preference
   */
  utils.leafMerge = function leafMerge(_confCurs, _defCurs) {
    for(var key in _defCurs) {
      if(!_confCurs[key]) {
        _confCurs[key] = _defCurs[key];
      } else {
        if(typeof _defCurs[key] === "object") {
          utils.leafMerge(_confCurs[key], _defCurs[key]);
        }
      }
    }
  };

  /**
   * @desc
   * The default rendering pattern for a sectioned/named renderer (template).
   * @notes
   * Historically I avoided using this function because I expected to have hard coded entries that I couldn't
   * render using `listing.scaffolded.*`.  Thus far, this has not been the case.   
   * @memberof module:template/publish
   * @param {object} _arrangement The rules array for the doclet/fragment being rendered.
   * @param {array} _defaults The default array of entries which are expected/valide for this doclet.
   * @param {object|array|string} _docOrData The doclet or fragment being rendered.
   * @todo Once I'm satisfied, this function should probably replace all the renderer snippets.
   */
  utils.renderDoclet = function renderDoclet(_tmpl, _arrangement, _defaults, _docOrData) {
    results = "";
    _arrangement.order.forEach(function(entry) { 
      if(entry === "*") { 
          // Get all the default listings that weren't explicitly placed
          var trimmed = _defaults.reduce(function(acc, cur) {
              if(_arrangement.order.indexOf(cur) === -1) {
                  acc.push(cur);
              }
              return acc;
          }, []);

          trimmed.forEach(function(listing) { 
              results += _tmpl.scaffoldPartial(_tmpl, _docOrData, _arrangement, listing);
          });
      } else {
          results += _tmpl.scaffoldPartial(_tmpl, _docOrData, _arrangement, entry);
      }
    });

    return results;
  };  
      
  return utils;
};