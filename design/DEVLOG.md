# Dev-log 

Developer log, scratch pad and todo list for `shinstrap`.

## ToDo

- Proof Usage.md:
    - Fix documentation for "container" paths.
    - I should probably clean up my language between "display [item]", "listing" and "entry".
    - ? add new lines to `<code>` samples to lessen need for scrollbars?
- Fix or rollback notes as `<details>`

- internal fork to `shinstrap`
- fork from `docstrap`
- fix `package.json` for github repos
- I need a license doc
- I need to wire up the wiki..

- Review docstrap's toc building code

## Issues/Futures, the Dev Edition

- template-helpers.  Never bothered to finish implementing them.  Would be useful for documenting `itemMarshalling` in `Usage.md`.  (Now Removed)
  I removed `@templateHelper` a while ago, but effectively this is a group aggregator tag.  Easy enough to implement at its core.
- Add some gists for popular tag scenarios like grunt tasks, express routes/web api/REST routes...
- extend `@honors` to have a "valid if" or "requires" column.  E.g. `titleWrapperAttributes` are only valid (well, only used) if `titleWrapper` exists and `suppressTitle` is not `true`.  Could also define a precedence column of sorts.
- [shinzen]: I didn't do this for `shinstrap` but possibly for `shinzen` I think I will simplify the tag descriptors by using an interpolated wrapper, rather than `wrapper`, `wrapperAttributes`, `outerWrapper`, `outermostWrapper`, `wrapperBusterBusterBuster`... etc.

        `<h5 class="jsdoc-notes-title">Notes</h5><div class="jsdoc-notes">${data}</div>`
    
    So I'll end up with `find`, `validate`, `render`, `defer`, `usePartial`, `usePerItemPartial`, `perItemMapPartial`... Might want to separate the data out to allow for specific marshalling I guess.  Could still have `alternateHandler` just wouldn't need it for KV.  The marshaller would be able to handle `usePartialOnField` cases.  'course it would only work on ES2015+.  Item Marshaller will have to be some sort of eval mess too.  if `usePartial`/`usePerItemPartial` could be evalled, I could dump `perItemMapPartial`.  Sounds nice.
- Transitions for collapsible.  Just a throw out example, anyway, but it ought to have a transition.  Something like..
        fieldset.jsdoc-redirect {
            transition: 5s height ease-in-out;
            overflow: hidden;
        }
        fieldset.jsdoc-redirect[data-hide="true"] {
            height: 0;
        }
        fieldset.jsdoc-redirect[data-hide="false"] {
            height: 100%;
        }
  Alternatively, I could follow bootstrap's pattern for collaspible, which is probably the correct answer for `shinstrap` being.. uh.. bootstrap based... right?
- the default template coloring that I'm using is a bit fubar.
    - related, I should probably look at fixing `docstrap`'s themer
- `types` handling kinda sucks.  Specifically I mean the shoe horned testing of `data.types.names`.  If this wasn't literally the only place I'd seen this, I'd be more certain that it should be resolved in a more generalized fashion.  It is not *quite* appropriate for a recursive resolution.
  This is indicative of a larger issue of the shoe-horned, overly specific nature of just about every aspect of this template, built as it was to conform/allow the options present, rather than architected to allow the widest variety of options possible.  This is probably a `shinzen` target issue.

## Changelog

- Added `supplementalFonts` support...  this is getting a bit rediculous.  Perhaps I should have a manifest section that lists all static files to bring over, rather than this ever growing colloection of piecemeal include lists...

## Notes

### Access

In `publish()` they set `opts.private = true` for `-p`.  Otherwise it's `opts.access = "protected"` for `-a protected` (for instance).

The access rules as written are a bit strange to me.  I ought to verify them, but I'm a bit busy.  As written the rule is...

`-a public`
:   Only display doclets tagged as "public" (but not protected, private or undefined)

`-a protected`
:   Only display doclets tagged as "protected" (but not private, public or undefined... weird, right?)

`-a private`
:   Only display doclets tagged as "private" (but not public, protected or undefined)

`-a undefined`
:   Only display doclets which are not tagged.

`-p` or `-a all`
:   Render everything.

## Log

When setting up I tried to simply set `template` to `"./template"`, but ran into an odd require bug with not being able to get `jsdoc/fs`.  I didn't work out exactly why, but rather circumvented the issue by symlinking `node_modules/@shizen/shinzen` to the project root and setting `opts.template` to `"node_modules/@shizen/shinzen/template"`.

