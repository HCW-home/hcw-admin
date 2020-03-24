import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { ConfirmationService } from '../confirmation.service';
import { AuthService } from '../auth/auth.service';

import { Observable, of } from 'rxjs';
@Injectable({ providedIn: 'root' })

export class RouterGuard implements CanActivate {
  consultationPath = /\/consultation\/.{24}(\/|$|\?)/;
  constructor(
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private confirmationServ: ConfirmationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {


    const currentNav = this.router.getCurrentNavigation();
    if (currentNav && currentNav.extras.state && currentNav.extras.state.confirmed) {

      return of(true);
    }
    if (this.consultationPath.test(this.router.url)) {
      const redirect = (this.consultationPath.test(state.url)) ? '/dashboard' : state.url;
      this.confirmationServ.requestConfirmation(redirect);
      return of(false);
    }

    // not logged in so redirect to login page with the return url
    console.log('navigate');
    return of(true);
  }
}
