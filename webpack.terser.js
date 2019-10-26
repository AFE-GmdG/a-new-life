module.exports = {
  terserOptions: { // https://github.com/terser-js/terser#minify-options
    ecma: 8,
    warnings: false, // false, true, "verbose"
    parse: { // https://github.com/terser-js/terser#parse-options
      bare_returns: true,
      ecma: 8,
      shebang: false
    },
    compress: { // https://github.com/terser-js/terser#compress-options
      drop_console: true,
      drop_debugger: true,
      ecma: 7,
      keep_classnames: false,
      keep_fargs: false, // set to true, if Function.length is used
      keep_fnames: false,
      keep_infinity: true,
      passes: 1, // Keep in mind more passes will take more time.
      toplevel: true,
      unsafe_arrows: false,
      unsafe_math: true,    // optimize numerical expressions like 2 * x * 3 into 6 * x, which may give imprecise floating point results.
      unsafe_methods: false,
      unsafe_proto: true,   // optimize expressions like Array.prototype.slice.call(a) into [].slice.call(a)
      unsafe_undefined: true
    },
    mangle: true, // https://github.com/terser-js/terser#mangle-options
    module: false,
    output: {
      beautify: false,
      comments: false, // false, true, "some", regex
      ecma: 7
    },
    toplevel: true,
    keep_classnames: false
  }
};
