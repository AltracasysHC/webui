import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EntityCardAction } from 'app/pages/common/entity/entity-card/entity-card-config.interface';
import { EntityCardComponent } from './entity-card.component';

@Component({
  selector: 'app-entity-card-actions',
  styleUrls: ['./entity-card-actions.component.scss'],
  templateUrl: './entity-card-actions.component.html',
})
export class EntityCardActionsComponent implements OnInit {
  @Input() entity: EntityCardComponent;
  @Input() row: any;

  actions: EntityCardAction[];
  showMenu = true;

  constructor(public translate: TranslateService) {}

  menuActionVisible(id: string): boolean {
    if (id == 'edit' || id == 'delete') {
      return false;
    }
    return true;
  }

  ngOnInit(): void {
    this.actions = this.entity.getCardActions();
    this.actions.forEach((action) => {
      if (this.entity.conf.isActionVisible) {
        action.visible = this.entity.conf.isActionVisible.bind(
          this.entity.conf,
        )(action.id, this.row);
      } else {
        action.visible = true;
      }
    });
  }
}
