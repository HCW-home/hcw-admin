
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SocketEventsService } from '../socket-events.service';
import { ConsultationService } from '../consultation.service';
import { Router } from '@angular/router';
import { User } from '../user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public currentUserSubject: BehaviorSubject<any>;
  private loggedIn: Subject<User> = new Subject();
  public currentUser: Observable<User>;

  constructor(private http: HttpClient,
    private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public loggedInSub() {
    return this.loggedIn;
  }
  login(token) {
    const headers = {};
    if (token) {
      headers['x-access-token'] = token;
    }
    return this.http.get<any>(`${environment.api}/current-user`, { headers })
      .pipe(map(res => {
        if (res.user && res.user.token) {
          sessionStorage.setItem('currentUser', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
          return res.user;
        }
      }));
  }

  loginLocal(email, password) {

    let opts = {};
    if (!environment.production) {
      opts = { withCredentials: true };
    }

    return this.http.post<any>(`${environment.api}/login-local`, { email, password }, opts);
  }

  loginSms(smsVerificationCode: string, user: string) {
    return this.http.post<any>(`${environment.api}/login-sms`, { smsVerificationCode, user });
  }

  login2FA(localLoginToken, smsLoginToken, user) {
    let opts = {};
    if (!environment.production) {
      opts = { withCredentials: true };
    }

    return this.http.post<any>(`${environment.api}/login-2fa`, { localLoginToken, smsLoginToken, user }, opts)
      .pipe(map(res => {
        if (res.user && res.user.token) {
          sessionStorage.setItem('currentUser', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
          return res.user;
        }
      }));
  }

  logout() {
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken() {
    return this.currentUserSubject.value.token;
  }

  getConfig() {
    return this.http.get<any>(`${environment.api}/config`);
  }
}
