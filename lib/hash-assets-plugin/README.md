# hash-assets-plugin

A webpack plugin to generate a json file with hash values on all output files.

## Getting Started

install the hash-assets-plugin
- todo

setup your `webpack.config.js`:
```js
// in the head of webpack.config.js
const HashAssetsPlugin = require("hash-assets-plugin");

// in the plugins array:
plugins: [
  new HashAssetsPlugin({
    path: path.resolve(__dirname, "dist"),
    filename: "hashes.json",
    prettyPrint: "false",
    exclude: /\.(?:map)$/i
  })
]
```

## Options

| Name          | Type        | Default         | Description                               |
| :-----------: | :---------: | :-------------: | :---------------------------------------: |
| `path`        | `{String}`  | `__dirname`     | The output path of the json file          |
| `filename`    | `{String}`  | `"hashes.json"` | The filename                              |
| `prettyPrint` | `{Boolean}` | `false`         | Should the json be pretty readable or not |
| `exclude`     | `{RegExp}`  | `/\.(?:map)$/i` | A RegExp to ignore some input files       |

## License

[MIT](./LICENSE)
