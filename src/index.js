import MagicString from "magic-string";
import estreeWalker from "estree-walker";
import rollupPluginutils from "rollup-pluginutils";

function nodeToCdn({ include, exclude, files = {} } = {}) {
  const filter = rollupPluginutils.createFilter(include, exclude);
  return {
    name: "localToCDN",
    options: opts => {
      return { ...opts, external: [...opts.external, ...Object.keys(files)] };
    },

    transform(code, id) {
      if (!filter(id)) return;
      const ast = this.parse(code);

      const _code = new MagicString(code);

      estreeWalker.walk(ast, {
        enter: function(node, parent) {
          if (
            parent &&
            parent.type === "ImportDeclaration" &&
            node.type === "Literal"
          ) {
            const cdnLocation = files[node.value];

            if (cdnLocation) {
              // +1 and -1 are to ignore the qoutes around the string
              _code.overwrite(node.start + 1, node.end - 1, cdnLocation);
            }
          }
        }
      });
      return {
        code: _code.toString(),
        map: _code.generateMap()
      };
    }
  };
}

export default nodeToCdn;
