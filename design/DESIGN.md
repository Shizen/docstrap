
# Design Documentation

`shinzen` which I've now rebranded to `shinstrap` as I've decided to stick closer to its `docstrap` roots for this version (and to remove dependencies on things like `shinmark`) was originally designed to enable easy inclusion of flexible/powerful rendering rules for new, custom jsdoc tags.

## Percolation/RFC Issues

These are, theoretically, the issues I'm currently pondering on a "design" level.

- I want to add a warn/log level functions.  I know I said I wasn't going to change how docstrap worked for error handling/reporting, but it's driving me a bit loopy to continue in this state of "wrongness".
- Some doclets get extra, special handling within `docstrap` before being rendered.  If we want to enable such things ourselves, we need to extend `publish` to patch in settings from the conf settings.  The trickiness here is that doclet are not tags, this is a separate level of reference :(.
	Currently I do this in `customizeOutput.doclets.*.processing` which probably should be called preprocessing, but also is an extremely limited solution. More exploration is needed to determine a "better" one, however.
- `extends` from `method.tmpl` and `implementors` from `details.tmpl` have not been tested.
- Allow setting of "master" defaults used in `listing.scaffolded.general.tmpl`?
- I contemplate replacing eval processing with a finite set of flags for each specific use case once I have them all enumerated. -- Increasingly less inclined to do so.
- [Sideways] Convert to using one `env` (which would then be unpacked in `handleScaffolding`)?  Here I mean `title` and `kind` in addition to `doc`/`data` rather than passing them in individually no the stack.  This is totally the way a sandbox call would end up being built.  Upon looking at it, there are only a few cases in use at the moment.  I'm strongly inclined to enumerate them directly as mentioned above, but I'm leaving it in for now while I test.  In the interim, I put in the env, but decided instead to simply access all the relevent information directly (e.g. from `_doclet.kind`, etc.).  In my testing these are always the same, but I haven't tunneled into the code enough to verify this to be factual.
- [No] Perhaps I should to use a json merge algorithm for defaults in the main tmpl files (e.g. `container.tmpl`). `_.defaults(object, *defaults)`.  The issue here is unintended consequences and desired precedence.  At the moment, something which has a default is entirely overwritten if you set any preference for it.  If you were only intending to tweak the settings, this might be inconvenient (and even unexpected), but the inverse is also true (having to override each individual setting).  I feel like the defaults applying per "listing" (or tag) is most intuitive.  Which is to say, "no", let's not do this.
- [No] Summary.  Do I add summary option with an option to suppress to every tag, basically?  `if(data.contents.summary && data.scaffolding.allowSummary)`...  Why didn't I do a `var rules = data.scaffolding` at the start of that file, ffs :(?  Anyway.  I'm inclined to say yes I should, but I suppose the issues are two-fold.  First, I'm introducing aberrant behavior--by default, some listings allow summaries while most listings do not.  Whichever way I make the default of `allowSummary` will not match that, although I suppose I control the defaults in each of the aggregator templates, so I can mimic the defaults presumed, and thus I'm simply allowing people to customize more which seems fine.  Ok.  So then the main problem stems from the structure of the summaryList itself.  The summary appears in a `<dd>` which is both not valid for many other listing formats (which is maybe not my concern), but also not possible within my system as specced atm to emit two values for a listing at different layers.  I could add.. what...  `allowSummary: 'templateName.tmpl'` and then.. I guess *inside* itemMarshalling I could do something like `if(data.contents.summary && data.scaffolding.allowSummary) { self.partial(data.contents.summary, data.scaffolding.allowSummary) }` modulo context of not being in a tmpl at that moment.  And then I have to add a `listing.summary-in-dd.tmpl` as the default...  I'm feeling very meh about this now.

	Similarly, the `namespaceLinkedSummary.tmpl` file ought to be replacable with an application of something more generic, but I haven't figured on a reasonable format that doesn't involve yet another eval.  I could allow for an interpolated string with only direct value references (basically a poor man's sandbox).  Still conflicted on the whole avoid the eval in an internal dev tool.  Tempted to just make a marshaller for this pattern and use itemMarshalling...  Would require setting up linkedSummary.tmpl as a customized `tmpl`, e.g. `partial.custom.summarizable.tmpl`.  This would involve needing to pass in/decorate `data.contents` with `data.scaffolding` in the `usePartial` and `usePerItemPartial` conditions of each `listing.custom.*`.  This pattern would obviate the need for a `allowSummary` setting (it's implied by using the summarizable template, right?).  It'd look something like this.  

		"classes": {
			find: {
				kind: 'class', 
				memberof: "doc.longname"
			},
			validate: "doc.kind !== 'globalobj'",
			titleWrapper: "h3",
			titleWrapperAttributes: "class=subsection-title",
			outerWrapper: "dl",	// pretty much required for well-formed html :/...
			useScaffolded: "partial.custom.summarizable.tmpl",
			itemMarshalling: [ [ "linkto", "", "" ] ]		// resolveNamespaceLink for namespaces
		};

## Design Goals

Build a customizable template to get around those limits of `docstrap` which irritate me most.

### Things I don't like about Docstrap...

- Like most (all?) templates there is no way without changing `.tmpl` files to add new tags reasonably (without hax, basically).  The `.tmpl` files aught to be built to look through and include AST leaves dynamically.
- Customizing requires modifying the `.less` files as specified in their readme below.  This is also super fragile.
- The customization pattern asks you to go into this module's directory and do an `npm install` and `bower install` (already unnecessary), so you can then run some grunt tasks to run `less`.
- Similar issues with recognizing AST nodes like `Tasks` or alternates to `Tutorials` so you could have arbitrary menus like `APIs` or whatever. 
- I hate the style "tweak" methodology below.  It's incredibly fragile.
- Their use of bootstrap is currently broken but also feels fragile

Probably unrelated...

- Shinmark markdown plugin.  The plugins in templates do not appear to be used as plugins for the base system.  So, basically, the plugin can be its own module, or included with this one, but has to be explicitly referenced from the root `.jsdoc.conf`.  

### Menus

The original idea was to allow something like:

	{
		"menus" : {
			"APIs" : {
				order: 1,
				"parents": [ "file-name-from-tutorial" ]
			}
		}
	}

Ideally, we'd add what I'm calling atm "menu" information to the tutorials directory's config .json (why that json file isn't part of the master config file I don't know).  So maybe I should say that ideally I'd merge it into the config json, but either way, these are effectively `jsdoc` level changes.  jsdoc create the doclets for tutorial files and munges them with `children` and `title` information within itself before it gets to the template.

Now, of course, I can go grab this file again and parse it again.  I could even go steal the code from jsdoc to do it so as to ensure the same mapping/discovery.  The format I had envisioned would look something like this:

    {
        "test1": {
            "title": "Tutorial One",
            "scope": "private",
            "menu": "APIs"
        },
        "test2": {
            "title": "Tutorial Two"
        }
    }

I don't particularly like the idea of reading it twice.  I also think all tutorial information really ought to live in the `.jsdoc.json`.  Multiple files is teh evil.  There's some legacy issues with per file `.json` config files (e.g. `test1.json` and `test2.json`).  Without drawing a definitive conclusion on this issue, I'm going, for the moment, to put scope information along with the "menu" settings currently in `customizeOutput`.  If it matters, the flames will likely inform the final pattern. 

Of course, once I've looked at the jsdoc source on this topic, it will likely turn out that menus can be subsumed into the parent/child system by simply allowing multiple root parents which would then be the menus (or having the direct children of the current tutorial root be the menus, etc.).  OT at this point.

Currently we have

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

This means, btw, that `access` control is by menu and is all or nothing.  So we do not have per "tutorial" level access.  Also there are some ambiguities.  If you list the same file as a member of two or more menus, that will actually work (as in they will show up in both menus, or either menu in the event one is access restricted).  This does *not* hold true for tutorials itself.  There is currently no way to put a document both in a menu and in the default "tutorials" menu.  This could be considered a bug.  There's also issues with parents & children.

### Themes

So, to generate their themes, they use an extended build process.

First, you have to configure `jsdoc.conf.json` (yes that "example" conf file), and set it to the theme you want to modify.  Then you have to update the `.less` template files they have for that theme.  The links for this are broken, but their documentation says that `grunt apply` is supposed to update those.  Once updated, you can then modify them (they recommend you modify `main.less` only, probably because the other two get replaced everytime you load a new style).  Then you "build" your changes by doing `grunt less`.  Then *the next time* you build your docs, if you use the new modified theme, it will be included in the generated docs directory.  So to recap...

0. Install all this module's dependencies (`npm install`; `bower install`).
1. Set the theme you want to modify in `jsdoc.conf.json` (the one inside the mod).
2. Get the updated `bootswatch.less` and `variables.less` files by running `grunt apply` (currently bugged!)
3. Modify the `main.less` file with the changes you want.
4. Compile the new version of this theme by running `grunt less`.
5. Rebuild your docs.

Note that if you forget what you are doing, and change the theme in `jsdoc.conf.json` mid process, and then run `grunt less` later, you will just overwrite that theme.  There is no sanity testing of any kind.

## Ideas

I'm thinking I'd like to allow you to set something like this...

"template": {
	"sections": {
		"method": [ "description", "notes", "remarks", "*", "futures", "changelog" ]
	}
}

The idea here being that this would output `doclet.description` first, if present, than `doclet.notes`, then `doclet.remarks`, then all the predefined normal things we understand (params, see also, listens for, etc.), then `doclet.futures` and finally `changelog`.

We could also allow some additionally configuration by extension...

"templates": {
	"container" : {
		"header" : {
			??
		},
		"article" : {
			"overview": {		// Module with modules, Class or every other case...
				// "class", "module-with-modules"  (cases for container)
				"all" : [ "desription", "task", "*" ],
				"kind" : [],		// How to catch the "module with modules" case?
				"module" : []			
			}
			"tags" : {
				"task": {
					"suppressTitle" : false,		// Can be ommitted if false
					"titleWrapper": "h5",
					"titleWrapperAttributes": "class=jsdoc-task-title",
					"wrapper": "div",
					"wrapperAttributes" : "class=jsdoc-task",
				}
			}
		}

	}
	"containers" : {
		"module" : [ "task" ]
		"method" : [ "description", "algorithm", "notes", "remarks", "*", "futures", "changelog" ]
	}
	"container-lists" : {		// Define custom container lists
		"tasks" : {
			"lists-kind": "task"
		}
	}
	"section-details": {		// Only necessary to override defaults;  The "notes" example I have below is what I imagine the default to be
		"notes" : {
			"wrapper": "div",
			"class": "notes"
		},
		"shin-example": {			// So looking for doclet.example, to put it in a <pre> tag with the class "shin".  Could also do montages.  Another idea would be to allow
													// some simple interpolation so you could maybe do... "class" : `${doclet.fullname}-example` or some such.
			"leaf" : "example",
			"wrapper" : "pre",
			"class" : "shin"
		}
	}
}

To override the theme default layout structure.  This allows a given project to specify its desired repos setup.

I have a growing list of defaults.  I'm not sure how pandemic they are, but they may want to move into `publish.js` rather than being set "inline" in their respective `tmpl` files.


container.tmpl ("overview"):

		[ "container", "article", "overview"...
		 ... "default" ]
		 ... "class" ]
		 ... "module-with-modules" ]

		// Conceptually we're looking at three parts

		{
			"gather"			// The information necessary to know what doclets to display
			"validation" 	// How to validate the "gathered" resources.  This is the most controversial one for me because I do not have an exhaustive understanding of the system.
			"display"			// How the doclet(s) should be rendered.
		}

		// Similarly, there are three general cases or patterns of gathered data.

		1. A string (e.g. description)
		2. A doclet {object} (e.g. a method)
		3. A collection of doclets {array} (e.g. a collection of parameters)

		arrangement.tags.description = arrangement.tags.description || {
				suppressTitle: true,
				wrapper: "div",
				wrapperAttributes: "class=description"
		};

		arrangement.tags.details = arrangement.tags.details || {
				defer: "details.tmpl",
		};

		arrangement.tags.examples = arrangement.tags.examples || {
				titleWrapper: "h3",
				usePartial: "examples.tmpl",
				titleContextPluralize: true
		};

		arrangement.tags.classes = arrangement.tags.classes || {
			// This find has an extra validation -- `doc.kind !== 'globalobj'` -- the precise requirement cause I'm not clear on.
				find: {     // Presence of find implies a list result which will be foreach'd with each result being applied
										// This is implemented in `find.tmpl`
						kind: 'class', 
						memberof: "doc.longname"    // Right now this is convention that `memberof` is resolved while `kind` is static.  One could create an interpolation pattern instead, but overkill for the moment
				},
				titleWrapper: "h3",
				titleWrapperAttributes: "class=subsection-title",
				usePartial: "linkedSummary.tmpl"			// We could allow an examples.tmpl style template for `items` with a different line (or the converse--
																							// usePartialPerItem: "method.tmpl" to signify calling inside a `forEach`)
		};
		
		arrangement.tags.methods = arrangement.tags.methods || {
				find: {     // Presence of find implies a list result which will be foreach'd with each result being applied
										// This is implemented in `find.tmpl`
						kind: 'function', 
						memberof: "title === 'Global' ? {isUndefined: true} : doc.longname"    // Right now this is convention that `memberof` is resolved while `kind` is static.  One could create an interpolation pattern instead, but overkill for the moment
				},
				titleWrapper: "h3",
				titleWrapperAttributes: "class=subsection-title",
				usePartial: "method.tmpl"			// usePartialPerItem: "method.tmpl"
		};

