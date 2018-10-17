
/**
 * @module @shizen/shin-jsdoc-tags
 * @desc
 * The custom tags used in documenting the `shinstrap` module.  If I like these patterns I might export them as a `gist` or
 * even elevate them to their own little module which I can include as a dev-dep for other projects.
 * @notes
 * While I've gone through an retro-fitted `shinstrap` to use ES5 coding styles, as a dev dependency it is not critical for
 * for this plugin to follow suit.
 * @private
 * @addsTag honors Here I could describe the honors tag, I suppose.
 * @addsTag tags Etc.  Might introduce a specific format for the `@addsTag` jsdoc comment, and then a `listing.scaffolded.tags.tmpl`
 */

// jshint esversion: 6

exports.defineTags = function (dictionary) {
  
  dictionary.defineTag("honors", {
    mustHaveValue: false,
    canHaveType: true,
    canHaveName: true,
    onTagged: function (doclet, tag) {
      // validate template only?
      // console.log("doclet.name", doclet.name);
      // console.log("doclet.kind", doclet.kind);
      // console.log("tag : %s", Object.getOwnPropertyNames(tag));
      // console.log("originalTitle : %s", tag.originalTitle);
      // console.log("title : %s", tag.title);
      // console.log("text : %s", tag.text);
      // console.log("value : %s", Object.getOwnPropertyNames(tag.value));
      // console.log("meta : %s", Object.getOwnPropertyNames(doclet.meta));
      // console.log("meta : %s", doclet.meta);
      if(doclet.honors === undefined) {
        doclet.honors = [];
      }
      // Somehow I thought jsdoc would do this for me given the settings above...
      // note that I'm only allowing one type listed here.
      // var parsed = tag.text.match(/^([\w.]+)\s+(?:{(\w+)})?\s+(.*)$/);
      // if(parsed !== null) {
      //   doclet.honors.push({
      //     name: parsed[1],
      //     type: {
      //       names: [ parsed[2] ],
      //     },
      //     description: parsed[3]
      //   });
      // }
      doclet.honors.push({
        name: tag.value.name,
        type: tag.value.type,
        description: tag.value.description,
        // optional: tag.value.optional,    // They are all more or less optional
        defaultvalue: tag.value.defaultvalue
      });
      // doclet.honors.push(tag.value);
    }
  });

  dictionary.defineTag("tags", {
    mustHaveValue: false,
    canHaveType: false,
    canHaveName: false,
    onTagged: function (doclet, tag) {
      if(!doclet.tags) {
        doclet.tags = [];
      }
      // Tag handling...  Might want to do more rigorous processing and validation
      let tags = tag.value.split(",");
      for(let idx = tags.length-1; idx >= 0; idx--) {
        let t = tags[idx] = tags[idx].trim().toLowerCase();
        if(t.length === 0 || tags.indexOf(t) !== idx || doclet.tags.indexOf(t) !== -1) {
          tags.splice(idx, 1);
        }
      }
      doclet.tags.push(...tags);
      // console.log("Added Tags: %s", tags);
    }
  });

  dictionary.defineTag("redirect", {
    mustHaveValue: true,
    canHaveType: false,
    canHaveName: false,
    onTagged: function (doclet, tag) {
      doclet.redirect = tag.text;
    }
  });

  dictionary.defineTag("template", {
    mustHaveValue: true,
    canHaveType: false,
    canHaveName: true,
    onTagged: function (doclet, tag) {
      // console.log("Template %s found (%s)", tag.text, tag.value);
      doclet.kind = "template";

      // Name specified?
      var m = tag.text.match(/^(\w+)\s+(\w+(?:\.(?!tmpl)\w*)*\.tmpl)/);
      if(m) {
        doclet.name = m[1];
        doclet.template = m[2];
      } else {
        // Match detail.tmpl or detail.blah.tmpl, etc...
        var m = tag.text.match(/^(\w+)(?:\.(?!tmpl)\w*)*\.tmpl/);
        if(m && m.length > 0) {
          doclet.name = m[1];
        } else {
          doclet.name = tag.text;
        }
        doclet.template = tag.text;
      }
      doclet.scope = "static";
    }
  });

  dictionary.defineTag("design", {
    mustHaveValue: true,
    canHaveType: false,
    canHaveName: false,
    onTagged: function (doclet, tag) {
      doclet.design = tag.value;
    }
  });
  dictionary.defineTag("notes", {
      mustHaveValue: true,
      canHaveType: false,
      canHaveName: false,
      onTagged: function (doclet, tag) {
        doclet.notes = tag.value;
      }
  });
  dictionary.defineTag("algorithm", {
    mustHaveValue: true,
    canHaveType: false,
    canHaveName: false,
    onTagged: function (doclet, tag) {
      doclet.algorithm = tag.value;
    }
  });
  
  dictionary.defineTag("futures", {
    mustHaveValue: true,
    canHaveType: false,
    canHaveName: false,
    onTagged: function (doclet, tag) {
      if(doclet.futures === undefined) {
        doclet.futures = [];
      }
      doclet.futures.push(tag.value);
    }
  });

  dictionary.defineTag("remarks", {
    mustHaveValue: true,
    canHaveType: false,
    canHaveName: false,
    onTagged: function (doclet, tag) {
      doclet.remarks = tag.value;
    }
  });

  dictionary.defineTag("changelog", {
    mustHaveValue: true,
    canHaveType: false,
    canHaveName: false,
    onTagged: function (doclet, tag) {
      doclet.changelog = tag.value;
    }
  }).synonym('changes');

  dictionary.defineTag("issues", {
    mustHaveValue: true,
    canHaveType: false,
    canHaveName: false,
    onTagged: function (doclet, tag) {
      doclet.issues = tag.value;
    }
  });
}; 
