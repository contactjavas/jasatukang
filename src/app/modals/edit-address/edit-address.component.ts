import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-edit-address",
  templateUrl: "./edit-address.component.html",
  styleUrls: ["./edit-address.component.scss"]
})
export class EditAddressComponent implements OnInit {
  address: string = "";
  savedAddress: string;

  constructor(
    public modalController: ModalController,
    private storage: Storage
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.storage.get("user").then(user => {
      this.address = user.address;
      this.savedAddress = user.address;
    });
  }

  cancel() {
    this.modalController.dismiss();
  }

  save() {
    if (this.address === this.savedAddress) {
      this.modalController.dismiss();
    } else {
      this.modalController.dismiss({ address: this.address });
    }
  }
}
