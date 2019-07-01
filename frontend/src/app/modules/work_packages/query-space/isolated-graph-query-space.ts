import {Injectable} from '@angular/core';
import {StatesGroup, InputState, input, State, derive} from 'reactivestates';
import {QueryResource} from "core-app/modules/hal/resources/query-resource";
import {QueryFormResource} from 'core-app/modules/hal/resources/query-form-resource';
import {GroupObject, WorkPackageCollectionResource} from "core-app/modules/hal/resources/wp-collection-resource";
import {WorkPackageTableRefreshRequest} from "core-components/wp-table/wp-table-refresh-request.service";
import {Subject} from 'rxjs';
import {ChartType} from 'chart.js';
import {IsolatedQuerySpace} from "core-app/modules/work_packages/query-space/isolated-query-space";

@Injectable()
export class IsolatedGraphQuerySpace extends IsolatedQuerySpace {
  chartType = input<ChartType>();
}
