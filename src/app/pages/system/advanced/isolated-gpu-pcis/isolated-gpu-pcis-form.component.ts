import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { DeviceType } from 'app/enums/device-type.enum';
import { AdvancedConfig } from 'app/interfaces/advanced-config.interface';
import { AppState } from 'app/interfaces/app-state.interface';
import { Device } from 'app/interfaces/device.interface';
import { FormConfiguration } from 'app/interfaces/entity-form.interface';
import { EntityFormComponent } from 'app/pages/common/entity/entity-form';
import { FieldSets } from 'app/pages/common/entity/entity-form/classes/field-sets';
import { FormSelectConfig } from 'app/pages/common/entity/entity-form/models/field-config.interface';
import { EntityUtils } from 'app/pages/common/entity/utils';
import { SystemGeneralService, WebSocketService } from 'app/services';
import { AppLoaderService } from 'app/services/app-loader/app-loader.service';
import { ModalService } from 'app/services/modal.service';
import { advancedConfigUpdated } from 'app/stores/system-config/system-config.actions';
import { selectAdvancedConfig } from 'app/stores/system-config/system-config.selectors';
import { T } from 'app/translate-marker';

@UntilDestroy()
@Component({
  selector: 'app-isolated-pcis-form',
  template: '<entity-form [conf]="this"></entity-form>',
  providers: [],
})
export class IsolatedGpuPcisFormComponent implements FormConfiguration {
  queryCall: 'system.advanced.config' = 'system.advanced.config';
  updateCall: 'system.advanced.update' = 'system.advanced.update';
  isOneColumnForm = true;
  gpus: Device[];
  private isolatedGpuPciIds: string[];
  private advancedConfig: AdvancedConfig;

  fieldSets = new FieldSets([
    {
      name: T("Isolated GPU PCI Id's"),
      label: false,
      class: 'isolated-pcis',
      config: [
        {
          type: 'select',
          placeholder: T("GPU's"),
          name: 'gpus',
          multiple: true,
          options: [],
          required: true,
        },
      ],
    },
    {
      name: 'divider',
      divider: true,
    },
  ]);

  private entityForm: EntityFormComponent;
  title = T("Isolated GPU PCI Id's");

  constructor(
    protected ws: WebSocketService,
    protected loader: AppLoaderService,
    private sysGeneralService: SystemGeneralService,
    private modalService: ModalService,
    private store$: Store<AppState>,
  ) { }

  afterInit(entityForm: EntityFormComponent): void {
    this.entityForm = entityForm;
    const gpusFormControl = this.entityForm.formGroup.controls['gpus'];

    this.ws.call('device.get_info', [DeviceType.Gpu]).pipe(untilDestroyed(this)).subscribe((gpus) => {
      this.gpus = gpus;
      const gpusConf: FormSelectConfig = this.fieldSets.config('gpus');
      for (const item of gpus) {
        gpusConf.options.push({ label: item.description, value: item.addr.pci_slot });
      }
      gpusFormControl.setValue(this.isolatedGpuPciIds);
    });

    this.store$.select(selectAdvancedConfig).pipe(untilDestroyed(this)).subscribe((config: AdvancedConfig) => {
      this.isolatedGpuPciIds = config.isolated_gpu_pci_ids;
      this.advancedConfig = config;
    });

    gpusFormControl.valueChanges.pipe(untilDestroyed(this)).subscribe((gpusValue: string[]) => {
      const finalIsolatedPciIds = [...gpusValue];

      const gpusConf: FormSelectConfig = this.fieldSets.config('gpus');
      if (finalIsolatedPciIds.length >= gpusConf.options.length) {
        const prevSelectedGpus = [];
        for (const gpu of this.gpus) {
          if (this.isolatedGpuPciIds.findIndex((igpi) => igpi === gpu.addr.pci_slot) >= 0) {
            prevSelectedGpus.push(gpu);
          }
        }
        if (prevSelectedGpus.length > 0) {
          const listItems = '<li>' + prevSelectedGpus.map((gpu, index) => (index + 1) + '. ' + gpu.description).join('</li><li>') + '</li>';
          gpusConf.warnings = 'At least 1 GPU is required by the host for it’s functions.<p>Currently following GPU(s) have been isolated:<ol>' + listItems + '</ol></p><p>With your selection, no GPU is available for the host to consume.</p>';
        } else {
          gpusConf.warnings = 'At least 1 GPU is required by the host for it’s functions. With your selection, no GPU is available for the host to consume.';
        }
        gpusFormControl.setErrors({ maxPCIIds: true });
      } else {
        gpusConf.warnings = null;
        gpusFormControl.setErrors(null);
      }
    });
  }

  customSubmit(body: { gpus: string[] }): void {
    this.loader.open();
    const finalIsolatedPciIds = body.gpus;
    this.ws.call('system.advanced.update', [{ isolated_gpu_pci_ids: finalIsolatedPciIds }]).pipe(untilDestroyed(this)).subscribe(
      () => {
        this.loader.close();
        this.entityForm.success = true;
        this.entityForm.formGroup.markAsPristine();
        this.modalService.close('slide-in-form');
        this.store$.dispatch(advancedConfigUpdated());
      },
      (err) => {
        this.loader.close();
        new EntityUtils().handleWSError(this.entityForm, err);
      },
    );
  }
}
