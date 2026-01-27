import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { TicketService } from '@services/ticket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ticket-create',
  templateUrl: './ticket-create.component.html',
})
export class TicketCreateComponent {
  form!: FormGroup;
  loading = false;

  qrcodeDetected = false;
  ticketExists = false;

  manualQrCode = this.fb.control('');
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private ticketService: TicketService
  ) {
    this.form = this.fb.group({
      qrcode: ['', Validators.required],
      description: ['', Validators.required],
      image: [null],
    });
  }

  async scanQRCode() {
    const { barcodes } = await BarcodeScanner.scan();
    if (barcodes.length) {
      this.setQrCode(barcodes[0].rawValue);
    }
  }

  confirmManualQrCode() {
    if (!this.manualQrCode.value) return;
    this.setQrCode(this.manualQrCode.value);
  }

  setQrCode(value: string) {
    this.form.patchValue({ qrcode: value });
    this.qrcodeDetected = true;
    this.checkTicket(value);
  }

  checkTicket(qrcode: string) {
    this.loading = true;

    this.ticketService.getByQrCode(qrcode).subscribe({
      next: (ticket) => {
        if (ticket?.id) {
          this.ticketExists = true;
          this.form.patchValue(ticket);
          this.form.disable();
        } else {
          this.ticketExists = false;
          this.form.enable();
        }
        this.loading = false;
      },
      error: () => {
        this.ticketExists = false;
        this.loading = false;
      },
    });
  }

  async takePhoto() {
    if (!Capacitor.isNativePlatform()) return;

    const photo = await Camera.getPhoto({
      source: CameraSource.Camera,
      resultType: CameraResultType.Base64,
      quality: 80,
    });

    this.imagePreview = `data:image/jpeg;base64,${photo.base64String}`;

    const byteString = atob(photo.base64String!);
    const buffer = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      buffer[i] = byteString.charCodeAt(i);
    }

    const file = new File(
      [buffer],
      `ticket_${Date.now()}.jpg`,
      { type: 'image/jpeg' }
    );

    this.form.patchValue({ image: file });
  }

  submit() {
    const formData = new FormData();

    Object.entries(this.form.getRawValue()).forEach(([k, v]) => {
      if (v !== null) formData.append(k, v as any);
    });

    this.ticketService.create(formData).subscribe({
      next: () => {
        this.toast.success('Ticket criado com sucesso!');
        this.form.reset();
        this.qrcodeDetected = false;
      },
      error: (error) => this.toast.error(error.message),
    });
  }
}
