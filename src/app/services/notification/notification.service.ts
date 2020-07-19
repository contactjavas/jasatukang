import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable, Subject } from "rxjs";
import { catchError } from "rxjs/operators";

import { Response } from "../../interfaces/http";
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

  order(data: any, token: String): Observable<Response> {
    this.appService.httpOptions.headers = this.appService.httpOptions.headers.set(
      "Authorization",
      "Bearer " + token
    );

    return this.http
      .post<Response>(
        this.appService.apiUrl + "/order",
        data,
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

  getUnreadState() {
    return this.unreadState.asObservable();
  }

  setUnreadState(value: Number) {
    this.unreadState.next(value);
  }
}
