import babel from "rollup-plugin-babel";

const pkg = require("./package.json");
const external = Object.keys(pkg.dependencies);

export default {
  input: "src/index.js",
  output: [
    { file: pkg.main, format: "cjs", sourcemap: true },
    { file: pkg.module, format: "esm", sourcemap: true }
  ],
  plugins: [babel()],
  external
};
