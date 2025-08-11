import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { User } from '@models/user';
import dayjs from 'dayjs';
import { Utils } from '@shared/utils';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { ProductService } from '@services/product.service';
import { Product, ProductType } from '@models/product';

@Component({
  selector: 'app-dialog-product',
  templateUrl: './dialog-product.component.html',
  styleUrl: './dialog-product.component.scss',
})
export class DialogProductComponent {
  public isNew: boolean = true;
  public title: string = 'Novo ';
  public form: FormGroup;
  public loading: boolean = false;
  public profileImageFile: File | null = null;
  profileImage: string | ArrayBuffer = null;
  isDragOver: boolean = false;

  public productTypes: ProductType[] = Object.values(ProductType);

  public reports = [
    {
      "id": "CAREER-REPORT",
      "description": "Guia de Carreira Astrológica"
    },
    {
      "id": "KARMA-LIFE-LESSONS",
      "description": "Carma e Lições de Vida"
    },
    {
      "id": "HEALTH-WELL-BEING-GUIDE",
      "description": "Guia de Saúde e Bem-Estar"
    },
    {
      "id": "FINANCIAL-REPORT",
      "description": "Oportunidades e Desafios Financeiros"
    },
    {
      "id": "FRIENDSHIP-SOCIAL-CONNECTIONS",
      "description": "Amizade e Conexões Sociais"
    },
    {
      "id": "FAMILY-ANCESTRAL-TIES",
      "description": "Relatório de Laços Familiares e Ancestrais"
    },
    {
      "id": "EDUCATION-LEARNING-PATHWAYS",
      "description": "Educação e Caminhos de Aprendizagem"
    },
    {
      "id": "TRAVEL-RELOCATION-OPPORTUNITIES",
      "description": "Oportunidades de Viagem e Relocalização"
    },
    {
      "id": "SPIRITUAL-GROWTH-AWAKENING",
      "description": "Guia de Crescimento Espiritual e Despertar"
    },
    {
      "id": "LIFE-PURPOSE-PASSION",
      "description": "Exploração de Propósito e Paixão de Vida"
    },
    {
      "id": "STRESS-COPING-MECHANISMS",
      "description": "Estratégias para Gerir o Stress"
    },
    {
      "id": "CREATIVITY-SELF-EXPRESSION",
      "description": "Guia de Criatividade e Autoexpressão"
    },
    {
      "id": "LIFE-TRANSITIONS-MILESTONES",
      "description": "Transições e Marcos de Vida"
    },
    {
      "id": "PERSONAL-GROWTH-CHALLENGES",
      "description": "Crescimento Pessoal e Desafios"
    },
    {
      "id": "DECISION-MAKING-CHOICES",
      "description": "Guia de Tomada de Decisões"
    },
    {
      "id": "EMPOWERMENT-CONFIDENCE-BOOSTERS",
      "description": "Fortalecimento Pessoal e Impulsionadores de Confiança"
    },
    {
      "id": "ENTREPRENEURSHIP-BUSINESS",
      "description": "Guia de Empreendedorismo e Negócios"
    },
    {
      "id": "DATING-MATING-RELATING",
      "description": "Relacionamentos e Conexões"
    },
    {
      "id": "DIGITAL-INFLUENCE",
      "description": "Presença Digital e Influência nas Redes Sociais"
    },
    {
      "id": "QUEEN-OF-HEARTS",
      "description": "Rainha de Copas: Decifrando a Sua Vida Amorosa"
    },
    {
      "id": "BOSS-LADY-S-BLUEPRINT",
      "description": "Plano de Sucesso da Mulher de Negócios"
    },
    {
      "id": "SCHOLARLY-SPIRITS",
      "description": "Espíritos Académicos: Um Guia de Numerologia para Estudantes"
    },
    {
      "id": "VIRAL-VISIONARY",
      "description": "Visionária Viral: O Mapa Numerológico de uma Influenciadora"
    },
    {
      "id": "THE-VISIONARY-S-NUMBERS",
      "description": "Os Números da Visionária: Sucesso nos Negócios com um Toque Feminino"
    },
    {
      "id": "THE-TECH-DIVA-S-CODE",
      "description": "O Código da Diva Tecnológica: Numerologia para a Inovadora"
    },
    {
      "id": "ROMANTIC-BEGINNINGS",
      "description": "Inícios Românticos: Um Guia de Numerologia para o Amor"
    },
    {
      "id": "TOGETHER-IN-HARMONY",
      "description": "Juntos em Harmonia: Um Guia de Numerologia para o Amor Duradouro"
    },
    {
      "id": "FROM-YES-TO-I-DO",
      "description": "Do Sim ao Eu Aceito: Numerologia do Noivado"
    },
    {
      "id": "PATH-TO-SELF-LOVE",
      "description": "Caminho para o Amor-Próprio: Reinvenção Após uma Separação"
    },
    {
      "id": "LONE-WOLFS-PATH",
      "description": "Caminho do Lobo Solitário: Decifrando o Seu Destino Amoroso"
    },
    {
      "id": "PROFESSIONAL-PROWESS",
      "description": "Poder Profissional: Um Guia de Numerologia para o Sucesso"
    },
    {
      "id": "CAMPUS-CONQUEROR",
      "description": "Conquistador do Campus: O Estudo Numerológico do Académico"
    },
    {
      "id": "DIGITAL-DOMINANCE",
      "description": "Domínio Digital: Uma Abordagem Numerológica à Influência Online"
    },
    {
      "id": "STARTUP-SUCCESS",
      "description": "Sucesso na Startup: Guia de Numerologia para Jovens Empreendedores"
    },
    {
      "id": "CODING-YOUR-FUTURE",
      "description": "Codificando o Seu Futuro: A Bússola Numerológica do Inovador"
    },
    {
      "id": "NEW-CONNECTION-CODE",
      "description": "Novo Código de Conexão: Um Guia para Relacionamentos"
    },
    {
      "id": "COMMITTED-CALCULATIONS",
      "description": "Cálculos de Compromisso: Um Guia para o Amor Duradouro"
    },
    {
      "id": "ENGAGEMENT-EQUATIONS",
      "description": "Equações do Noivado: Um Guia de Compromisso Numerológico"
    },
    {
      "id": "SOLO-SHIFT",
      "description": "Mudança Solo: Um Guia de Numerologia para Solteiros"
    },
    {
      "id": "SOLO-SOJOURN",
      "description": "Jornada Solo: Um Guia de Numerologia para a Independência"
    }
  ];
  

