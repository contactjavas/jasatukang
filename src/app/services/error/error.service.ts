import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse
} from "@angular/common/http";

import { throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(private http: HttpClient) { }

  public handleError(httpError: HttpErrorResponse) {
    if (httpError.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      // console.error("An error occurred:", httpError.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      // console.error(`Backend returned code ${httpError.status}, ` + `body was: ${httpError.error}`);
    }

    // Use "custom generated" error object.
    let appError = httpError.error;

    // Bring "server generated" error properties to our custom error object.
    appError.status = httpError.status;
    appError.statusText = httpError.statusText;

    // Choose where to get the "message" property.
    if (httpError.error) {
      if (!httpError.error.message) {
        appError.message = httpError.error;
      }
    } else {
      appError.message = httpError.message;
    }

    console.log(appError.message);

    // return an observable with a user-facing error message
    return throwError(appError);
  }
}
