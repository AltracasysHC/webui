import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_LEGACY_SNACK_BAR_DEFAULT_OPTIONS as MAT_SNACK_BAR_DEFAULT_OPTIONS, MatLegacySnackBarConfig as MatSnackBarConfig, MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { IxIconModule } from 'app/modules/ix-icon/ix-icon.module';
import { SnackbarComponent } from 'app/modules/snackbar/components/snackbar/snackbar.component';

@NgModule({
  imports: [
    IxIconModule,
    MatButtonModule,
    MatSnackBarModule,
    TranslateModule,
    CommonModule,
    MatSnackBarModule,
  ],
  exports: [],
  declarations: [
    SnackbarComponent,
  ],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        verticalPosition: 'top',
        duration: 3000,
      } as MatSnackBarConfig,
    },
  ],
})
export class SnackbarModule {}
