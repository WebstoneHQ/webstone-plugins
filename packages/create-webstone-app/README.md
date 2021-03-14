# Webstone

TODO:

```sh
# Create a new project
npm init webstone-app [my-app]
```

# How it works

1. User: Run `npm init webstone-app [my-app]`
1. NPM: Downloads the `create-webstone-app` package (i.e. the directory you are reading this `README` in)
1. NPM: Executes the `bin` script defined in the `create-webstone-app/package.json` file
    - The `bin` script:
      1. Copies the `create-webstone-app/template` monorepo template to the app directory (i.e. project root by default or `[my-app]` if provided. The app directory is referred to as `<app-dir>` going forward.
      1. Installs the Sveltekit template in the `<app-dir>/web` directory
          - Ensure the Sveltekit installation prompts are displayed to the user
      1. Runs `npm install` in `<app-dir>`
      1. Prints a friendly, nicely styled message with next steps