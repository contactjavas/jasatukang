import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Storage } from "@ionic/storage";

import { AuthService } from "../../services/auth/auth.service";
import { OrderService } from "../../services/order/order.service";
import { ErrorService } from "../../services/error/error.service";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.page.html",
  styleUrls: ["./orders.page.scss"]
})
export class OrdersPage implements OnInit {
  orderSegment = 1;
  activeOrders = [];
  finishedOrders = [];

  orders: object[];

  constructor(
    private router: Router,
    private storage: Storage,
    private authService: AuthService,
    private orderService: OrderService,
    public errorService: ErrorService,
  ) {
    console.log('Orders "constructor" run');
  }

  ngOnInit() {
    console.log('Orders "ngOnInit" run');
    this.fetchOrders(null);
  }

  ionViewWillEnter() {
    console.log('Orders "ionViewWillEnter" run');
  }

  checkOrders() {
    this.storage.get("orders").then(orders => {
      if (!orders) {
        this.fetchOrders(null);
      } else {
        this.orders = orders;

        this.groupsOrders();
      }
    });
  }

  fetchOrders(refresher: any) {
    this.storage.get("token").then(token => {
      if (!token) return;

      this.orderService.fetchOrders(token).subscribe(
        res => {
          this.storage.set("orders", res.data);
          this.storage.set("token", res.token);

          this.orders = res.data;

          this.groupsOrders();

          if (refresher) refresher.target.complete();
        },
        err => {
          if (refresher) refresher.target.complete();
          this.errorService.showMessage(err);
        }
      );
    });
  }

  groupsOrders() {
    let activeOrders = [];
    let finishedOrders = [];

    this.orders.forEach((order: any) => {
      order.status = Number(order.status);

      // 11 means "finished"
      if (order.status === 11) {
        finishedOrders.push(order);
      } else {
        activeOrders.push(order);
      }
    });

    this.activeOrders = activeOrders;
    this.finishedOrders = finishedOrders;
  }

  doRefresh(event: any) {
    this.fetchOrders(event);
  }
}
