import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

// // // metronic implementa el guard de forma interna, no lo declara en el router

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;

    // not logged in so redirect to login page with the return url
    if (!currentUser) {
      this.authService.logout();
      return false;
    }

    const token = this.authService.token;
    if (!token) {
      this.authService.logout();
      return false;
    }

    const tokenExpiration = JSON.parse(atob(token.split('.')[1])).exp;
    if (Math.floor(new Date().getTime() / 1000) >= tokenExpiration) {
      this.authService.logout();
      return false;
    }

    // logged in so return true
    return true;
  }
}
