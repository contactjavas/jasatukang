import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { Response } from "../../interfaces/http";
import { ErrorService } from "../../services/error/error.service";
import { AppService } from "../../services/app/app.service";

@Injectable({
  providedIn: "root"
})
export class OrderService {
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

  fetchOrders(token: String): Observable<Response> {
    this.appService.httpOptions.headers = this.appService.httpOptions.headers.set(
      "Authorization",
      "Bearer " + token
    );

    return this.http
      .get<Response>(
        this.appService.apiUrl + "/my-orders",
        this.appService.httpOptions
      )
      .pipe(catchError(this.errorService.handleError));
  }

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }
}
