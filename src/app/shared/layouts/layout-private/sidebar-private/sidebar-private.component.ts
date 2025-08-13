import {Component, Input, SimpleChanges} from '@angular/core';
import {IMenuItem} from "@models/ItemsMenu";
import {SidebarService} from '@services/sidebar.service';
import {Router, NavigationEnd} from "@angular/router";
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-sidebar-private',
  templateUrl: './sidebar-private.component.html',
  styleUrl: './sidebar-private.component.scss'
})
export class SidebarPrivateComponent {
  @Input() menuItem: IMenuItem[] = [];

  constructor(
    protected readonly _sidebarService: SidebarService,
    protected readonly router: Router
  ) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.updateActiveRoutes());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['menuItem'] && changes['menuItem'].currentValue) {
      this.updateActiveRoutes();
    }
  }

  private updateActiveRoutes() {
    const url = this.router.url;
    this.menuItem.forEach(item => {
      item.active = url === item.route;
      item.children?.forEach(child => child.active = url === child.route);
    });
  }

  public toggleShowSidebar() {
    this._sidebarService.showSidebar.set(false);
  }

  public toggleDropdown(item: IMenuItem): void {
    item.isOpen = !item.isOpen;
  }

  public navigateToRoute(item: IMenuItem, event?: Event): void {
    event?.stopPropagation();
    if (!item.route) return;

    this.router.navigate([item.route]).then(() => this.updateActiveRoutes());
  }

  routerActive(child: IMenuItem) {
    return child.active;
  }
}
