import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuStateService {
  public selectedMenu: string = ''; // Track the selected route
  public openMenu: string = ''; // Track the open menu title

  // Update the menu state
  updateMenuState(selectedMenu: string, openMenu: string): void {
    this.selectedMenu = selectedMenu;
    this.openMenu = openMenu;
  }
}
