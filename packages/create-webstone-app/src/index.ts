import {
  createAppDir,
  copyTemplate,
  displayNextSteps,
  displayWelcome,
  installDependencies,
  installWebApp,
} from "./helpers";

const pipe = (...functions: ((input?: any) => Promise<any>)[]) => (
  input?: any
) =>
  functions.reduce((chain, func) => chain.then(func), Promise.resolve(input));

pipe(
  displayWelcome,
  createAppDir,
  copyTemplate,
  installWebApp,
  installDependencies,
  displayNextSteps
)();
