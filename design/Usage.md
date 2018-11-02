# Usage instructions

(Author: <shin@shinworks.co>)

Skip to | [Specification Documentation](#details) |

The `shinstrap` template is intended to be an "in-place" replacement for [`ink-docstrap`](https://github.com/docstrap/docstrap).  In theory, all the bootstrappy goodness you could leverage with docstrap also works with shinstrap.  This mainly boils down to a toc, theming, sunlight highlighting and searching (although last I checked docstrap's theming was temporarily? broken).  

What this template adds to the pantheon of capabilities of jsdoc/docstrap are four features.

1. The ability to specify display for new tags. (Skip to the [Quickstart guide to adding tags](#newtag.quickstart))  

  This is the primary purpose of this template.  `jsdoc` *already* provides the ability to have its parsers consume unknown (new) tags, and via its "plugins" api, define those tags to allow parsing and decorating of the underlining AST.  (If that last part didn't make sense, it means that with a plugin you can have jsdoc actually record/do something internally with tags you make up).  What was missing from the jsdoc suite of tools was a template which could then *display* a newly defined tag.  The methodology to date was to jury rig a fragile solution by stuffing the information from a given tag into the display information for another tag (typically description)\*.  The former has many issues, of course, including styling, ordering and munging of page structure.  (\*Or one would make an entirely new template).

  `shinstrap` allows you to define when, where and how you want your tags to be displayed.  With `shinstrap` you define the display information in your project's `.jsdoc.json` (or whatever you've called your jsdoc conf file).  ([go here for a quickstart in jsdoc](http://usejsdoc.org/about-getting-started.html)).  ([go here for documentation on jsdoc's configuration file](http://usejsdoc.org/about-configuring-jsdoc.html)).  ([go here for a quick overview of how to build a simple jsdoc plugin to recognize new tags](http://usejsdoc.org/about-plugins.html#tag-definitions)).
  
  All template settings in jsdoc are stored under the `"templates"` field in the config file's json structure.  For tag definitions in `shinstrap` you want to decorate `templates.customizeOutput`.  The "JSONPtr" path from there depends on where you want your tag to be displayed.  (Note that while the primary focus is on new tags, but you can also override how existing tags are displayed as well).

  By default, most jsdoc templates (including docstrap) inherit their structure from the `default` jsdoc template.  This template uses a particular hierarchy of `.tmpl` files to display its documentation (these are just [`underscore`](https://underscorejs.org/#template) templates.  Fortunately, this hierarchy is pretty simple.  At the root, you have `container.tmpl`.  This handles most of the top-level entities which are getting documented (e.g. modules, classes, namespaces, etc.).  This template then calls, as needed `method.tmpl` and `details.tmpl`.  These are the only templates you are likely going to need to know about to display your new tags.

  With this understanding in hand, you are ready to add display specifications for your new tag to `shinstrap`.  Let's say you wanted to add an `@notes` tag, similar to `@desc`, but listed separately at the end of each documented object's details listing.  Assuming you had your plugin written to generate your tag information, you could define its display simply by adding to your jsdoc config file...

        "customizeOutput" {
          "details": {
            "order": [ "*", "notes" ],
            "tags": {
              "notes" : {
                "title": "h5",
                "wrapper": "div"
              }
            }
          }
        }
  
  There are three pieces to this specification.

        "notes" : {
          "title": "h5",
          "wrapper": "div"
        }
  
  Defines the new tag.  There are several possible options, and in fact, these are the defaults for `details.tmpl`, but specified here for demonstration purposes.  The `title` field indicates what the title of the listing should be wrapped in (you can set what the title should be or suppress its display, but by default it will use the name of the tag as the title, in this case "notes").  The `wrapper` field tells `shinstrap` in what html element to wrap the value of `doclet.notes`.  This will generate a listing like

  ```html
  <h5>notes</h5>
  <div>Whatever the contents ("value") of the notes were.  Technically `shinstrap` will look for `doclet.notes` here by default.</div>
  ```

  The second piece comes from this line.

        "all": [ "*", "notes" ],

  This tells `shinstrap` to display the all the usual (default) listings first (`"*"`) and then display the `"notes"` tag.

  The final piece is simply where we added the above pieces.  Specifically in 
  
        "customizeOutput" {
          "details": {
            ...
          }
        }
  
  Which indicates to `shinstrap` that these rules apply to the `details.tmpl`.  

  In a practical example you'd probably want to at least specify some attributes as well, which would also go in the `notes` descriptor in the `tags` "section".  These are covered in more detail in the [Adding Tags](#addtags) section.

2. The ability to add tutorial files under arbitrary menu names following standard access rules.

  `jsdoc` allows a developer to include arbitrary `html` or `markdown` files into their generated documentation as "tutorial" files.  These normally are all listed under a "tutorials" menu or listing (depends on the template), with an optional hierarchy specified in the "tutorials" directory.  (See [tutorials documentation]() in jsdoc).  `shinstrap` allows you to alter this behavior to split these documents up into one or more menus with whatever name(s) you desire.  Further, you can tie the display of a menu (and thus the documentation underneath) to an access level, similar to other documentation pieces (i.e. similar to `@private`, etc. in jsdoc).

        "customizeOutput": {
          "menus" : {
            "APIs" : {
              "title": "APIs",
              "members": [ "DESIGN" ],
              "access": "private"
            },
          }
        }

  The above example instructs `shinstrap` to build a menu called "APIs" and put the tutorial "DESIGN" in it (and thus remove it from the default "tutorials" group).  Finally, it sets the access level for this menu to "private".  If jsdoc is invoked with an access setting that would normally prevent generation of "private" tagged documentation, this menu will not be created, and the "DESIGN" document would (still) not be included in the default tutorials group.

3. The ability to override this template's provided `tmpl` files (as well as provide your own).
 
        "templateOverrideDir": "localTmpl",

  tmpl files in this directory will be used before any in `shinstrap`'s default `tmpl/` directory.  This allows you to either override an existing template, if you find yourself in need there of, as well as to provide new templates should you find you need complex handling for a new tag you add.

4. The ability to add extra resource files.

        "supplementalCSS": "local.css",
        "supplementalJS": [ "local1.js", "local2.js" ]

  While `docstrap` already allows you to theme and modify via its grunt-less-bootstrap build system, sometimes it is convenient to be able to add simple bits of css patchwork.  Some people may feel that allowing such a "back door" opens the way to abuse and bad practices, bad structure and violation of the spirit and purpose of `less`, `bootstrap` or `docstrap`.  So don't do that.  Practically speaking, however, I find it is often convenient to be able to quickly add in small bits of finalizing css.  Similarly (and conceptually related) you can also add additional javascript and font files.

## Adding Tags <a name="addtags"></a>

| Skip to the [Add a New Tag Quickstart](#newtag.quickstart) |

This is the primary use case of this template, and thus is getting a called out walk through here.  On a macro level there are two principal steps to adding a custom jsdoc tag into the `jsdoc` ecosystem.  First, you need to create a plugin to teach the `jsdoc` parser how to recognize and parse your new tag.  Second, (which is what `shinstrap` adds to the equation), you need to specify to your template (`shinstrap`) how your new document tag should be rendered.

### Adding a jsdoc tag plugin

This is not actually a part of `shinstrap` at all, but the standard mechanism in `jsdoc` to add a custom tag.  The jsdoc documentation for this is located [here](http://usejsdoc.org/about-plugins.html#tag-definitions).  Basically, you create a plugin module which exports a `defineTags` function.  This function takes one parameter, a "dictionary" object which provides a `defineTag` function which your plugin calls to define its tags.  The `defineTag` function takes a tag name and a descriptor object.  The tag name is the tag literal without the `@` sign that you are defining.  So if your tag is `@notes`, this is `"notes"`.  The descriptor object describes the tag's behavior and how it should be parsed.

The most important part of the descriptor object is the `onTagged` field, which sets the function to call when a tag of your new type is discovered.  This is where you then have the chance to do any handling you want to decide how to package up the information around your tag and decorate the associated `doclet`.

Again, the documentation is [here](http://usejsdoc.org/about-plugins.html#tag-definitions).  Here are some examples.

```
dictionary.defineTag("design", {
  mustHaveValue: true,
  canHaveType: false,
  canHaveName: false,
  onTagged: function (doclet, tag) {
    doclet.design = tag.value;
  }
});
```

This is a basic custom tag.  It defines an `@design` tag, which must have a value `mustHaveValue: true`.  The value specified in any comment tag found will be recorded on the `doclet` in `doclet.design` (this is what `onTagged` is doing).

```
dictionary.defineTag("honors", {
  mustHaveValue: false,
  canHaveType: true,
  canHaveName: true,
  onTagged: function (doclet, tag) {
    if(doclet.honors === undefined) {
      doclet.honors = [];
    }
    doclet.honors.push({
      name: tag.value.name,
      type: tag.value.type,
      description: tag.value.description,
      defaultvalue: tag.value.defaultvalue
    });
  }
});
```

This defines an `honors` tag (@honors).  The values `canHaveType` and `canHaveName` will cause `jsdoc` to parse `@honors {object} usePartial description` with `"honors"` as the `tag.value.name`, `"object"` as the `tag.value.type`, and `"description"` as `tag.value.description`.  This is the same pattern as the standard `@params` document comment.  

The `onTagged` function takes the parsed tag information from `jsdoc` and pushes it onto the associated `doclet` onto an array called `honors`.  `shinstrap` uses this tag to document what settings a given `template` will make use of in a presentation practically identical to how `@params` works.

```
dictionary.defineTag("template", {
  mustHaveValue: true,
  canHaveType: false,
  canHaveName: true,
  onTagged: function (doclet, tag) {
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
```

This is the definition for the `@template` document comment.  This jsdoc comment tag allows one to create an entry describing a template (which can not be directly commented as `jsdoc` can not parse a `tmpl` file--at least until I fork jsdoc, itself).   When found this tag's `onTagged` callback does a few things.  Internally, `doclet`s are created with custom ids using `jsdoc`'s ["namepath"](http://usejsdoc.org/about-namepaths.html) specification.  These ids are built based on a tag's `name`.  This tag is creating a `doclet` and giving it a name, which will then be used to derive its custom id.  Namepaths in `jsdoc` give `"."`s a special meaning, which causes `jsdoc` to get confused when building the id for the associated `doclet` if the name contains `"."`s (like, for instance, if it were the name of a template file, which all have the extention `.tmpl`--e.g. `container.tmpl`).  To get around this, `onTagged` does some simple regex parsing.  If the `@template` tag has a name, it uses that value for the name of the resulting `doclet`.  If it does not, it will generate a name by parsing the value of the `@template` tag.  It then records the actual file name of the template in `doclet.template`.  Finally, by usage convention, all templates are considered to be "static" members of the module which uses them (`doclet.scope="static"`).

You can verify if your tags are being parsed as you would like them by a number of methods.  Most easily, you can directly debug `jsdoc`.  You can output information on the console from your `onTagged` function.  You can also ask `jsdoc` to print out all of the doclets it has generated for your source code by specifying `-X` on the commandline.  This can be very verbose, so you might want to redirect it into a file you can peruse.

### Specifying Tag Display in `shinstrap`

Once you have `jsdoc` parsing and decorating its AST with your tag information, you will most likely want to get it rendered in your documentation.  This is where `shinstrap` comes in.  Rendering specifications are enumerated in the `templates` setting of your jsdoc configuration file.  For the most part, the bulk of the settings will live in `templates.customizeOptions`.  You can read the detailed specifications [here](#details).

The basic idea for tag display is *if a doclet/data chunk has data for your tag* then we want to render some HTML tag structure with that data in it.  This first part is typically quite simple.  All tag rules intrinsically associate their tag name with the presence of a field with the same name on the doclet.  So a `notes` tag will expect to find `doclet.notes` to be present.  If it is not present, then it assumes that `doclet` has no notes.  So from the tag examples above, the `design` tag would be defined in the `"tags"` section under `"design"`, because it records the value of the tag in `doclet.design`.  If for some quixotic reason you decided to make a take called `@foo` and its `onTagged()` stored its value in `doclet.bar`, your tag rule for your `@foo` tag would want to live in `tags.bar`.  The only exception to this rule are tags which make use of the special `find` keyword (to find and associate data to a `doclet` via some set of search criteria on the AST).  The `find` keyword is described in more detail in the [tags specificaton](#customizeOutput.templates.tags) section.

There are two parts to a render specification for a tag.  There is the html structure in which its information should be rendered, and there is the question of where and in what order that html structure should be rendered.  `shinstrap` separates these specifications into two separate "sections" called ["order"](#customizeOutput.templates.order) and ["tags"](#customizeOutput.templates.tags).  These are effectively namespaced by the template to which they apply (the template in which you want your tag data to be rendered).  In `shinstrap` the standard templates which one cares about in this regard are `container.tmpl`, `method.tmpl` and `details.tmpl`.  These are described in more detail in the [templates section](#customizeOutput.templates).  This gives the configuartion file's `"templates"` section the following structure for specifying rendering information for custom tags:

```
{
  "customizeOutput: {
    "container" : {
      ...
    },
    "method": {
      ...
    },
    "details": {
      ...
    }
  }
}
```

With each section containing the specifications for its associated template.  The internals of these sections then specify the `"order"` and the `"tags"` structure information.

```
"method": {
  "all": [ "description", "design", "*" ],
  "tags": {
    "design": {
      "title": "h5",
      "titleAttributes": "class='jsdoc-design-title subsection-title'",
      "wrapper": "div",
      "wrapperAttributes" : "class=jsdoc-design-body"
    }
  }
}
```

The `"all"` entry is an `"order"` specifier.  The `"tags"` entry describes the structure to emit when rendering your tag.  In the above example, the `"order"` of `[ "description", "design", "*" ]` indicates to `shinstrap` that it should first render any `description` for the doclet, then any `design`, and then any remaining listings for the `doclet` which `method.tmpl` considers to be default (those tags which `docstrap` would have rendered in its `method.tmpl`).

The `"tags"` section tells `shinstrap` how to render the data in the event that it is present (i.e. in the event there is a `doclet.design`).  In this case it will render a title (based on the default `"design"`) in an `<h5>` element with the attribute `class='jsdoc-design-title subsection-title'`.  The value will be rendered after that in a `<div>` element with the attribute `class=jsdoc-design-body`.  These are all `class` attributes here, but this is arbitrary, they could as easily have been `foo=true, bar=false, baz=left`.

The `"tags"` section can take a number of values to specify a variety of rendering options.  These are described more fully in the [tags section](#customizeOutput.templates.tags).

As for the other example tags.  `@honors`

```
"method": {
  "all": [ "template", "honors", "description", "remarks", "*", "futures" ],
  "honors" : {
    "title": "h5",
    "titleAttributes": "class=jsdoc-honors",
    "titleCaption": "<em>Honors</em> the following configuration settings:",
    "usePartial": "params.tmpl"
  }
```

Again, this specification effects the `methods.tmpl` template.  Tag specifications for `container.tmpl` are a bit more complicated because there are multiple valid template namespaces.  First because `container.tmpl` has two sections--an overview section and a body section, and second because there are two rendering paths for the overview section--the default and the "module-with-modules" case.  None of that is relevant to this example.

Here, we define `honors` information to be rendered after the `template` information but before the `description`.  This might seem confusing if you are thinking about it, because we're doing something a bit confusing with our naming patterns here vis a vis `template` which will become more clear in the next example.  For now, focus on the `honors` part.  

If there is any `honors` data in `doclet.honors` for the `doclet` being examined by `method.tmpl` it will render a title in an `<h5>` element with the attribute `class=jsdoc-honors`.  The title's innerHTML value will be `<em>Honors</em> the following configuration settings:`, so in other words it will render...

```html
<h5 class=jsdoc-honors><em>Honors</em> the following configuration settings:</h5>
```

To render the value for `doclet.honors` `shinstrap` will delegate that rendering to the `params.tmpl` template, which is the template used to render `@params` for methods (recall that in our tag creation example above, we had `jsdoc` parse `@honors` in the same fashion as `@params` only keeping a subset of the possible things `@params` can specify).  `doclet.honors` just like `doclet.params` is an array of values, and thus we get the familiar output we expect.  We could, instead have provided our own template here by specifying `"usePartial": "honors.tmpl"` for example, setting a [`templateOverrideDir`](#templateOverrideDir) and creating our own `honors.tmpl` file there.

#### `@template`

`@template` is our big example in this walk through, because it shows a couple of techniques at once.  First, recall our tag parsing and doclet generation process above--We recorded the `name` of the template as the `doclet.name`, its `kind` as `template` and the actual file name of the template as `doclet.template`

```
"container": {
  "body": {
    "all" : [ "augments", "requires", "classes", "mixins", "namespaces", "templates", "*" ],
    "tags" : {
      "templates": {
        "find": {     
            "kind": "template", 
            "memberof": "_doclet.longname"
        },
        "validate": "_doclet.kind !== 'globalobj'",
        "title": "h3",
        "titleAttributes": "class=subsection-title",
        "outerWrapper": "dl",
        "usePerItemPartial": "method.tmpl"
      }
    }
  }
},
"method": {
  "all": [ "template", "honors", "description", "remarks", "*", "futures" ],
  "tags": {
    "template": {
      "title": "h5",
      "titleCaption": "Template File:",
      "alternateHandler": "listing.scaffolded.kv.tmpl",
      "wrapper": "span",
      "wrapperAttributes": "class=jsdoc-template-filename"
    }
  }
}
```

Here we're specifying two separate entries.  The first in `container.body` is the "root" entry for a template as specified by `@template`.  `container.tmpl` renders a variety of "first order" `doclet`s like `module`s, `mixin`s and `namespace`s.  By convention, we use our `@template` document comment as members of a `module` for documentation purposes.  This association is actually done explicitly using `@memberof module:...`.  When `container.tmpl` reaches the `template` entry it checks to see if it has a value for that entry on its current `doclet` in order to decide if it should render it.  Unlike the usual pattern for simple entries, the `template` tag description for `container.body` has a `find` specification.  This tells `container.tmpl` that this entry is valid and should be rendered if it can find any `doclet`s of `kind` `"template"` which are `memberof` `_doclet.longname` (the `doclet` `container.tmpl` is looking at).  This is how `jsdoc` associates `doclet`s with each other.  The same mechanics are used to find classes, mixins, etc. which are members of a given module, methods in classes, etc.

If `container.tmpl` finds any such `doclet`s it will then attempt to validate (superfluously in this case) them according to the conditions in `validate`.  All `doclet`s which pass this validation step are then rendered.  The next settings should seem familiar.  `title` and `titleAttributes` cause an html `<h3>` element to be rendered with the attribute `class=subsection-title` and the caption/innerHTML of `templates`.  `outerWrapper` then renders a `<dl>` element the contents of which are whatever is rendered by `method.tmpl`.  `usePerItemPartial` specifies that `method.tmpl` should be called *for each* `doclet` that came back from the `find` and passed validation.  Note that `outerWrapper` is specified here because `wrapper` and `usePerItemPartial` both address the same "level" of nested output (`usePerItemPartial` also has higher precedence, but either way would be broken for what we want to achieve).

This is where our second tag specification comes in.  So far, we've rendered a title and are rendering a `method.tmpl` for each of our template `doclets` created by our `@template` tag definition we defined above.  `method.tmpl` will take care of rendering most anything else we have defined on our template doclet, like `@desc`, `@author` or `@see` tags, etc. as well as our custom `@honors` tag.  But in our `@template` definition we did one other thing, we decorated our template `doclet` with another value--`template` containing the file name of the template.  (We might have considered naming it something else, like `filename`).

`method.tags.template` describes how to render that data when `method.tmpl` encounters a `doclet` with a `template` field.  The settings for `template` should be largely familiar by now.  `title` and `titleAttributes` specify the title (with the default caption of `template`).  `wrapper` and `wrapperAttributes` indicate that we want `shinstrap` to render a `<span class=jsdoc-template-filename>` for each entry.  The `alternateHandler` entry is new.  The vast majority of custom listings are handled in `shinstrap` by `listing.scaffolded.general.tmpl`.  This entry says rather than use that template, which renders a title followed by a value in separate wrappers, `shinstrap` should use `listing.scaffolded.kv.tmpl`.  `kv` in this case stands for "key-value".  Which is to say we want to see `<title-wrapper>...<value-wrapper>...</value-wrapper></title-wrapper>`.  There are a few key-value styled listings rendered in `docstrap` by default, and these have been reproduced in `shinstrap`.  The available rendering options are described in more detail in the [tags section](#customizeOutput.templates.tags).

| [Specifcations in Detail](#details) |

<a name="newtag.quickstart"></a>

### Adding a Tag -- Quickstart

To quickly add a new tag and see it working, follow these steps.

1. First, make sure you have everything you need installed.

        npm install --save-dev jsdoc
        npm install --save-dev shinstrap

2. Second, you need to create a simple `jsdoc` plugin to teach jsdoc how it should annotate the information conveyed by your tag.  This requires creating a javascript file (a `jsdoc` plugin).  If you intend to use the same set of tags in multiple projects you will likely want to make these tags into a module and use your favorite package management system to deploy them.  For this example, however, we'll just put them into a file at the root of your project.

    `jsdoc-tags.js`:

        exports.defineTags = function (dictionary) {
          dictionary.defineTag("notes", {
              mustHaveValue: true,
              canHaveType: false,
              canHaveName: false,
              onTagged: function (doclet, tag) {
                doclet.notes = tag.value;
              }
          });
        }; 

    Note that the above is standard `jsdoc` plugin format and is valid outside the context of `shinstrap`.

3. Setup your `.jsdoc.json` file.  There are many settings you might want to set in your configuration file, but for the moment, create this file at the root of your project with the following content.

        {
          "tags": {
            "allowUnknownTags": true
          },
          "plugins": [ "jsdoc-tags.js" ],  
          "excludePattern": "(^|\\/|\\\\)",
          "recurseDepth": 5,
          "source": {
            "exclude": [ "node_modules" ]
          },
          "opts": {
            "template": "node_modules/shinstrap/template"
          },
          "templates": {
            "customizeOutput": {
              "container" : {
                "article" : {
                  "overview": {
                    "all" : [ "description", "notes", "*" ],
                    "tags" : {
                      "notes": {
                        "title": "h5",
                        "titleAttributes": "class='jsdoc-notes-title subsection-title'",
                        "wrapper": "div",
                        "wrapperAttributes" : "class=jsdoc-notes-body"
                      }
                    }
                  }
                }
              }
            }
          }
        }

    This specifies a couple of things to `jsdoc`, many of which are "standard" (like anything I don't specifically call out here).  `"tags": { "allowUnknownTags": true }` tells `jsdoc` to accept without error comment tags which it does not recognize.  This isn't strictly speaking necessary if all your comment tag types are covered by your plugin.  `"opts": { "template": "node_modules/shinstrap/template" }` indicates which template you want to use to render your documentation.  `"templates": {...}` are the settings specific to that template.  For `shinstrap` the custom rendering information for your new comment tag is in `templates.customizeOutput.container.article.overview`.  That path indicates when the new tag will be rendered.  The fields inside `templates.customizeOutput.container.article.overview.tags.notes` dictate the specific html structure to be rendered.  `templates.customizeOutput.container.article.overview.all` specifies where amongst the various doclet's listings the new tag's listing should go.

4. Make sure you have a source file with your new comment tag in it ;)

        /**
        * @module test
        * @desc
        * This is a gratuitous description put in as part of my test.
        * @notes
        * This is an example of using my new document tag.
        */

5. Generate the documentation.  From the root of your project, enter into the command line...

    ```bash
    ./node_modules/.bin/jsdoc -c ./.jsdoc.json -d docs/ -r .
    ```

    This will create your documentation into the `docs/` directory (change the value of the `-d` parameter if you want to put it elsewhere).  `-r` specifies to build the documentation by looking at all valid source files in this directory descending recursively down (to up to 5 levels deep, from our setting in `.jsdoc.json` -- `"recurseDepth": 5`).  The `-c` option tells jsdoc where to find your configuration file.  If you decide to name your config file something other than `.jsdoc.json` you can change it here.  There are other CLI options for jsdoc, you can find them [here](http://usejsdoc.org/about-commandline.html).

    At this point you should have some nicely generated documentation (well, at least to the extent that you have jsdoc comments in your source code).  The "root" of your documentation should be located in `docs/index.html`.

<a name="details"></a>

## Specifications in Detail 

- [favicon](#favicon)
- [repoIcon & repository](#repoicon)
- [supplementalCSS](#supplementalCSS)
- [supplementalJS](#supplementalJS)
- [supplementalFonts](#supplementalFonts)
- [templateOverrideDir](#templateOverrideDir)
- [customizeOutput](#customizeOutput)
  - [menu section](#customizeOutput.menu)
  - [doclets section](#customizeOutput.doclets)
  - [template sections](#customizeOutput.templates)
    - [order field](#customizeOutput.templates.order)
    - [tags field](#customizeOutput.templates.tags)

    
<a name="favicon"></a>

### `favicon`

This template setting allows you to specify an image to be used as the favicon for your generated documents (this is the icon that typically appears in the window tab in your browser).  This feature is currently experimental (see below).  At the moment, `shinstrap` will encode any image specified into base64 and store it in a datauri on every page it generates.

Note: Chrome seems to have some issues with this icon.  I have not dug deeply enough to determine if it is simply aggressive caching issues or if it is a security constraint.  Chrome will not serve a favicon off disk.  Internally I'm tracking this at like.. P3?--not terribly important.

<a name="repoicon"></a>

### `repoIcon` & `repository`

Another experimental feature.  If *both* settings are set, `shinstrap` will emit a link the to specified url (specified by `repository`) using the image specified in `repoIcon` (which for the moment is also being included as a datauri, even though this seems unnecessary).  `repository` should be a string containing a valid url (no validation is done currently).  `repoIcon` should be the path to an image file (this setting uses the standard resource path discovery mechanism).

<a name="supplementalCSS"></a>

### `supplementalCSS` 

This is a simple configuration setting to specify an additional css file to include with all generated documentation.  It follows the same discovery rules as all other `jsdoc` resource files.  It is added after other css files for overriding porpoises.

    "supplementalCSS": "local.css"

<a name="supplementalJS"></a>

### `supplementalJS` 

This setting accepts either a string or an array of strings each specifying the path to a javascript source file (discovered as a resource) which should be included with the documentation's static files and loaded on every page of the documentation.  `shinstrap` does not currently have a mechanism to include a js file in the manifest but *not* have it referenced on every generated documentation page.

    "supplementalJS": [ "local1.js", "node_modules/@someone/mymodule/lib/rearrangeViaCheerioBecauseImCrazy.js" ]

<a name="supplementalFonts"></a>

### `supplementalFonts` 

`supplementalFonts` setting accepts a stringPath or an array of stringPaths to files which should be included into the generated documentation's static files.

    "supplementalFonts": [ "node_modules/@someone/otfCreations/fonts/myCoolFont.woff" ]

<a name="templateOverrideDir"></a>

### `templateOverrideDir`

This is a project relative directory path to a directory which should be added to the template discovery path at the highest precedence.  When `shinstrap` looks for a template, either internally or via a tag specification (e.g. `usePartial`), it will look for that template in the directory specified by this value before looking anywhere else.

    "templateOverrideDir": "localTmpl"

<a name="customizeOutput"></a>

### `customizeOutput`

| [menu](#customizeOutput.menu) | [doclets](#customizeOutput.doclets) | [template](#customizeOutput.templates) | [order](#customizeOutput.templates.order) | [tags](#customizeOutput.templates.tags) |

This is the section where the bulk of the `shinstrap`-specific specifications live (in theory, `shinstrap` will also honor any settings understood by `docstrap`--it is a fork of `docstrap` after all).  `customizeOutput` has three general "types" of keys--The [`menu`](#customizeOutput.menu) key, the [`doclets`](#customizeOutput.doclets) key (probably best ignored), and the ["template"](#customizeOutput.templates) keys.  Currently there are four "valid" template keys, `method`, `container`, `details`, and `members`.

<a name="customizeOutput.menu"></a>

#### Menu Section  

    "customizeOutput": {
      "menus" : {
        "APIs" : {
          "title": "APIs",
          "order": 1,       // Ignored atm
          "members": [ "DESIGN" ],
          "access": "private"
        },
        "Usage" : {
          "title": "Usage",
          "members": ["Usage"]
        }
      }
    }

The "menus" section allows you to specify custom menus for the navbar in which you would like so-called "tutorial" files referenced.  [`tutorials`](http://usejsdoc.org/about-tutorials.html) are a feature of `jsdoc` which allows you to associate and include arbitrary `html` and `markdown` documents into your auto-generated documentation.  `jsdoc` will include these pages in a menu called "tutorials".  In `shinstrap` you can go a bit farther.  `shinstrap` allows you to "subvert" this feature to include such documents in one or more menus with names of your choice.  The specification excerpt above is one such example.

The keys in the "menus" section are the internal ids for the menus in question.  These ids should be valid identifiers.  Each key holds an object which describes its associated menu.  Currently there are three valid fields in this object.

`title` {string}
:   The desired title for the menu in the navigation bar.

`members` {array}
:   The documents to include in this menu.  As with `jsdoc`'s own tutorial configuration files, the string elements of this array are filenames without their extension, which is how `jsdoc` associates these "weak" ids with their respective files.  Any file listed as a member of any menu will be removed from the default tutorials menu (even if they are not otherwise included due to `access` settings--see below).  If there are no actual "tutorial" files left, no tutorials menu will be generated (your custom menus, though, will be assuming `access`).

`access` {string}
:   This setting allows you to specify that a given menu should be rendered only if the access level for the auto-generated documentation calls for it.  This setting parallels the same rules for access as `jsdoc` uses for other `doclets`.

Documents included in custom menus will still honor any of the usual `jsdoc` tutorial settings--namely `children` and `title`.  As of the inital release of `shinstrap` these are still specified in the normal places for `jsdoc`, despite it making more sense to move those specifications into the primary `jsdoc` configuration file.  `shinstrap` also does not alter the `jsdoc` pattern for tutorial inclusion (it's still just a folder).  Easy to change, just not done.

<a name="customizeOutput.doclets"></a>

#### Doclets Section 

This is a bit of a dangerous curves section and best ignored by most users. It is also of limited use at this moment.  This section allows the specification of additional processing on doclets by `kind`, similar to what `docstrap` performs for certain built-in doclet `kind`s.  By and large this has to do with generating attribute lists and call signatures for display.  In `shinstrap`, attribs rendering has been moved to `partial.scaffolded.attribs.tmpl`.  This example section indicates that the specified doclet kind (`"template"` in this case) should be preprocessed by calling `addAttribs(doclet)`, `shinHelpers.addScopeToAttribs(doclet)` and `addSignatureTypes(doclet)` in that order before doclets are rendered.  Effective use of this specification requires internal understanding of `docstrap`/`shinstrap` and is thus probably not useful (at this juncture).

    "customizeOutput": {
      "doclets" : { // This is where I could add rules to allow generation of separate pages
        "template": {
          "processing" : [ "addAttribs", "shinHelpers.addScopeToAttribs", "addSignatureTypes" ]
        }
      }
    }

<a name="customizeOutput.templates"></a>

#### Template Sections 

Currently, only three templates are wired to "honor" template customization specifications--`container.tmpl`, `method.tmpl`, and `details.tmpl`.  Each of these takes an "order" specification and a "tags" specification.  The "tags" specification is always under the key `tags` as an object with the name of each tag specification as a key (each tag specification is, itself, an object).  The tag specification format is described [here](#customizeOutput.templates.tags).  The "order" specification is listed under a field name based on the circumstances to which it applies (`"all"` being the default case).  For `method.tmpl` ("customizeOutput.method") and `details.tmpl` ("customizeOutput.details") `"all"` is the only valid case.  `container.tmpl` is more complicated however.  

The container template has two sections--an "overview" section and a "body".  Further, the "overview" section has a two separate rendering paths, depending on the doclet being rendered--It might be a module containing other modules, or it could be something (anything) else (`container.tmpl` as the root template is invoked to render `class`es, but these it punts to `method.tmp`).  The specifications for these cases are delineated by the keys used to contain those specifications.  The `templates.customizeOutput.container.body` covers the specifications for the "body" section of the container.  The `templates.customizeOutput.container.overview` section covers specifications for the "overview" section.  This section is further potentially divided by its two render cases--`templates.customizeOutput.container.overview.module-with-modules` and `templates.customizeOutput.container.overview.default`.  For this section the `templates.customizeOutput.container.overview.all` will be used as a fallback for any of the above which are not specified.  All these branches use the same "tags" section, it is the "order" section which varies.  The "order" specification is described [here](#customizeOutput.templates.order).

    "customizeOutput": {
      "container" : {
        "article" : {
          "overview": {		
            "all" : [ "description", "notes", "design", "*" ],
            "tags" : {
              "notes": {
                "title": "h5",
                "titleAttributes": "class='jsdoc-notes-title subsection-title'",
                "wrapper": "div",
                "wrapperAttributes" : "class=jsdoc-notes-body"
              },
              "design": {
                "title": "h5",
                "titleAttributes": "class='jsdoc-design-title subsection-title'",
                "wrapper": "div",
                "wrapperAttributes" : "class=jsdoc-design-body"
              }
            }
          },
          "body": {
            "all" : [ "augments", "requires", "classes", "mixins", "namespaces", "templates", "*" ],
            "tags" : {
              "tasks": {
                "find": {     
                    "kind": "task", 
                    "memberof": "_doclet.contents && _doclet.contents.title === 'Global' ? {isUndefined: true} : _doclet.longname" 
                },
                "title": "h3",
                "titleAttributes": "class=subsection-title",
                "usePerItemPartial": "method.tmpl"
              }, 
              "templates": {
                "find": {     
                    "kind": "template", 
                    "memberof": "_doclet.longname" 
                },
                "validate": "_doclet.kind !== 'globalobj'",
                "title": "h3",
                "titleAttributes": "class=subsection-title",
                "outerWrapper": "dl",
                "usePerItemPartial": "method.tmpl"
              }
            }
          }
        }
      },
      "method": {
        "all": [ "template", "honors", "description", "remarks", "*", "futures" ],
        "tags": {
          "template": {
            "title": "h5",
            "titleCaption": "Template File:",
            "alternateHandler": "listing.scaffolded.kv.tmpl",
            "wrapper": "span",
            "wrapperAttributes": "class=jsdoc-template-filename"
          },
          "honors" : {
            "title": "h5",
            "titleAttributes": "class=jsdoc-honors",
            "titleCaption": "<em>Honors</em> the following configuration settings:",
            "usePartial": "params.tmpl"
          },
          "remarks": {
            "title": "h5",
            "titleAttributes": "class='jsdoc-remarks-title capitalize-title'",
            "wrapper": "div",
            "wrapperAttributes" : "class=jsdoc-remarks-body"
          },
          "futures": {
            "title": "dt",
            "titleCaption": "Futures:",
            "titleAttributes": "class='tag-futures capitalize-title method-doc-label method-doc-details-label'",
            "outermostWrapper": "dd",
            "outermostWrapperAttributes": "class=tag-futures",
            "outerWrapper": "ul",
            "wrapper": "li"
          },
          "attribs": {
            "alternateHandler": "partial.scaffolded.attribs.tmpl",
            "template": {
              "displayStyle": "badges" 
            }
          }
        }
      },
      "details": {
        "all": [ "todo", "*" ]
      },
      "members": {
        "tags": {
          "attribs": {
            "alternateHandler": "partial.scaffolded.attribs.tmpl",
            "template": {
              "displayStyle": "csl"
            }
          }
        }
      }
    }

  Note that the `members` section does not actually honor "order" or "tags" per se, but like `method` it does make use of `partial.scaffolded.attribs.tmpl` which, as a scaffolded template *does* honor tag specifications which, when referenced from `members.tmpl` will look for a tag specification in `templates.customizeOutput.members.tags`.  

<a name="customizeOutput.templates.order"></a>

##### The "Order" field

An "order" field specifies the order in which listings should be rendered for a given doclet.  This field takes an `array` of `string`s which specifies the order by tag name in which the listings should be rendered.  The special identifier `"*"` is a catch all, meaning *"all the __default__ listings which I have not explictly placed elsewhere"*.  Note the *default* callout.  Each template (from `docstrap`) has a default, expected set of listing to output.  So, for instance, `shinstrap` normally displays the following tags in `method.tmpl`:

    [ "description", "augments", "type", "this", "params", "details", "requires", "fires", "listens", "listeners", "exceptions", "returns", "examples" ]

So an "order" entry in `templates.customizeOutputs.method.all` of `["*"]` will result in the listings above being rendered in that order.

    [ "notes", "*", "futures" ]

Would result in first the `"notes"` tag being rendered, then all the defaults, and finally the `"futures"` tag.  You can also specify ordering for default tags, and as indicated above, the `"*"` will only include default listings which are not already specified.

    [ "description", "notes", "*", "futures", "examples" ]

Would result in the following ordering

    [ "description", "notes", "augments", "type", "this", "params", "details", "requires", "fires", "listens", "listeners", "exceptions", "returns", "futures", "examples" ]

<a name="customizeOutput.templates.tags"></a>

##### The `"tags"` section 

The `tags` section of `customizeOutput` allows you to specify how you want a given set of data to be displayed for a given doclet (by template, see [template sections](#customizeOutput.templates) above for more detail).  Within each template namespace the `tags` sub section contains an entry for each tag whose rendering you wish to control (or override).  The `tags` specification for the default tags are all located in `defaults.json`.  These can be useful as examples.

(At this time), there are two templates which control the rendering of data (or a `listing` in `shinstrap` terminology)--`listing.scaffolded.general.tmpl`({@link module:template/publish.General}) and `listing.scaffolded.kv.tmpl`({@link module:template/publish.KeyValue}).  (If this were shinmark-based, I'd pull the honors data directly out of the relevant files).  

The primary difference between these two templates is how they structure their output.  The general pattern is to emit a fully formed and closed title element followed by a fully formed and closed value element (with some possible degree of structure nesting).  The "KV" template allows for a key-value pattern where the "title" element contains the "value" element.  The list of which customization settings each template honors is listed in the associated template documentation in the publish module ({@link module:template/publish}).  `listing.scaffolded.general.tmpl` is the default handler for all listings (unless the `tags` setting `alternateHandler` is used).

```
"templates": {
  "customizeOutput": {
    "container" : {
      "article" : {
        "overview": {
          "all" : [ "description", "notes", "*" ],
          "tags" : {
            "notes": {
              "title": "h5",
              "titleAttributes": "class='jsdoc-notes-title subsection-title'",
              "wrapper": "div",
              "wrapperAttributes" : "class=jsdoc-notes-body"
            }
          }
        }
      }
    }
  }
}
```

In the example above, the `tags` section is in the `container.article.overview` "namespace".  Which is to say that the settings in the excerpted `tags` section apply to the "overview" section of the "article" in `container.tmpl`.  The `tags` section has only one listing in this example (but it could have many)--the `"notes"` entry.  This setting instructs `shinstrap` when rendering the overview section of the article element in `container.tmpl` to watch for `doclet`s with a `doclet.notes` defined.  If such is encountered, `shinstrap` will use `listing.scaffolded.general.tmpl` to render the `doclet.notes` information.  The general listing template in turn will look at the settings inside of `container.article.overview.tags.notes` to decide how to render the listing.  In the example above, it emits a title in an `<h5>` element with the attribute `class='jsdoc-notes-title subsection-title'` followed by a `<div>` element with the attribute `class=jsdoc-notes-body` containing the actual data in `doclet.notes`.  

Most settings are "ignored" if not present for a given tag.  Each scaffolded template has its own defaults for the `wrapper` and `titleWrapper` settings if neither specified nor overridden.  The tag specifiers in the `tags` section leverage a number of general case settings:

`wrapper` {string}
:   The html element to generate for the list value.

`wrapperAttributes` {string}
:   The attributes for the `wrapper` tag.

`outerWrapper` {string}
:   An html element to wrap the `wrapper` in.

`outerWrapperAttributes` {string}
:   The attributes for the `outerWrapper` tag.

`outermostWrapper` {string}
:   The outer most (third) wrapping html element for the `wrapper` tag.  Since each level is ignored individually if not specified, an `outermostWrapper` for a tag without an `outerWrapper` will effectively behave like an `outerWrapper`.

`outermostWrapperAttributes` {string}
:   The attributes for the `outermostWrapper` tag.

`suppressTitle` {boolean}
:   If `true` will instruct `shinstrap` to suppress rendering of any title or title elements.  This invalidates all the title settings listed below.

`titleWrapper` {string}
:   The html element to wrap the listing's title in.

`titleWrapperAttributes` {string}
:   The attributes for the `titleWrapper` tag.

`outerTitleWrapper` {string}
:   An html element to wrap the `titleWrapper` element within.

`outerTitleWrapperAttributes` {string}
:   The attributes for the `outerTitleWrapper` tag.

`titleCaption` {string}
:   A replacement for the default title (which is based on the tag name).

`titleContextPluralize` {object}
:   An awkward setting 8D.  This is an object with two keys `singular` and `plural`.  If the associated `data` is has only one value (`length === 1`), the string value of the key `singular` will be used.  More than one, and the `plural` value will be used for the title.

`titleInterpolation` {string}
:   :es6: This setting instructs `shinstrap` to interpret the provide value as a template string and use it for the listing's title.

There are also a few more advanced setting options.

###### Identifying the data

By default, in most cases, the presence of data needing to be rendered is inferred implicitly from the name of the tag.  `"notes"` above implies the presence of a `doclet.notes` value.  If that value is not present it means that there are no notes to render for this entity.  In the unlikely case that additional validation is required, it can be specified in a `validate` setting.  The value of this setting is a string which must evaluate to true in order for the perspective listing to be considered "valid" or necessary for rendering. See [writing eval expression](#customizeOutput.templates.tags.evals) for more information.

For certain types of data, particularly associating disparate `doclet`s with each other, it is necessary to instead specify a `find`.  When a `find` is indicated, a value on `doclet` is not looked for.  Instead, `shinstrap` performs a `find` (taffyDB) with the parameters specified.  As written, `find` currently only will accept a `kind` and a `memberof` field.  `kind` is taken literally, but for legacy purposes, `memberof` is evaluated, in the event that the `memberof` needs to reference another object (like the doclet itself--e.g doclet.longname).  See [writing eval expression](#customizeOutput.templates.tags.evals) below for more information.  For specifics on how `find` works, see {@link module:template/publish.handleScaffolding}.

###### Handling "Complex" Entries

There are a number of prebuilt template handlers for a variety of documentable entities like params, members, sources, properties, etc.  At this time not all of these templates are documented, however ({@link module:template/publish}).  New templates can also be created and added to the [`templateOverrideDir`](#templateOverrideDir).  To leverage one of these templates (new or old) with a tag (again, new or old) you can use one of a few different handler specifiers.

`alternateHandler`
:   Allows you to specify a scaffolded handler to use instead of `listing.scaffolded.general.tmpl`.  At this time the only other scaffolded handler is `listing.scaffolded.kv.tmpl`.

`defer`
:   The counterpart to `alternateHandler`, `defer` will defer rendering of a listing to the template specified *without* any scaffolding.  Use this to have old school `docstrap` templates render your entity.

`usePartial`
:   This setting instructs `shinstrap` to utilize the specified template (without scaffolding) to generate the "wrapper" portion of an entity.  Title rendering (and any outerWrappers) are still controlled by the primary listing template.  New templates conducive for use with this setting are named `partial.*.tmpl`.  The behavior of this setting can be further customized with `usePartialOnField` which instructs `shinstrap` to pass into the template the field on the data entity specified.  (e.g. if working on data.notes and `usePartialOnField` was set to `"special"`, `shinstrap` would call the `usePartial` specified template on `data.notes.special`).

`usePerItemPartial`
:   This setting is similar to `usePartial` except that it is only valid with data entries which are arrays (technically `forEach`able).  Rather than being called once for the entire entry, the template is called `forEach` element in the data entry.  

`perItemMapPartial` 
:   This setting takes an object.  The keys in that object represent cases in which the associated value template should be used.

```
{
    "i.signature" : "method.tmpl",
    "default": "members.tmpl"
}
```

For purposes of `perItemMapPartial`, `i` is the item in question for reflection purposes.  `"default"` is the default template to use should none of the other cases be valid.  These keys are treated as [eval fields](#customizeOutput.templates.tags.evals).

###### Item Marshalling

The `itemMarshalling` setting allows you to specify, finally, to `shinstrap` that you would like one or more marshalling functions called on the value before it is rendered.  The same functionality can be achieved in many other ways, of course, but this feature allows for easy use of legacy marshalling functions from `docstrap` such as the various link creators.  

```
"itemMarshalling": [ [ "linkto", "", "" ] ]
```

Marshallers are executed in order.  The first parameter is the name of the marshaller followed by any parameters it takes.  Each parameter is expected to be in reference to the data entity in question, so `""` is the entity itself, whereas "`longname"` would amount to `data.longname`.

<a name="customizeOutput.templates.tags.evals"></a>

###### Evals in Tags block (Writing eval expressions)

Expressions evaluated in the context of a `tags` definition are handled inside {@link module:template/publish.handleScaffolding}.  The main thing to note here is that the current doclet/data object is available in `_doclet`.  You can check in `defaults.json` for examples of various eval expressions.

For `perItemMapPartial` its haxtastic key-cases provide the variable `i` to reference the current "item" being considered.

###### Templates

This is a bit of estoerica, really.  Templates with "."-pathed names are wholy new as of `shinstrap` and did not exist in `docstrap`.  Otherwise template names remain the same (albeit their contents may be quite different).  A template with `scaffolded` in its name expects to be called from `scaffoldPartial()` one way or another.  If you are writing your own templates and want to call one of these, this means you need to call `self.scaffoldPartial('template.tmpl', doclet, listing)` or `self.scaffoldPartialBySpec('template.tmpl', doclet, "template:specifier")`.  If you are doing this sort of thing, you should look at the larger documentation for the template (as generated by `jsdoc`! 8D)--{@link module:template/publish}