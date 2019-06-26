import {
  WorkPackageTableConfiguration,
} from "core-components/wp-table/wp-table-configuration";
import {WidgetWpSetComponent} from "core-app/modules/grids/widgets/wp-set/wp-set.component";

export class WidgetWpListComponent extends WidgetWpSetComponent {
  // An heuristic based on paddings, margins, the widget header height and the pagination height
  private static widgetSpaceOutsideTable:number = 230;
  private static wpLineHeight:number = 40;
  private static gridAreaHeight:number = 100;
  private static gridAreaSpace:number = 20;

  public configuration:Partial<WorkPackageTableConfiguration> = {
    actionsColumnEnabled: false,
    columnMenuEnabled: false,
    hierarchyToggleEnabled: true,
    contextMenuEnabled: false
  };

  ngOnInit() {
    super.ngOnInit();

    this.configuration.forcePerPageOption = this.perPageOption;
  }

  private get perPageOption():number|false {
    if (this.resource) {
      let numberOfRows = this.resource.height;
      let availableHeight = numberOfRows * WidgetWpListComponent.gridAreaHeight +
        (numberOfRows - 1) * WidgetWpListComponent.gridAreaSpace;
      let perPageOption:number = Math.floor((availableHeight - WidgetWpListComponent.widgetSpaceOutsideTable) / WidgetWpListComponent.wpLineHeight);

      return perPageOption < 1 ? 1 : perPageOption;
    } else {
      return false;
    }
  }
}
