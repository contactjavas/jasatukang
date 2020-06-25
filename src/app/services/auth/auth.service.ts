import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { Observable, Subject } from 'rxjs';

import { Menu } from '../../classes/menu/menu';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  menus = [];
  loggedInState = new Subject<any>();

  constructor(
    private storage: Storage,
    private router: Router,
    private menu: Menu
  ) {
  }

  logout() {
    this.storage.remove("token");
    this.storage.remove("user");
    this.storage.remove("via");

    this.storage.remove("products");
    this.storage.remove("orders");

    this.menus = this.menu.notLoggedIn;
    this.router.navigateByUrl("/intro");
  }

  getLoggedInState() {
    return this.loggedInState.asObservable();
  }

  setLoggedInState(value: Boolean) {
    this.loggedInState.next(value);
  }
}
