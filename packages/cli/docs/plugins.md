# Plugin guide for the Webstone CLI

Plugins allow you to add features to the Webstone CLI, such as commands and
extensions to the `toolbox` object that provides the majority of the functionality
used by command line interface.

Creating a CLI plugin is easy. Just create a repo with three optional folders:

```
commands/
extensions/
templates/
```

A command is a file that looks something like this:

```js
// commands/foo.js

module.exports = {
  run: (toolbox) => {
    const { print, filesystem } = toolbox;

    const desktopDirectories = filesystem.subdirectories(`~/Desktop`);
    print.info(desktopDirectories);
  },
};
```

An extension lets you add additional features to the `toolbox`.

```js
// extensions/bar-extension.js

module.exports = (toolbox) => {
  const { print } = toolbox;

  toolbox.bar = () => {
    print.info("Bar!");
  };
};
```

This is then accessible in your plugin's commands as `toolbox.bar`.

## Loading a plugin

To load a particular plugin (which has to start with `webstone-*`),
install it to your project using `[npx|pnpm|yarn] install --save-dev webstone-PLUGINNAME`,
and the Webstone CLI will pick it up automatically.

## Further reading

To learn more about plugins, please review [the official Gluegun Plugins documentation](https://infinitered.github.io/gluegun/#/plugins).
