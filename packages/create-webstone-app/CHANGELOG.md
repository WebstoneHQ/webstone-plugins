# create-webstone-app

## 0.5.1

### Patch Changes

- 5df3a8c: change naming scheme for plugins

## 0.5.0

### Minor Changes

- b3774cb: introduce new plugin-structure
- ab65f24: set up plugins for webstone

### Patch Changes

- 14975da: Apply missed code from the new plugin structure PR.
- dfdf5d4: Warn instead of force-emptying the app directory if it's not empty.
- e2f49b9: bump sveltekit-version to stable

## 0.4.1

### Patch Changes

- 241c146: Use the user's preferred package manager (npm, pnpm, or yarn).

## 0.4.0

### Minor Changes

- f7a4f1f: remove monorepo approach

## 0.3.0

### Minor Changes

- 4556a68: Switch from tsc to esbuild for the create-webstone-app.
- 412041a: Implement latest Sveltekit breaking changes

## 0.2.6

### Patch Changes

- 3070a28: resolve prompt, created by enquirer, correctly
- 77db1c4: fix issue with clearing directory while creating an app

## 0.2.5

### Patch Changes

- 7abe8c3: Run a system requirements check before creating a Webstone app.

## 0.2.4

### Patch Changes

- 0bd597b: Move prod dependencies out of devDependencies.

## 0.2.3

### Patch Changes

- ac92329: Use listr2 to create the Webstone project.

## 0.2.2

### Patch Changes

- 0665efd: Use create-svelte to instantiate the Webstone app.

## 0.2.1

### Patch Changes

- 9354f10: Update Webstone to work with the latest version of SvelteKit.
- 4fee40d: Migrate from Cypress to Playwright.

## 0.2.0

### Minor Changes

- 0b94911: Write unit tests for the `create-webstone-app` package.

## 0.1.0

### Minor Changes

- 7e5f53a: Add a `webstone dev` command to start services.

## 0.0.10

### Patch Changes

- 4ff8dfa: Introduce the Webstone CLI skeleton.

## 0.0.9

### Patch Changes

- cca9b7f: Remove the node_modules filter when copying the template.

## 0.0.8

### Patch Changes

- 7b194c0: Use pnpm in the template to simplify commands.
- 58cbcba: Ignore node_modules when copying the template.

## 0.0.7

### Patch Changes

- 133b0c5: Always use the latest version of the CLI in the template.

## 0.0.6

### Patch Changes

- 2d40fd8: Auto-update the template dependencies.

## 0.0.5

### Patch Changes

- 1102a5a: Add an initial CLI skeleton file.

## 0.0.4

### Patch Changes

- 8662f47: Initialize core and cli packages; add core dependency to the app template.

## 0.0.3

### Patch Changes

- c3b9e1f: Fix the missing web template directory.

## 0.0.2

### Patch Changes

- 075bc3d: Add an ASCII art banner to the README.
