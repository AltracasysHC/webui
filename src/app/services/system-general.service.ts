import { EventEmitter, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdvancedConfig } from 'app/interfaces/advanced-config.interface';
import { CertificateAuthority } from 'app/interfaces/certificate-authority.interface';
import { Certificate } from 'app/interfaces/certificate.interface';
import { Choices } from 'app/interfaces/choices.interface';
import { Option } from 'app/interfaces/option.interface';
import { SystemGeneralConfig } from 'app/interfaces/system-config.interface';
import { SystemInfo } from 'app/interfaces/system-info.interface';
import { WebSocketService } from './ws.service';

@Injectable({ providedIn: 'root' })
export class SystemGeneralService {
  protected certificateList: 'certificate.query' = 'certificate.query';
  protected caList: 'certificateauthority.query' = 'certificateauthority.query';

  updateRunning = new EventEmitter<string>();
  updateRunningNoticeSent = new EventEmitter<string>();
  updateIsDone$ = new Subject();

  /**
   * @deprecated Use selectAdvancedConfig
   */
  sendConfigData$ = new Subject<SystemGeneralConfig>();

  /**
   * @deprecated Use selectAdvancedConfig
   */
  refreshSysGeneral$ = new Subject();

  // Prevent repetitive api calls in a short time when data is already available
  /**
   * @deprecated Use selectGeneralConfig
   */
  generalConfigInfo: SystemGeneralConfig | { waiting: true };

  /**
   * @deprecated Use selectGeneralConfig
   */
  getGeneralConfig$ = new Observable<SystemGeneralConfig>((observer) => {
    if (!this.ws.loggedIn) {
      return observer.next({} as SystemGeneralConfig);
    }
    if ((!this.generalConfigInfo || _.isEmpty(this.generalConfigInfo))) {
      // Since the api call can be made many times before the first response comes back,
      // set waiting to true to make if condition false after the first call
      this.generalConfigInfo = { waiting: true };
      this.ws.call('system.general.config').subscribe((configInfo) => {
        this.generalConfigInfo = configInfo;
        observer.next(this.generalConfigInfo);
      });
    } else {
      // Check every ten ms to see if the object is ready, then stop checking and send the obj
      const wait = setInterval(() => {
        if (this.generalConfigInfo && !(this.generalConfigInfo as { waiting?: true }).waiting) {
          clearInterval(wait);
          observer.next(this.generalConfigInfo as SystemGeneralConfig);
        }
      }, 10);
    }
    // After a pause, set object to empty so calls can be made
    setTimeout(() => {
      this.generalConfigInfo = {} as SystemGeneralConfig;
    }, 2000);
  });

  /**
   * @deprecated Use selectAdvancedConfig
   */
  advancedConfigInfo: AdvancedConfig | { waiting: true };

  /**
   * @deprecated Use selectAdvancedConfig
   */
  getAdvancedConfig$ = new Observable<AdvancedConfig>((observer) => {
    if ((!this.advancedConfigInfo || _.isEmpty(this.advancedConfigInfo))) {
      this.advancedConfigInfo = { waiting: true };
      this.ws.call('system.advanced.config').subscribe((advancedConfig) => {
        this.advancedConfigInfo = advancedConfig;
        observer.next(this.advancedConfigInfo);
      });
    } else {
      const wait = setInterval(() => {
        if (this.advancedConfigInfo && !(this.advancedConfigInfo as { waiting: true }).waiting) {
          clearInterval(wait);
          observer.next(this.advancedConfigInfo as AdvancedConfig);
        }
      }, 10);
    }
    setTimeout(() => {
      this.advancedConfigInfo = {} as AdvancedConfig;
    }, 2000);
  });

  productType = '';
  getProductType$ = new Observable<string>((observer) => {
    if (!this.productType) {
      this.productType = 'pending';
      this.ws.call('system.product_type').subscribe((res) => {
        this.productType = res;
        observer.next(this.productType);
      });
    } else {
      const wait = setInterval(() => {
        if (this.productType !== 'pending') {
          clearInterval(wait);
          observer.next(this.productType);
        }
      }, 10);
    }
    setTimeout(() => {
      this.productType = '';
    }, 5000);
  });

  constructor(protected ws: WebSocketService) {}

  getCA(): Observable<CertificateAuthority[]> {
    return this.ws.call(this.caList, []);
  }

  getCertificates(): Observable<Certificate[]> {
    return this.ws.call(this.certificateList);
  }

  getUnsignedCertificates(): Observable<Certificate[]> {
    return this.ws.call(this.certificateList, [[['CSR', '!=', null]]]);
  }

  getUnsignedCAs(): Observable<CertificateAuthority[]> {
    return this.ws.call(this.caList, [[['privatekey', '!=', null]]]);
  }

  getCertificateCountryChoices(): Observable<Choices> {
    return this.ws.call('certificate.country_choices');
  }

  getSysInfo(): Observable<SystemInfo> {
    return this.ws.call('system.info');
  }

  ipChoicesv4(): Observable<Option[]> {
    return this.ws.call('system.general.ui_address_choices').pipe(
      map((response) =>
        Object.keys(response || {}).map((key) => ({
          label: response[key],
          value: response[key],
        }))),
    );
  }

  ipChoicesv6(): Observable<Option[]> {
    return this.ws.call('system.general.ui_v6address_choices').pipe(
      map((response) =>
        Object.keys(response || {}).map((key) => ({
          label: response[key],
          value: response[key],
        }))),
    );
  }

  kbdMapChoices(): Observable<Option[]> {
    return this.ws.call('system.general.kbdmap_choices').pipe(
      map((response) =>
        Object.keys(response || {}).map((key) => ({
          label: `${response[key]} (${key})`,
          value: key,
        }))),
    );
  }

  languageChoices(): Observable<Choices> {
    return this.ws.call('system.general.language_choices');
  }

  timezoneChoices(): Observable<Option[]> {
    return this.ws.call('system.general.timezone_choices').pipe(
      map((response) =>
        Object.keys(response || {}).map((key) => ({
          label: response[key],
          value: key,
        }))),
    );
  }

  refreshDirServicesCache(): Observable<void> {
    return this.ws.call('directoryservices.cache_refresh');
  }

  updateDone(): void {
    this.updateIsDone$.next();
  }

  sendConfigData(data: SystemGeneralConfig): void {
    this.sendConfigData$.next(data);
  }

  refreshSysGeneral(): void {
    this.refreshSysGeneral$.next();
  }

  checkRootPW(password: string): Observable<boolean> {
    return this.ws.call('auth.check_user', ['root', password]);
  }
}
