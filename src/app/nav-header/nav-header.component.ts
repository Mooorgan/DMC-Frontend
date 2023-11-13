import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'dmc-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.scss'],
})
export class NavHeaderComponent implements OnInit {
  username$!: Observable<string | null>;
  authStatus$!: Observable<boolean>;
  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.username$ = this.auth.username$;
    this.authStatus$ = this.auth.authStatus$.pipe(
      map((authStatus) => !!authStatus)
    );
  }

  onLogout() {
    this.auth.logout();
  }
}