### Format 

    "customizeOutput": {
      "container" : {
        "article" : {
          "overview": {		// Module with modules, Class or every other case...
            "all" : [ "description", "notes", "design", "*" ],
            "tags" : {
              "notes": {
                "titleWrapper": "h5",
                "titleWrapperAttributes": "class='jsdoc-notes-title subsection-title'",
                "wrapper": "div",
                "wrapperAttributes" : "class=jsdoc-notes-body"
              },
              "design": {
                "titleWrapper": "h5",
                "titleWrapperAttributes": "class='jsdoc-design-title subsection-title'",
                "wrapper": "div",
                "wrapperAttributes" : "class=jsdoc-design-body"
              }
            }
          }
        }
      },
      "method": {
        "all": [ "description", "remarks", "*", "futures" ],
        "tags": {
          "remarks": {
            "titleWrapper": "h5",
            "titleWrapperAttributes": "class='jsdoc-remarks-title capitalize-title'",
            "wrapper": "div",
            "wrapperAttributes" : "class=jsdoc-remarks-body"
          },
          "futures": {
            "titleWrapper": "dt",
            "titleCaption": "Futures:",
            "titleWrapperAttributes": "class='jsdoc-futures-title capitalize-title'",
            "alternateHandler": "asDefinition.tmpl"
          }
        }
      },
      "details": {
        "all": [ "*" ]
      }
    }

-----

## Old static code

Mostly stripped, but can be seen in `v0.0.1-alpha.7`.

    <?js if (data && data.changelog) { ?>
    <h5>Change Log</h5>
    <div class="changelog">
        <?js= data.changelog ?>
    </div>
    <?js } ?>

-----

scratch pad for sanity & time saving vis a vis git ;)

## tutorials.json

{
    "test1": {
        "title": "Tutorial One",
        "children": [ "child1", "child2" ]
    },
    "test2": {
        "title": "Tutorial Two"
    }
}

## container.tmpl

