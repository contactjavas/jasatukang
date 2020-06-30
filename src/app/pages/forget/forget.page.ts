import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AlertController, LoadingController } from "@ionic/angular";
import { Storage } from "@ionic/storage";

import { AuthService } from "../../services/auth/auth.service";
import { UserService } from "../../services/user/user.service";
import { ErrorService } from "../../services/error/error.service";

@Component({
  selector: 'app-forget',
  templateUrl: './forget.page.html',
  styleUrls: ['../login/auth.scss', './forget.page.scss'],
})
export class ForgetPage implements OnInit {
  forgetForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private storage: Storage,
    public authService: AuthService,
    public userService: UserService,
    public errorService: ErrorService,
  ) {
    this.forgetForm = this.formBuilder.group({
      email: ["", Validators.required]
    });
  }

  ngOnInit() {
  }

  async forgetPassword() {
    const loading = await this.loadingController.create({
      message: "Checking..."
    });

    await loading.present();

    await this.userService.forgetPassword(this.forgetForm.value).subscribe(
      (res: any) => {
        console.log(res);
        loading.dismiss();
        this.showSuccessMessage(res);
      },
      (err: any) => {
        loading.dismiss();
        this.errorService.showMessage(err);
      }
    );
  }

  async showSuccessMessage(res) {
    const alert = await this.alertController.create({
      header: "Berhasil",
      message: res.message ? res.message : res,
      buttons: [
        {
          text: "OK",
          handler: () => {
            this.router.navigateByUrl("/reset-password/" + this.forgetForm.value.email);
          }
        }
      ]
    });

    await alert.present();
  }

}
