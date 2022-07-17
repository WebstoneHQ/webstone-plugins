// FIXME: Does anyone know how to properly type the `pipe` function?
/* eslint @typescript-eslint/no-explicit-any: "off" */
import {
  createAppDir,
  copyTemplate,
  displayNextSteps,
  displayWelcome,
  installDependencies,
  installWebApp,
} from "./helpers.js";

const pipe =
  (...functions: ((input?: any) => Promise<any>)[]) =>
  (input?: any) =>
    functions.reduce((chain, func) => chain.then(func), Promise.resolve(input));

pipe(
  displayWelcome,
  createAppDir,
  copyTemplate,
  installWebApp,
  installDependencies,
  displayNextSteps
)();
