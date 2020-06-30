import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Menu {
  loggedIn = [
    {
      text: "Beranda",
      url: "/app/tabs/home",
      icon: "home",
      direction: "root"
    },
    {
      text: "Pesanan",
      url: "/app/tabs/orders",
      icon: "cart",
      direction: "root"
    },
    {
      text: "Inbox",
      url: "/app/tabs/messages",
      icon: "mail",
      direction: "root"
    },
    {
      text: "Profil",
      url: "/app/tabs/profile",
      icon: "person",
      direction: "root"
    },
    {
      text: "Keluar",
      icon: "log-out",
      click: "logout"
    }
  ];

  notLoggedIn = [
    {
      text: "Login",
      url: "/login",
      icon: "log-in",
      direction: "forward"
    },
    {
      text: "Forget Password",
      url: "/forget",
      icon: "help-circle-outline",
      direction: "forward"
    },
    {
      text: "Register",
      url: "/register",
      icon: "person",
      direction: "forward"
    }
  ];
}
