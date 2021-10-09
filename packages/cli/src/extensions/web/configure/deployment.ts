import { availableAdapters } from "../../../toolbox/web/configure/deployment/adapters";
import getInstalledAdapterPackageName from "../../../toolbox/web/configure/deployment/get-installed-adapter-package-name";
import installAdapter from "../../../toolbox/web/configure/deployment/install-adapter";
import isAnyAdapterInstalled from "../../../toolbox/web/configure/deployment/is-any-adapter-installed";
import removeAdapter from "../../../toolbox/web/configure/deployment/remove-adapter";

export default {
  availableAdapters,
  getInstalledAdapterPackageName,
  installAdapter,
  isAnyAdapterInstalled,
  removeAdapter,
};
