import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { TranslateModule } from '@ngx-translate/core';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { CoreComponents } from 'app/core/core-components.module';
import { CommonDirectivesModule } from 'app/directives/common/common-directives.module';
import { CastModule } from 'app/modules/cast/cast.module';
import { AppCommonModule } from 'app/modules/common/app-common.module';
import { EntityModule } from 'app/modules/entity/entity.module';
import { IxFormsModule } from 'app/modules/ix-forms/ix-forms.module';
import { IxIconModule } from 'app/modules/ix-icon/ix-icon.module';
import { IxTableModule } from 'app/modules/ix-tables/ix-table.module';
import { JobsModule } from 'app/modules/jobs/jobs.module';
import { LayoutModule } from 'app/modules/layout/layout.module';
import { AppLoaderModule } from 'app/modules/loader/app-loader.module';
import { TerminalModule } from 'app/modules/terminal/terminal.module';
import { ApplicationsRoutingModule } from 'app/pages/applications/applications-routing.module';
import { ApplicationsComponent } from 'app/pages/applications/applications.component';
import { CatalogComponent } from 'app/pages/applications/catalog/catalog.component';
import { ChartReleasesComponent } from 'app/pages/applications/chart-releases/chart-releases.component';
import { CatalogSummaryDialogComponent } from 'app/pages/applications/dialogs/catalog-summary/catalog-summary-dialog.component';
import { ChartBulkUpgradeComponent } from 'app/pages/applications/dialogs/chart-bulk-upgrade/chart-bulk-upgrade.component';
import { ChartEventsDialogComponent } from 'app/pages/applications/dialogs/chart-events/chart-events-dialog.component';
import { ChartUpgradeDialogComponent } from 'app/pages/applications/dialogs/chart-upgrade/chart-upgrade-dialog.component';
import { ManageCatalogSummaryDialogComponent } from 'app/pages/applications/dialogs/manage-catalog-summary/manage-catalog-summary-dialog.component';
import {
  PodSelectLogsDialogComponent,
} from 'app/pages/applications/dialogs/pod-select-logs/pod-select-logs-dialog.component';
import { PodSelectDialogComponent } from 'app/pages/applications/dialogs/pod-select/pod-select-dialog.component';
import { DockerImageDeleteDialogComponent } from 'app/pages/applications/docker-images/docker-image-delete-dialog/docker-image-delete-dialog.component';
import { DockerImageUpdateDialogComponent } from 'app/pages/applications/docker-images/docker-image-update-dialog/docker-image-update-dialog.component';
import { DockerImagesListComponent } from 'app/pages/applications/docker-images/docker-images-list/docker-images-list.component';
import { DockerImagesComponentStore } from 'app/pages/applications/docker-images/docker-images.store';
import { PullImageFormComponent } from 'app/pages/applications/docker-images/pull-image-form/pull-image-form.component';
import { CatalogAddFormComponent } from 'app/pages/applications/forms/catalog-add-form/catalog-add-form.component';
import { CatalogEditFormComponent } from 'app/pages/applications/forms/catalog-edit-form/catalog-edit-form.component';
import { ChartFormComponent } from 'app/pages/applications/forms/chart-form/chart-form.component';
import { KubernetesSettingsComponent } from 'app/pages/applications/kubernetes-settings/kubernetes-settings.component';
import { ManageCatalogsComponent } from 'app/pages/applications/manage-catalogs/manage-catalogs.component';
import { PodLogsComponent } from 'app/pages/applications/pod-logs/pod-logs.component';
import { PodShellComponent } from 'app/pages/applications/pod-shell/pod-shell.component';
import { SelectPoolDialogComponent } from 'app/pages/applications/select-pool-dialog/select-pool-dialog.component';
import { ChartRollbackModalComponent } from './chart-rollback-modal/chart-rollback-modal.component';
import { CommonAppsToolbarButtonsComponent } from './common-apps-toolbar-buttons/common-apps-toolbar-buttons.component';

@NgModule({
  imports: [
    AppLoaderModule,
    AppCommonModule,
    ApplicationsRoutingModule,
    CastModule,
    CommonDirectivesModule,
    CoreComponents,
    EntityModule,
    FlexLayoutModule,
    FormsModule,
    ImgFallbackModule,
    JobsModule,
    IxFormsModule,
    IxTableModule,
    LayoutModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    IxIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSortModule,
    MatTabsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    TerminalModule,
    TranslateModule,
  ],
  declarations: [
    ApplicationsComponent,
    CatalogAddFormComponent,
    CatalogComponent,
    CatalogEditFormComponent,
    CatalogSummaryDialogComponent,
    ChartEventsDialogComponent,
    ChartFormComponent,
    ChartReleasesComponent,
    ChartUpgradeDialogComponent,
    CommonAppsToolbarButtonsComponent,
    DockerImageDeleteDialogComponent,
    DockerImagesListComponent,
    DockerImageUpdateDialogComponent,
    KubernetesSettingsComponent,
    ManageCatalogsComponent,
    ManageCatalogSummaryDialogComponent,
    PodLogsComponent,
    PodShellComponent,
    PodSelectDialogComponent,
    PodSelectLogsDialogComponent,
    PullImageFormComponent,
    SelectPoolDialogComponent,
    ChartRollbackModalComponent,
    ChartBulkUpgradeComponent,
  ],
  providers: [
    DockerImagesComponentStore,
  ],
})
export class ApplicationsModule { }