### container-overview
(?:[\w.]+)\s*=\s*arrangement.tags.(\w+)\s*\|\| 
(\s)(?!["])(\w+)(?!["'\w\s.=-])
'(\w+)'

#### Class

                    <?js } else if (doc.kind === 'class') { ?>
                        <?js // This is basically a root level defer. I *could* put in something for this at the "renderDoclet" level, but it feels unnecessary. ?>
                        <?js= self.partial('method.tmpl', doc) ?>

#### module-with-modules

                        <?js if (doc.description) { ?>
                            <div class="description"><?js= doc.description ?></div>
                        <?js } ?>

                        <?js doc.modules.forEach(function(module) { ?>
                            <?js= self.partial('method.tmpl', module) ?>
                        <?js }) ?>

#### default

                            // Add in `tmpl` specific defaults 
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
                                titleContextPluralize: { singular: "Example", plural: "Examples" },
                                usePartial: "examples.tmpl"
                            };

### container-body
						// Add in `tmpl` specific defaults
                        arrangement.tags.augments = arrangement.tags.augments || {
                            titleWrapper: "h3",
                            titleCaption: "Extends",
                            titleWrapperAttributes: "class=subsection-title",
                            outerWrapper: "ul",
                            wrapper: "li",
                            itemMarshalling: [ [ "linkto", "", "" ] ]
                        };
                        arrangement.tags.requires = arrangement.tags.requires || {
                            titleWrapper: "h3",
                            titleWrapperAttributes: "class=subsection-title",
                            outerWrapper: "ul",
                            wrapper: "li",
                            itemMarshalling: [ [ "linkto", "", "" ] ]
                        };
                        arrangement.tags.classes = arrangement.tags.classes || {
                            find: { 
                                kind: 'class', 
                                memberof: "_doclet.longname"                                
                            },
                            validate: "_doclet.kind !== 'globalobj'",
                            titleWrapper: "h3",
                            titleWrapperAttributes: "class=subsection-title",
                            usePartial: "partial.linkedSummary.tmpl"
                        };
                        arrangement.tags.mixins = arrangement.tags.mixins || {
                            find: {     
                                kind: 'mixin', 
                                memberof: "_doclet.longname"    
                                
                            },
                            validate: "_doclet.kind !== 'globalobj'",
                            titleWrapper: "h3",
                            titleWrapperAttributes: "class=subsection-title",
                            usePartial: "partial.linkedSummary.tmpl"
                        };
                        arrangement.tags.namespaces = arrangement.tags.namespaces || {
                            find: {     
                                kind: 'namespace', 
                                memberof: "_doclet.longname"    
                            },
                            validate: "_doclet.kind !== 'globalobj'",
                            titleWrapper: "h3",
                            titleWrapperAttributes: "class=subsection-title",
                            usePartial: "partial.namespaceLinkedSummary.tmpl",
                        };
                        arrangement.tags.members = arrangement.tags.members || {
                            find: {     
                                kind: 'member', 
                                memberof: "_doclet.contents && _doclet.contents.title === 'Global' ? {isUndefined: true} : _doclet.longname"    
                            },
                            titleWrapper: "h3",
                            titleWrapperAttributes: "class=subsection-title",
                            usePerItemPartial: "members.tmpl",
                        };
                        arrangement.tags.methods = arrangement.tags.methods || {
                            find: {  
                                kind: 'function', 
                                memberof: "_doclet.contents && _doclet.contents.title === 'Global' ? {isUndefined: true} : _doclet.longname"    
                                
                            },
                            titleWrapper: "h3",
                            titleWrapperAttributes: "class=subsection-title",
                            usePerItemPartial: "method.tmpl"
                        };
                        arrangement.tags.typedefs = arrangement.tags.typedefs || {
                            find: {     
                                kind: 'typedef', 
                                memberof: "_doclet.contents && _doclet.contents.title === 'Global' ? {isUndefined: true} : _doclet.longname"    
                            },
                            titleWrapper: "h3",
                            titleCaption: "Type Definitions",
                            titleWrapperAttributes: "class=subsection-title",
                            perItemMapPartial: {
                                "i.signature" : "method.tmpl",        // This is a bit ugly
                                "default": "members.tmpl"
                            }
                        };
                        arrangement.tags.events = arrangement.tags.events || {
                            find: {     
                                kind: 'event', 
                                memberof: "_doclet.contents && _doclet.contents.title === 'Global' ? {isUndefined: true} : _doclet.longname"    
                            },
                            titleWrapper: "h3",
                            titleWrapperAttributes: "class=subsection-title",
                            usePerItemPartial: "method.tmpl",
                        };

                    <?js= helpers.handleScaffolding(self, doc, arrangement, "augments", title) ?>
                    <?js= helpers.handleScaffolding(self, doc, arrangement, "requires", title) ?>
                    <?js= helpers.handleScaffolding(self, doc, arrangement, "classes", title) ?>
                    <?js= helpers.handleScaffolding(self, doc, arrangement, "mixins", title) ?>
                    <?js= helpers.handleScaffolding(self, doc, arrangement, "namespaces", title) ?>
                    <?js= helpers.handleScaffolding(self, doc, arrangement, "tasks", title) ?>
                    <?js= helpers.handleScaffolding(self, doc, arrangement, "members", title) ?>
                    <?js= helpers.handleScaffolding(self, doc, arrangement, "methods", title) ?>
                    <?js= helpers.handleScaffolding(self, doc, arrangement, "typedefs", title) ?>
                    <?js= helpers.handleScaffolding(self, doc, arrangement, "events", title) ?>

#### Classes

                    <?js
                        var classes = self.find({kind: 'class', memberof: doc.longname});
                        if (doc.kind !== 'globalobj' && classes && classes.length) {
                    ?>
                        <?js if(doc.longname) {
                            console.log("classes! " + doc.longname); // Kind, contents (title, link, members) 
                        } ?>
                    <?js } ?>

#### Mixins
                    <?js
                        var mixins = self.find({kind: 'mixin', memberof: doc.longname});
                        if (doc.kind !== 'globalobj' && mixins && mixins.length) {
                    ?>
                        <h3 class="subsection-title">Mixins</h3>

                        <dl><?js mixins.forEach(function(m) { ?>
                            <dt><?js= self.linkto(m.longname, m.name) ?></dt>
                            <dd><?js if (m.summary) { ?><?js= m.summary ?><?js } ?></dd>
                        <?js }); ?></dl>
                        
                        <?js if(doc.longname) {
                            console.log("mixins! " + doc.longname);
                        } ?>

                    <?js } ?>

#### Namespaces

                    <?js
                        var namespaces = self.find({kind: 'namespace', memberof: doc.longname});
                        if (doc.kind !== 'globalobj' && namespaces && namespaces.length) {
                    ?>
                        <h3 class="subsection-title">Namespaces</h3>

                        <dl><?js namespaces.forEach(function(n) { ?>
                            <dt><a href="namespaces.html#<?js= n.longname ?>"><?js= self.linkto(n.longname, n.name) ?></a></dt>
                            <dd><?js if (n.summary) { ?><?js= n.summary ?><?js } ?></dd>
                        <?js }); ?></dl>

                        <?js if(doc.longname) {
                            console.log("namespaces! " + doc.longname);
                        } ?>
                    <?js } ?>

#### Tasks

                    <?js
                        var tasks = self.find({kind: 'task', memberof: title === 'Global' ? {isUndefined: true} : doc.longname});
                        if(tasks & tasks.length && doc.longname) {
                            console.log("tasks! " + doc.longname);
                        }

                        if (tasks && tasks.length && tasks.forEach) {
                    ?>
                        <h3 class="subsection-title">Tasks</h3>

                        <dl><?js tasks.forEach(function(t) { ?>
                            <?js= self.partial('method.tmpl', t) ?>
                        <?js }); ?></dl>
                        
                        <?js if(doc.longname) {
                            console.log("tasks! " + doc.longname);
                        } ?>
                    <?js } ?>

#### Members

                    <?js
                        var members = self.find({kind: 'member', memberof: title === 'Global' ? {isUndefined: true} : doc.longname});
                        if (members && members.length && members.forEach) {
                    ?>
                        <h3 class="subsection-title">Members</h3>

                        <dl><?js members.forEach(function(p) { ?>
                            <?js= self.partial('members.tmpl', p) ?>
                        <?js }); ?></dl>

                        <?js if(doc.longname) {
                            console.log("members! " + doc.longname);
                        } ?>
                    <?js } ?>

#### Typedefs

                    <?js
                        var typedefs = self.find({kind: 'typedef', memberof: title === 'Global' ? {isUndefined: true} : doc.longname});
                        if (typedefs && typedefs.length && typedefs.forEach) {
                    ?>
                        <h3 class="subsection-title">Type Definitions</h3>

                        <dl><?js typedefs.forEach(function(e) {
                                if (e.signature) {
                            ?>
                            <p>shin says nowhere!!</p>
                                <?js= self.partial('method.tmpl', e) ?>
                                <?js if(doc.longname) {
                                    console.log("method/typedef! " + doc.longname);
                                } ?>
                            <?js
                                }
                                else {
                            ?>
                            <p>shin says here!</p>
                                <?js= self.partial('members.tmpl', e) ?>
                                <?js if(doc.longname) {
                                    console.log("members/typedef! " + doc.longname);
                                } ?>
                            <?js
                                }
                            }); ?></dl>
                    <?js } ?>

#### Events

                    <?js
                        var events = self.find({kind: 'event', memberof: title === 'Global' ? {isUndefined: true} : doc.longname});
                        if (events && events.length && events.forEach) {
                    ?>
                        <h3 class="subsection-title">Events</h3>

                        <dl><?js events.forEach(function(e) { ?>
                            <?js= self.partial('method.tmpl', e) ?>
                        <?js }); ?></dl>
                        <?js if(doc.longname) {
                            console.log("events! " + doc.longname);
                        } ?>
                    <?js } ?>

										

## method.tmpl

    <?js= self.handleScaffolding(self, data, arrangement, "description") ?>
    <?js= self.handleScaffolding(self, data, arrangement, "augments") ?>
    <?js= self.handleScaffolding(self, data, arrangement, "type", undefined, kind) ?>    
    <?js= self.handleScaffolding(self, data, arrangement, "this") ?>    
    <?js= self.handleScaffolding(self, data, arrangement, "params") ?>
    <?js= self.handleScaffolding(self, data, arrangement, "details") ?>
    <?js= self.handleScaffolding(self, data, arrangement, "requires") ?>
    <?js= self.handleScaffolding(self, data, arrangement, "fires") ?>
    <?js= self.handleScaffolding(self, data, arrangement, "listens") ?>
    <?js= self.handleScaffolding(self, data, arrangement, "listeners") ?>
    <?js= self.handleScaffolding(self, data, arrangement, "exceptions") ?>
    <?js= self.handleScaffolding(self, data, arrangement, "returns") ?>
    <?js= self.handleScaffolding(self, data, arrangement, "examples") ?>    

### Definition

#### Description

    <?js if (data && data.description) { ?>
        <div class="description">
            <?js= data.description ?>
        </div>

        <?js console.log("Description in " + data.longname); ?>
    <?js } ?>

#### Extends (Untested)

I don't know when this case is ever tripped :(.  I'm not sure what data.alias is used for, and I don't know when `data.alias.indexOf("module:")` will be 0 (i.e when an alias will start with "module:").  Mmm...  yeah.

    <?js if(data.augments) { console.log("augments in " + data.longname); } ?>
    <?js if(data.alias) { console.log("aliases in " + data.longname + " = " + data.alias); } ?>
		
    <?js if (data.augments && data.alias && data.alias.indexOf('module:') === 0) { ?>
        <h5>Extends:</h5>
        <?js= self.partial('linksList.tmpl', data.augments) ?>

        <?js console.log("extends in " + data.longname); ?>
    <?js } ?>

#### Types

    <?js if (kind === 'event' && data && data.type && data.type.names) {?>
    <p>Here is the type!!</p>
        <h5>Type: <?js= self.partial('type.tmpl', data.type.names) ?></h5>
        
        <?js console.log("type in " + data.longname); ?>
    <?js } ?>

#### This

    <?js if (data['this']) { ?>
        <h5>This:</h5>
        <ul><li><?js= this.linkto(data['this'], data['this']) ?></li></ul>

        <?js console.log("this in " + data.longname); ?>
    <?js } ?>

#### Params (oops)

#### Details

    <?js= this.partial('details.tmpl', data) ?>

#### Requires

    <?js if (data.kind !== 'module' && data.requires && data.requires.length) { ?>
        <h5>Requires:</h5>
        <ul><?js data.requires.forEach(function(r) { ?>
            <li><?js= self.linkto(r) ?></li>
        <?js }); ?></ul>
        <?js console.log("requires! in " + data.longname); ?>
    <?js } ?>

#### Fires

    <?js if (data.fires && fires.length) { ?>
        <h5>Fires:</h5>
        <ul><?js fires.forEach(function(f) { ?>
            <li><?js= self.linkto(f) ?></li>
        <?js }); ?></ul>
        
        <?js console.log("fires in " + data.longname); ?>
    <?js } ?>

#### Listens

    <?js if (data.listens && listens.length) { ?>
    <h5>Listens to Events:</h5>
    <ul><?js listens.forEach(function(f) { ?>
        <li><?js= self.linkto(f) ?></li>
    <?js }); ?></ul>
        <?js console.log("listens in " + data.longname); ?>
    <?js } ?>

#### Listeners

    <?js if (data.listeners && listeners.length) { ?>
        <h5>Listeners of This Event:</h5>
        <ul><?js listeners.forEach(function(f) { ?>
            <li><?js= self.linkto(f) ?></li>
        <?js }); ?></ul>
        <?js console.log("listeners in " + data.longname); ?>
    <?js } ?>

#### Exceptions

Note the redundent `if` :/

    <?js if (data.exceptions && exceptions.length) { ?>
        <h5>Throws:</h5>
        <?js if (exceptions.length > 1) { ?><ul><?js
            exceptions.forEach(function(r) { ?>
                <li><?js= self.partial('exceptions.tmpl', r) ?></li>
            <?js });
        ?></ul><?js } else {
            exceptions.forEach(function(r) { ?>
                <?js= self.partial('exceptions.tmpl', r) ?>
            <?js });
        } ?>
        <?js console.log("exceptions in " + data.longname); ?>
    <?js } ?>

#### Returns

    <?js if (data.returns && returns.length) { ?>
        <h5>Returns:</h5>
        <?js if (returns.length > 1) { ?><ul><?js
            returns.forEach(function(r) { ?>
                <li><?js= self.partial('returns.tmpl', r) ?></li>
            <?js });
        ?></ul><?js } else {
            returns.forEach(function(r) { ?>
                <?js= self.partial('returns.tmpl', r) ?>
            <?js });
        } ?>
        <?js console.log("returns in " + data.longname); ?>
    <?js } ?>

#### Examples

    <?js if (data.examples && examples.length) { ?>
        <h5>Example<?js= examples.length > 1? 's':'' ?></h5>
        <?js= this.partial('examples.tmpl', examples) ?>
        <?js console.log("method:examples! " + data.longname); ?>
    <?js } ?>

## Details

	<?js= self.handleScaffolding(self, data, arrangement, "properties") ?>
	<?js= self.handleScaffolding(self, data, arrangement, "version") ?>
	<?js= self.handleScaffolding(self, data, arrangement, "since") ?>
	<?js= self.handleScaffolding(self, data, arrangement, "inherits") ?>
	<?js= self.handleScaffolding(self, data, arrangement, "overrides") ?>
	<?js= self.handleScaffolding(self, data, arrangement, "implementations") ?>
	<?js= self.handleScaffolding(self, data, arrangement, "implements") ?>
	<?js= self.handleScaffolding(self, data, arrangement, "mixes") ?>
	<?js= self.handleScaffolding(self, data, arrangement, "deprecated") ?>
	<?js= self.handleScaffolding(self, data, arrangement, "author") ?>
	<?js= self.handleScaffolding(self, data, arrangement, "copyright") ?>
	<?js= self.handleScaffolding(self, data, arrangement, "license") ?>
	<?js= self.handleScaffolding(self, data, arrangement, "defaultvalue") ?>
	<?js= self.handleScaffolding(self, data, arrangement, "meta") ?>
	<?js= self.handleScaffolding(self, data, arrangement, "tutorials") ?>
	<?js= self.handleScaffolding(self, data, arrangement, "see") ?>
	<?js= self.handleScaffolding(self, data, arrangement, "todo") ?>

### Properties

	<?js
			var properties = data.properties;
			if (properties && properties.length && properties.forEach) {
	?>

		<h5 class="subsection-title">Properties:</h5>

		<dl><?js= this.partial('properties.tmpl', properties) ?></dl>
		<?js console.log("Properties! " + data.longname); ?>
	<?js } ?>

### Version

	<?js if (data.version) { ?>
		<dt class="tag-version method-doc-label method-doc-details-label">Version:</dt>
		<dd class="tag-version">
			<ul class="dummy">
				<li><?js= version ?></li>
			</ul>
		</dd>
	<?js } ?>

### Since

	<?js if (data.since) {?>
		<dt class="tag-since method-doc-label method-doc-details-label">Since:</dt>
		<dd class="tag-since">
			<ul class="dummy">
				<li><?js= since ?></li>
			</ul>
		</dd>
	<?js } ?>

### Inherits

	<?js if (data.inherited && data.inherits) { ?>
		<dt class="inherited-from method-doc-label method-doc-details-label">Inherited From:</dt>
		<dd class="inherited-from">
			<ul class="dummy">
				<li>
					<?js= this.linkto(data.inherits, this.htmlsafe(data.inherits)) ?>
				</li>
			</ul>
		</dd>	

		<?js console.log("Inherits! " + data.longname); ?>
	<?js } ?>

### Overrides

	<?js if (data.overrides) { ?>
		<dt class="tag-overrides">Overrides':</dt>
		<dd class="tag-overrides"><ul class="dummy"><li>
			<?js= this.linkto(data.overrides, this.htmlsafe(data.overrides)) ?>
		</li></ul></dd>
		<?js console.log("Overrides! " + data.longname); ?>
	<?js } ?>

### Implementations (Not tested because link not being generated properly)

	<?js if (data.implementations && data.implementations.length) { ?>
		<dt class="implementations">Implementations:</dt>
		<dd class="implementations"><ul>
			<?js data.implementations.forEach(function(impl) { ?>
				<li><?js= self.linkto(impl, self.htmlsafe(impl)) ?></li>
			<?js }); ?>
		</ul></dd>
		<?js console.log("Implementations! " + data.longname); // Broken in this template for reasons unclear--link up is failing. ?>
	<?js } ?>

### Implements

	<?js if (data.implements && data.implements.length) { ?>
		<dt class="implements">Implements:</dt>
		<dd class="implements"><ul>
			<?js data.implements.forEach(function(impl) { ?>
				<li><?js= self.linkto(impl, self.htmlsafe(impl)) ?></li>
			<?js }); ?>
		</ul></dd>
	<?js } ?>

### Mixins

	<?js if (data.mixes && data.mixes.length) { ?>
			<dt class="mixes">Mixes In:</dt>

			<dd class="mixes"><ul>
			<?js data.mixes.forEach(function(a) { ?>
					<li><?js= self.linkto(a, a) ?></li>
			<?js }); ?>
			</ul></dd>
			<?js console.log("Mixes! " + data.longname); ?>
	<?js } ?>

### Deprecated

	<?js if (data.deprecated) { ?>
		<dt class="important tag-deprecated method-doc-label method-doc-details-label">Deprecated:</dt>
		<?js if (data.deprecated === true) { ?>
			<dd class="yes-def tag-deprecated">
				<ul class="dummy">
					<li>Yes</li>
				</ul>
			</dd>
		<?js } else { ?>
			<dd>
					<ul class="dummy">
							<li><?js= data.deprecated ?></li>
					</ul>
			</dd>
		<?js } ?>
		<?js console.log("Deprecated! " + data.longname); ?>
	<?js } ?>

### Author

	<?js if (data.author && author.length) {?>
		<dt class="tag-author method-doc-label method-doc-details-label">Author:</dt>
		<dd class="tag-author">
			<ul><?js author.forEach(function(a) { ?>
				<li><?js= self.resolveAuthorLinks(a) ?></li>
				<?js }); ?></ul>
		</dd>
		<?js console.log("Author! " + data.longname); ?>
	<?js } ?>

### Copyright

	<?js if (data.copyright) {?>
		<dt class="tag-copyright method-doc-label method-doc-details-label">Copyright:</dt>
		<dd class="tag-copyright">
			<ul class="dummy">
				<li><?js= copyright ?></li>
			</ul>
		</dd>
		<?js console.log("copyright! " + data.longname); ?>
	<?js } ?>

### License

	<?js if (data.license) {?>
		<dt class="tag-license method-doc-label method-doc-details-label">License:</dt>
		<dd class="tag-license">
			<ul class="dummy">
				<li><?js= license ?></li>
			</ul>
		</dd>
		<?js console.log("License! " + data.longname); ?>
	<?js } ?>

### Defaults

	<?js if (data.defaultvalue) {?>
		<dt class="tag-default method-doc-label method-doc-details-label">Default Value:</dt>
		<dd class="tag-default">
			<ul class="dummy">
				<li><?js= data.defaultvalue ?></li>
			</ul>
		</dd>
	<?js } ?>

### Source 

	<?js if (data.meta && this.navOptions.outputSourceFiles) {?>
		<dt class="tag-source method-doc-label method-doc-details-label">Source:</dt>
		<dd class="tag-source">
			<ul class="dummy">
				<li>
					<?js= self.linkto(meta.shortpath) ?><?js if (this.navOptions.linenums) {?>,
					<?js= self.linkto(meta.shortpath, 'line ' + meta.lineno, null, 'sunlight-1-line-' + meta.lineno) ?><?js } ?>
				</li>
			</ul>
		</dd>
	<?js } else if (data.meta && this.navOptions.outputSourcePath) { ?>
		<dt class="tag-source method-doc-label method-doc-details-label">Source:</dt>
		<dd class="tag-source">
			<?js= meta.shortpath ?>
		</dd>
	<?js } ?>

### Tutorials 

	<?js if (data.tutorials && tutorials.length) {?>
		<dt class="tag-tutorial method-doc-label method-doc-details-label">Tutorials:</dt>
		<dd class="tag-tutorial">
			<ul><?js tutorials.forEach(function(t) { ?>
				<li><?js= self.tutoriallink(t) ?></li>
				<?js }); ?></ul>
		</dd>
		<?js console.log("Tutorials! " + data.longname); ?>
	<?js } ?>

### See

	<?js if (data.see && see.length) {?>
		<dt class="tag-see method-doc-label method-doc-details-label">See:</dt>
		<dd class="tag-see">
			<ul><?js see.forEach(function(s) { ?>
				<li><?js= self.linkto(s) ?></li>
				<?js }); ?></ul>
		</dd>
		<?js console.log("data.see: %s", data.see); ?>
		<?js console.log("see: %s", see); ?>
	<?js } ?>

### ToDo

	<?js if (data.todo && todo.length) {?>
		<dt class="tag-todo method-doc-label method-doc-details-label">To Do:</dt>
		<dd class="tag-todo">
			<ul><?js todo.forEach(function(t) { ?>
				<li><?js= t ?></li>
				<?js }); ?></ul>
		</dd>
	<?js } ?>