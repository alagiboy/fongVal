// Import the required packages to the service
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database-deprecated";

import {CookieService} from 'angular2-cookie/core';

//import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import "rxjs/add/operator/map";
import { fail } from 'assert';


  // ----------------------------------------------------------------------
  // Interface for cookie object
  // ----------------------------------------------------------------------
  interface CookieData {
    statusId: string;
    isLiked: boolean;
  }


@Injectable()
export class StatusesService {

  // Flag to see if status update is in progress
  private inProgress: boolean = false

  // Set default flag for cookie like reaction
  private isLiked: boolean = false

  // Possible available reactions
  private reactions: string[] = ['like', 'love', 'dislike']

  // All the statuses available
  public statuses: FirebaseListObservable<any[]>

  // The maimum length and minimum length of a status
  public maxLength:number = 500
  public minLength:number = 0

  // Flag that determines if the status text is valid or nah
  public statusTextValid: boolean = false

  // Class constructor, injects the angular fire database as this.af and cookie services as _cookieService
  constructor(private af: AngularFireDatabase, private _cookieService: CookieService) {
    this.statuses = this.af.list('/statuses');
  }

  // ----------------------------------------------------------------------
  // Method to post the status to Firebase
  // ----------------------------------------------------------------------

  post(status: string) {
    if ( ! this.updating()) {
      this.inProgress = true
      let payload = {text: status, like:0, dislike:0, love:0, createdAt: {".sv": "timestamp"}};
      this.statuses.push(payload).then( snapshot => {
        this.inProgress = false
      })
    }
  }

  // ----------------------------------------------------------------------
  // Method to send a reaction to a status to Firebase
  // ----------------------------------------------------------------------

  react(reaction: string, status) {
    if (~this.reactions.indexOf(reaction)) {
      let reactions: any = {}
      let count: number = isNaN(parseInt(status[reaction])) ? 0 : parseInt(status[reaction])
      reactions[reaction] = count+1
      this.statuses.update(status.$key, reactions)
    }
  }

  // ----------------------------------------------------------------------
  // Method to get the recent statuses from Firebase
  // ----------------------------------------------------------------------

  recent(amount: number): FirebaseListObservable<any[]> {
    return this.statuses = this.af.list('/statuses').map(arr => arr.reverse()) as FirebaseListObservable<any[]>;
  }

  // ----------------------------------------------------------------------
  // Method to check the validity of a status update
  // ----------------------------------------------------------------------

  valid(status: string) : boolean {
    return status.length >= this.minLength && status.length <= this.maxLength
  }

  // ----------------------------------------------------------------------
  // Method to check the in progress flag
  // ----------------------------------------------------------------------

  updating() : boolean {
    return this.inProgress
  }

  // ----------------------------------------------------------------------
  // Method to set cookie
  // ----------------------------------------------------------------------
  setCookie(cookie: CookieData): boolean{
    let now = new Date()
    return this._cookieService.putObject('_statuses__'+cookie.statusId, cookie, {expires: new Date( now.getFullYear(), now.getMonth()+1, now.getDate())}) ? true : false
  }

  // ----------------------------------------------------------------------
  // Method to restrict multiple likes
  // ----------------------------------------------------------------------
  alreadyReacted(statusID: string) : boolean {
    let ck  = this._cookieService.getObject('_statuses__'+statusID)
    return this.isLiked = (typeof ck !== 'undefined' && ck.hasOwnProperty('isLiked') == true) ? true : false
  }

}
