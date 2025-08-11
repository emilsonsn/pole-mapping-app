import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '@models/product';
import { City2Service } from '@services/city2.service';
import { ClientService } from '@services/client.service';
import { ProductService } from '@services/product.service';
import { CityService } from '@services/quiz/city.service';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrl: './generate.component.scss'
})
export class GenerateComponent {

  public form: FormGroup;
  products: Product[];

  cityControl = new FormControl();
  cities: any[] = [];

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _cityService: CityService,
    private readonly _productService: ProductService,
    private readonly _clientService: ClientService,
    private readonly _toastr: ToastrService,
    private readonly _route: Router,
    private city2Service: City2Service
  ){}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      name: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      email: [null, [Validators.required]],
      address: [null, [Validators.required]],
      birth: [null, [Validators.required]],
      whatsapp: [null, [Validators.required]],
      reports: [null, [Validators.required]],
    });  

    // this.getCitys();
    this.getProducts();

    this.cityControl.valueChanges
    .pipe(
      debounceTime(300), 
      switchMap((query) => this.city2Service.getCities(query))
    )
    .subscribe((cities) => (this.cities = cities));

  }

  getCitys(){
    // this._cityService.searchCities('')
    // .subscribe({
    //   next: (res) => {
    //     this.citys = res;
    //   }
    // })
  }

  getProducts(){
    this._productService.search({})
    .subscribe({
      next: (res) => {
        this.products = res.data;
      }
    })
  }

  onSubmit(){

    if(!this.form.valid){
      this.form.markAllAsTouched();
      console.log(this.form.controls);
      return;
    }

    this._clientService
    .generate({
      ...this.form.getRawValue()      
    })
    .subscribe({
      next: (res) => {
        this._toastr.success(res.message);
        this.form.reset();
      },
      error: (err) => {
        this._toastr.error(err.error.message);
      }
    });
  }

  public goToAll(){
    this._route.navigate(['/painel/generate/all']);
  }

  
}
