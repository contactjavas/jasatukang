import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable, Subject } from "rxjs";
import { catchError } from "rxjs/operators";

import { Response } from "../../interfaces/http";
import { Notification } from "../../interfaces/notification";

import { ErrorService } from "../../services/error/error.service";
import { AppService } from "../../services/app/app.service";

@Injectable({
  providedIn: "root"
})
export class NotificationService {
  unreadState = new Subject<any>();

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private appService: AppService
  ) { }

  markAsSeen(token: string, notifId: number): Observable<Response> {
    this.appService.httpOptions.headers = this.appService.httpOptions.headers.set(
      "Authorization",
      "Bearer " + token
    );

    return this.http
      .post<Response>(
        this.appService.apiUrl + "/my-notifications/mark-as-seen/",
        { id: notifId },
        this.appService.httpOptions
      )
      .pipe(catchError(this.errorService.handleError));
  }

  fetchLimit(token: String, offset: Number, limit: Number): Observable<Response> {
    this.appService.httpOptions.headers = this.appService.httpOptions.headers.set(
      "Authorization",
      "Bearer " + token
    );

    return this.http
      .get<Response>(
        this.appService.apiUrl + "/my-notifications/" + offset + "/" + limit,
        this.appService.httpOptions
      )
      .pipe(catchError(this.errorService.handleError));
  }

  countUnread(notifications: Array<Notification>) {
    let total = 0;

    notifications.forEach(notification => {
      if (!notification.is_seen) total++;
    });

    return total;
  }

  getUnreadState() {
    return this.unreadState.asObservable();
  }

  setUnreadState(value: Number) {
    this.unreadState.next(value);
  }
}
