import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '@models/product';
import { DialogProductComponent } from '@shared/dialogs/dialog-product/dialog-product.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {

  public loading: boolean = false;

  constructor(
    private readonly _dialog: MatDialog,
  ){}


  openDialogProduct(product?: Product) {
    this._initOrStopLoading();
    this._dialog
      .open(DialogProductComponent, {
        data: product,
        width: '80%',
        maxWidth: '850px',
        maxHeight: '90%',
      })
      .afterClosed()
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe((res) => {
        if (res) {
        }
      });
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

}
