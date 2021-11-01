import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit,
} from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import helptext from 'app/helptext/directory-service/kerberos-settings';
import { EntityUtils } from 'app/pages/common/entity/utils';
import { FormErrorHandlerService } from 'app/pages/common/ix-forms/services/form-error-handler.service';
import { DialogService, WebSocketService } from 'app/services';
import { IxModalService } from 'app/services/ix-modal.service';

@UntilDestroy()
@Component({
  templateUrl: './kerberos-settings.component.html',
  styleUrls: ['./kerberos-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KerberosSettingsComponent implements OnInit {
  isFormLoading = false;

  form = this.fb.group({
    appdefaults_aux: [''],
    libdefaults_aux: [''],
  });

  readonly tooltips = {
    appdefaults_aux: helptext.ks_appdefaults_tooltip,
    libdefaults_aux: helptext.ks_libdefaults_tooltip,
  };

  constructor(
    private ws: WebSocketService,
    private modalService: IxModalService,
    private errorHandler: FormErrorHandlerService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.isFormLoading = true;

    this.ws.call('kerberos.config').pipe(untilDestroyed(this)).subscribe(
      (config) => {
        this.form.patchValue(config);
        this.isFormLoading = false;
      },
      (error) => {
        new EntityUtils().handleWSError(null, error, this.dialogService);
        this.isFormLoading = false;
      },
    );
  }

  onSubmit(): void {
    const values = this.form.value;

    this.isFormLoading = true;
    this.ws.call('kerberos.update', [values]).pipe(untilDestroyed(this)).subscribe(() => {
      this.isFormLoading = false;
      this.modalService.close();
    }, (error) => {
      this.isFormLoading = false;
      this.errorHandler.handleWsFormError(error, this.form);
      this.cdr.markForCheck();
    });
  }
}
