import {Component, ElementRef, Renderer2} from '@angular/core';
import {filter, Subscription} from "rxjs";
import {User} from "@models/user";
import {SessionQuery} from '@store/session.query';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import { IMenuItem } from '@models/ItemsMenu';
import { SidebarService } from '@services/sidebar.service';

@Component({
  selector: 'app-layout-private',
  templateUrl: './layout-private.component.html',
  styleUrl: './layout-private.component.scss'
})
export class LayoutPrivateComponent {
  titleProcess: string = '';

  public menuItem: IMenuItem[] = [
    // {
    //   label: 'Home',
    //   icon: 'fa-solid fa-house',
    //   route: '/painel/home',
    //   active: true
    // },
    {
      label: 'Home',
      icon: 'fa-solid fa-house',
      route: '/painel/home',
      active: true
    },
    {
      label: 'Cadastro',
      icon: 'fa-solid fa-file-lines',
      route: '/painel/register',
      active: true
    },
    {
      label: 'Manutenções',
      icon: 'fa-solid fa-user',
      route: '/painel/maintenance',
      active: true
    },
    {
      label: 'Histórico de manutenções',
      icon: 'fa-solid fa-list',
      route: '/painel/maintenance/history',
      active: true
    }
  ]

  protected isMobile: boolean = window.innerWidth >= 1000;
  private resizeSubscription: Subscription;
  user: User;

  isHome = false;

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _sidebarService: SidebarService,
    private readonly _sessionQuery: SessionQuery,
    private readonly _router: Router
  ) {
  }


  ngOnInit(): void {
    this._sessionQuery.user$.subscribe(user => {
      this.user = user;
    })

    document.getElementById('template').addEventListener('click', () => {
      this._sidebarService.retractSidebar();
    });

    // Escuta as mudanças nos queryParams diretamente
    this._activatedRoute.queryParams.subscribe(params => {
      this.titleProcess = params['title_process'];
    });

    this._router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isHome = event.urlAfterRedirects === '/painel/home';
      });
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  goHome(): void {
    this._router.navigate(['/painel/home']);
  }

}
