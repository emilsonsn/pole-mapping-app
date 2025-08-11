import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {environment} from "@env/environment";

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  constructor(private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle(environment.appName);
  }
}
