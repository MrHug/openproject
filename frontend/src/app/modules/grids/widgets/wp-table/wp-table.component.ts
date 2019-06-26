import {WidgetWpSetComponent} from "core-app/modules/grids/widgets/wp-set/wp-set.component";
import {Component} from '@angular/core';

@Component({
  templateUrl: './wp-table.component.html',
  styleUrls: ['../wp-list/wp-list.component.css'],
})
export class WidgetWpTableComponent extends WidgetWpSetComponent {
  public text = { title: this.i18n.t('js.grid.widgets.work_packages_table.title') };
}
