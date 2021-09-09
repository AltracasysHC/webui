import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, switchMap } from 'rxjs/operators';
import { ServiceName, serviceNames } from 'app/enums/service-name.enum';
import { ServiceStatus } from 'app/enums/service-status.enum';
import { AppState } from 'app/interfaces/app-state.interface';
import { QueryParams } from 'app/interfaces/query-api.interface';
import { Service } from 'app/interfaces/service.interface';
import { EntityTableComponent } from 'app/pages/common/entity/entity-table/entity-table.component';
import { EntityTableAction, EntityTableConfig } from 'app/pages/common/entity/entity-table/entity-table.interface';
import { IscsiService, WebSocketService } from 'app/services/';
import { DialogService } from 'app/services/dialog.service';
import { selectAdvancedConfig } from 'app/stores/system-config/system-config.selectors';
import { T } from 'app/translate-marker';

interface ServiceRow extends Service {
  onChanging: boolean;
  name: string;
}

@UntilDestroy()
@Component({
  selector: 'services',
  styleUrls: ['./services.component.scss'],
  template: '<entity-table [title]="title" [conf]="this"></entity-table>',
  providers: [IscsiService],
})
export class Services implements EntityTableConfig, OnInit {
  title = T('Services');
  isFooterConsoleOpen: boolean;
  queryCall: 'service.query' = 'service.query';
  queryCallOption: QueryParams<Service> = [[], { order_by: ['service'] }];
  rowIdentifier = 'name';
  entityList: EntityTableComponent;
  inlineActions = true;

  columns = [
    { name: T('Name'), prop: 'name', always_display: true },
    {
      name: T('Running'),
      prop: 'state',
      toggle: true,
      always_display: true,
    },
    {
      name: T('Start Automatically'),
      prop: 'enable',
      checkbox: true,
      always_display: true,
    },
  ];

  config = {
    paging: false,
    sorting: { columns: this.columns },
  };
  hiddenServices: ServiceName[] = [ServiceName.Gluster, ServiceName.Afp];

  showSpinner = true;

  constructor(
    protected ws: WebSocketService,
    protected router: Router,
    private translate: TranslateService,
    private dialog: DialogService,
    private iscsiService: IscsiService,
    private store$: Store<AppState>,
  ) {}

  resourceTransformIncomingRestData(services: Service[]): ServiceRow[] {
    return services
      .filter((service) => !this.hiddenServices.includes(service.service))
      .map((service) => ({
        ...service,
        name: this.getServiceName(service),
        onChanging: false,
      }));
  }

  ngOnInit(): void {
    this.store$.select(selectAdvancedConfig).pipe(untilDestroyed(this)).subscribe((config) => {
      if (config) {
        this.isFooterConsoleOpen = config.consolemsg;
      }
    });
  }

  afterInit(entityList: EntityTableComponent): void {
    this.entityList = entityList;
    this.subscribeToServiceUpdates();
  }

  subscribeToServiceUpdates(): void {
    this.ws
      .subscribe('service.query')
      .pipe(
        map((event) => event.fields),
        filter((service) => !this.hiddenServices.includes(service.service)),
        untilDestroyed(this),
      )
      .subscribe((incomingService: Service) => {
        const service = this.entityList.rows.find((service) => service.service === incomingService.service);
        service.onChanging = true;

        setTimeout(() => {
          service.state = incomingService.state;
          service.enable = incomingService.enable;
          service.onChanging = false;
        }, 300);
      });
  }

  getActions(parentRow: ServiceRow): EntityTableAction[] {
    return [{
      actionName: 'configure',
      name: parentRow.service,
      icon: 'edit',
      id: 'Configure',
      label: T('Configure'),
      onClick: (row: ServiceRow) => {
        if (row.service === ServiceName.OpenVpnClient || row.service === ServiceName.OpenVpnServer) {
          const navigationExtras: NavigationExtras = { state: { configureOpenVPN: row.service.replace('openvpn_', '') } };
          this.router.navigate(['network'], navigationExtras);
        } else {
          this.editService(row.service);
        }
      },
    }];
  }

  onSliderChange(service: ServiceRow): void {
    this.toggle(service);
  }

  onCheckboxChange(service: ServiceRow): void {
    this.enableToggle(service);
  }

  toggle(service: ServiceRow): void {
    const rpc = service.state === ServiceStatus.Running ? 'service.stop' : 'service.start';

    const serviceName = this.getServiceName(service);

    if (rpc === 'service.stop') {
      if (service.service == ServiceName.Iscsi) {
        this.iscsiService.getGlobalSessions().pipe(
          switchMap((sessions) => {
            const msg = sessions.length == 0 ? '' : T('<font color="red"> There are ') + sessions.length
              + T(' active iSCSI connections.</font><br>Stop the ' + serviceName + ' service and close these connections?');

            return this.dialog.confirm({
              title: T('Alert'),
              message: msg == '' ? this.translate.instant('Stop {serviceName}?', { serviceName }) : msg,
              hideCheckBox: true,
              buttonMsg: T('Stop'),
            });
          }),
          filter(Boolean),
        ).pipe(untilDestroyed(this)).subscribe(() => this.updateService(rpc, service));
      } else {
        this.dialog.confirm({
          title: T('Alert'),
          message: this.translate.instant('Stop {serviceName}?', { serviceName }),
          hideCheckBox: true,
          buttonMsg: T('Stop'),
        }).pipe(filter(Boolean), untilDestroyed(this)).subscribe(() => {
          this.updateService(rpc, service);
        });
      }
    } else {
      this.updateService(rpc, service);
    }
  }

  updateService(rpc: 'service.start' | 'service.stop', service: ServiceRow): void {
    service.onChanging = true;
    const serviceName = this.getServiceName(service);
    this.ws.call(rpc, [service.service]).pipe(untilDestroyed(this)).subscribe((res) => {
      if (res) {
        if (service.state === ServiceStatus.Running && rpc === 'service.stop') {
          this.dialog.info(
            T('Service failed to stop'),
            serviceName + ' ' + T('service failed to stop.'),
          );
        }
        service.state = ServiceStatus.Running;
        service.onChanging = false;
      } else {
        if (service.state === ServiceStatus.Stopped && rpc === 'service.start') {
          this.dialog.info(
            T('Service failed to start'),
            serviceName + ' ' + T('service failed to start.'),
          );
        }
        service.state = ServiceStatus.Stopped;
        service.onChanging = false;
      }
    }, (res) => {
      let message = T('Error starting service ');
      if (rpc === 'service.stop') {
        message = T('Error stopping service ');
      }
      this.dialog.errorReport(message + serviceName, res.message, res.stack);
      service.onChanging = false;
    });
  }

  enableToggle(service: ServiceRow): void {
    this.ws
      .call('service.update', [service.id, { enable: service.enable }])
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        if (!res) {
          // Middleware should return the service id
          throw new Error('Method service.update failed. No response from server');
        }
      });
  }

  editService(service: ServiceName): void {
    switch (service) {
      case ServiceName.Iscsi:
        this.router.navigate(['/', 'sharing', 'iscsi']);
        break;
      case ServiceName.Cifs:
        this.router.navigate(['/', 'services', 'smb']);
        break;
      default:
        this.router.navigate(['/', 'services', service]);
        break;
    }
  }

  getServiceName(service: Service): string {
    return serviceNames.get(service.service) || service.service;
  }
}
