import { Component, OnInit } from "@angular/core";

import { Storage } from "@ionic/storage";
import { Plugins } from '@capacitor/core';

const { Browser } = Plugins;

import { AuthService } from "../../services/auth/auth.service";
import { ProductService } from "../../services/product/product.service";
import { PartnerService } from "../../services/partner/partner.service";
import { ErrorService } from "../../services/error/error.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {
  homeCategories: any;
  partners: Array<Object> = [];

  constructor(
    private storage: Storage,
    private authService: AuthService,
    private productService: ProductService,
    private partnerService: PartnerService,
    public errorService: ErrorService,
  ) {
    console.log('Home "constructor" run');
  }

  ngOnInit() {
    console.log('Home "ngOnInit" run');
    this.fetchPartners();
    this.fetchProducts(null);
  }

  ionViewWillEnter() {
    console.log('Home "ionViewWillEnter" run');
  }

  checkProducts() {
    this.storage.get("categorized_products").then(categories => {
      if (!categories) {
        console.log(
          'Check product from home page: "not exists", prepare fetching'
        );
        this.fetchProducts(null);
      } else {
        console.log('Check product from home page: "exists", prepare painting');
        this.prepareOutput(categories);
      }
    });
  }

  fetchProducts(refresher: any) {
    this.storage.get("token").then(token => {
      if (token) {
        this.productService.fetchProducts(token).subscribe(
          res => {
            console.log(res.data);
            console.log('Data fetched from "home.page.ts", prepare painting');

            this.storage.set("categorized_products", res.data);
            this.prepareOutput(res.data);

            if (refresher) refresher.target.complete();
          },
          err => {
            if (refresher) refresher.target.complete();
            this.errorService.showMessage(err);
          }
        );
      }
    });
  }

  fetchPartners() {
    this.partnerService.fetchAll().subscribe(
      res => {
        console.log(res.data);
        console.log('All partners fetched from "home.page.ts", prepare painting');

        this.storage.set("partners", res.data);
        this.partners = res.data;
      },
      err => {
        this.errorService.showMessage(err);
      }
    );
  }

  prepareOutput(categories: any) {
    let cats = [];

    categories.forEach(category => {
      let catPanel = {
        id: category.id,
        slug: category.slug,
        name: category.name,
        rows: []
      };

      let cols = [];
      let count = 0;
      const lastIndex = category.products.length - 1;

      category.products.forEach((product, index) => {
        count++;
        cols.push(product);

        if (count === 2) {
          catPanel.rows.push(cols);
          cols = [];
          count = 0;
        } else {
          // if count === 1 && current index === lastIndex.
          if (index === lastIndex) {
            catPanel.rows.push(cols);
            cols = [];
            count = 0;
          }
        }
      });

      cats.push(catPanel);
    });

    this.homeCategories = cats;
  }

  toggleShrink(event: any) {
    const parent = event.target.parentNode.parentNode;

    parent.classList.toggle("is-shrinked");
  }

  openInApp(url: string) {
    Browser.open({ url: url });
  }

  doRefresh(event: any) {
    this.fetchProducts(event);
  }
}
