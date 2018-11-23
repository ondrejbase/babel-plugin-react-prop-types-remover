# babel-plugin-react-prop-types-remover
Babel plugin for removing React's propTypes declarations in production builds.

## Installation
```sh
npm install babel-plugin-react-prop-types-remover --save-dev
```

## Usage

### CLI

```sh
$ browserify script.js -o bundle.js -t [ babelify --plugins [ babel-plugin-react-prop-types-remover ] ]
```

### Node

```javascript
var fs = require('fs');
var browserify = require('browserify');
browserify('./script.js')
  .transform('babelify', { plugins: ['babel-plugin-react-prop-types-remover'] })
  .bundle()
  .pipe(fs.createWriteStream('bundle.js'));
```

## Example

`script.js`:
```javascript
class Foo {
  static get baz() {}

  static get propTypes() {}

  get myFo() {}

  bar() {}
}
```

will be transformed to `bundle.js`:
```javascript
class Foo {
  static get baz() {}

  get myFo() {}

  bar() {}
}
```
