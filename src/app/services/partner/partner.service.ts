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
export class PartnerService {
  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private appService: AppService
  ) { }

  fetch(partnerId: Number): Observable<Response> {
    return this.http
      .get<Response>(
        this.appService.apiUrl + "/partners/" + partnerId,
        this.appService.httpOptions
      )
      .pipe(catchError(this.errorService.handleError));
  }

  fetchAll(): Observable<Response> {
    return this.http
      .get<Response>(
        this.appService.apiUrl + "/partners",
        this.appService.httpOptions
      )
      .pipe(catchError(this.errorService.handleError));
  }
}
