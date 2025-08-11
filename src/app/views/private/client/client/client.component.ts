import { Component } from '@angular/core';
import { ClientService } from '@services/client.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {

  public loading: boolean = false;

  constructor(
    private readonly _clientService: ClientService
  ){}

  export(){
    this._clientService.export('Client')
    .subscribe({
      next: (res) => {
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `clients.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
      }
    });
  }

}
