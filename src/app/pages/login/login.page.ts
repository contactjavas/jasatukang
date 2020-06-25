import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AlertController, LoadingController } from "@ionic/angular";
import { Storage } from "@ionic/storage";

import { Plugins } from '@capacitor/core';
import "@codetrix-studio/capacitor-google-auth";
import { FacebookLoginResponse } from '@rdlabo/capacitor-facebook-login';
const { GoogleAuth, FacebookLogin } = Plugins;

import { AuthService } from "../../services/auth/auth.service";
import { UserService } from "../../services/user/user.service";
import { User, GoogleLoginData } from "../../interfaces/user";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss", "./auth.scss"]
})
export class LoginPage implements OnInit {
  user: User;
  loginForm: FormGroup;

  constructor(
    public alertController: AlertController,
    public loadingController: LoadingController,
    private router: Router,
    private formBuilder: FormBuilder,
    private storage: Storage,
    public authService: AuthService,
    public userService: UserService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  ngOnInit() { }

  loginWithGoogle() {
    GoogleAuth.signIn().then((res) => {
      console.log(res);

      /**
       * When accessed via ionic serve, the format is res.authentication.accessToken
       * But when accessed via apk, the format is res.authentication.idToken or simply res.idToken
       */
      this.loginWith('google', {
        accessToken: res.authentication.accessToken, 
        idToken: res.authentication.idToken
      });
    })
      .catch((err: ErrorEvent) => console.error(err));
  }

  loginWithFacebook() {
    FacebookLogin.login({ permissions: ["public_profile", "email"] }).then((res: FacebookLoginResponse) => {
      console.log(res);
      this.loginWith('facebook', res.accessToken.token);
    })
      .catch((err: ErrorEvent) => console.error(err));
  }

  async login() {
    this.loginWith('default', this.loginForm.value);
  }

  async loginWith(method: string, data: string | object) {
    let loginFn = 'login';

    switch (method) {
      case 'google':
        loginFn = 'loginWithGoogle';
        break;

      case 'facebook':
        loginFn = 'loginWithFacebook';
        break;
    }

    const loading = await this.loadingController.create({
      message: "Checking..."
    });

    await loading.present();

    await this.userService[loginFn](data).subscribe(
      (res: any) => {
        console.log(res);
        this.storage.set("token", res.token);
        this.storage.set("user", res.data);
        this.storage.set("via", method);

        loading.dismiss();
        this.authService.setLoggedInState(true);
        this.router.navigateByUrl("/app/tabs/home");
      },
      (err: any) => {
        loading.dismiss();
        this.showErrorMessage(err);
      }
    );
  }

  async showErrorMessage(error: any) {
    const alert = await this.alertController.create({
      header: "Gagal",
      subHeader: error.label ? "Kesalahan di input " + error.label : "",
      message: error.error,
      buttons: ["OK"]
    });

    await alert.present();
  }
}
