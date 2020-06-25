import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AlertController, LoadingController } from "@ionic/angular";

import { UserService } from "../../services/user/user.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss", "../login/auth.scss"]
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;

  constructor(
    public alertController: AlertController,
    public loadingController: LoadingController,
    public userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.registerForm = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
      phone: ["", Validators.required],
      name: ["", Validators.required],
      map: [""]
    });
  }

  ngOnInit() { }

  async register() {
    const loading = await this.loadingController.create({
      message: "Registering..."
    });

    await loading.present();

    await this.userService.register(this.registerForm.value).subscribe(
      res => {
        console.log(res);
        loading.dismiss();
        this.showSuccessMessage(res);
      },
      err => {
        loading.dismiss();
        this.showErrorMessage(err);
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
            this.router.navigateByUrl("/login");
          }
        }
      ]
    });

    await alert.present();
  }
}
