import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { NgxFilesizeModule } from 'ngx-filesize';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CoreComponents } from 'app/core/core-components.module';
import { CommonDirectivesModule } from 'app/directives/common/common-directives.module';
import { AppCommonModule } from 'app/modules/common/app-common.module';
import { EntityModule } from 'app/modules/entity/entity.module';
import { IxFormsModule } from 'app/modules/ix-forms/ix-forms.module';
import { IxIconModule } from 'app/modules/ix-icon/ix-icon.module';
import { IxTableModule } from 'app/modules/ix-tables/ix-table.module';
import { LayoutModule } from 'app/modules/layout/layout.module';
import { SnapshotCloneDialogComponent } from 'app/pages/datasets/modules/snapshots/snapshot-clone-dialog/snapshot-clone-dialog.component';
import { SnapshotDetailsRowComponent } from 'app/pages/datasets/modules/snapshots/snapshot-details-row/snapshot-details-row.component';
import { SnapshotListComponent } from 'app/pages/datasets/modules/snapshots/snapshot-list/snapshot-list.component';
import { SnapshotRollbackDialogComponent } from 'app/pages/datasets/modules/snapshots/snapshot-rollback-dialog/snapshot-rollback-dialog.component';
import { routing } from 'app/pages/datasets/modules/snapshots/snapshots.routing';
import { SnapshotEffects } from 'app/pages/datasets/modules/snapshots/store/snapshot.effects';
import { snapshotReducer } from 'app/pages/datasets/modules/snapshots/store/snapshot.reducer';
import { snapshotStateKey } from 'app/pages/datasets/modules/snapshots/store/snapshot.selectors';
import { SnapshotAddFormComponent } from './snapshot-add-form/snapshot-add-form.component';
import { SnapshotBatchDeleteDialogComponent } from './snapshot-batch-delete-dialog/snapshot-batch-delete-dialog.component';

@NgModule({
  providers: [],
  imports: [
    CommonDirectivesModule,
    CommonModule,
    CoreComponents,
    EffectsModule.forFeature([SnapshotEffects]),
    EntityModule,
    IxFormsModule,
    IxTableModule,
    IxIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatRippleModule,
    MatSortModule,
    MatExpansionModule,
    MatCardModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    RouterModule,
    ReactiveFormsModule,
    routing,
    StoreModule.forFeature(snapshotStateKey, snapshotReducer),
    TranslateModule,
    TranslateModule,
    NgxFilesizeModule,
    AppCommonModule,
    MatSlideToggleModule,
    LayoutModule,
    NgxSkeletonLoaderModule,
  ],
  declarations: [
    SnapshotListComponent,
    SnapshotCloneDialogComponent,
    SnapshotRollbackDialogComponent,
    SnapshotBatchDeleteDialogComponent,
    SnapshotAddFormComponent,
    SnapshotDetailsRowComponent,
  ],
  exports: [
    SnapshotListComponent,
    SnapshotCloneDialogComponent,
    SnapshotRollbackDialogComponent,
    SnapshotBatchDeleteDialogComponent,
    SnapshotAddFormComponent,
  ],
})
export class SnapshotsModule { }
