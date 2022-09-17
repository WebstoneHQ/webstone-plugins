import { displayWelcome, displayNextSteps } from "./helpers";
import { tasks } from "./tasks/index";

displayWelcome();
const context = await tasks.run();
displayNextSteps(context);
