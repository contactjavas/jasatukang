import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Storage } from "@ionic/storage";

import { OrderService } from "../../services/order/order.service";

import {
  ToastController,
  AlertController,
  ModalController,
  LoadingController
} from "@ionic/angular";

import { format } from 'date-fns'
import { parseISO } from 'date-fns'

import { LocationPickerComponent } from "../../modals/location-picker/location-picker.component";
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: "app-order",
  templateUrl: "./order-form.page.html",
  styleUrls: ["./order-form.page.scss"]
})
export class OrderFormPage implements OnInit {
  token: string;
  pageTitle: string;
  orderForm: FormGroup;
  formData: any;

  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    public modalController: ModalController,
    public loadingController: LoadingController,
    public orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private authService: AuthService
  ) {
    this.orderForm = this.formBuilder.group({
      product_id: [""],
      user_id: [""],
      address: ["", Validators.required],
      location_detail: ["", Validators.required],
      map_location: [""],
      map_lat: [""],
      map_lng: [""],
      note: [""],
      execution_day: ["", Validators.required],
      execution_time: ["", Validators.required],
      service: [""]
    });

    this.storage.get("token").then(token => {
      this.token = token;
    });
  }

  ngOnInit() {
    this.prefillForm();
  }

  prefillForm() {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    const service = Number(this.route.snapshot.paramMap.get("service"));

    this.pageTitle = service === 1 ? "Panggil tukang" : "Order survey borongan";

    this.orderForm.controls.product_id.setValue(id);
    this.orderForm.controls.service.setValue(service);

    this.storage.get("user").then(user => {
      this.orderForm.controls.user_id.setValue(user.id);
      this.orderForm.controls.address.setValue(user.address);
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: "Silakan cek kembali isian form.",
      duration: 2000
    });
    toast.present();
  }

  async presentLocationPicker() {
    const modal = await this.modalController.create({
      component: LocationPickerComponent,
      componentProps: {
        value: ""
      }
    });

    modal.onWillDismiss().then(r => {
      if (!r || !r.data) {
        return;
      }

      this.orderForm.controls.map_location.setValue(r.data.description);
      this.orderForm.controls.map_lat.setValue(r.data.lat);
      this.orderForm.controls.map_lng.setValue(r.data.lng);
    });

    return await modal.present();
  }

  async order() {
    if (!this.orderForm.valid) {
      this.presentToast();
      return;
    }

    /**
     * We copy the values info this.formData, 
     * so that our time formatting doesn't affect the timepicker value.
     */
    this.formData = this.orderForm.value;

    const dayValue = this.orderForm.controls.execution_day.value;
    const timeValue = this.orderForm.controls.execution_time.value;

    this.formData.execution_day = format(parseISO(dayValue), 'yyyy-MM-dd');
    this.formData.execution_time = format(parseISO(timeValue), 'HH:mm:ss');

    const loading = await this.loadingController.create({
      message: "Checking..."
    });

    await loading.present();

    await this.orderService.order(this.formData, this.token).subscribe(
      res => {
        this.storage.set("orders", res.data);
        this.storage.set("token", res.token);
        loading.dismiss();
        this.showSuccessMessage(res);
      },
      err => {
        loading.dismiss();

        if (err.status === 401) {
          this.authService.logout();
        } else {
          this.showErrorMessage(err);
        }

      }
    );
  }

  async showErrorMessage(error) {
    const alert = await this.alertController.create({
      header: "Gagal",
      subHeader: error.label ? "Kesalahan di input " + error.label : "",
      message: error.message ? error.message : error,
      buttons: ["OK"]
    });

    await alert.present();
  }

  async showSuccessMessage(res) {
    const alert = await this.alertController.create({
      header: "Berhasil",
      message: res.message ? res.message : res,
      buttons: [
        {
          text: "OK",
          handler: () => {
            this.router.navigateByUrl("/app/tabs/orders");
          }
        }
      ]
    });

    await alert.present();
  }
}
