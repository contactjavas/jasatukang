import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Storage } from "@ionic/storage";

@Component({
  selector: "app-order",
  templateUrl: "./order.page.html",
  styleUrls: ["./order.page.scss"]
})
export class OrderPage implements OnInit {
  order: any = {
    address: "-",
    execution_day: "",
    execution_time: "",
    id: "",
    location_detail: "-",
    map_lat: "",
    map_lng: "",
    map_location: "-",
    note: "-",
    product_id: "",
    product_name: "",
    service: "",
    service_name: "",
    status: "",
    status_name: ""
  };

  constructor(
    private route: ActivatedRoute,
    private storage: Storage
  ) {
    console.log('OrderPage "constructor" run');
  }

  ngOnInit() {
    console.log('OrderPage "ngOnInit" run');
  }

  ionViewWillEnter() {
    console.log('OrderPage "ionViewWillEnter" run');
    this.getOrder();
  }

  getOrder() {
    const id = Number(this.route.snapshot.paramMap.get("id"));

    this.storage.get("orders").then(orders => {
      const order = orders.find(order => {
        return Number(order.id) === id;
      });

      if (order) {
        this.order = order;
        return true;
      }
    });
  }

  launchMap() {
  }
}
