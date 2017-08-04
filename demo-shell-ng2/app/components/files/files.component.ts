/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ChangeDetectorRef, Component, Input, OnInit, Optional, ViewChild } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';
import { DownloadEntry, MinimalNodeEntity } from 'alfresco-js-api';
import {
    AlfrescoApiService, AlfrescoContentService, FileUploadCompleteEvent,
    FolderCreatedEvent, NotificationService, PermissionsEnum, SiteModel, UploadService
} from 'ng2-alfresco-core';
import { DocumentListComponent, DropdownSitesComponent, PermissionStyleModel } from 'ng2-alfresco-documentlist';

import { CreateFolderDialogComponent } from '../../dialogs/create-folder.dialog';

@Component({
    selector: 'adf-files-component',
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
    // The identifier of a node. You can also use one of these well-known aliases: -my- | -shared- | -root-
    currentFolderId: string = '-my-';

    errorMessage: string = null;
    fileNodeId: any;
    fileShowed: boolean = false;

    useCustomToolbar = true;
    toolbarColor = 'default';
    useDropdownBreadcrumb = false;

    selectionModes = [
        { value: 'none', viewValue: 'None' },
        { value: 'single', viewValue: 'Single' },
        { value: 'multiple', viewValue: 'Multiple' }
    ];

    @Input()
    selectionMode = 'multiple';

    @Input()
    multiselect = false;

    @Input()
    multipleFileUpload: boolean = false;

    @Input()
    disableWithNoPermission: boolean = false;

    @Input()
    folderUpload: boolean = false;

    @Input()
    acceptedFilesTypeShow: boolean = false;

    @Input()
    versioning: boolean = false;

    @Input()
    acceptedFilesType: string = '.jpg,.pdf,.js';

    @Input()
    enableUpload: boolean = true;

    @ViewChild(DocumentListComponent)
    documentList: DocumentListComponent;

    permissionsStyle: PermissionStyleModel[] = [];

    constructor(private changeDetector: ChangeDetectorRef,
                private apiService: AlfrescoApiService,
                private notificationService: NotificationService,
                private uploadService: UploadService,
                private contentService: AlfrescoContentService,
                private dialog: MdDialog,
                @Optional() private route: ActivatedRoute) {
    }

    showFile(event) {
        if (event.value.entry.isFile) {
            this.fileNodeId = event.value.entry.id;
            this.fileShowed = true;
        } else {
            this.fileShowed = false;
        }
    }

    toggleFolder() {
        this.multipleFileUpload = false;
        this.folderUpload = !this.folderUpload;
        return this.folderUpload;
    }

    ngOnInit() {
        if (this.route) {
            this.route.params.forEach((params: Params) => {
                if (params['id']) {
                    this.currentFolderId = params['id'];
                    this.changeDetector.detectChanges();
                }
            });
        }

        this.uploadService.fileUploadComplete.debounceTime(300).subscribe(value => this.onFileUploadComplete(value));
        this.contentService.folderCreated.subscribe(value => this.onFolderCreated(value));

        // this.permissionsStyle.push(new PermissionStyleModel('document-list__create', PermissionsEnum.CREATE));
        // this.permissionsStyle.push(new PermissionStyleModel('document-list__disable', PermissionsEnum.NOT_CREATE, false, true));
    }

    onNavigationError(err: any) {
        if (err) {
            this.errorMessage = err.message || 'Navigation error';
        }
    }

    resetError() {
        this.errorMessage = null;
    }

    onFileUploadComplete(event: FileUploadCompleteEvent) {
        if (event && event.file.options.parentId === this.documentList.currentFolderId) {
            this.documentList.reload();
        }
    }

    onFolderCreated(event: FolderCreatedEvent) {
        console.log('FOLDER CREATED');
        console.log(event);
        if (event && event.parentId === this.documentList.currentFolderId) {
            this.documentList.reload();
        }
    }

    handlePermissionError(event: any) {
        this.notificationService.openSnackMessage(
            `You don't have the ${event.permission} permission to ${event.action} the ${event.type} `,
            4000
        );
    }

    onCreateFolderClicked(event: Event) {
        let dialogRef = this.dialog.open(CreateFolderDialogComponent);
        dialogRef.afterClosed().subscribe(folderName => {
            if (folderName) {
                this.contentService.createFolder('', folderName, this.documentList.currentFolderId).subscribe(
                    node => console.log(node),
                    err => console.log(err)
                );
            }
        });
    }

    getSiteContent(site: SiteModel) {
        this.currentFolderId = site && site.guid ? site.guid : '-my-';
    }

    hasSelection(selection: Array<MinimalNodeEntity>): boolean {
        return selection && selection.length > 0;
    }

    downloadNodes(selection: Array<MinimalNodeEntity>) {
        if (!selection || selection.length === 0) {
            return;
        }

        if (selection.length === 1) {
            this.downloadNode(selection[0]);
        } else {
            this.downloadZip(selection);
        }
    }

    downloadNode(node: MinimalNodeEntity) {
        if (node && node.entry) {
            const entry = node.entry;

            if (entry.isFile) {
                this.downloadFile(node);
            }

            if (entry.isFolder) {
                this.downloadZip([node]);
            }
        }
    }

    downloadFile(node: MinimalNodeEntity) {
        if (node && node.entry) {
            const nodesApi = this.apiService.getInstance().core.nodesApi;
            const contentApi = this.apiService.getInstance().content;

            const url = contentApi.getContentUrl(node.entry.id, true);
            const fileName = node.entry.name;

            this.download(url, fileName);
        }
    }

    // Download as ZIP prototype
    // js-api@alpha 1.8.0-c422a3b69b1b96f72abc61ab370eff53590f8ee4
    downloadZip(selection: Array<MinimalNodeEntity>) {
        if (selection && selection.length > 0) {
            const nodeIds = selection.map(node => node.entry.id);

            const downloadsApi = this.apiService.getInstance().core.downloadsApi;
            const nodesApi = this.apiService.getInstance().core.nodesApi;
            const contentApi = this.apiService.getInstance().content;

            const promise: any = downloadsApi.createDownload({ nodeIds });

            promise.on('progress', progress => console.log('Progress', progress));
            promise.on('error', error => console.log('Error', error));
            promise.on('abort', data => console.log('Abort', data));

            promise.on('success', (data: DownloadEntry) => {
                console.log('Success', data);
                if (data && data.entry && data.entry.id) {
                    const url = contentApi.getContentUrl(data.entry.id, true);
                    // the call is needed only to get the name of the package
                    nodesApi.getNode(data.entry.id).then((downloadNode: MinimalNodeEntity) => {
                        console.log(downloadNode);
                        const fileName = downloadNode.entry.name;
                        // this.download(url, fileName);
                        this.waitAndDownload(data.entry.id, url, fileName);
                    });
                }
            });
        }
    }

    waitAndDownload(downloadId: string, url: string, fileName: string) {
        const downloadsApi = this.apiService.getInstance().core.downloadsApi;
        downloadsApi.getDownload(downloadId).then((d: DownloadEntry) => {
            if (d.entry) {
                if (d.entry.status === 'DONE') {
                    this.download(url, fileName);
                } else {
                    setTimeout(() => {
                        this.waitAndDownload(downloadId, url, fileName);
                    }, 1000);
                }
            }
        });
    }

    download(url: string, fileName: string) {
        if (url && fileName) {
            const link = document.createElement('a');

            link.style.display = 'none';
            link.download = fileName;
            link.href = url;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
