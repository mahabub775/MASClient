import { Component, OnInit,AfterViewInit, ChangeDetectorRef  } from '@angular/core';
import {JwtHelperService} from'@auth0/angular-jwt'
import { Router, NavigationEnd } from '@angular/router';
import {AuthService} from '../../core/services/auth.services';
import { AppConfig } from '../../core/AppConfig';
import{IdleService} from '../../services/idle.service'
import { MenuStateService } from '../../services/menu-state.service';

@Component({
  selector: 'app-adminlayout',
  templateUrl: './adminlayout.component.html',
  styles: ` .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
   
  }

  .trigger:hover {
    color: #1890ff;
    
  }

  .logo {
    height: 47px;
    background: #ced3db;
    margin: 16px;
  }

  nz-header {
    background: #fff;
    padding: 0;
   
  }

.header {
    background: #fff;
    padding: 0;
    text-align: right;
  }

  nz-content {
    margin: 0 16px;
  }

  nz-breadcrumb {
    margin: 16px 0;
  }

  .inner-content {
    padding: 24px;
    background: #fff;
    min-height: 710px;
  }

  nz-button-group {
    margin: 0 8px 8px 0;
  }


  nz-footer {
    text-align: center;
  } `
})
export class AdminlayoutComponent implements  AfterViewInit {


  public IsLoggedIn = false;
  private logininfo:any;  username:string = "";
  userRole:string = ""; menus :any = [];
   // Dynamic breadcrumb array
   breadcrumbs: string[] = [];
  constructor(private _router: Router, private Auth : AuthService, private menuStateService: MenuStateService, private cdr: ChangeDetectorRef, private idleService: IdleService) {
    //debugger;
    this.logininfo = this.Auth.GetuserLoginInfo();
    this.username = this.logininfo!=null?  this.logininfo.user.name:"";
    this.userRole = this.logininfo != null && this.logininfo.userRoles.length > 0 ? this.logininfo.userRoles[0] : "";

    // Filter menus based on role
    this.menus = (this.userRole === "NonAdmin" || this.userRole === "") ? this.fullMenu.filter((menu: any)   =>parseInt(menu.id) === 3) : this.fullMenu;

    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.initializeMenuStateFromRoute();
      }
    });
  }

  ngAfterViewInit(): void {
    this.updateMenuStateFromService();
    this.initializeMenuStateFromRoute();
      // Trigger change detection manually
      this.cdr.detectChanges();
  }

  isCollapsed = false;
  selectedMenu: string = '';  // Track selected menu
  fullMenu  = [
    {
      id : 1,
      title: 'Admin',
      icon: 'team',
      isOpen: false,
      items: [
        { route: 'users', icon: 'user', label: 'User' , isSelected: false}
      ]
    },
   
    {
      id : 2,
      title: 'Operations',
      icon: 'transaction',
      isOpen: false,
      items: [
        { route: 'trans/appointments', icon: 'mac-command', label: 'Appointments' , isSelected: false},
        { route: 'trans/email', icon: 'mail', label: 'Email' , isSelected: false},
  
      ]
    },

  ];

  setSelected(route: string, menu: any): void {
    this.selectedMenu = route;
    menu.isOpen = true;
    // Set the breadcrumb based on the menu and route clicked
    const breadcrumbItem = menu.items.find((item: any) => item.route === route);
    if (breadcrumbItem) {
      this.updateBreadcrumbs(menu.title, breadcrumbItem.label);
    }

     // Navigate to the same route to "refresh" the URL
     this._router.navigateByUrl('/'); // Optional: This can be left empty for general refresh
     this._router.navigate([route]); // Navigating to the route selected
     sessionStorage.clear();
       // Save the selected menu state
      sessionStorage.setItem("selectedMenu", route);
      sessionStorage.setItem("openMenu", menu.title);
    
    this.menus.forEach((m:any) => {
      if (m.id !== menu.id) {
        m.isOpen = false;
      }
    });
  
    // Save state to the service
    this.menuStateService.selectedMenu = route;
    this.menuStateService.openMenu = menu.title;
  }
  
  updateBreadcrumbs(menuTitle: string, itemLabel: string): void {
    // Update breadcrumbs with the menu title and item label
    this.breadcrumbs = [menuTitle, itemLabel];
  }

  getMenuByRoute(routeName: string): any | undefined {
    for (const menu of this.menus) {
      for (const item of menu.items) {
        if (item.route === routeName) {
          return menu;
        }
      }
    }
    return undefined;
  }

  updateMenuStateFromService(): void {
    const { selectedMenu, openMenu } = this.menuStateService;
    this.menus.forEach((menu: any) => {
      menu.isOpen = menu.title === openMenu;
      menu.items.forEach((item: any) => {
        item.isSelected = item.route === selectedMenu;
      });
    });
    
  }

  initializeMenuStateFromRoute(): void {
    const storedMenu = sessionStorage.getItem("selectedMenu");
  const storedOpenMenu = sessionStorage.getItem("openMenu");

  if (storedMenu && storedOpenMenu) {
    this.selectedMenu = storedMenu;
    const menu = this.menus.find((m: any) => m.title === storedOpenMenu);
    if (menu) {
      menu.isOpen = true;
      menu.items.forEach((item: any) => {
        item.isSelected = item.route === storedMenu;
      });
    }
  } else {
    const currentRoute = this._router.url.split('?')[0]; // Exclude query parameters
    const baseRoute = currentRoute.split('/').slice(1, 3).join('/'); // This takes 'basic/munits' from '/basic/munits/0/new'
      const menu = this.getMenuByRoute(baseRoute);  
    if (menu) {
      this.selectedMenu = baseRoute; // Set selected menu based on the base route
      menu.isOpen = true; // Open the menu
    }
  }
  }
  
Logout=()=>{
  //debugger;
  this.Auth.LogOut().subscribe(r => 
    {
    console.log(r);
    sessionStorage.clear();
    localStorage.removeItem("jwt");
    localStorage.removeItem("logininfo");
    this.idleService.logout();
    this._router.navigateByUrl('/logout');
  })
}

changePassword =()=>{
  this._router.navigate(['admin/changepass']);
}


onCollapseChange(collapsed: boolean): void {
  this.isCollapsed = collapsed;
}
}