import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {environment} from "@env/environment";
import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  constructor(private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle(environment.appName);

    if (Capacitor.getPlatform() === 'android') {
      App.addListener('backButton', ({ canGoBack }) => {
        if (window.confirm('Deseja realmente sair?')) App.exitApp()
      })
    }    
  }
}
