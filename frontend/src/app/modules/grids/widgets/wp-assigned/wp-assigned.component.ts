import {Component, OnInit} from "@angular/core";
import {ApiV3FilterBuilder} from "core-components/api/api-v3/api-v3-filter-builder";
import {WidgetWpListComponent} from "core-app/modules/grids/widgets/wp-list/wp-list.component";

@Component({
  templateUrl: '../wp-list/wp-list.component.html',
  styleUrls: ['../wp-list/wp-list.component.css']
})

export class WidgetWpAssignedComponent extends WidgetWpListComponent implements OnInit {
  public text = { title: this.i18n.t('js.grid.widgets.work_packages_assigned.title') };
  public queryProps:any;

  ngOnInit() {
    super.ngOnInit();
    let filters = new ApiV3FilterBuilder();
    filters.add('assignee', '=', ["me"]);
    filters.add('status', 'o', []);

    this.queryProps = {"columns[]":["id", "project", "type", "subject"],
      "filters":filters.toJson()};
  }
}