  public utils = Utils;

  // Filters
  public statusSelect: { label: string; value: string }[] = [
    {
      label: 'Ativo',
      value: '1',
    },
    {
      label: 'Inativo',
      value: '0',
    },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data: Product,
    private readonly _dialogRef: MatDialogRef<DialogProductComponent>,
    private readonly _fb: FormBuilder,
    private readonly _dialog: MatDialog,
    private readonly _productService: ProductService,
    private readonly _toastr : ToastrService,
  ) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      id: [null],
      title: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      is_active: [null, [Validators.required]],
      report: [null, [Validators.required]],
      type: [null, [Validators.required]],
    });

    if (this._data?.id) {
      this.isNew = false;
      this.title = 'Editar ';
      this.form.patchValue(this._data);
    }

    if(this._data.image){
      this.filesToSend.push({
        preview: this._data.image,
        file: null
      })
    }
  }

  public onSubmit(form: FormGroup): void {
    if (!form.valid || this.loading || (this.isNew && !this.filesToSend.length)) {
      form.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    Object.entries(form.controls).forEach(([key, control]) => {
      formData.append(key, control.value);
    });

    this.filesToSend.map((file, index) => {
      if(file.file){
        formData.append(`images[${index}]`, file.file);
      }
    });

    if(this.isNew) {
      this._postProduct(formData);
    }
    else {
      this._patchProduct(formData);
    }

  }

  _postProduct(product) {
    this._initOrStopLoading();

    this._productService
      .create(product)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
            this._dialogRef.close(true);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  _patchProduct(product) {
    this._initOrStopLoading();
    const id = product.get('id');
    this._productService
      .update(id, product)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
            this._dialogRef.close(true);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  // Files
  protected selectedFiles: File[] = [];
  protected filesToSend: {
    preview: string;
    file: File;
  }[] = [];

  protected filesToRemove : number[] = [];
  protected filesFromBack : {
    index : number,
    id: number,
    name : string,
    path: string, // Wasabi
    category : string,
  }[] = [];

  public allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/pdf',
  ];

  public async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  public async onFileSelected(event: any) {
    const files: FileList = event.target.files;
    const fileArray: File[] = Array.from(files);

    for (const file of fileArray) {
      if (this.allowedTypes.includes(file.type)) {
        let base64: string = null;

        if (file.type.startsWith('image/')) {
          base64 = await this.convertFileToBase64(file);
        }

        this.filesToSend.push({
          preview: base64,
          file: file
        });
      } else this._toastr.error(`${file.type} não é permitido`);
    }
  }

  public removeFileFromSendToFiles(index: number) {
    if (index > -1) {
      this.filesToSend.splice(index, 1);
    }
  }

  public openFileInAnotherTab(e) {
    const fileUrl = URL.createObjectURL(e.file);

    window.open(fileUrl, '_blank');
  }

  public prepareFileToRemoveFromBack(fileId, index) {
    this.filesFromBack.splice(index, 1);
    this.filesToRemove.push(fileId);
  }

  // Utils
  public onCancel(): void {
    this._dialogRef.close();
  }

  protected _initOrStopLoading() {
    this.loading = !this.loading;
  }
}
