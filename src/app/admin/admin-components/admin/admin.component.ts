import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router }    from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { MdSnackBar } from '@angular/material';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements OnInit {

  user: Observable<firebase.User>;
  currentAdmin: any;

  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public router: Router,
    public globalService: GlobalService,
    public snackBar: MdSnackBar,
  ) {
    this.user = afAuth.authState;
    this.currentAdmin = {};
  }

  ngOnInit() {
    this.user.subscribe(currentUser => {
      if (!currentUser) {
        this.router.navigateByUrl('login');
      } else {
        this.db.object('/admins/' + this.globalService.hashCode(currentUser.email)).subscribe((a) => {
          if (a && a.email) {
            this.globalService.admin.next(currentUser);
            this.db.object('/admins/' + currentUser.uid).subscribe((a) => {
              this.globalService.admin.next(a);
              this.currentAdmin.role = a.role;
            });
          } else {
            this.router.navigateByUrl('');
            let snackBarRef = this.snackBar.open('You are not an authorized administrator', 'OK!', {
              duration: 3000
            });
          }
        }, (err) => {
          console.log('Permission Error', err);
          this.router.navigateByUrl('');
          let snackBarRef = this.snackBar.open('You are not an authorized administrator', 'OK!', {
            duration: 3000
          });
        });
      }
    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

}
