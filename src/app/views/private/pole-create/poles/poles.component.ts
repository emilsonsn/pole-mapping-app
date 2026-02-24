import { Component, OnInit } from '@angular/core';
import { PoleService } from '@services/pole.service';

@Component({
  selector: 'app-poles',
  templateUrl: './poles.component.html',
  styleUrls: ['./poles.component.css']
})
export class PolesComponent implements OnInit {

  loading = false;
  poles: any[] = [];
  selected: any = null;
  expandedImage: string | null = null;

  constructor(private poleService: PoleService) {}

  ngOnInit() {
    this.loadPoles();
  }

  loadPoles() {
    this.loading = true;

    this.poleService.getAll().subscribe({
      next: (data) => {
        console.log('POLES:', data);
        console.log('select:', this.selected);
        this.poles = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  selectPole(pole: any) {
    this.selected = pole;
  }

  closeDetails() {
    this.selected = null;
  }

  openImage(path: string) {
    this.expandedImage = path;
  }

  closeImage() {
    this.expandedImage = null;
  }
}