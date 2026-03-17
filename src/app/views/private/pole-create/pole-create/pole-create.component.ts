// pole-create.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PoleService } from '@services/pole.service';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { ToastrService } from 'ngx-toastr';
import { AuxiliaryService } from '@services/auxiliary.service';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

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

  poleImagePreview: string | null = null;
  polePhotoConfirmed = false;

  relayImagePreview: string | null = null;
  relayPhotoConfirmed = false;

  locationFields = [
    { value: 'latitude', label: 'Latitude', class: 'form-item'},
    { value: 'longitude', label: 'Longitude', class: 'form-item'},
    { value: 'city', label: 'Cidade', class: 'col-md-12'},
    { value: 'neighborhood', label: 'Bairro', class: 'col-md-12'},
    { value: 'address', label: 'Endereço', class: 'col-md-12'},
    { value: 'number', label: 'Número', class: 'col-md-12'},
  ];

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
  relays: any[] = [];

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
      number: ['', Validators.required],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      type_id: ['', Validators.required],
      remote_management_relay: [''],
      relay_id: [''],
      pole_image: [''],
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

        if (poste.pole_image_url) {
          this.poleImagePreview = poste.pole_image_url;
          this.polePhotoConfirmed = true;
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

  private async captureAndSet(
    field: 'remote_management_relay' | 'pole_image',
    kind: 'relay' | 'pole'
  ) {
    try {
      if (!Capacitor.isNativePlatform()) {
        this.toast.error('Abra o app Android (não o navegador) para tirar a foto.');
        return;
      }

      // Request only camera permission - photos permission not needed for camera-only
      const cameraPermission = await Camera.requestPermissions({ 
        permissions: ['camera'] 
      });

      if (cameraPermission.camera !== 'granted') {
        this.toast.error('Permissão de câmera negada.');
        return;
      }

      // Optimized camera settings for low-end devices
      const photo = await Camera.getPhoto({
        source: CameraSource.Camera,
        resultType: CameraResultType.Base64, // Base64 é mais leve que URI em dispositivos fracos
        quality: 50, // Reduzido de 70 para 50 - menor consumo de memória
        width: 1024, // Limita largura máxima - evita imagens muito grandes
        height: 1024, // Limita altura máxima
        allowEditing: false,
        saveToGallery: false,
        correctOrientation: true, // Corrige orientação automaticamente
        promptLabelHeader: 'Câmera',
        promptLabelCancel: 'Cancelar',
        promptLabelPicture: 'Câmera',
      });

      if (!photo.base64String) {
        this.toast.error('Não foi possível obter a foto.');
        return;
      }

      // Set preview using base64 data URL
      const preview = `data:image/jpeg;base64,${photo.base64String}`;

      if (kind === 'relay') {
        this.relayImagePreview = preview;
        this.relayPhotoConfirmed = false;
      } else {
        this.poleImagePreview = preview;
        this.polePhotoConfirmed = false;
      }

      // Convert base64 to File directly - more memory efficient
      const byteCharacters = atob(photo.base64String);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      const filename = kind === 'relay' ? `rele_${Date.now()}.jpg` : `poste_${Date.now()}.jpg`;
      const file = new File([blob], filename, { type: 'image/jpeg' });

      this.form.patchValue({ [field]: file });

      // Clear base64 string from memory after conversion
      (photo as any).base64String = null;

    } catch (e: any) {
      console.error('Erro ao capturar foto:', e);
      
      // Handle user cancellation gracefully
      if (e?.message?.includes('cancelled') || e?.message?.includes('canceled')) {
        return; // User cancelled - no error message needed
      }
      
      this.toast.error('Não foi possível abrir a câmera.');
    }
  }

  async takeRelayPhoto() {
    this.captureAndSet('remote_management_relay', 'relay');
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

  async takePolePhoto() {
    this.captureAndSet('pole_image', 'pole');
  }

  confirmPolePhoto() {
    if (this.poleImagePreview) {
      this.polePhotoConfirmed = true;
      this.toast.success('Foto do poste confirmada.');
    }
  }

  discardPolePhoto() {
    this.poleImagePreview = null;
    this.polePhotoConfirmed = false;
    this.form.patchValue({ pole_image: null });
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
        this.relays = res.relays;
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
      let value = barcodes[0].rawValue?.trim();

      if (!value) return;

      if (value.includes('http://') || value.includes('https://')) {
        value = value.split('/').filter(Boolean).pop() || value;
      }

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
        if (poste.id) {
          this.toast.success('Informações encontradas com sucesso!')
          this.poleExist = true;
          this.form.patchValue(poste);
          this.loading = false;

          if (poste.remote_management_relay_image) {
            this.relayImagePreview = poste.remote_management_relay_image;
            this.relayPhotoConfirmed = true;
          }

          if (poste.pole_image_url) {
            this.poleImagePreview = poste.pole_image_url;
            this.polePhotoConfirmed = true;
          }
        } else {
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
      return;
    }

    this.loading = true;

    const formData = new FormData();

    Object.entries(this.form.getRawValue()).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as any);
      }
    });

    const id = this.form.get('id').value;

    if (id) {
      this.update(id, formData);
    } else {
      this.create(formData);
    }
  }

  public create(formData) {
    this.poleService.create(formData).subscribe({
      next: () => {
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

  public update(id, formData) {
    this.poleService.update(id, formData).subscribe({
      next: () => {
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

  public reset() {
    this.qrcodeDetected = false;
    this.poleExist = false;
  }
}