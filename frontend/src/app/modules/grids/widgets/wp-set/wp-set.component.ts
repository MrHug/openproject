import {OnDestroy, OnInit} from "@angular/core";
import {QueryResource} from "core-app/modules/hal/resources/query-resource";
import {I18nService} from "core-app/modules/common/i18n/i18n.service";
import {untilComponentDestroyed} from 'ng2-rx-componentdestroyed';
import {skip} from 'rxjs/operators';
import {UrlParamsHelperService} from "core-components/wp-query/url-params-helper";
import {QueryFormDmService} from "core-app/modules/hal/dm-services/query-form-dm.service";
import {QueryDmService} from "core-app/modules/hal/dm-services/query-dm.service";
import {QueryFormResource} from "core-app/modules/hal/resources/query-form-resource";
import {Observable} from "rxjs";
import {StateService} from '@uirouter/core';
import {AbstractWidgetComponent} from "core-app/modules/grids/widgets/abstract-widget.component";
import {IsolatedQuerySpace} from "core-app/modules/work_packages/query-space/isolated-query-space";

export abstract class WidgetWpSetComponent extends AbstractWidgetComponent implements OnInit, OnDestroy {
  public text = { title: this.i18n.t('js.grid.widgets.work_packages_graph.title') };
  public queryId:string|null;
  private queryForm:QueryFormResource;
  public inFlight = false;
  public query$:Observable<QueryResource>;

  constructor(protected i18n:I18nService,
              protected urlParamsHelper:UrlParamsHelperService,
              protected readonly state:StateService,
              protected readonly queryDm:QueryDmService,
              protected readonly querySpace:IsolatedQuerySpace,
              protected readonly queryFormDm:QueryFormDmService) {
    super(i18n);
  }

  ngOnInit() {
    if (!this.resource.options.queryId) {
      this.createInitial()
        .then((query) => {
          this.resource.options = { queryId: query.id };

          this.resourceChanged.emit(this.resource);

          this.queryId = query.id;
        });
    } else {
      this.queryId = this.resource.options.queryId as string;
    }

    this.query$ = this
      .querySpace
      .query
      .values$();

    this.query$
      .pipe(
        // 2 because ... well it is a magic number and works
        skip(2),
        untilComponentDestroyed(this)
      ).subscribe((query) => {
      this.ensureFormAndSaveQuery(query);
    });
  }

  ngOnDestroy() {
    // nothing to do
  }

  private ensureFormAndSaveQuery(query:QueryResource) {
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
      .update(query, this.queryForm)
      .toPromise()
      .then((query) => {
        this.inFlight = false;
        return query;
      })
      .catch(() => this.inFlight = false);
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

  protected queryCreationParams() {
    return {
      hidden: true,
      name: this.text.title
    };
  }
}
