import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Storage } from "@ionic/storage";

import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { Response } from "../../interfaces/http";
import { ErrorService } from "../error/error.service";
import { AppService } from "../app/app.service";
import { RegisterData, LoginData, User } from "../../interfaces/user";

@Injectable({
  providedIn: "root"
})
export class UserService {
  user: User;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private errorService: ErrorService,
    private appService: AppService
  ) {
    this.storage.get("user").then(user => {
      this.user = user;
    });
  }

  register(data: RegisterData): Observable<Response> {
    return this.http
      .post<Response>(
        this.appService.apiUrl + "/register",
        data,
        this.appService.httpOptions
      )
      .pipe(catchError(this.errorService.handleError));
  }

  login(data: LoginData): Observable<Response> {
    return this.http
      .post<Response>(
        this.appService.apiUrl + "/login",
        data,
        this.appService.httpOptions
      )
      .pipe(catchError(this.errorService.handleError));
  }

  loginWithGoogle(tokens: object): Observable<Response> {
    return this.http
      .post<Response>(
        this.appService.apiUrl + "/login/google",
        {
          tokens: tokens
        },
        this.appService.httpOptions
      )
      .pipe(catchError(this.errorService.handleError));
  }

  loginWithFacebook(accessToken: string): Observable<Response> {
    return this.http
      .post<Response>(
        this.appService.apiUrl + "/login/facebook",
        {
          accessToken: accessToken
        },
        this.appService.httpOptions
      )
      .pipe(catchError(this.errorService.handleError));
  }

  getProfile(token: string): Observable<Response> {
    this.appService.httpOptions.headers = this.appService.httpOptions.headers.set(
      "Authorization",
      "Bearer " + token
    );

    return this.http
      .get<Response>(
        this.appService.apiUrl + "/my-profile",
        this.appService.httpOptions
      )
      .pipe(catchError(this.errorService.handleError));
  }

  editProfile(data: any, token: string): Observable<Response> {
    return this.http
      .post<Response>(
        this.appService.apiUrl + "/profile/edit",
        data,
        this.appService.httpOptions
      )
      .pipe(catchError(this.errorService.handleError));
  }

  changePassword(data: any, token: string): Observable<Response> {
    return this.http
      .post<Response>(
        this.appService.apiUrl + "/account/change-password",
        data,
        this.appService.httpOptions
      )
      .pipe(catchError(this.errorService.handleError));
  }

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }
}
