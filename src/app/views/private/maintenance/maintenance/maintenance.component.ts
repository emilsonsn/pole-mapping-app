// maintenance.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaintenanceService } from '@services/maintenance.service';
import { ToastrService } from 'ngx-toastr';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { PoleService } from '@services/pole.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent {
  form!: FormGroup;
  qrcode: string;
  imagePreview: string | null = null;
  loading = false;
  pendingMaintenance: any = null;
  isFinishing = false;
  manualQrCode = this.fb.control('');
  photoConfirmedInitial = false;
  photoConfirmedFinal = false;
  private redirectToRegisterAfterFinish = false;

  constructor(
    private fb: FormBuilder,
    private service: MaintenanceService,
    private toast: ToastrService,
    private poleService: PoleService,
    private readonly routeService: Router
  ) {
    this.form = this.fb.group({
      id: [''],
      pole_id: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      address: ['', Validators.required],
      number: [''],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      photo: [null],
      initial_description: ['', Validators.required],
      final_description: ['', Validators.required],
      conclusion_photo: [null],
    });
  }

  ngOnInit() {}

  async scanQRCode() {
    try {
      const { barcodes } = await BarcodeScanner.scan();
      if (barcodes.length === 0) return;

      let qrcode = barcodes[0].rawValue?.trim();
      if (!qrcode) return;

      if (qrcode.includes('http://') || qrcode.includes('https://')) {
        qrcode = qrcode.split('/').filter(Boolean).pop() || qrcode;
      }

      this.qrcode = qrcode;
      this.loading = true;

      this.poleService.getByQrCode(qrcode).subscribe({
        next: (pole) => {
          if (pole?.id) {
            this.toast.success('Poste encontrado!');
            this.resetPhotoState();

            this.form.patchValue({
              pole_id: pole.id,
              latitude: pole.latitude,
              longitude: pole.longitude,
              address: pole.address,
              number: pole.number,
              neighborhood: pole.neighborhood,
              city: pole.city,
              id: pole.maintenances.length ? pole.maintenances[0]?.id : null
            });

            if (pole.maintenances?.length > 0) {
              this.pendingMaintenance = pole.maintenances[0];
              this.isFinishing = true;
              this.toast.info('Este poste possui manutenção pendente. Finalize abaixo.');
            } else {
              this.pendingMaintenance = null;
              this.isFinishing = false;
            }
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

  confirmManualQrCode() {
    const value = this.manualQrCode.value?.trim();

    if (!value) {
      this.toast.error('Digite um QR Code válido.');
      return;
    }

    this.qrcode = value;
    this.loading = true;

    this.poleService.getByQrCode(value).subscribe({
      next: (pole) => {
        if (pole?.id) {
          this.toast.success('Poste encontrado!');
          this.resetPhotoState();

          this.form.patchValue({
            pole_id: pole.id,
            latitude: pole.latitude,
            longitude: pole.longitude,
            address: pole.address,
            neighborhood: pole.neighborhood,
            city: pole.city,
            id: pole.maintenances.length ? pole.maintenances[0]?.id : null,
            initial_description: pole.maintenances.length ? pole.maintenances[0]?.initial_description : '',
            final_description: pole.maintenances.length ? pole.maintenances[0]?.final_description : ''
          });

          if (pole.maintenances?.length > 0) {
            this.pendingMaintenance = pole.maintenances[0];
            this.isFinishing = true;
            this.toast.info('Este poste possui manutenção pendente. Finalize abaixo.');
          } else {
            this.pendingMaintenance = null;
            this.isFinishing = false;
          }
        } else {
          this.toast.error('Poste não encontrado!');
        }

        this.loading = false;
      },
      error: () => {
        this.toast.error('Erro ao buscar poste.');
        this.loading = false;
      }
    });
  }

  private requiredPhotoField(): 'photo' | 'conclusion_photo' {
    return this.isFinishing ? 'conclusion_photo' : 'photo';
  }

  private isRequiredPhotoConfirmed(): boolean {
    return this.isFinishing ? this.photoConfirmedFinal : this.photoConfirmedInitial;
  }

  private resetPhotoState() {
    this.imagePreview = null;
    this.photoConfirmedInitial = false;
    this.photoConfirmedFinal = false;
    this.form.patchValue({ photo: null, conclusion_photo: null });
  }

  async captureAndSet(field: 'photo' | 'conclusion_photo') {
    if (!Capacitor.isNativePlatform()) {
      this.toast.error('Abra o app Android (não o navegador) para tirar a foto.');
      return;
    }

    try {
      await Camera.requestPermissions({ permissions: ['camera'] });

      const photo = await Camera.getPhoto({
        source: CameraSource.Camera,
        resultType: CameraResultType.Uri,
        quality: 70,
        allowEditing: false,
        saveToGallery: false
      });

      this.imagePreview = photo.webPath ?? null;

      if (field === 'photo') {
        this.photoConfirmedInitial = false;
      } else {
        this.photoConfirmedFinal = false;
      }

      if (!photo.webPath) {
        this.toast.error('Não foi possível obter a foto.');
        return;
      }

      const blob = await (await fetch(photo.webPath)).blob();
      const file = new File([blob], `evidencia_${Date.now()}.jpg`, { type: blob.type || 'image/jpeg' });

      this.form.patchValue({ [field]: file });
    } catch (e: any) {
      this.toast.error('Não foi possível abrir a câmera.');
      console.error('Erro ao tirar foto', e);
    }
  }

  takePhoto() {
    this.captureAndSet('photo');
  }

  takeConclusionPhoto() {
    this.captureAndSet('conclusion_photo');
  }

  confirmPhoto() {
    if (!this.imagePreview) return;

    if (this.isFinishing) {
      this.photoConfirmedFinal = true;
    } else {
      this.photoConfirmedInitial = true;
    }

    this.toast.success('Foto confirmada.');
  }

  discardPhoto() {
    const field = this.requiredPhotoField();

    this.imagePreview = null;

    if (field === 'photo') {
      this.photoConfirmedInitial = false;
      this.form.patchValue({ photo: null });
    } else {
      this.photoConfirmedFinal = false;
      this.form.patchValue({ conclusion_photo: null });
    }
  }

  submit() {
    const requiredField = this.requiredPhotoField();
    const requiredFile = this.form.get(requiredField)?.value;

    if (this.form.invalid) {
      this.toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    if (!requiredFile || !this.isRequiredPhotoConfirmed()) {
      this.toast.error('Tire e confirme a foto antes de enviar.');
      return;
    }

    const formData = new FormData();
    formData.append('pole_id', this.form.get('pole_id')?.value);
    formData.append('latitude', this.form.get('latitude')?.value);
    formData.append('longitude', this.form.get('longitude')?.value);
    formData.append('address', this.form.get('address')?.value);
    formData.append('neighborhood', this.form.get('neighborhood')?.value);
    formData.append('city', this.form.get('city')?.value);
    formData.append('photo', this.form.get('photo')?.value ?? '');
    formData.append('conclusion_photo', this.form.get('conclusion_photo')?.value ?? '');
    formData.append('initial_description', this.form.get('initial_description')?.value ?? '');
    formData.append('final_description', this.form.get('final_description')?.value ?? '');

    this.loading = true;

    if (!this.isFinishing) {
      this.store(formData);
    } else {
      this.update(formData);
    }
  }

  private store(formData) {
    this.service.store(formData).subscribe({
      next: () => {
        this.toast.success('Manutenção registrada com sucesso!');
        this.form.reset();
        this.resetPhotoState();
        this.loading = false;
        this.routeService.navigate(['/painel/home']);
      },
      error: () => {
        this.toast.error('Erro ao enviar manutenção.');
        this.loading = false;
      }
    });
  }

  private update(formData) {
    const id = this.form.get('id')?.value;

    this.service.update(formData, id).subscribe({
      next: () => {
        this.toast.success('Manutenção registrada com sucesso!');
        this.form.reset();
        this.resetPhotoState();
        this.loading = false;

        if (this.redirectToRegisterAfterFinish) {
          localStorage.setItem('AUTO_QRCODE_FROM_MAINTENANCE', this.qrcode);
          this.routeService.navigate(['/painel/register']);
        } else {
          this.routeService.navigate(['/painel/home']);
        }
      },
      error: (error) => {
        this.toast.error('Erro ao enviar manutenção.');
        this.toast.error(error.message);
        this.loading = false;
      }
    });
  }
}