### Menus

	{
		"menus" : {
			"APIs" : {
				order: 1,
				"parents": [ "file-name-from-tutorial" ]
			}
		}
	}

By default, any file not explicitly assigned somewhere goes to the Tutorials list

## The Plan

I am currently debating whether I should get into modifying jsdoc directly.  Some of the issues above (shinmark interpretation of tutorial files, for instance), may require patching jsdoc directly to take advantage of.  [jsdoc](https://github.com/jsdoc3/jsdoc/blob/master/lib/jsdoc/util/markdown.js) uses `markdown-it` internally but doesn't expose the parser, save through some hard coded predefines.  This would have to be patched in order to allow a custom markdown-it parser to be used.  This also aught to be integrated into markdown.js plugin (right now I have a hard-coded version which uses my `shinmark` lib).

If I were to patch this, I would have to decide how to exactly specify or pass in the custom markdown-it parser.  This is problematic, of course, because it is specified in a `conf.json` file, which means I can't instantiate it and pass it in.  This may also be relevant to consider in the light of customizing VSC, which also allows a specification of a markdown-it tweaked parser.  I should really look at that.

- Custom markdown-it parser specification at `jsdoc` root.
- Custom template with dynamic layout by settings of containers (method, module, class, etc.).
	- Some mechanism for specifying new template files for custom containers and layout files patch configurable.
	- Add a generic container that will basically just layout based on leaves it knows with generic/normal handling of custom leaves.
- Specify custom added menus (ala. Tutorials) with configurable files listed.  Basically, alternate tutorials lists.  This probably requires modification of the `jsdoc` root as well.	 The markdown parser is specified [here](https://github.com/jsdoc3/jsdoc/blob/b21427343c7294bbf1f14c718a390f3e955e37cb/lib/jsdoc/tutorial.js#L102).

*I've moved `jsdoc` level issues and thoughts to shin-jsdoc's `DESIGN.md` file.


## Design Notes

As it stands, I currently associate templates with customization settings (directly).  These are done contextually in the `customizeOutput` object, using basically a specifier path (e.g. "container:overview:case").  The idea basically being `{template}:{subsection|branch}*:{branch selector}`, where a `subsection` is a structural section like `<article>` or `<div class=body>`, etc. and a `branch` is a "major" template branch (e.g. `kind==="class"`, etc. where it makes sense by template).  Currently only the `container.tmpl` has "branches".  These are obviously artificial and alterable by template as it grows.  The final branch selector is probably a bit sloppy*, but is designed to allow setting a default for all the final branches.  This could probably be rearchitected to allow defaulting anywhere along the path, but I have not done so, as yet.  In any event, the idea is you could specify `"container:article:overview:class"` or `"container:article:overview:default"`.  The former would look for a `customizeOutput.container.article.overview.class` object to describe the ordering in the "class" branch case.  If it was not present, it would instead lookd for `customizeOutput.container.article.overview.all` as the default.  If neither are present, it will set the order to `[ "*" ]`.  `"container:article:overview:default"` on the other hand, simply looks in `customizeOutput.container.article.overview.all` or returns `["*"]` for the order.  Tags are determined without consider the "branch selector", so in both of the cases above, tag descriptors will be looked for at `customizeOutput.container.article.overview.tags`.  If not present, they will be set to defaults (`tags: {}`).

It may turn out, in the long run, that it is desireable to have more context.  This will require some refactoring.  The thought here is that one might with to know, for instance if `details.tmpl` was called from `container.tmpl`, `members.tmpl` or `method.tmpl`, etc.  The specifier would need some new rules both for factoring and for determining defaults and fallbacks.  

Another long term gotcha is that I'm probably going to want to be able to specify a data "key" that is different from the rule "key".  I.e. the "attribs" rule may not always want to reference "data.attribs".  We've seen this already with "source", where the "source" rule is called "meta", iir, because "meta" is where the source information is held.

It seems as though there are two types of templates--scaffolded and direct pass-through.  The former expects to receive a complex object describing what it is displaying, including `rules`.  The later expects just a raw data object (these are the old style).  The former would require introduction of scaffolded directed keys, e.g. `useScaffoldedPartial`, `usePerItemScaffoldedPartial`, etc.  I haven't actually needed any yet.

In addition to the standard tag descriptors, I have added the concept of template specific descriptors, to call out options which are only valid on a given template because, presumably, it has special handling for them.  These are held in a special `template` descriptor in the greater tag descriptor.
"attribs": 

	{
		"alternateHandler": "partial.scaffolded.attribs.tmpl",
		"template": {
			"displayStyle": "badges"  // One of badges, buttons, csl
		}
	}

---

So basically, when it comes to generation of html for a specific listing we have..

With three levels of wrap plus title, with the bottom level being `forEach`able, and we can substitute a partial (in effect at any level by not declaring the levels above/below it)... Other than clear naming...  That would give me: `outermostWrapper`, `outerWrapper`, `wrapper` and `title` with `defer` (nothing), `usePartial` (wrapper), `usePerItemPartial` (wrapper, `forEach`ed), and `perItemMapPartial` maybe will cover all the cases?  Then `asDefinition.tmpl` goes away (save the defaults question), and instead is just 

    "futures": {
        "titleWrapper": "dt",
        "titleCaption": "Futures:",
        "titleWrapperAttributes": "class='jsdoc-futures-title capitalize-title'",
        "outermostWrapper": "dd",
        "outerWrapper": "ul",
        "wrapper": "li",
    }

and `todo` becomes...

    "todo": {
        "titleWrapper": "dt",
        "titleCaption": "ToDo:",
        "titleWrapperAttributes": "class='tag-todo method-doc-label method-doc-details-label'",
        "outermostWrapper": "dd",
        "outermostWrapperAttributes: "class=tag-todo",
        "outerWrapper": "ul",
        "wrapper": "li",
    }

The `linksList.tmpl` (e.g. requires) becomes...

    "requires": {
        validate: "data.kind !== 'module'",
        titleWrapper: "h5",
        titleCaption: "Requires:",
        titleWrapperAttributes: "class=subsection-title",
        "outerWrapper": "ul",
        "wrapper": "li",
        "linkto": [ "", "" ]
    };

`asLinksList.tmpl` simply goes away, as it is the non-array case of the above.

Upon dealing with `details.tmpl` I have switched from a `linkto` specific marshaller to an `itemMarshalling` rule.  `itemMarshalling: [ [ "linkto", "", "" ] ]` where `linkto` could be any marshalling function defined on the `view` (for instance, `resolveAuthorLinks`).

The "KV" listing case would remain.

Initial notes/planning outlined these cases:

- the complex case (e.g. `method.tmpl`, etc.), which uses a custom template to piece together many disparate listings to present a view on a complex doclet.
- the definition case (e.g. `asDefinitionTerm.tmpl`) <--  And this could just be a branch in `customizedListing.tmpl` : This would subsume `linkedSummary.tmpl` and `asDefinition.tmpl`
- the list case (e.g. `customizedListing.tmpl`) : this would subsume `linksList.tmpl` and `asLinksList.tmpl` with the ability to specify asLink, but specifying the params to `self.linkto` seems problematic short of resorting to more evals.  I guess we could do "item", "item.longname", "item.name" and deref manually.  Or "" for item, and "name", etc. for the subfield.  That would be workable.
- a basic title-wrapper/div listing (e.g. `customizedListing.tmpl`)
- the KV case (e.g. `asKVHeading.tmpl`).  This format is a-pattern, putting the title (key) and listing (value) inside the same tag (e.g. `<H5>`) to get something like...
	<h5>Type: [Object]</h5>

## Conventions

First, some basic terminology.  A doclet is an entity, as defined generally by `jsdoc`.  (e.g. a method, class, module, namespace, etc.).  An "entry" is a discrete displayable chunk of data in the context of a doclet.  A entry can be, itself another doclet or even an array of doclets (e.g. the members of a class, methods in a namespace, etc.).  I use the term entry to refer to the overall information being rendered in this context.  I use the term "listing" to describe the internal name for the entry.  So the "listing" for the members of a namespace is "members".  A [display] "item", which I don't think I use often, refers to a member of an entry array in the event that an entry is an array of doclets.  (e.g. a single member doclet in "members").

I've decided to adopt a naming convention for `.tmpl` documents.  

A full entry handler will start with `listing.`.  A `listing` template (maybe I should have called in `entry`, huh), should be "deferred" to, in that it is a complete entry handler in its own right.

A fragment template will start with `partial.`.  These templates are expected to be invoked via something like `usePartial` or `usePerItemPartial`.

A `scaffolded` template expects to be called from `handleScaffolding` {@link module:template/publish.handleScaffolding}, which primarily means it expects to receive a complex data object containing rendering rules.  The exact set or rendering rules a given template will honor should be listed in the template documentation in {@link module:template/publish} (not all rules are valid/applicable to all entry renderers).

### Debatable

I have come to refer to each individual display element of a doclet as a "listing".  Originally, I called them `tags` (as is demonstrable in the `.jsdoc.json`).  Listings seems better than tags, but I'm not sure it is entirely appropriate either.  "Entry" might be better?  A namespace has entries for the classes and mixins it contains.  A module has entries for its methods, mixins, classes, namespaces, requires, augments, typedefs...  It still sounds a little awkward, but maybe best.  
