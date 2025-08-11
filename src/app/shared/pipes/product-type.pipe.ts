import { Pipe, PipeTransform } from '@angular/core';
import { ProductType } from '@models/product';

@Pipe({
  name: 'productType'
})
export class ProductTypePipe implements PipeTransform {

  transform(value: ProductType): string {
    if (!value) return '';
    switch (value){
        case ProductType.Main:
          return 'Produto principal';
        case ProductType.Upsell:
          return 'Upsell';
        case ProductType.Bundle:
          return 'Bundle';
        default:
          return '----';
    }    
  }

}
