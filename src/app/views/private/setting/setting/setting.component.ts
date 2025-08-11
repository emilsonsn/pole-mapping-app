import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingThemes } from '@models/setting';
import { SettingService } from '@services/setting.service';
import { Utils } from '@shared/utils';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss'
})
export class SettingComponent {

  public form: FormGroup;
  public loading: boolean = false;
  public profileImageFile: File | null = null;
  profileImage: string | ArrayBuffer = null;
  isDragOver: boolean = false;

  public utils = Utils;

  protected themes = [
      {
          "description": "Tema 1",
          "id": "001"
      },
      {
          "description": "Tema 2",
          "id": "002"
      },
      {
          "description": "Tema 3",
          "id": "003"
      },
      {
          "description": "Tema 4",
          "id": "004"
      },
      {
          "description": "Tema 5",
          "id": "005"
      },
      {
          "description": "Tema 6",
          "id": "006"
      },
      {
          "description": "Tema 7",
          "id": "007"
      },
      {
          "description": "Tema 8",
          "id": "008"
      },
      {
          "description": "Tema 9",
          "id": "009"
      },
      {
          "description": "Tema 10",
          "id": "010"
      },
      {
          "description": "Tema 11",
          "id": "011"
      },
      {
          "description": "Tema 12",
          "id": "012"
      },
      {
          "description": "Tema 13",
          "id": "013"
      },
      {
          "description": "Tema 14",
          "id": "014"
      },
      {
          "description": "Tema 15",
          "id": "015"
      },
      {
          "description": "Tema 16",
          "id": "016"
      },
      {
          "description": "Tema 17",
          "id": "017"
      },
      {
          "description": "Tema 18",
          "id": "018"
      },
      {
          "description": "Tema 19",
          "id": "019"
      },
      {
          "description": "Tema 20",
          "id": "020"
      }
  ];

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _settingService: SettingService,
    private readonly _toastr: ToastrService,
  ) {
  }

  ngOnInit(): void {

    this.form = this._fb.group({
      id: [null],
      company_name: [null, [Validators.required]],
      company_url: [null, [Validators.required]],
      company_email: [null, [Validators.required]],
      company_phone: [null, [Validators.required]],
      company_bio: [null, [Validators.required]],
      theme: [null, [Validators.required]],
      footer_text: [null, [Validators.required]],
      api_key: [null, [Validators.required]],
      bearer_token: [null, [Validators.required]],
      tags: [null]
    })

    this._initOrStopLoading();
    this._settingService.search().pipe(finalize(() => this._initOrStopLoading())).subscribe(res => {
        this.form.patchValue(res);
        this.profileImage = res.logo;
    })
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.profileImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.profileImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }


  removeImage(event: Event): void {
    event.stopPropagation();
    this.profileImage = null;
  }

  validatePhoneNumber(control: any) {
    const phoneNumber = control.value;
    return !(phoneNumber && phoneNumber.replace(/\D/g, '').length !== 10);
  }

  public onSubmit(form: FormGroup): void {
    if (!form.valid) {
      form.markAllAsTouched();
    } else {
      this._initOrStopLoading();

      const formData = new FormData();
      formData.append('company_name', form.get('company_name')?.value);
      formData.append('company_url', form.get('company_url')?.value);
      formData.append('company_email', form.get('company_email')?.value);
      formData.append('company_phone', form.get('company_phone')?.value);
      formData.append('company_bio', form.get('company_bio')?.value);
      formData.append('theme', form.get('theme')?.value);
      formData.append('footer_text', form.get('footer_text')?.value);
      formData.append('api_key', form.get('api_key')?.value);
      formData.append('bearer_token', form.get('bearer_token')?.value);
      formData.append('tags', form.get('tags')?.value);

      if (this.profileImageFile) {
        formData.append('logo', this.profileImageFile);
      }

      this._settingService.update(formData)
      .pipe(finalize(() => this._initOrStopLoading())).subscribe(res => {
        if (res.status) {
          this._toastr.success(res.message);
        }
      })
    }
  }
}
