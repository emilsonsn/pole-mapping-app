import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {IMenuItem} from "@models/ItemsMenu";
import {SidebarService} from '@services/sidebar.service';
import {User} from "@models/user";
import {SessionService} from '@store/session.service';
import {SessionQuery} from '@store/session.query';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-header-private',
  templateUrl: './header-private.component.html',
  styleUrls: ['./header-private.component.scss']
})
export class HeaderPrivateComponent implements OnInit {
  @Input() menuItem: IMenuItem[] = [];
  @Input() user: User;
  @Input() titleProcess!: string;
  activeLabel: string = '';
  show_dropdown = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleSidebar() {
    event.stopPropagation();
    this._sidebarService.showSidebar.set(true);
  }

  constructor(
    protected router: Router,
    private readonly _sidebarService: SidebarService,
    private readonly _authService: AuthService,
    private readonly _sessionService: SessionService,
    private readonly _sessionQuery: SessionQuery
  ) {
  }

  ngOnInit() {
    this.updateActiveLabel();
    this.router.events.subscribe(() => {
      this.updateActiveLabel();
    });

    this._sessionService.getUserFromBack().subscribe();
  }

  private updateActiveLabel() {
    const currentUrl = this.router.url;
    const activeItem = this.findActiveItem(this.menuItem, currentUrl);
    this.activeLabel = activeItem ? activeItem.label : '';
  }

  findActiveItem(menuItems: IMenuItem[], currentUrl: string): IMenuItem | undefined {
    for (let item of menuItems) {
      if (currentUrl.match(item.route) && item.label) {
        return item;
      } else if (item.children) {
        const childItem = this.findActiveItem(item.children, currentUrl);
        if (childItem) {
          return childItem;
        }
      }
    }
    return undefined;
  }

  protected readonly console = console;


  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.show_dropdown = !this.show_dropdown;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown') && this.show_dropdown) {
      this.show_dropdown = false;
    }
  }

  public get isMobile() {
    return this._sidebarService.mobile();
  }

  public get isSidebarOpen() {
    return this._sidebarService.showSidebar();
  }


  logout() {
    this._authService.logout();
  }
}
