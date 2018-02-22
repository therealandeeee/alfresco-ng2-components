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

## Development

ADF makes extensive use of [Angular CLI](https://github.com/angular/angular-cli)
to manage development. Most often, you will start by using `ng serve` to run a
test webserver for your app (Angular CLI commands have the general form `ng xxx`).
The command will open the browser at the address of your server and after a short
wait, you will see it up and running. By default, the server runs in a "watch mode"
which detects changes in your source files as you save them. It then recompiles the
project automatically and updates the page in the browser with the latest version.
This gives you very rapid feedback about your app as you develop it.

### Adding new components

The `ng generate` command in Angular CLI can be used to add components, services
and other classes to your project. For example, you could add a new component with
the following command:

`ng generate component <my-component-name> -m app.module`

This creates a new folder in the `app` folder for the component which contains the
corresponding source files. Also, the correct declarations for the new component are
added to the `app.module.ts` file.

Note that this command can be issued from any folder within the project, not
just the root. Also, it is generally not recommended to use the word "component" in
your component names since this will be added automatically in the class name.

The `generate` command has a number of other "blueprints" for the various different
classes used in Angular (services, directives, enums, etc) - see its
[webpage](https://github.com/angular/angular-cli/wiki/generate) for further details.

## Linting and testing

You will most likely want to check the correctness of your code before using it for
anything serious. There are a number of Angular CLI commands you can use to run
lint checks, unit testing and end-to-end testing on your project.

### Linting

*Linting* involves running an automated syntax check on your source code. This goes
a stage further than the syntax checker in the compiler by reporting code *style* issues.
Some of these are simply a matter of making the code look neat, but others can improve
efficiency or security among other things. In the ADF project, linting is provided by
the `ng lint` command. Note that unlike `ng generate`, this command must be run from the
root folder of the project:

`ng lint <options>`

The options include automatic fixing of lint errors as they are found.
See the [ng lint webpage](https://github.com/angular/angular-cli/wiki/lint) for full
details.

Linting is actually performed by the [tslint](https://github.com/angular/angular-cli/wiki/lint)
tool. This provides many different linting rules that can be configured in the `tslint.json`
file in the project's root folder. Learn more about the available rules at the
[tslint website](https://palantir.github.io/tslint/rules/)

### Unit testing

*Unit testing* is the process of running pieces of code that test components, methods or
other "units" of code in isolation. In the ADF project, the test code is contained in a
component's folder in a file with a `.spec.ts` suffix. For example, the app component has
`app.component.spec.ts`, which looks like this:

```ts
// Imports...

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AdfModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
```

This is a minimal [Jasmine](https://jasmine.github.io/) test specification for
the app component. The test code is run using the `it` function which in this case
simply creates the component instance and then asserts that it has been created
using the `expect` line. The full test suite consists of a number of these tests,
each one asserting a different condition about the component. See the
[Jasmine docs](https://jasmine.github.io/tutorials/your_first_suite) for more
information about tests and the types of assertions that are available.

The full set of unit tests for the project is run using a tool called
[Karma](http://karma-runner.github.io/2.0/index.html), which is activated
with a simple `ng test` command.

### End-to-end testing

*End-to-end testing* (or E2E) involves an automated process that simulates the
mouse clicks, typing and other actions of a user in the browser. E2E uses Jasmine
test specs contained in the project's `e2e` folder. For example, the scaffold
`app.e2e-spec.ts` file looks like this:

```ts
import { AdfAppPage } from './app.po';

describe('adf-app App', () => {
  let page: AdfAppPage;

  beforeEach(() => {
    page = new AdfAppPage();
  });

  it('should display toolbar', () => {
    page.navigateTo();
    expect(page.getToolbar()).toBeDefined();
  });
});
```

Start E2E testing by serving the app (with `ng serve`) and then running a
`ng e2e` command. This will start the [Protractor](http://www.protractortest.org/)
test system, launch the browser and run the test code. See the
[Protractor](http://www.protractortest.org/) website for more information about
its API.

## Building

