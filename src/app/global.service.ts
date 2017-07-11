import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class GlobalService {
  public user = new BehaviorSubject(null);
  public currentPost = new BehaviorSubject(null);
  public currentPage = new BehaviorSubject(null);
}