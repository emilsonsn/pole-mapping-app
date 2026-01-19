import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PoleService } from '@services/pole.service';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { ToastrService } from 'ngx-toastr';
import { AuxiliaryService } from '@services/auxiliary.service';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Router, NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';

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
  manualQrCode = this.fb.control('');

  relayImagePreview: string | null = null;
  relayPhotoConfirmed = false;

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
  characteristics: any[] = [];
  arms: any[] = [];
  lamps: any[] = [];
  powers: any[] = [];
  reactors: any[] = [];

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private auxiliaryService: AuxiliaryService,
    private poleService: PoleService,
    private readonly routeService: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [''],
      qrcode: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      address: ['', Validators.required],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      type_id: ['', Validators.required],
      remote_management_relay: [''],
      paving_id: ['', Validators.required],
      position_id: ['', Validators.required],
      network_type_id: ['', Validators.required],
      connection_type_id: ['', Validators.required],
      transformer_id: ['', Validators.required],
      access_id: ['', Validators.required],
      luminaire_quantity: ['0', Validators.required],
      characteristic_id: ['', Validators.required],
      arm_id: ['', Validators.required],
      lamp_id: ['', Validators.required],
      power_id: ['', Validators.required],
      reactor_id: ['', Validators.required],      
    });

    this.loadOptions();
    this.getLocation();

    const qrcode = localStorage.getItem('AUTO_QRCODE_FROM_MAINTENANCE');

    if (qrcode) {
      this.manualQrCode.setValue(qrcode);
      localStorage.removeItem('AUTO_QRCODE_FROM_MAINTENANCE');
      this.confirmManualQrCode();
    }
  }

  loadPoleById(poleId: number) {
    this.loading = true;

    this.poleService.getById(poleId).subscribe({
      next: (poste) => {
        this.poleExist = true;
        this.qrcodeDetected = true;
        this.form.patchValue(poste);

        if (poste.remote_management_relay_image) {
          this.relayImagePreview = poste.remote_management_relay_image;
          this.relayPhotoConfirmed = true;
        }

        this.loading = false;
        this.toast.info('Edite os dados do poste conforme necessário.');
      },
      error: () => {
        this.loading = false;
        this.toast.error('Erro ao carregar poste para edição.');
      }
    });
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

  confirmManualQrCode() {
    const value = this.manualQrCode.value?.trim();

    if (!value) {
      this.toast.error('Digite um código válido');
      return;
    }

    this.form.patchValue({ qrcode: value });
    this.qrResult = value;
    this.qrcodeDetected = true;
    this.checkPoste(value);
  }

  async takeRelayPhoto() {
    try {
      if (!Capacitor.isNativePlatform()) {
        throw new Error('camera_unavailable_on_web');
      }

      await Camera.requestPermissions({ permissions: ['camera'] });

      const photo = await Camera.getPhoto({
        source: CameraSource.Camera,
        resultType: CameraResultType.Base64,
        quality: 80,
        allowEditing: false,
        saveToGallery: false
      });

      this.relayImagePreview = `data:image/jpeg;base64,${photo.base64String}`;
      this.relayPhotoConfirmed = false;

      const base64 = photo.base64String!;
      const byteString = atob(base64);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([uint8Array], { type: 'image/jpeg' });
      const file = new File([blob], `rele_${Date.now()}.jpg`, { type: 'image/jpeg' });

      this.form.patchValue({ remote_management_relay: file });
    } catch (e) {
      this.toast.error('Não foi possível abrir a câmera.');
    }
  }

  confirmRelayPhoto() {
    if (this.relayImagePreview) {
      this.relayPhotoConfirmed = true;
      this.toast.success('Foto do relê confirmada.');
    }
  }

  discardRelayPhoto() {
    this.relayImagePreview = null;
    this.relayPhotoConfirmed = false;
    this.form.patchValue({ remote_management_relay: null });
  }


  loadOptions(): void {
    this.loading = true;

    this.auxiliaryService.getAll().subscribe({
      next: (res) => {
        this.types = res.types;
        this.pavings = res.pavings;
        this.positions = res.positions;
        this.networkTypes = res.networkTypes;
        this.connectionTypes = res.connectionTypes;
        this.transformers = res.transformers;
        this.accesses = res.accesses;
        this.characteristics = res.characteristics;
        this.arms = res.arms;
        this.lamps = res.lamps;
        this.powers = res.powers;
        this.reactors = res.reactors;
      },
      error: () => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
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
          this.loading = false;
          if (poste.remote_management_relay_image) {
            this.relayImagePreview = poste.remote_management_relay_image;
            this.relayPhotoConfirmed = true;
          }
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

    const formData = new FormData();

    Object.entries(this.form.getRawValue()).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as any);
      }
    });    

    const id = this.form.get('id').value;

    if(id){
      this.update(id, formData);
    }else{
      this.create(formData);
    }
  }

  public create(formData){
    this.poleService.create(formData).subscribe({
      next: (res) => {
        this.toast.success('Poste cadastrado com sucesso!');
        this.form.reset();
        this.loading = false;
        this.routeService.navigate(['/painel/home']);
      },
      error: (error) => {
        this.toast.error(error.message);
        this.loading = false;
      }
    });
  }

  public update(id, formData){
    this.poleService.update(id, formData).subscribe({
      next: (res) => {
        this.toast.success('Poste atualizado com sucesso!');
        this.form.reset();
        this.loading = false;
        this.routeService.navigate(['/painel/home']);
      },
      error: (error) => {
        this.toast.error(error.message);
        this.loading = false;
      }
    });
  }  

  public reset(){
    this.qrcodeDetected = false;
    this.poleExist = false;
  }
}
