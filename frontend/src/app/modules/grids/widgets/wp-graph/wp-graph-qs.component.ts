import {Component} from '@angular/core';
import {AbstractWidgetComponent} from "core-app/modules/grids/widgets/abstract-widget.component";
import {IsolatedQuerySpace} from "core-app/modules/work_packages/query-space/isolated-query-space";
import {IsolatedGraphQuerySpace} from "core-app/modules/work_packages/query-space/isolated-graph-query-space";
import {GridWidgetResource} from "core-app/modules/hal/resources/grid-widget-resource";

@Component({
  templateUrl: './wp-graph-qs.component.html',
  styleUrls: ['./wp-graph-qs.component.sass']
})
export class WidgetWpGraphQuerySpaceComponent extends AbstractWidgetComponent {

  public onResourceChanged(resource:GridWidgetResource) {
    this.resourceChanged.emit(resource);
  }
}
