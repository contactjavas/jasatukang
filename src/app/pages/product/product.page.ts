import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { LoadingController } from "@ionic/angular";
import { Storage } from "@ionic/storage";

import { Product, Service } from "../../interfaces/product";
import { ProductService } from "../../services/product/product.service";
import { AuthService } from "../../services/auth/auth.service";
import { ErrorService } from "../../services/error/error.service";

@Component({
  selector: "app-product",
  templateUrl: "./product.page.html",
  styleUrls: ["./product.page.scss"]
})
export class ProductPage implements OnInit {
  currentSegment = 1;

  product: Product = {
    id: 0,
    name: "",
    slug: "",
    icon_url: "",
    services: [],
    categories: []
  };

  constructor(
    public loadingController: LoadingController,
    private route: ActivatedRoute,
    private storage: Storage,
    private productService: ProductService,
    private authService: AuthService,
    public errorService: ErrorService,
  ) { }

  ngOnInit() {
    this.loadingProduct();
  }

  async loadingProduct() {
    const id = Number(this.route.snapshot.paramMap.get("id"));

    const loading = await this.loadingController.create({
      message: "Loading..."
    });

    await loading.present();

    this.storage.get("token").then(token => {
      if (!token) return;

      this.productService.get(token, id).subscribe(
        res => {
          console.log(res.data);
          console.log(
            'Product with id "' +
            id +
            '" has been fetched from "product.page.ts", prepare painting'
          );

          this.product = res.data;

          this.product.services.some((service: Service) => {
            this.currentSegment = service.id;
            return true;
          });

          loading.dismiss();
        },
        err => {
          loading.dismiss();
          this.errorService.showMessage(err);
        }
      );
    });
  }
}
