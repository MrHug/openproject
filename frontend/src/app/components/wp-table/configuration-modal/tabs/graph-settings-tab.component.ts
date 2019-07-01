
import {I18nService} from 'core-app/modules/common/i18n/i18n.service';
import {TabComponent} from 'core-components/wp-table/configuration-modal/tab-portal-outlet';
import {WorkPackageTableGroupByService} from 'core-components/wp-fast-table/state/wp-table-group-by.service';
import {QueryGroupByResource} from 'core-app/modules/hal/resources/query-group-by-resource';
import {Component, Injector} from "@angular/core";
import {IsolatedQuerySpace} from "core-app/modules/work_packages/query-space/isolated-query-space";
import {IsolatedGraphQuerySpace} from "core-app/modules/work_packages/query-space/isolated-graph-query-space";
import {ChartType} from 'chart.js';

interface OpChartType {
  identifier:ChartType;
  label:string;
}

@Component({
  templateUrl: './graph-settings-tab.component.html'
})
export class WpTableConfigurationGraphSettingsTab implements TabComponent {

  // Grouping
  public currentGroup:QueryGroupByResource|null;
  public availableGroups:QueryGroupByResource[] = [];
  public availableChartTypes = _.sortBy([{identifier: 'horizontalBar' as ChartType, label: 'Horizontal bar'},
                                         {identifier: 'line' as ChartType, label: 'Line'},
                                         {identifier: 'pie' as ChartType, label: 'Pie'}], 'label');
  public currentChartType:OpChartType;

  public text = {
    group_by: this.I18n.t('js.label_group_by'),
    chart_type: "Chart type"
  };

  constructor(readonly injector:Injector,
              readonly I18n:I18nService,
              readonly wpTableGroupBy:WorkPackageTableGroupByService,
              readonly querySpace:IsolatedQuerySpace) {
    this.currentChartType = this.availableChartTypes.find(type => type.identifier === this.chartType$.value) || this.availableChartTypes[0];
  }

  public onSave() {
    // Update grouping state
    let group = this.currentGroup;
    this.wpTableGroupBy.update(group);

    this.chartType$.putValue(this.currentChartType.identifier as ChartType);
  }

  public updateGroup(href:string) {
    this.currentGroup = _.find(this.availableGroups, group => group.href === href) || null;
  }

  ngOnInit() {
    this.wpTableGroupBy
      .onReady()
      .then(() => {
        this.availableGroups = _.sortBy(this.wpTableGroupBy.available, 'name');
        this.currentGroup = this.wpTableGroupBy.current;
      });
  }

  public get chartType$() {
    return (this.querySpace as IsolatedGraphQuerySpace).chartType;
  }
}
