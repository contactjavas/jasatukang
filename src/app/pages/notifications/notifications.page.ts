import { Component, OnInit } from '@angular/core';

import { Storage } from "@ionic/storage";

import { Subscription, from } from 'rxjs';
import { toDate, parseISO, format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

import { Notification } from "../../interfaces/notification";

import { NotificationService } from "../../services/notification/notification.service";
import { ErrorService } from "../../services/error/error.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  notifications: Notification[];

  constructor(
    private storage: Storage,
    private notificationService: NotificationService,
    public errorService: ErrorService,
  ) {
    console.log('Notifications "constructor" run');
  }

  ngOnInit() {
    console.log('Notifications "ngOnInit" run');
  }

  ionViewWillEnter() {
    console.log('Notifications "ionViewWillEnter" run');
    this.getNotifications();
  }

  getNotifications() {
    this.storage.get("notifications").then((notifications: Array<Notification>) => {
      console.log("Notification list has been taken from storage via 'getNotifications()' in notifications.page.ts");
      this.notificationService.setUnreadState(
        this.notificationService.countUnread(notifications)
      );

      this.notifications = notifications;
    });
  }

  fetchNotifications(refresher: any) {
    this.storage.get("token").then(token => {
      if (!token) return;

      this.notificationService.fetchLimit(token, 0, 20).subscribe(
        res => {
          console.log("Notifications fetched from tabs.page.ts via refresher");
          this.notificationService.setUnreadState(
            this.notificationService.countUnread(res.data)
          );

          this.notifications = res.data;

          this.storage.set("notifications", res.data);
          if (refresher) refresher.target.complete();
        },
        err => {
          if (refresher) refresher.target.complete();
          this.errorService.showMessage(err);
        }
      );

    });
  }

  toReadableDate(dateStr: string) {
    const parsedDate = parseISO(dateStr);
    return format(parsedDate, 'EEEE, dd MMMM yyyy', { locale: idLocale });
  }

  refreshData(event: any) {
    this.fetchNotifications(event);
  }

  onItemClick(e, notifId: number) {
    console.log('notification item clicked');

    this.notifications.forEach((notification: Notification, index: number) => {
      if (notification.id === notifId) {
        notification.is_seen = 1;
        this.notifications[index] = notification;

        return;
      }
    });

    this.storage.set("notifications", this.notifications);
    this.markAsSeen(notifId);
  }

  markAsSeen(notifId: number) {
    this.storage.get("token").then(token => {
      if (!token) return;

      this.notificationService.markAsSeen(token, notifId).subscribe(
        res => {
          console.log("Notification '" + notifId + "' has been mark as seen");
        },
        err => {
          this.errorService.showMessage(err);
        }
      );
    });
  }

}
