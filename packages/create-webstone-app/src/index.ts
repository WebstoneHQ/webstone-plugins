import { displayWelcome, displayNextSteps } from "./helpers.js";
import { tasks } from "./tasks/index.js";

displayWelcome();
const context = await tasks.run();
displayNextSteps(context);
