TrueNAS WebUI
================
![CI](https://github.com/truenas/webui/workflows/CI/badge.svg?branch=master)


This is the project for the Angular.io WebUI for TrueNAS CORE & TrueNAS SCALE.

# Development requirements

  - yarn >= 1.12
  - Node.js >= 8.9
  - Running TrueNAS 12 Nightly Machine (VM is fine)


# Getting started

Install the development requirements (FreeBSD 11 or later):

```sh
# pkg install yarn
```

Checkout TrueNAS git repository:

```sh
$ git clone https://github.com/truenas/webui.git
$ cd webui
```

Install yarn packages:

```sh
$ yarn install
```

Run the environment configuration script
(if your ip address changes later you may repeat this step)

```sh
$ ./setup_env.js -i <ip address or FQDN of the server where TrueNAS is running>
```

To start run
```yarn start```

This runs a local webserver with the new WebUI, by default at http://localhost:4200.
If this webserver is kept running, changes to the project will be rebuilt incrementally.

To test AOT in dev mode run

```yarn run start:dev:aot```

To run the production build, run

```yarn run build:prod:aot```

Getting errors about missing packages?

```yarn install```

Getting permission errors or Failed messages when trying to run `yarn start`?

From the webui repo
```
rm -rf node_modules (may need root)
rm yarn.lock 
yarn cache clean --force
yarn install
```
This should bring the yarn environment back to a useable state.

# Translating Text to Other Languages

To extract all of the strings from the project to be translated run:
```yarn run extract```

This will update all of the PO files located in the directory src/assets/i18n.
These can be edited with any PO editor.


Stock images used on the dashboard UI are courtesy of Pixabay.com and are subject to the Simplified Pixabay License. 
Full license details can be found at https://pixabay.com/service/license/.
