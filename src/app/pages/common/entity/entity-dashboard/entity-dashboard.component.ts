import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { ProductType } from 'app/enums/product-type.enum';
import { WebSocketService } from 'app/services/ws.service';

export interface EntityDashboardRoutePart extends Route {
  addPath?: string;
}

@UntilDestroy()
@Component({
  selector: 'entity-dashboard',
  templateUrl: './entity-dashboard.component.html',
  styleUrls: ['./entity-dashboard.component.scss'],
})
export class EntityDashboardComponent implements OnInit {
  routeParts: EntityDashboardRoutePart[] = [];
  protected parent = '';

  protected scale_exclude = ['nis', 'multipaths'];
  protected enterpriseOnly = ['viewenclosure'];

  productType = window.localStorage.getItem('product_type') as ProductType;

  constructor(
    protected ws: WebSocketService,
    protected router: Router,
    protected aroute: ActivatedRoute,
    public translate: TranslateService,
  ) {

  }

  ngOnInit(): void {
    this.parent = this.aroute.parent.parent.routeConfig.path;
    const routeConfigs: EntityDashboardRoutePart[] = this.aroute.parent.routeConfig.children;
    routeConfigs.forEach((routeConfig) => {
      if (routeConfig.path !== '' && !routeConfig.path.includes(':')) {
        if (_.find(routeConfig.children, { path: 'add' })) {
          routeConfig['addPath'] = 'add';
        } else if (_.find(routeConfig.children, { path: 'import' })) {
          routeConfig['addPath'] = 'import';
        }
        this.routeParts.push(routeConfig);
      }
    });

    let exclude: string[] = [];
    if (this.productType.includes(ProductType.Scale)) {
      exclude = exclude.concat(this.scale_exclude);
    }
    if (!this.productType.includes(ProductType.Enterprise)) {
      exclude = exclude.concat(this.enterpriseOnly);
    }
    this.ws.call('ipmi.is_loaded').pipe(untilDestroyed(this)).subscribe((isIpmiLoaded) => {
      if (!isIpmiLoaded) {
        this.remove('ipmi');
      }
    });
    this.ws.call('multipath.query').pipe(untilDestroyed(this)).subscribe((res) => {
      if (!res || res.length === 0) {
        this.remove('multipaths');
      }
    });
    exclude.forEach((element) => {
      this.remove(element);
    });
  }

  remove(element: string): void {
    this.routeParts = _.remove(this.routeParts, (r) => r['path'] !== element);
  }

  goList(item: EntityDashboardRoutePart): void {
    this.router.navigate(new Array('/').concat([this.parent, item.path]));
  }

  goAdd(item: EntityDashboardRoutePart): void {
    this.router.navigate(new Array('/').concat([this.parent, item.path, item.addPath]));
  }
}
