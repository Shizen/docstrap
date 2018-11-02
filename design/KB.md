---
index: shinstrap
description: Root, local knowledge base articles for the shinstrap
---

#{ ToDo

- [Read up on Collapsible pattern in Bootstrap](https://getbootstrap.com/docs/4.1/components/collapse/)

}

#{ References

- [jsdoc]()
- [docstrap]()
- [sunlight](https://github.com/tmont/sunlight) : This is the module used to colorize the code excerpts rendered by jsdoc/markdown in the context of the docstrap template

}

# Knowledge Base

What do I know?

## Bootstrap

Bootstrap is a "css framework" basically describing a methodology and thought process for how to think about using css to layout pages (and a whoooolllleee bunch of css following that methodology, at least in theory).  Bootstrap is used by docstrap, and hense why it is here.

### Collapse

Bootstrap has its own methodology on how to do collapsibles, which I haven't looked at.  [Bootstrap's documentation on Collapsible](https://getbootstrap.com/docs/4.1/components/collapse/).

### Glyhpicons-Halflings

Bootstrap uses its own glyphicons font, similar to font-awesome (only not as awesome).  They are also not free, but have a special use permission for bootstrap.  Go figure.  Like font-awesome, they have their own `css` settings.  In this case, they include [`content` property references](https://github.com/twbs/bootstrap/blob/867e2bef8d9c9b901022899227b306a532f5baf3/dist/css/bootstrap.css) for various icons which is helpful.  Check down around lines 2650+.  Or search for `font-family: 'Glyph`.

If this doesn't work for you, there is this [stackoverflow discussion referencing glyphicons in css](https://stackoverflow.com/questions/19740700/glyphicons-bootstrap-icon-font-hex-value) which includes a bunch in shorthand.  See also the [glyphicon documentation on using glyphicons](https://getbootstrap.com/docs/3.3/components/#glyphicons-how-to-use) because, you know, authority and stuff.  This page also has a handy [display of all available icons](https://getbootstrap.com/docs/3.3/components/#glyphicons-how-to-use).

