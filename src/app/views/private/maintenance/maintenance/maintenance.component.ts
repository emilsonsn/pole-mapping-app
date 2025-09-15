import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaintenanceService } from '@services/maintenance.service';
import { ToastrService } from 'ngx-toastr';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { PoleService } from '@services/pole.service';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent {
  form!: FormGroup;
  imagePreview: string | null = null;
  photoConfirmed = false;
  locationFetched = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private service: MaintenanceService,
    private toast: ToastrService,
    private poleService: PoleService
  ) {
    this.form = this.fb.group({
      pole_id: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      address: ['', Validators.required],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      photo: [null, Validators.required],
    });
  }

  ngOnInit() {
  }

  async scanQRCode() {
    try {
      const { barcodes } = await BarcodeScanner.scan();
      if (barcodes.length === 0) return;

      const qrcode = barcodes[0].rawValue;

      this.loading = true;
      this.poleService.getByQrCode(qrcode).subscribe({
        next: (pole) => {
          if (pole?.id) {
            this.toast.success('Poste encontrado!');
            this.form.patchValue({ pole_id: pole.id });
            this.getLocation();
          } else {
            this.toast.error('Poste não encontrado!');
          }
          this.loading = false;
        },
        error: () => {
          this.toast.error('Erro ao buscar poste.');
          this.loading = false;
        },
      });
    } catch (error) {
      this.toast.error('Erro ao escanear QR Code.');
      console.error(error);
    }
  }


  async getLocation() {
    try {
      this.loading = true;

      // apenas uma chamada já basta
      await Geolocation.requestPermissions();

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });

      const lat = position.coords.latitude.toFixed(6);
      const lng = position.coords.longitude.toFixed(6);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const address = data.address || {};

      this.form.patchValue({
        latitude: lat,
        longitude: lng,
        address: `${address.road || ''}${address.house_number ? ', ' + address.house_number : ''}`.trim(),
        neighborhood: address.suburb || address.neighbourhood || '',
        city: address.city || address.town || address.village || '',
      });

      this.locationFetched = true;
    } catch (error) {
      console.error('Erro ao obter localização', error);
      this.toast.error('Não foi possível obter sua localização.');
    } finally {
      this.loading = false;
    }
  }

  async takePhoto() {
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

      this.imagePreview = `data:image/jpeg;base64,${photo.base64String}`;
      this.photoConfirmed = false;

      const base64 = photo.base64String!;
      const byteString = atob(base64);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([uint8Array], { type: 'image/jpeg' });
      const file = new File([blob], `evidencia_${Date.now()}.jpg`, { type: 'image/jpeg' });

      this.form.patchValue({ photo: file });
    } catch (e: any) {
      if (e?.message === 'camera_unavailable_on_web') {
        this.toast.error('Abra o app Android (não o navegador) para tirar a foto.');
      } else {
        this.toast.error('Não foi possível abrir a câmera.');
        console.error('Erro ao tirar foto', e);
      }
    }
  }

  confirmPhoto() {
    if (this.imagePreview) {
      this.photoConfirmed = true;
      this.toast.success('Foto confirmada.');
    }
  }

  discardPhoto() {
    this.imagePreview = null;
    this.photoConfirmed = false;
    this.form.patchValue({ photo: null });
  }

  submit() {
    if (this.form.invalid || !this.photoConfirmed) {
      this.toast.error('Preencha todos os campos obrigatórios.');
      return;
    }
    const formData = new FormData();
    formData.append('pole_id', this.form.get('pole_id')?.value);
    formData.append('latitude', this.form.get('latitude')?.value);
    formData.append('longitude', this.form.get('longitude')?.value);
    formData.append('address', this.form.get('address')?.value);
    formData.append('neighborhood', this.form.get('neighborhood')?.value);
    formData.append('city', this.form.get('city')?.value);
    formData.append('photo', this.form.get('photo')?.value);

    this.loading = true;
    this.service.store(formData).subscribe({
      next: () => {
        this.toast.success('Manutenção registrada com sucesso!');
        this.form.reset();
        this.imagePreview = null;
        this.photoConfirmed = false;
        this.locationFetched = false;
        this.loading = false;
      },
      error: () => {
        this.toast.error('Erro ao enviar manutenção.');
        this.loading = false;
      }
    });
  }
}
