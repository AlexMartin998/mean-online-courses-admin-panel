import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';

import { API_BASE_URL } from 'src/app/config/config';
import { environment } from 'src/environments/environment';
import { User } from '../../shared/interfaces';
import { UserModel } from '../models/user.model';
import { LoginResponse } from '../shared/interfaces';
import { AuthHTTPService } from './auth-http';

export type UserType = User | undefined;
export type AuthUserType = { user: User; token: string } | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private readonly apiBaseUrl: string = API_BASE_URL;

  private _token: string;
  private _currentUser?: User;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router,
    private http: HttpClient
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  // // // public methods

  ////* login
  login(email: string, password: string): Observable<UserType> {
    // propio de metronic
    this.isLoadingSubject.next(true);

    return this.http
      .post<LoginResponse>(`${this.apiBaseUrl}/auth/login`, { email, password })
      .pipe(
        map((loginResponse: LoginResponse) => {
          const result = this.setAuthFromLocalStorage(loginResponse);

          return result;
        }),
        switchMap(() => {
          const user = this.getUserByToken();

          return user;
        }),
        catchError((err) => {
          console.error('err', err);
          return of(undefined);
        }),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  ////* logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  ////* getUserByToken
  getUserByToken(): Observable<User | undefined> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);

    return of(auth.user).pipe(
      map((user: User) => {
        if (user) {
          if (user.rol !== 'admin') {
            // throw new Error('Invalid user');
            return undefined;
          }
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.email, user.password)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // // // private methods

  ////* setAuthFromLocalStorage
  private setAuthFromLocalStorage(auth: LoginResponse): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.token) {
      localStorage.setItem('token', auth.token);
      localStorage.setItem('user', JSON.stringify(auth.user));
      return true;
    }
    return false;
  }

  ////* getAuthFromLocalStorage
  private getAuthFromLocalStorage(): AuthUserType {
    try {
      const lsValue = localStorage.getItem('user');
      if (!lsValue) {
        return undefined;
      }
      const authData = JSON.parse(lsValue);

      //
      this._token = localStorage.getItem('token') ?? '';
      this._currentUser = JSON.parse(JSON.stringify(authData)); // deep clone objects

      return { user: authData, token: this._token };
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
