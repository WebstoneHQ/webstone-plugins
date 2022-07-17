// FIXME: Does anyone know how to properly type the `pipe` function?
/* eslint @typescript-eslint/no-explicit-any: "off" */
import { tasks, displayWelcome, displayNextSteps } from "./helpers.js";

displayWelcome();
const context = await tasks.run();
console.log(context);
displayNextSteps(context);
