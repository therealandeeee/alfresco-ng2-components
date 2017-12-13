# Component Docs Index

Below is an index of the documentation for ADF. The [User Guide](#user-guide)
section discusses particular techniques in depth. The other sections are references for the ADF
libraries. Items marked with an asterisk (\*) do not currently have documentation - the link leads
to the appropriate source file.

## Contents

-   [User Guide](#user-guide)
-   [ADF Core](#adf-core)
-   [ADF Content Services](#adf-content-services)
-   [ADF Process Services](#adf-process-services)
-   [ADF Insights](#adf-insights)

## User guide

<!-- guide start -->

-   [Form Extensibility and Customisation](extensibility.md)
-   [Angular Material Design](angular-material-design.md)
-   [Theming](theming.md)
-   [Typography](typography.md)
-   [Walkthrough - adding indicators to highlight information about a node](metadata-indicators.md)

<!-- guide end -->

[(Back to Contents)](#contents)

## ADF Core

Contains a variety of components used throughout ADF.
See the library's
[README file](../lib/core/README.md)
for more information about installing and using the source code.

<!--core start-->

## Components

-   [Card view component](card-view.component.md) ([Source](core/card-view/card-view.component.ts)) Displays a configurable property list renderer.
-   [Accordion group component](accordion-group.component.md) ([Source](core/collapsable/accordion-group.component.ts)) Adds a collapsible panel to an [accordion menu](accordion.component.md).
-   [Accordion component](accordion.component.md) ([Source](core/collapsable/accordion.component.ts)) Creates a collapsible accordion menu.
-   [Data column component](data-column.component.md) ([Source](core/data-column/data-column.component.ts)) Defines column properties for DataTable, Tasklist, Document List and other components.
-   [Datatable component](datatable.component.md) ([Source](core/datatable/components/datatable/datatable.component.ts)) Displays data as a table with customizable columns and presentation.
-   [Form field component](form-field.component.md) ([Source](core/form/components/form-field/form-field.component.ts)) A form field in an APS form.
-   [Form list component](form-list.component.md) ([Source](core/form/components/form-list.component.ts)) The component shows the activiti forms as a list.
-   [Form component](form.component.md) ([Source](core/form/components/form.component.ts)) The component shows a Form from Activiti (see it live: [Form Quickstart](https://embed.plnkr.co/YSLXTqb3DtMhVJSqXKkE/))
-   [Start form component](start-form.component.md) ([Source](core/form/components/start-form.component.ts)) Displays the Start Form for a process.
-   [Text mask component](text-mask.component.md) ([Source](core/form/components/widgets/text/text-mask.component.ts)) Implements text field input masks.
-   [Info drawer layout component](info-drawer-layout.component.md) ([Source](core/info-drawer/info-drawer-layout.component.ts)) Displays a sidebar-style information panel.
-   [Info drawer component](info-drawer.component.md) ([Source](core/info-drawer/info-drawer.component.ts)) Displays a sidebar-style information panel with tabs.
-   [Language menu component](language-menu.component.md) ([Source](core/language-menu/language-menu.component.ts)) Displays all the languages that are present in the "app.config.json" or the default one (EN).
-   [Login component](login.component.md) ([Source](core/login/components/login.component.ts)) Authenticates to Alfresco Content Services and Alfresco Process Services.
-   [Infinite pagination component](infinite-pagination.component.md) ([Source](core/pagination/infinite-pagination.component.ts)) Adds "infinite" pagination to the component it is used with.
-   [Pagination component](pagination.component.md) ([Source](core/pagination/pagination.component.ts)) Adds pagination to the component it is used with.
-   [Host settings component](host-settings.component.md) ([Source](core/settings/host-settings.component.ts)) This component is a form that allows you to validate and set the url of your content service and process service saving 
    it in the user local storage
-   [Toolbar divider component](toolbar-divider.component.md) ([Source](core/toolbar/toolbar-divider.component.ts)) Divides groups of elements in a Toolbar with a visual separator.
-   [Toolbar title component](toolbar-title.component.md) ([Source](core/toolbar/toolbar-title.component.ts)) Supplies custom HTML to be included in a Toolbar component title.
-   [Toolbar component](toolbar.component.md) ([Source](core/toolbar/toolbar.component.ts)) Simple container for headers, titles, actions and breadcrumbs.
-   [User info component](user-info.component.md) ([Source](core/userinfo/components/user-info.component.ts)) This will show a round icon with user and on click some user information.
    If user is logged in with ECM and BPM the ECM image will be shown.
-   [Viewer component](viewer.component.md) ([Source](core/viewer/components/viewer.component.ts)) See it live: [Viewer Quickstart](https://embed.plnkr.co/iTuG1lFIXfsP95l6bDW6/)

## Directives

-   [Context menu directive](context-menu.directive.md) ([Source](core/context-menu/context-menu.directive.ts)) See **Demo Shell** or **DocumentList** implementation for more details and use cases.
-   [Highlight directive](highlight.directive.md) ([Source](core/directives/highlight.directive.ts)) Adds highlighting to selected sections of an HTML element's content.
-   [Logout directive](logout.directive.md) ([Source](core/directives/logout.directive.ts)) Logs the user out when the decorated element is clicked.
-   [Node delete directive](node-delete.directive.md) ([Source](core/directives/node-delete.directive.ts)) Deletes multiple files and folders.
-   [Node favorite directive](node-favorite.directive.md) ([Source](core/directives/node-favorite.directive.ts)) Selectively toggles nodes as favorite
-   [Node permission directive](node-permission.directive.md) ([Source](core/directives/node-permission.directive.ts)) Selectively disables an HTML element or Angular component
-   [Node restore directive](node-restore.directive.md) ([Source](core/directives/node-restore.directive.ts)) 'NodeRestoreDirective' directive takes a selection of `DeletedNodeEntry[]` and restores them in their original location.
    If the original location doesn't exist anymore, then they remain in the trash list.
-   [Upload directive](upload.directive.md) ([Source](core/directives/upload.directive.ts)) Allows your components or common HTML elements reacting on File drag and drop in order to upload content.

## Models

-   [Form field model](form-field.model.md) ([Source](core/form/components/widgets/core/form-field.model.ts)) Contains the value and metadata for a field of an
    [ADF Form](form.component.md).
-   [Comment process model](comment-process.model.md) ([Source](core/models/comment-process.model.ts)) Represents a comment added to a Process Services task or process instance.
-   [Product version model](product-version.model.md) ([Source](core/models/product-version.model.ts)) Contains version and license information classes for Alfresco products.
-   [Site model](site.model.md) ([Source](core/models/site.model.ts)) Provides information about a site in a Content Services repository.
-   [User process model](user-process.model.md) ([Source](core/models/user-process.model.ts)) Represents a Process Services user.
-   [Bpm user model](bpm-user.model.md) ([Source](core/userinfo/models/bpm-user.model.ts)) Contains information about a Process Services user.
-   [Ecm user model](ecm-user.model.md) ([Source](core/userinfo/models/ecm-user.model.ts)) Contains information about a Content Services user.

## Pipes

-   [File size pipe](file-size.pipe.md) ([Source](core/pipes/file-size.pipe.ts)) Converts a number of bytes to the equivalent in KB, MB, etc.
-   [Mime type icon pipe](mime-type-icon.pipe.md) ([Source](core/pipes/mime-type-icon.pipe.ts)) Retrieves an icon to represent a MIME type.
-   [Node name tooltip pipe](node-name-tooltip.pipe.md) ([Source](core/pipes/node-name-tooltip.pipe.ts)) Formats the tooltip of the underlying Node based on the following rules:
-   [Text highlight pipe](text-highlight.pipe.md) ([Source](core/pipes/text-highlight.pipe.ts)) Adds highlighting to words or sections of text that match a search string.
-   [Time ago pipe](time-ago.pipe.md) ([Source](core/pipes/time-ago.pipe.ts)) Converts a recent past date into a number of days ago.
-   [User initial pipe](user-initial.pipe.md) ([Source](core/pipes/user-initial.pipe.ts)) Takes the name fields of a UserProcessModel object and extracts and formats the initials.

## Services

-   [Activiti alfresco service](activiti-alfresco.service.md) ([Source](core/form/services/activiti-alfresco.service.ts)) Get Alfresco Repository folder content based on a Repository account configured in Alfresco Process Services (APS). 
    It is possible to configure multiple Alfresco Repository accounts in APS (i.e. multiple Alfresco Servers).
    This service can also be used to link Alfresco content as related content in APS. 
    Content such as documents and other files can be attached to Process Instances 
    and Task Instances as related content.
-   [Form rendering service](form-rendering.service.md) ([Source](core/form/services/form-rendering.service.ts)) Maps an APS form field type string onto the corresponding form widget component type.
-   [Form service](form.service.md) ([Source](core/form/services/form.service.ts)) Implements Process Services form methods
-   [Node service](node.service.md) ([Source](core/form/services/node.service.ts)) Get Alfresco Repository node metadata and create nodes with metadata. 
    This service cannot be used to create nodes with content.
-   [Process content service](process-content.service.md) ([Source](core/form/services/process-content.service.ts)) Manipulate content related to a Process Instance or Task Instance in APS. Related content can be 
    uploaded to APS via for example a file upload dialog. 
-   [Alfresco api service](alfresco-api.service.md) ([Source](core/services/alfresco-api.service.ts)) Provides access to initialized **AlfrescoJSApi** instance.
-   [Apps process service](apps-process.service.md) ([Source](core/services/apps-process.service.ts)) Gets details of the Process Services apps that are deployed for the user.
-   [Auth guard bpm service](auth-guard-bpm.service.md) ([Source](core/services/auth-guard-bpm.service.ts)) Adds authentication with Process Services to a route within the app.
-   [Auth guard ecm service](auth-guard-ecm.service.md) ([Source](core/services/auth-guard-ecm.service.ts)) Adds authentication with Content Services to a route within the app.
-   [Auth guard service](auth-guard.service.md) ([Source](core/services/auth-guard.service.ts)) Adds authentication to a route within the app.
-   [Authentication service](authentication.service.md) ([Source](core/services/authentication.service.ts)) Provides authentication for use with the Login component.
-   [Card view update service](card-view-update.service.md) ([Source](core/services/card-view-update.service.ts)) Reports edits and clicks within fields of a [Card View component](card-view.component.md).
-   [Comment process service](comment-process.service.md) ([Source](core/services/comment-process.service.ts)) Adds and retrieves comments for task and process instances in Process Services.
-   [Content service](content.service.md) ([Source](core/services/content.service.ts)) Accesses app-generated data objects via URLs and file downloads.
-   [Cookie service](cookie.service.md) ([Source](core/services/cookie.service.ts)) Stores key-value data items as browser cookies.
-   [Deleted nodes api service](deleted-nodes-api.service.md) ([Source](core/services/deleted-nodes-api.service.ts)) Gets a list of Content Services nodes currently in the trash.
-   [Discovery api service](discovery-api.service.md) ([Source](core/services/discovery-api.service.ts)) Gets version and license information for Process Services and Content Services.
-   [Favorites api service](favorites-api.service.md) ([Source](core/services/favorites-api.service.ts)) Gets a list of items a user has marked as their favorites.
-   [Highlight transform service](highlight-transform.service.md) ([Source](core/services/highlight-transform.service.ts)) Adds HTML to a string to highlight chosen sections.
-   [Log service](log.service.md) ([Source](core/services/log.service.ts)) Provide a log functionality for your ADF application.
-   [Nodes api service](nodes-api.service.md) ([Source](core/services/nodes-api.service.ts)) Accesses and manipulates ACS document nodes using their node IDs.
-   [Notification service](notification.service.md) ([Source](core/services/notification.service.ts)) Shows a notification message with optional feedback.
-   [Page title service](page-title.service.md) ([Source](core/services/page-title.service.ts)) Sets the page title.
-   [People content service](people-content.service.md) ([Source](core/services/people-content.service.ts)) Gets information about a Content Services user.
-   [People process service](people-process.service.md) ([Source](core/services/people-process.service.ts)) Gets information about Process Services users.
-   [Shared links api service](shared-links-api.service.md) ([Source](core/services/shared-links-api.service.ts)) Finds shared links to Content Services items.
-   [Storage service](storage.service.md) ([Source](core/services/storage.service.ts)) Stores items in the form of key-value pairs.
-   [Thumbnail service](thumbnail.service.md) ([Source](core/services/thumbnail.service.ts)) Retrieves an SVG thumbnail image to represent a document type.
-   [Translation service](translation.service.md) ([Source](core/services/translation.service.ts)) Supports localisation.
-   [Upload service](upload.service.md) ([Source](core/services/upload.service.ts)) Provides access to various APIs related to file upload features.
-   [User preferences service](user-preferences.service.md) ([Source](core/services/user-preferences.service.ts)) Stores preferences for components.
-   [Bpm user service](bpm-user.service.md) ([Source](core/userinfo/services/bpm-user.service.ts)) Gets information about the current Process Services user.
-   [Ecm user service](ecm-user.service.md) ([Source](core/userinfo/services/ecm-user.service.ts)) Gets information about a Content Services user.


-   \* Renditions service ([Source](core/services/renditions.service.ts))
-   \* Sites service ([Source](core/services/sites.service.ts))

## Widgets

-   [Content widget](content.widget.md) ([Source](core/form/components/widgets/content/content.widget.ts)) The component shows the content preview.

<!--core end-->

### Other classes and interfaces

-   [DataTableAdapter interface](DataTableAdapter.md)
-   [FormFieldValidator interface](FormFieldValidator.md)

[(Back to Contents)](#contents)

## ADF Content Services

Contains components related to Content Services.
See the library's
[README file](../lib/content-services/README.md)
for more information about installing and using the source code.

<!--content-services start-->

## Components

-   [Breadcrumb component](breadcrumb.component.md) ([Source](content-services/breadcrumb/breadcrumb.component.ts)) Indicates the current position within a navigation hierarchy.
-   [Dropdown breadcrumb component](dropdown-breadcrumb.component.md) ([Source](content-services/breadcrumb/dropdown-breadcrumb.component.ts)) Indicates the current position within a navigation hierarchy using a dropdown menu.
-   [Content node selector component](content-node-selector.component.md) ([Source](content-services/content-node-selector/content-node-selector.component.ts)) Allows a user to select items from a Content Services repository.
-   [Content action component](content-action.component.md) ([Source](content-services/document-list/components/content-action/content-action.component.ts)) Adds options to a Document List actions menu for a particular content type.
-   [Document list component](document-list.component.md) ([Source](content-services/document-list/components/document-list.component.ts)) Displays the documents from a repository.
-   [Search control component](search-control.component.md) ([Source](content-services/search/components/search-control.component.ts)) Displays a input text which shows find-as-you-type suggestions.
-   [Search component](search.component.md) ([Source](content-services/search/components/search.component.ts)) You have to add a template that will be shown when the results are loaded.
-   [Sites dropdown component](sites-dropdown.component.md) ([Source](content-services/site-dropdown/sites-dropdown.component.ts)) Displays a dropdown menu to show and interact with the sites of the current user.
-   [Like component](like.component.md) ([Source](content-services/social/like.component.ts)) ![Custom columns](docassets/images/social1.png)
-   [Rating component](rating.component.md) ([Source](content-services/social/rating.component.ts)) ![Rating component screenshot](docassets/images/social2.png)
-   [Tag actions component](tag-actions.component.md) ([Source](content-services/tag/tag-actions.component.ts)) ![Custom columns](docassets/images/tag3.png)
-   [Tag list component](tag-list.component.md) ([Source](content-services/tag/tag-list.component.ts)) ![Custom columns](docassets/images/tag2.png)
-   [Tag node list component](tag-node-list.component.md) ([Source](content-services/tag/tag-node-list.component.ts)) ![Custom columns](docassets/images/tag1.png)
-   [File uploading dialog component](file-uploading-dialog.component.md) ([Source](content-services/upload/components/file-uploading-dialog.component.ts)) Shows a dialog listing all the files uploaded with the Upload Button or Drag Area components.
-   [Upload button component](upload-button.component.md) ([Source](content-services/upload/components/upload-button.component.ts)) You can show a notification error when the user doesn't have the right permission to perform the action.
    The UploadButtonComponent provides the event permissionEvent that is raised when the delete permission is missing
    You can subscribe to this event from your component and use the NotificationService to show a message.
-   [Upload drag area component](upload-drag-area.component.md) ([Source](content-services/upload/components/upload-drag-area.component.ts)) Adds a drag and drop area to upload files to Alfresco.
-   [Version list component](version-list.component.md) ([Source](content-services/version-manager/version-list.component.ts)) Displays the version history of a node in a
    [Version Manager component](version-manager.component.md)
-   [Version manager component](version-manager.component.md) ([Source](content-services/version-manager/version-manager.component.ts)) Displays the version history of a node with the ability to upload a new version.
-   [Webscript component](webscript.component.md) ([Source](content-services/webscript/webscript.component.ts)) Another example:


-   \* Content metadata card component ([Source](content-services/content-metadata/content-metadata-card.component.ts))
-   \* Content metadata component ([Source](content-services/content-metadata/content-metadata.component.ts))

## Directives

-   [Folder create directive](folder-create.directive.md) ([Source](content-services/folder-directive/folder-create.directive.ts)) 'FolderCreateDirective' directive needs the id of the parent folder where we want the new folder node to be created. If no value is provided, the '-my-' alias is used.
    It opens the FolderDialogComponent to receive data for the new folder. If data is valid, on dialog close, it emits folderCreate event.
-   [Folder edit directive](folder-edit.directive.md) ([Source](content-services/folder-directive/folder-edit.directive.ts)) 'FolderEditDirective' directive needs a selection folder entry of #documentList to open the folder dialog component to edit the name and description properties of that selected folder.
    If data is valid, on dialog close, it emits folderEdit event.
-   [File draggable directive](file-draggable.directive.md) ([Source](content-services/upload/directives/file-draggable.directive.ts)) Provide drag-and-drop features for an element such as a `div`.

## Models

-   [Document library model](document-library.model.md) ([Source](content-services/document-list/models/document-library.model.ts)) Defines classes for use with the Content Services node API.
-   [Permissions style model](permissions-style.model.md) ([Source](content-services/document-list/models/permissions-style.model.ts)) Sets custom CSS styles for rows of a [Document List](document-list.component.md) according to the item's permissions.

## Services

-   [Document actions service](document-actions.service.md) ([Source](content-services/document-list/services/document-actions.service.ts)) Implements the document menu actions for the Document List component.
-   [Document list service](document-list.service.md) ([Source](content-services/document-list/services/document-list.service.ts)) Implements node operations used by the Document List component.
-   [Folder actions service](folder-actions.service.md) ([Source](content-services/document-list/services/folder-actions.service.ts)) Implements the folder menu actions for the Document List component.
-   [Rating service](rating.service.md) ([Source](content-services/social/services/rating.service.ts)) Manages ratings for items in Content Services.
-   [Tag service](tag.service.md) ([Source](content-services/tag/services/tag.service.ts)) Manages tags in Content Services.


-   \* Content metadata service ([Source](content-services/content-metadata/content-metadata.service.ts))

<!--content-services end-->

[(Back to Contents)](#contents)

## ADF Process Services

Contains components related to Process Services.
See the library's
[README file](../lib/process-services/README.md)
for more information about installing and using the source code.

<!--process-services start-->

## Components

-   [Apps list component](apps-list.component.md) ([Source](process-services/app-list/apps-list.component.ts)) Shows all available apps.
-   [Create process attachment component](create-process-attachment.component.md) ([Source](process-services/attachment/create-process-attachment.component.ts)) Displays Upload Component (Drag and Click) to upload the attachment to a specified process instance
-   [Create task attachment component](create-task-attachment.component.md) ([Source](process-services/attachment/create-task-attachment.component.ts)) Displays Upload Component (Drag and Click) to upload the attachment to a specified task
-   [Process attachment list component](process-attachment-list.component.md) ([Source](process-services/attachment/process-attachment-list.component.ts)) Displays attached documents on a specified process instance
-   [Task attachment list component](task-attachment-list.component.md) ([Source](process-services/attachment/task-attachment-list.component.ts)) Displays attached documents on a specified task.
-   [Comment list component](comment-list.component.md) ([Source](process-services/comments/comment-list.component.ts)) Shows a list of comments.
-   [Comments component](comments.component.md) ([Source](process-services/comments/comments.component.ts)) Displays comments from users involved in a specified task and allows an involved user to add a comment to the task.
-   [Process comments component](process-comments.component.md) ([Source](process-services/comments/process-comments.component.ts)) Displays comments associated with a particular process instance and allows the user to add new comments
-   [People list component](people-list.component.md) ([Source](process-services/people/people-list.component.ts)) Shows a list of users (people).
-   [People search component](people-search.component.md) ([Source](process-services/people/people-search.component.ts)) Searches users/people.
-   [People component](people.component.md) ([Source](process-services/people/people.component.ts)) Displays involved users to a specified task
-   [Process filters component](process-filters.component.md) ([Source](process-services/process-list/components/process-filters.component.ts)) Collection of criteria used to filter process instances, which may be customized by users.
-   [Process instance details component](process-instance-details.component.md) ([Source](process-services/process-list/components/process-instance-details.component.ts)) Displays detailed information on a specified process instance
-   [Process instance header component](process-instance-header.component.md) ([Source](process-services/process-list/components/process-instance-header.component.ts)) Sub-component of the process details component, which renders some general information about the selected process.
-   [Process instance tasks component](process-instance-tasks.component.md) ([Source](process-services/process-list/components/process-instance-tasks.component.ts)) Lists both the active and completed tasks associated with a particular process instance
-   [Process list component](process-list.component.md) ([Source](process-services/process-list/components/process-list.component.ts)) This component renders a list containing all the process instances matched by the parameters specified.
-   [Start process component](start-process.component.md) ([Source](process-services/process-list/components/start-process.component.ts)) Displays Start Process, allowing the user to specify some basic details needed to start a new process instance.
-   [Checklist component](checklist.component.md) ([Source](process-services/task-list/components/checklist.component.ts)) Shows the checklist task functionality.
-   [Start task component](start-task.component.md) ([Source](process-services/task-list/components/start-task.component.ts)) Creates/Starts new task for the specified app
-   [Task details component](task-details.component.md) ([Source](process-services/task-list/components/task-details.component.ts)) Shows the details of the task id passed in input
-   [Task filters component](task-filters.component.md) ([Source](process-services/task-list/components/task-filters.component.ts)) Shows all available filters.
-   [Task header component](task-header.component.md) ([Source](process-services/task-list/components/task-header.component.ts)) Shows all the information related to a task.
-   [Task list component](task-list.component.md) ([Source](process-services/task-list/components/task-list.component.ts)) Renders a list containing all the tasks matched by the parameters specified.

## Directives

-   [Process audit directive](process-audit.directive.md) ([Source](process-services/process-list/components/process-audit.directive.ts)) Fetches the Process Audit information in the pdf or json format.
-   [Task audit directive](task-audit.directive.md) ([Source](process-services/task-list/components/task-audit.directive.ts)) Fetches the Task Audit information in the pdf or json format.

## Models

-   [Filter model](filter.model.md) ([Source](process-services/task-list/models/filter.model.ts)) Contains classes related to filters in Process Services.

## Services

-   [Process filter service](process-filter.service.md) ([Source](process-services/process-list/services/process-filter.service.ts)) Manage Process Filters, which are pre-configured Process Instance queries. 
-   [Process service](process.service.md) ([Source](process-services/process-list/services/process.service.ts)) Manage Process Instances, Process Variables, and Process Audit Log. 
-   [Task filter service](task-filter.service.md) ([Source](process-services/task-list/services/task-filter.service.ts)) Manage Task Filters, which are pre-configured Task Instance queries. 
-   [Tasklist service](tasklist.service.md) ([Source](process-services/task-list/services/tasklist.service.ts)) Manage Task Instances. 


-   \* Task upload service ([Source](process-services/task-list/services/task-upload.service.ts))

<!--process-services end-->

[(Back to Contents)](#contents)

## ADF Insights

Contains components for Process Services analytics and diagrams.
See the library's
[README file](../lib/insights/README.md)
for more information about installing and using the source code.

<!--insights start-->

## Components

-   [Widget component](widget.component.md) ([Source](insights/analytics-process/components/widgets/widget.component.ts)) Base class for standard and custom widget classes.
-   [Analytics generator component](analytics-generator.component.md) ([Source](insights/analytics-process/components/analytics-generator.component.ts)) Generates and shows charts
-   [Analytics report list component](analytics-report-list.component.md) ([Source](insights/analytics-process/components/analytics-report-list.component.ts)) Shows a list of all available reports
-   [Analytics component](analytics.component.md) ([Source](insights/analytics-process/components/analytics.component.ts)) Shows the charts related to the reportId passed as input
-   [Diagram component](diagram.component.md) ([Source](insights/diagram/components/diagram.component.ts)) This component shows the diagram of a process.

<!--insights end-->

[(Back to Contents)](#contents)
