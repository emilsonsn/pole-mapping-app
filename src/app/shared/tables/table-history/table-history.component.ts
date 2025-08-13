import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Order, PageControl } from '@models/application';
import { MaintenanceService } from '@services/maintenance.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-table-history',
  templateUrl: './table-history.component.html',
  styleUrl: './table-history.component.scss'
})
export class TableHistoryComponent implements OnInit {
 @Input() searchTerm: string = '';
  @Input() loading: boolean = false;
  @Input() filters: any;
  @Output() rowClick = new EventEmitter<any>();

  maintenances: any[] = [];

  columns = [
    { slug: 'created_at', order: true, title: 'Data', align: 'start' },
    { slug: 'address', order: true, title: 'Endereço', align: 'start' }
  ];

  pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: 'created_at',
    order: Order.DESC
  };

  constructor(private readonly toast: ToastrService, private readonly service: MaintenanceService) {}

  ngOnInit(){
    this._onSearch();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    const {filters, searchTerm, loading} = changes;
    if (searchTerm?.previousValue !== undefined && searchTerm?.currentValue !== searchTerm?.previousValue) this._onSearch();
    else if (!loading?.currentValue) this._onSearch();
    else if (filters?.previousValue && filters?.currentValue) this._onSearch();
  }

  onRowClick(item: any) {
    this.rowClick.emit(item);
  }

  private _toggleLoading() {
    this.loading = !this.loading;
  }

  private _onSearch() {
    this.pageControl.search_term = this.searchTerm || '';
    this.pageControl.page = 1;
    this.search();
  }

  search() {
    this._toggleLoading();
    const params = {
      ...this.filters,
      search: this.pageControl.search_term,
      page: this.pageControl.page,
      take: this.pageControl.take,
      order_field: this.pageControl.orderField,
      order: this.pageControl.order
    };
    this.service.list(params)
      .pipe(finalize(() => this._toggleLoading()))
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.maintenances = (res.data || res.items || []).map((m: any) => ({
            ...m,
            address_full: `${m.address} - ${m.neighborhood} - ${m.city}`
          }));
          this.pageControl.itemCount = res.itemCount ?? res.total ?? 0;
          this.pageControl.pageCount = res.pageCount ?? Math.ceil((this.pageControl.itemCount || 0) / this.pageControl.take);
        },
        error: () => this.toast.error('Erro ao carregar histórico')
      });
  }

  onClickOrderBy(slug: string, canOrder: boolean) {
    if (!canOrder) return;
    if (this.pageControl.orderField === slug) this.pageControl.order = this.pageControl.order === Order.ASC ? Order.DESC : Order.ASC;
    else { this.pageControl.order = Order.ASC; this.pageControl.orderField = slug; }
    this.pageControl.page = 1;
    this.search();
  }

  pageEvent(e: any) {
    this.pageControl.page = e.pageIndex + 1;
    this.pageControl.take = e.pageSize;
    this.search();
  }
}