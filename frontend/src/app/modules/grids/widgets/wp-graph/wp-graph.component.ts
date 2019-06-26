import {Component, OnDestroy, OnInit} from '@angular/core';
import {WorkPackageEmbeddedGraphDataset} from "core-components/wp-table/embedded/wp-embedded-graph.component";
import {I18nService} from "core-app/modules/common/i18n/i18n.service";
import {UrlParamsHelperService} from "core-components/wp-query/url-params-helper";
import {QueryDmService} from "core-app/modules/hal/dm-services/query-dm.service";
import {StateService} from '@uirouter/core';
import {QueryFormDmService} from "core-app/modules/hal/dm-services/query-form-dm.service";
import {WorkPackageStatesInitializationService} from "core-components/wp-list/wp-states-initialization.service";
import {QueryFormResource} from "core-app/modules/hal/resources/query-form-resource";
import {QueryResource} from "core-app/modules/hal/resources/query-resource";
import {Observable} from 'rxjs';
import {IsolatedQuerySpace} from "core-app/modules/work_packages/query-space/isolated-query-space";
import {AbstractWidgetComponent} from "core-app/modules/grids/widgets/abstract-widget.component";
import {skip, distinctUntilChanged} from 'rxjs/operators';
import {untilComponentDestroyed} from 'ng2-rx-componentdestroyed';
import {CollectionResource} from "core-app/modules/hal/resources/collection-resource";
import {WorkPackageResource} from "core-app/modules/hal/resources/work-package-resource";

@Component({
  selector: 'widget-wp-graph',
  templateUrl: './wp-graph.component.html',
  styleUrls: ['../wp-list/wp-list.component.css',
              './wp-graph.component.sass'],
})
export class WidgetWpGraphComponent extends AbstractWidgetComponent implements OnInit, OnDestroy {
  public text = { title: this.i18n.t('js.grid.widgets.work_packages_graph.title') };
  public datasets:WorkPackageEmbeddedGraphDataset[] = [];
  private queryForm:QueryFormResource|undefined;
  public inFlight = false;
  public query$:Observable<QueryResource>;

  constructor(protected i18n:I18nService,
              protected urlParamsHelper:UrlParamsHelperService,
              protected readonly state:StateService,
              protected readonly queryDm:QueryDmService,
              protected readonly queryFormDm:QueryFormDmService,
              protected readonly querySpace:IsolatedQuerySpace,
              protected readonly wpStatesInitialization:WorkPackageStatesInitializationService) {
    super(i18n);
  }

  ngOnInit() {
    this.ensureQueryAndLoad();

    this.setupListeners();
  }

  private setupListeners() {
    this.query$ = this
      .querySpace
      .query
      .values$();

    this.query$
      .pipe(
        // 3 because ... well it is a magic number and works
        skip(3),
        distinctUntilChanged(),
        untilComponentDestroyed(this)
      ).subscribe((query) => {
      this.ensureFormAndSaveQuery(query);
      this.updateDatasets(query.results);
    });
  }

  ngOnDestroy() {
    // nothing to do
  }

  private ensureFormAndSaveQuery(query:QueryResource) {
    this.queryForm = this.querySpace.queryForm.value;

    if (this.queryForm) {
      this.saveQuery(query);
    } else {
      this.queryFormDm.load(query).then((form) => {
        this.queryForm = form;
        this.saveQuery(query);
      });
    }
  }

  public renameQuery(query:QueryResource, value:string) {
    query.name = value;

    this.ensureFormAndSaveQuery(query);
  }

  private saveQuery(query:QueryResource) {
    this.inFlight = true;

    this
      .queryDm
      .update(query, this.queryForm!)
      .toPromise()
      .then((query) => {
        this.inFlight = false;
      })
      .catch(() => this.inFlight = false);
  }

  private ensureQueryAndLoad() {
    if (!this.resource.options.queryId) {
      this.createInitial()
        .then((query) => {
          this.resource.options = { queryId: query.id };

          this.resourceChanged.emit(this.resource);

          this.loadQuery(query.id as string);
        });
    } else {
      this.loadQuery(this.resource.options.queryId as string);
    }
  }

  private createInitial():Promise<QueryResource> {
    const projectIdentifier = this.state.params['projectPath'];

    return this.queryFormDm
      .loadWithParams(
        {pageSize: 0},
        undefined,
        projectIdentifier,
        this.queryCreationParams()
      )
      .then(form => {
        const query = this.queryFormDm.buildQueryResource(form);

        return this.queryDm.create(query, form);
      });
  }

  private loadQuery(queryId:string) {
    this.queryDm
      .find(
        {pageSize: 0},
        queryId
      )
      .then(query => {
        this.wpStatesInitialization.initialize(query, query.results);

        this.updateDatasets(query.results);
      });
  }

  protected queryCreationParams() {
    //return Object.assign({}, super.queryCreationParams(), {
    return {
      hidden: true,
      name: this.text.title,
      showHierarchies: false,
      _links: {
        groupBy: {
          href: "/api/v3/queries/group_bys/status"
        }
      }
    };
  }

  protected updateDatasets(results:CollectionResource<WorkPackageResource>) {
    this.datasets = [{ groups: results.groups, queryProps: '', label: '' }];
  }
}
