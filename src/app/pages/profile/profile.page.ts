import { Component, NgZone, OnInit } from "@angular/core";

import { AlertController, ModalController } from "@ionic/angular";
import { Storage } from "@ionic/storage";

import { User } from "../../interfaces/user";

import { AuthService } from "../../services/auth/auth.service";
import { UserService } from "../../services/user/user.service";

import { EditAddressComponent } from "../../modals/edit-address/edit-address.component";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"]
})
export class ProfilePage implements OnInit {
  user: User = {
    id: 0,
    username: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    map: "",
    roles: []
  };
  loggedInWith = 'default';

  constructor(
    public alertController: AlertController,
    public modalController: ModalController,
    private zone: NgZone,
    private storage: Storage,
    private authService: AuthService,
    private userService: UserService
  ) {
    Promise.all([this.storage.get("user"), this.storage.get("via")]).then(values => {
      this.user = values[0];
      this.loggedInWith = values[1];
    });
  }

  editProfile(data: any) {
    this.storage.get("token").then(token => {
      if (token) {
        this.userService.editProfile(data, token).subscribe(
          res => {
            this.storage.set("user", res.data);
            this.storage.set("token", res.token);
          },
          err => {
            if (err.status === 401) {
              this.authService.logout();
            }
          }
        );
      }
    });
  }

  changePassword(data: any) {
    this.storage.get("token").then(token => {
      if (token) {
        this.userService.changePassword(data, token).subscribe(
          res => {
            this.storage.set("user", res.data);
            this.storage.set("token", res.token);
          },
          err => {
            console.log(err);

            if (err.status === 401) {
              this.authService.logout();
            } else {
              this.presentEditPasswordForm('Gagal: ' + err.message);
            }
          }
        );
      }
    });
  }

  fetchProfile(refresher: any) {
    this.storage.get("token").then(token => {
      if (token) {
        this.userService.getProfile(token).subscribe(
          res => {
            this.storage.set("user", res.data);

            if (refresher) {
              refresher.target.complete();
            }
          },
          err => {
            console.log(err);

            if (refresher) {
              refresher.target.complete();
            }

            if (err.status === 401) {
              this.authService.logout();
            }
          }
        );
      }
    });
  }

  async presentEditNameForm() {
    const alert = await this.alertController.create({
      header: "Ubah nama",
      inputs: [
        {
          name: "name",
          type: "text",
          placeholder: "Nama Depan",
          value: this.user.name
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            //
          }
        },
        {
          text: "Save",
          handler: data => {
            this.zone.run(() => {
              this.user.name = data.name;
            });

            this.editProfile(data);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentEditAddressForm() {
    const modal = await this.modalController.create({
      component: EditAddressComponent,
      componentProps: { value: this.user.address }
    });

    modal.onWillDismiss().then(r => {
      if (!r || !r.data) {
        return;
      }

      this.user.address = r.data.address;
      this.editProfile(r.data);
    });

    return await modal.present();
  }

  async presentEditPhoneForm() {
    const alert = await this.alertController.create({
      header: "Ubah nomor telepon",
      inputs: [
        {
          name: "phone",
          type: "tel",
          placeholder: "Nomor telepon",
          value: this.user.phone
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            //
          }
        },
        {
          text: "Save",
          cssClass: "secondary",
          handler: data => {
            this.zone.run(() => {
              this.user.phone = data.phone;
            });

            this.editProfile(data);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentEditEmailForm() {
    const alert = await this.alertController.create({
      header: "Ubah alamat email",
      inputs: [
        {
          name: "email",
          type: "email",
          placeholder: "Alamat email",
          value: this.user.email
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            //
          }
        },
        {
          text: "Save",
          cssClass: "secondary",
          handler: data => {
            this.zone.run(() => {
              this.user.email = data.email;
            });

            this.editProfile(data);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentEditPasswordForm(msg: any) {
    let inputs: Array<Object> = [
      {
        name: "password",
        type: "password",
        placeholder: "Masukkan password baru",
      },
      {
        name: "repassword",
        type: "password",
        placeholder: "Ketik ulang password baru",
      }
    ];

    if (this.loggedInWith === 'default') {
      inputs.unshift({
        name: "old_password",
        type: "password",
        placeholder: "Masukkan password lama",
      });
    }

    const alert = await this.alertController.create({
      header: "Ubah password",
      message: msg,
      inputs: inputs,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            //
          }
        },
        {
          text: "Save",
          cssClass: "secondary",
          handler: data => {
            this.changePassword(data);
          }
        }
      ]
    });

    await alert.present();
  }

  doRefresh(event: any) {
    this.fetchProfile(event);
  }

  ngOnInit() { }
}
