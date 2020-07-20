import { Component, OnInit } from "@angular/core";

import { Storage } from "@ionic/storage";

import { Subscription, interval } from 'rxjs';

import { AuthService } from "../../services/auth/auth.service";
import { ProductService } from "../../services/product/product.service";
import { NotificationService } from "../../services/notification/notification.service";
import { ErrorService } from "../../services/error/error.service";
import { flatMap } from 'rxjs/operators';

@Component({
  selector: "app-tabs",
  templateUrl: "./tabs.page.html",
  styleUrls: ["./tabs.page.scss"]
})
export class TabsPage implements OnInit {
  unreadState: Subscription;
  notificationState: Subscription;
  totalUnread: Number = 0;
  fetchingInterval: number = 1 * 60 * 1000; // 1 minutes.

  constructor(
    private storage: Storage,
    private authService: AuthService,
    private productService: ProductService,
    private notificationService: NotificationService,
    public errorService: ErrorService,
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

    this.storage.get("token").then(token => {
      if (!token) return;

      let notificationPipe = interval(this.fetchingInterval).pipe(
        flatMap(() => this.notificationService.fetchLimit(token, 0, 20))
      );
  
      this.notificationState = notificationPipe.subscribe(res => {
        console.log("Notification list has been fetched via 2 minutes observable in tabs.page.ts");

        this.notificationService.setUnreadState(
          this.notificationService.countUnread(res.data)
        );
        this.storage.set("notifications", res.data);
      });
    });

  }

  fetchData() {
    this.storage.get("token").then(token => {
      if (!token) return;
      console.log("Fetching product list & notification list in tabs.page.ts");

      this.productService.fetchProducts(token).subscribe(
        res => {
          console.log("Product list has been fetched via 'fetchData()' in tabs.page.ts");
          this.storage.set("categorized_products", res.data);
        },
        err => {
          this.errorService.showMessage(err);
        }
      );

      this.notificationService.fetchLimit(token, 0, 20).subscribe(
        res => {
          console.log("Notification list has been fetched via 'fetchData()' in tabs.page.ts");
          this.notificationService.setUnreadState(
            this.notificationService.countUnread(res.data)
          );
          this.storage.set("notifications", res.data);
        },
        err => {
          this.errorService.showMessage(err);
        }
      );
    });
  }

  ngOnDestroy() {
    this.unreadState.unsubscribe();
    this.notificationState.unsubscribe();
  }
}
