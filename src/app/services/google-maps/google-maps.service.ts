import { Injectable } from "@angular/core";
import { Plugins, NetworkStatus } from "@capacitor/core";

const { Network, Geolocation } = Plugins;

import { google } from "google-maps";
declare let google: any;

@Injectable({
  providedIn: "root"
})
export class GoogleMapsService {
  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised: boolean = false;
  mapLoaded: any;
  mapLoadedObserver: any;
  marker: any;
  latLng = {
    lat: null,
    lng: null
  };
  location = {
    lat: null,
    lng: null,
    description: ''
  };
  apiKey: string = "AIzaSyDWZEvnYI7KrCrxmmrDZRRFAJDOh0lKHGs";
  geocoder: any;
  infowindow: any;

  constructor() { }

  init(mapElement: any, pleaseConnect: any): Promise<any> {
    this.mapElement = mapElement;
    this.pleaseConnect = pleaseConnect;
    console.log("google-maps.service init run");

    return this.loadGoogleMaps();
  }

  loadGoogleMaps(): Promise<any> {
    console.log("google-maps.service loadGoogleMaps run");
    return new Promise(resolve => {
      if (typeof google == "undefined" || typeof google.maps == "undefined") {
        console.log("Google maps JavaScript needs to be loaded.");
        this.disableMap();

        Network.getStatus().then((status: NetworkStatus) => {
          if (status.connected) {
            if (!document.getElementById('googleMaps')) {
              window["mapInit"] = () => {
                this.initMap().then(() => {
                  resolve(true);
                });

                this.enableMap();
              };

              let script = document.createElement("script");
              script.id = "googleMaps";

              console.log("creating google-maps script tag");

              if (this.apiKey) {
                script.src =
                  "https://maps.google.com/maps/api/js?key=" +
                  this.apiKey +
                  "&callback=mapInit&libraries=places";
              } else {
                script.src = "https://maps.google.com/maps/api/js?callback=mapInit";
              }

              script.async = true;
              script.defer = true;

              document.body.appendChild(script);
            }
          }

          resolve(status.connected);
        });
      } else {
        Network.getStatus().then((status: NetworkStatus) => {
          if (status.connected) {
            this.initMap();
            this.enableMap();
          } else {
            this.disableMap();
          }
        });

        resolve(true);
      }

      this.addConnectivityListeners();
    });
  }

  initMap(): Promise<any> {
    return new Promise(resolve => {
      Geolocation.getCurrentPosition().then(position => {
        this.geocoder = new google.maps.Geocoder;
        this.infowindow = new google.maps.InfoWindow;

        let latLng = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );

        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.location.lat = position.coords.latitude;
        this.location.lng = position.coords.longitude;
        this.map = new google.maps.Map(this.mapElement, mapOptions);

        this.marker = new google.maps.Marker({
          position: latLng,
          map: this.map,
          draggable: true
        });

        this.marker.addListener('dragend', this.onDragEnd.bind(this));
        this.mapInitialised = true;
        resolve(true);
      });
    });
  }

  disableMap(): void {
    if (this.pleaseConnect) {
      this.pleaseConnect.style.display = "block";
    }
  }

  enableMap(): void {
    if (this.pleaseConnect) {
      this.pleaseConnect.style.display = "none";
    }
  }

  addConnectivityListeners(): void {
    Network.addListener('networkStatusChange', (status: NetworkStatus) => {

      if (status.connected) {
        setTimeout(() => {
          if (typeof google == "undefined" || typeof google.maps == "undefined") {
            this.loadGoogleMaps();
          } else {
            if (!this.mapInitialised) {
              this.initMap();
            }

            this.enableMap();
          }
        }, 2000);
      } else {
        this.disableMap();
      }

    });
  }

  onDragEnd(e) {
    console.log(this.location);

    this.location.lat = e.latLng.lat();
    this.location.lng = e.latLng.lng();

    this.geocodeLatLng({
      lat: this.location.lat,
      lng: this.location.lng,
      map: null
    });
  }

  geocodeLatLng(args) {
    // args: lat, lng, map
    console.log(args);

    const latLng = { lat: args.lat, lng: args.lng };

    this.geocoder.geocode({ 'location': latLng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          if (args.map) {
            args.map.setZoom(17);
          }

          /*var marker = new google.maps.Marker({
            position: latLng,
            map: args.map
          });

          this.infowindow.setContent(results[0].formatted_address);
          this.infowindow.open(args.map, marker);*/

          this.location.description = results[0].formatted_address;
          console.log(this.location.description);
          return results[0].formatted_address;
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }

      this.location.description = args.lat + ',' + args.lng;
      return false;
    });
  }
}
