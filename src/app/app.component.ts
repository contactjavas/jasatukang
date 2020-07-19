import { Component, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";

import { Platform } from '@ionic/angular';
import { Storage } from "@ionic/storage";

import { Subscription, from } from 'rxjs';
import { Plugins, StatusBarStyle } from '@capacitor/core';

import { Menu } from './classes/menu/menu';
import { AuthService } from './services/auth/auth.service';

const { SplashScreen, StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy {
  isStatusBarLight = true
  menus: object[] = [];
  subscription: Subscription;

  constructor(
    private platform: Platform,
    private router: Router,
    private storage: Storage,
    private menu: Menu,
    private authService: AuthService
  ) {
    this.initializeApp();
    this.subscribeState();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      SplashScreen.hide();

      if (this.platform.is('hybrid')) {
        StatusBar.setStyle({
          style: this.isStatusBarLight ? StatusBarStyle.Dark : StatusBarStyle.Light
        });
      }
    });

    this.storage.get("user").then(user => {
      if (user) {
        this.menus = this.menu.loggedIn;
        this.router.navigateByUrl("/app");
      } else {
        this.menus = this.menu.notLoggedIn;
        this.router.navigateByUrl("/intro");
      }
    });
  }

  callFunction(f: any) {
    this[f]();
  }

  logout() {
    this.authService.logout();
  }

  subscribeState() {
    this.subscription = this.authService.getLoggedInState().subscribe((isLoggedIn: Boolean) => {
      if (isLoggedIn) {
        this.menus = this.menu.loggedIn;
      } else {
        this.menus = this.menu.notLoggedIn;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
