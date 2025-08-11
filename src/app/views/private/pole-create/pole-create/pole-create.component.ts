import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PoleService } from '@services/pole.service';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { ToastrService } from 'ngx-toastr';
import { AuxiliaryService } from '@services/auxiliary.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-pole-create',
  templateUrl: './pole-create.component.html',
  styleUrls: ['./pole-create.component.scss']
})

export class PoleCreateComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  locationFetched = false;
  qrResult = '';
  qrcodeDetected = false;
  poleExist = false;

  locationFields = [
    { value: 'latitude', label: 'Latitude', class: 'form-item'},
    { value: 'longitude', label: 'Longitude', class: 'form-item'},
    { value: 'city', label: 'Cidade', class: 'col-md-12'},
    { value: 'neighborhood', label: 'Bairro', class: 'col-md-12'},
    { value: 'address', label: 'Endereço', class: 'col-md-12'},
  ];

  // Campos dos selects
  types: any[] = [];
  pavings: any[] = [];
  positions: any[] = [];
  networkTypes: any[] = [];
  connectionTypes: any[] = [];
  transformers: any[] = [];
  accesses: any[] = [];

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private auxiliaryService: AuxiliaryService,
    private poleService: PoleService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      qrcode: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      address: ['', Validators.required],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      type_id: ['', Validators.required],
      height: ['', Validators.required],
      paving_id: ['', Validators.required],
      position_id: ['', Validators.required],
      network_type_id: ['', Validators.required],
      connection_type_id: ['', Validators.required],
      transformer_id: ['', Validators.required],
      access_id: ['', Validators.required],
      luminaire_quantity: ['0', Validators.required],
    });
    this.loadOptions();
      this.getLocation();
  }

  async getLocation() {
    try {
      await Geolocation.requestPermissions();

      const permission = await Geolocation.requestPermissions();
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });

      const lat = position.coords.latitude.toFixed(6);
      const lng = position.coords.longitude.toFixed(6);

      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      const address = data.address || {};

      this.form.patchValue({
        latitude: lat,
        longitude: lng,
        address: `${address.road || ''}, ${address.house_number || ''}`.trim(),
        neighborhood: address.suburb || address.neighbourhood || '',
        city: address.city || address.town || address.village || '',
      });

    } catch (error) {
      console.error('Erro ao obter localização', error);
      this.toast.error('Não foi possível obter a localização via GPS.');
    }
  }

  loadOptions(): void {
    this.auxiliaryService.getAll().subscribe({
      next: (res) => {
        this.types = res.types;
        this.pavings = res.pavings;
        this.positions = res.positions;
        this.networkTypes = res.networkTypes;
        this.connectionTypes = res.connectionTypes;
        this.transformers = res.transformers;
        this.accesses = res.accesses;
      },
      error: () => {
        this.toast.error('Erro ao carregar dados auxiliares.');
      }
    });
  }

  async scanQRCode() {
    const { barcodes } = await BarcodeScanner.scan();

    if (barcodes.length > 0) {
      const value = barcodes[0].rawValue;
      this.qrResult = value;
      this.qrcodeDetected = true;
      this.form.patchValue({ qrcode: value });

      this.checkPoste(value);
    }
  }

  onCodeResult(result) {
    if (this.qrcodeDetected) return;

    this.qrcodeDetected = true;
    this.form.patchValue({ qrcode: result });
    this.checkPoste(result);
  }

  checkPoste(qrcode: string) {
    this.loading = true;
    this.poleService.getByQrCode(qrcode).subscribe({
      next: (poste) => {
        if(poste.id){
          this.toast.success('Informações encontradas com sucesso!')
          this.poleExist = true;
          this.form.patchValue(poste);
          this.form.disable();
          this.loading = false;
        }else{
          this.poleExist = false;
          this.loading = false;
        }
      },
      error: () => {
        this.poleExist = false;
        this.loading = false;
      },
    });
  }

  submit() {
    if (this.form.invalid) {
      this.toast.error('Preencha todos os campos obrigatórios');
    };

    this.loading = true;

    this.poleService.create(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.toast.success('Poste cadastrado com sucesso!');
        this.form.reset();
        this.loading = false;
      },
      error: (error) => {
        this.toast.error(error.message);
        this.loading = false;
      }
    });
  }
}
