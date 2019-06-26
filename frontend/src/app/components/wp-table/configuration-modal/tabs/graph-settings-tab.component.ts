
import {I18nService} from 'core-app/modules/common/i18n/i18n.service';
import {TabComponent} from 'core-components/wp-table/configuration-modal/tab-portal-outlet';
import {WorkPackageTableGroupByService} from 'core-components/wp-fast-table/state/wp-table-group-by.service';
import {QueryGroupByResource} from 'core-app/modules/hal/resources/query-group-by-resource';
import {WorkPackageTableHierarchiesService} from 'core-components/wp-fast-table/state/wp-table-hierarchy.service';
import {WorkPackageTableSumService} from 'core-components/wp-fast-table/state/wp-table-sum.service';
import {Component, Injector} from "@angular/core";

@Component({
  templateUrl: './graph-settings-tab.component.html'
})
export class WpTableConfigurationGraphSettingsTab implements TabComponent {

  // Grouping
  public currentGroup:QueryGroupByResource|null;
  public availableGroups:QueryGroupByResource[] = [];


  public text = {
    choose_mode: this.I18n.t('js.work_packages.table_configuration.choose_display_mode'),
    label_group_by: this.I18n.t('js.label_group_by'),
    title: this.I18n.t('js.label_group_by'),
    placeholder: this.I18n.t('js.placeholders.default'),
    please_select: this.I18n.t('js.placeholders.selection'),
    default: '— ' + this.I18n.t('js.work_packages.table_configuration.default'),
    display_sums: this.I18n.t('js.work_packages.query.display_sums'),
    display_sums_hint: '— ' + this.I18n.t('js.work_packages.table_configuration.display_sums_hint'),
    display_mode: {
      default: this.I18n.t('js.work_packages.table_configuration.default_mode'),
      grouped: this.I18n.t('js.work_packages.table_configuration.grouped_mode'),
      hierarchy: this.I18n.t('js.work_packages.table_configuration.hierarchy_mode'),
      hierarchy_hint: '— ' + this.I18n.t('js.work_packages.table_configuration.hierarchy_hint')
    }
  };

  constructor(readonly injector:Injector,
              readonly I18n:I18nService,
              readonly wpTableGroupBy:WorkPackageTableGroupByService,
              readonly wpTableHierarchies:WorkPackageTableHierarchiesService,
              readonly wpTableSums:WorkPackageTableSumService) {
  }

  public onSave() {
    // Update grouping state
    let group = this.currentGroup;
    this.wpTableGroupBy.update(group);
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
}
