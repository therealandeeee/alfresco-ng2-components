# Lifecycle of an ADF project

Even a minimal ADF development project involves a large number of files
and folders. To assist you in managing these, the framework makes use of
various tools and conventions that keep the complexity as low as possible.
The various stages of development are outlined below along with recommended
techniques for the best development experience.

## Creating a project

The easiest way to get a project started is with our 
[Yeoman generator](https://github.com/Alfresco/generator-ng2-alfresco-app).
This creates a *project scaffold*, which is a complete, minimal project set
up with useful placeholders and defaults. You will inevitably replace these as
the project progresses. However, the idea is that they provide a stable starting
point that you can develop incrementally while seeing working code at each stage.

Full instructions for the Yeoman generator are available at its main
[project page](https://github.com/Alfresco/generator-ng2-alfresco-app). See the
[Yeoman website](http://yeoman.io/) for more information about the tool itself.

The root folder of the newly-generated project mainly contains configuration files
for tools which are described in more detail below. Most of the development "action"
happens in the `src/app` folder, which contains the main app sources along with a
separate folder for each of your components.

## Main development operations

ADF makes extensive use of [Angular CLI](https://github.com/angular/angular-cli)
to manage development. Most often, you will start by using `ng serve` to run a
test webserver for your app (Angular CLI commands have the general form `ng xxx`).
The command will open the browser at the address of your server and after a short
wait, you will see it up and running. By default, the server runs in a "watch mode"
which detects changes in your source files as you save them. It then recompiles the
project automatically and updates the page in the browser with the latest version.
This gives you very rapid feedback about your app as you develop it.
