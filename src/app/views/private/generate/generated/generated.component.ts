import { Component } from '@angular/core';
import { ClientService } from '@services/client.service';
import { GeneratedService } from '@services/generated.service';

@Component({
  selector: 'app-generated',
  templateUrl: './generated.component.html',
  styleUrl: './generated.component.scss'
})
export class GeneratedComponent {

  public loading: boolean = false;

  constructor(
    private readonly _generatedService: GeneratedService
  ){}
}
