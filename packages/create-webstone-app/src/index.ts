// FIXME: Does anyone know how to properly type the `pipe` function?
/* eslint @typescript-eslint/no-explicit-any: "off" */

import {
  createAppDir,
  copyTemplate,
  displayNextSteps,
  displayWelcome,
  installWebApp,
} from "./helpers";

const pipe =
  (...functions: ((input?: any) => Promise<any>)[]) =>
  (input?: any) =>
    functions.reduce((chain, func) => chain.then(func), Promise.resolve(input));

pipe(
  displayWelcome,
  createAppDir,
  copyTemplate,
  installWebApp,
  displayNextSteps
)();
