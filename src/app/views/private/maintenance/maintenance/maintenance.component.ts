import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaintenanceService } from '@services/maintenance.service';
import { ToastrService } from 'ngx-toastr';
import { Geolocation } from '@capacitor/geolocation';

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
    private toast: ToastrService
  ) {
    this.form = this.fb.group({
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      address: ['', Validators.required],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      photo: [null, Validators.required],
    });
  }

  ngOnInit(){
    this.getLocation();
  }

  async getLocation() {
    try {
      this.loading = true;
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

      this.locationFetched = true;
      this.loading = false;

    } catch (error) {
      console.error('Erro ao obter localização', error);
      this.toast.error('Não foi possível obter a localização via GPS.');
    }
  }


  onPhotoSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.photoConfirmed = false;
    };
    reader.readAsDataURL(file);
    this.form.patchValue({ photo: file });
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
    if (this.form.invalid || !this.photoConfirmed) return;

    const formData = new FormData();
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

  triggerCamera(): void {
    const input = document.getElementById('cameraInput') as HTMLInputElement | null;
    if (input) input.click();
  }

}
