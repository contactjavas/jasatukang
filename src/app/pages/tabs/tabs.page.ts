import { Component, OnInit } from "@angular/core";

import { Storage } from "@ionic/storage";

import { AuthService } from "../../services/auth/auth.service";
import { ProductService } from "../../services/product/product.service";

@Component({
  selector: "app-tabs",
  templateUrl: "./tabs.page.html",
  styleUrls: ["./tabs.page.scss"]
})
export class TabsPage implements OnInit {
  constructor(
    private storage: Storage,
    private authService: AuthService,
    private productService: ProductService
  ) {
    console.log('TabsPage "constructor" run');
  }

  ngOnInit() {
    console.log('TabsPage "ngOnInit" run');
  }

  ionViewWillEnter() {
    this.fetchProducts();
    console.log('TabsPage "ionViewWillEnter" run');
  }

  fetchProducts() {
    this.storage.get("token").then(token => {
      if (token) {
        console.log("Fetching data from tabs.page.ts via ionViewWillEnter");

        this.productService.fetchProducts(token).subscribe(
          res => {
            console.log("Data fetched from tabs.page.ts via ionViewWillEnter");
            this.storage.set("categorized_products", res.data);
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
}
