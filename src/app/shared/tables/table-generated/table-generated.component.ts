import { Component, Input, Output, SimpleChanges } from '@angular/core';
import { Order, PageControl } from '@models/application';
import { Client } from '@models/client';
import { ClientService } from '@services/client.service';
import { GeneratedService } from '@services/generated.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-table-generated',
  templateUrl: './table-generated.component.html',
  styleUrl: './table-generated.component.scss'
})
export class TableGeneratedComponent {
  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Input()
  filters: any;

  public generateds: any[] = [];

  public columns = [
    {
      slug: "client",
      order: true,
      title: "Cliente",
      align: "start",
    },
    {
      slug: "url",
      order: true,
      title: "Url",
      align: "justify-content-center",
    },
  ];

  public pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: "id",
    order: Order.ASC,
  };

  constructor(
    private readonly _toastr: ToastrService,
    private readonly _generatedService: GeneratedService,    
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    const {filters, searchTerm, loading} = changes;

    if (searchTerm?.previousValue && searchTerm?.currentValue !== searchTerm?.previousValue) {
      this._onSearch();
    } else if (!loading?.currentValue) {
      this._onSearch();
    } else if (filters?.previousValue && filters?.currentValue) {
      this._onSearch();
    }

  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  get getLoading() {
    return !!this.loading;
  }

  private _onSearch() {
    this.pageControl.search_term = this.searchTerm || '';
    this.pageControl.page = 1;
    this.search();
  }

  search(): void {
    this._initOrStopLoading();

    this._generatedService
      .search(this.pageControl)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: res => {
          this.generateds = res.data;

          this.pageControl.page = res.current_page - 1;
          this.pageControl.itemCount = res.total;
          this.pageControl.pageCount = res.last_page;
        },
        error: err => {
          this._toastr.error(
            err?.error?.message || "Ocorreu um erro ao buscar os dados"
          );
        }
      });
  }

  onClickOrderBy(slug: string, order: boolean) {
    if (!order) {
      return;
    }

    if (this.pageControl.orderField === slug) {
      this.pageControl.order =
        this.pageControl.order === Order.ASC ? Order.DESC : Order.ASC;
    } else {
      this.pageControl.order = Order.ASC;
      this.pageControl.orderField = slug;
    }
    this.pageControl.page = 1;
    this.search();
  }

  pageEvent($event: any) {
    this.pageControl.page = $event.pageIndex + 1;
    this.pageControl.take = $event.pageSize;
    this.search();
  }

  copy(text: string | undefined) {
    if (!text) {
      this._toastr.warning('Nenhuma URL para copiar');
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      this._toastr.success('URL copiada com sucesso!');
    }).catch(err => {
      this._toastr.error('Erro ao copiar a URL:', err);
    });
  }
}
