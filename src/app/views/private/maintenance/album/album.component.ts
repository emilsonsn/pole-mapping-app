import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from '@services/maintenance.service';

declare var bootstrap: any;

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})

export class AlbumComponent implements OnInit {
  images: any[] = [];
  loading = false;
  selectedImage: string | null = null;

  constructor(private service: MaintenanceService) {}

  ngOnInit(): void {
    this.loading = true;
    this.service.all().subscribe({
      next: (res) => {
        console.log(this.images);
        this.images = res.filter(m => m.photo_path);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  openImage(url: string) {
    this.selectedImage = url;
    const modal = new bootstrap.Modal(document.getElementById('imageModal'));
    modal.show();
  }
}
