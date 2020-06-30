import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AlertController, LoadingController } from "@ionic/angular";
import { Storage } from "@ionic/storage";

import { AuthService } from "../../services/auth/auth.service";
import { UserService } from "../../services/user/user.service";
import { ErrorService } from "../../services/error/error.service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['../login/auth.scss', './reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  resetForm: FormGroup;
  email: string = this.route.snapshot.paramMap.get("email");

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private storage: Storage,
    public authService: AuthService,
    public userService: UserService,
    public errorService: ErrorService,
  ) {
    this.resetForm = this.formBuilder.group({
      email: ["", Validators.required],
      reset_code: ["", Validators.required],
      password: ["", Validators.required],
      repassword: ["", Validators.required]
    });

    this.resetForm.controls.email.setValue(this.email);
  }

  ngOnInit() {
  }

  async resetPassword() {
    const loading = await this.loadingController.create({
      message: "Processing..."
    });

    await loading.present();

    await this.userService.resetPassword(this.resetForm.value).subscribe(
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
            this.router.navigateByUrl("/login");
          }
        }
      ]
    });

    await alert.present();
  }

}
