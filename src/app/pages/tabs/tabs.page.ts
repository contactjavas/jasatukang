import { Component, OnInit } from "@angular/core";

import { Storage } from "@ionic/storage";

import { Subscription } from 'rxjs';

import { AuthService } from "../../services/auth/auth.service";
import { ProductService } from "../../services/product/product.service";
import { NotificationService } from "../../services/notification/notification.service";

@Component({
  selector: "app-tabs",
  templateUrl: "./tabs.page.html",
  styleUrls: ["./tabs.page.scss"]
})
export class TabsPage implements OnInit {
  unreadState: Subscription;
  totalUnread: Number = 0;

  constructor(
    private storage: Storage,
    private authService: AuthService,
    private productService: ProductService,
    private notificationService: NotificationService
  ) {
    console.log('TabsPage "constructor" run');
  }

  ngOnInit() {
    console.log('TabsPage "ngOnInit" run');
    this.subscribeState();
    this.fetchData();
  }

  ionViewWillEnter() {
    console.log('TabsPage "ionViewWillEnter" run');
  }

  subscribeState() {
    this.unreadState = this.notificationService.getUnreadState().subscribe((total: Number) => {
      if (total) {
        this.totalUnread = total;
      } else {
        this.totalUnread = 0;
      }
    });
  }

  fetchData() {
    this.storage.get("token").then(token => {
      if (token) {
        console.log("Fetching data from tabs.page.ts via ionViewWillEnter");

        this.productService.fetchProducts(token).subscribe(
          res => {
            console.log("Products fetched from tabs.page.ts via ionViewWillEnter");
            this.storage.set("categorized_products", res.data);
          },
          err => {
            console.log(err);

            if (err.status === 401) {
              this.authService.logout();
            }
          }
        );

        this.notificationService.fetchLimit(token, 0, 20).subscribe(
          res => {
            console.log("Notifications fetched from tabs.page.ts via ionViewWillEnter with total: " + res.data.length);
            this.notificationService.setUnreadState(res.data.length);
            this.storage.set("notifications", res.data);
          },
          err => {
            console.log(err);

            if (err.status === 401) {
              this.authService.logout();
            }
          }
        );
      }
    });
  }

  ngOnDestroy() {
    this.unreadState.unsubscribe();
  }
}
