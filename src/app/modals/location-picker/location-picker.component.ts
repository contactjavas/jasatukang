import {
  Component,
  ElementRef,
  ViewChild,
  NgZone,
  OnInit
} from "@angular/core";
import { ModalController } from "@ionic/angular";

import { GoogleMapsService } from "../../services/google-maps/google-maps.service";

import { google } from "google-maps";
declare let google: any;

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

  @ViewChild("map", { static: false }) mapElement: ElementRef;
  @ViewChild("pleaseConnect", { static: false }) pleaseConnect: ElementRef;

  location = {
    lat: null,
    lng: null,
    description: ''
  };
  query = "";
  places: any = [];

  autocompleteService: any;
  placesService: any;
  searchDisabled: boolean;
  saveDisabled: boolean;

  constructor(
    public modalController: ModalController,
    public zone: NgZone,
    public maps: GoogleMapsService
  ) {
    console.log("location picker constructor run");

    this.searchDisabled = true;
    this.saveDisabled = true;
  }

  ngOnInit() { }

  ionViewDidEnter() {
    this.loadMap();
  }

  loadMap() {
    console.log("prepare map loading");

    this.maps
      .init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement)
      .then(() => {
        console.log("maps loaded");

        setTimeout(() => {
          this.autocompleteService = new google.maps.places.AutocompleteService();
          this.placesService = new google.maps.places.PlacesService(
            this.maps.map
          );

          console.log('the location is: ' + this.maps.location.description);

          this.saveDisabled = false;
          this.searchDisabled = false;
        }, 2500);
      });
  }

  selectPlace(place: any) {
    this.places = [];

    console.log(place);
    this.maps.location.description = place.description;

    this.placesService.getDetails({ placeId: place.place_id }, details => {
      this.zone.run(() => {
        console.log(details);

        this.maps.location.description = details.formatted_address;
        this.maps.location.lat = details.geometry.location.lat();
        this.maps.location.lng = details.geometry.location.lng();

        this.saveDisabled = false;

        this.maps.map.setCenter({ lat: this.maps.location.lat, lng: this.maps.location.lng });
        this.maps.marker.setPosition(new google.maps.LatLng(this.maps.location.lat, this.maps.location.lng));

        console.log(this.maps.location);
      });
    });
  }

  searchPlace() {
    this.saveDisabled = true;

    console.log("searching place...");

    if (this.query.length > 0 && !this.searchDisabled) {
      let config = {
        types: ["geocode"],
        input: this.query
      };

      this.autocompleteService.getPlacePredictions(
        config,
        (predictions, status) => {
          if (
            status == google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            this.places = [];

            predictions.forEach(prediction => {
              this.places.push(prediction);
            });
          }
        }
      );
    } else {
      this.places = [];
    }
  }

  cancel() {
    this.modalController.dismiss();
  }

  save() {
    console.log(this.maps.location);
    this.modalController.dismiss(this.maps.location);
  }

}
