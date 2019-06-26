import {Injectable} from '@angular/core';
import {I18nService} from 'core-app/modules/common/i18n/i18n.service';
import {TabInterface} from "core-components/wp-table/configuration-modal/tab-portal-outlet";
import {WpTableConfigurationFiltersTab} from "core-components/wp-table/configuration-modal/tabs/filters-tab.component";
import {WpTableConfigurationGraphSettingsTab} from "core-components/wp-table/configuration-modal/tabs/graph-settings-tab.component";

@Injectable()
export class WpGraphConfigurationService {

  protected _tabs:TabInterface[] = [
    {
      name: 'filters',
      title: this.I18n.t('js.work_packages.query.filters'),
      componentClass: WpTableConfigurationFiltersTab,
    },
    {
      name: 'graph-settings',
      title: this.I18n.t('js.work_packages.table_configuration.display_settings'),
      componentClass: WpTableConfigurationGraphSettingsTab,
    }
  ];

  constructor(readonly I18n:I18nService) {
  }

  public get tabs() {
    return this._tabs;
  }
}
