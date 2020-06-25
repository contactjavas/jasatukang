import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { Response } from "../../interfaces/http";
import { ErrorService } from "../../services/error/error.service";
import { AppService } from "../../services/app/app.service";
import { User } from "../../interfaces/user";

@Injectable({
  providedIn: "root"
})
export class ProductService {
  user: User;

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private appService: AppService
  ) { }

  get(token: String, productId: Number): Observable<Response> {
    this.appService.httpOptions.headers = this.appService.httpOptions.headers.set(
      "Authorization",
      "Bearer " + token
    );

    return this.http
      .get<Response>(
        this.appService.apiUrl + "/products/" + productId,
        this.appService.httpOptions
      )
      .pipe(catchError(this.errorService.handleError));
  }

  fetchProducts(token: String): Observable<Response> {
    this.appService.httpOptions.headers = this.appService.httpOptions.headers.set(
      "Authorization",
      "Bearer " + token
    );

    return this.http
      .get<Response>(
        this.appService.apiUrl + "/products/categorized",
        this.appService.httpOptions
      )
      .pipe(catchError(this.errorService.handleError));
  }

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }
}
