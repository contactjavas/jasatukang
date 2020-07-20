import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "home",
        children: [
          {
            path: "",
            loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: "orders",
        children: [
          {
            path: "",
            loadChildren: () => import('../orders/orders.module').then(m => m.OrdersPageModule)
          }
        ]
      },
      {
        path: "notifications",
        children: [
          {
            path: "",
            loadChildren: () => import('../notifications/notifications.module').then(m => m.NotificationsPageModule)
          }
        ]
      },
      {
        path: "profile",
        children: [
          {
            path: "",
            loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
          }
        ]
      },
      {
        path: "",
        redirectTo: "/app/tabs/home",
        pathMatch: "full"
      }
    ]
  },
  {
    path: "",
    redirectTo: "/app/tabs/home",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
