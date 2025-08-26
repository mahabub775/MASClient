// idle.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {
    this.setupIdle();
  }

  setupIdle() {
    // ⏱ Set idle time to 10 mins (600 seconds)
    this.idle.setIdle(3600);//1 hour
    // 🕐 Set timeout after idle for 0 (immediate logout)
    this.idle.setTimeout(1); // 1 sec, just triggers right away after idle
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.onIdleEnd.subscribe(() => {
      // user is active again
    });

    this.idle.onTimeout.subscribe(() => {
      const token = localStorage.getItem('jwt');
      if (!token || this.jwtHelper.isTokenExpired(token)) {
        // Token expired or missing
        console.warn('Token expired during idle.');
      } else {
        // Token valid but idle
        console.warn('User idle too long. Logging out.');
      }

      this.logout();
    });

    // this.keepalive.interval(15); // optional ping
    // this.keepalive.onPing.subscribe(() => {
    //   // optional server ping
    // });
  }

  startWatching() {
    this.idle.watch();
  }

  stopWatching() {
    this.idle.stop();
  }

  logout() {
    sessionStorage.clear();
    localStorage.removeItem("logininfo");
    localStorage.removeItem('jwt');
    this.stopWatching();
    this.router.navigate(['/logout']);
  }
}
