import { Component, OnInit } from '@angular/core';
import { StatusesService } from './statuses.service';

@Component({
  selector: 'app-statuses',
  templateUrl: './statuses.component.html',
  styleUrls: ['./statuses.component.scss']
})
export class StatusesComponent implements OnInit {

  // Status text
  public statusText: string

  // The status available
  public statuses: any[]

  // Flag to see if a new status can be added or nah
  public canPostStatus: boolean = true

  // ---------------------------------------------------------
  // Class constructor, injects StatusService as this.status
  // ---------------------------------------------------------

  constructor(public status: StatusesService) {
  }

  // ---------------------------------------------------------
  // ngOnInit is automatically fired on intialisation
  // ---------------------------------------------------------

  ngOnInit() {
    // Get 50 of the most recent statuses
    this.status.recent(50)
  }

  // ---------------------------------------------------------
  // Get the status of the text if it's valid or nah
  // ---------------------------------------------------------

  typingStatus() {
    this.canPostStatus = this.status.valid(this.statusText) && this.status.updating() == true;
  }

  // ---------------------------------------------------------
  // Post a status if it is valid
  // ---------------------------------------------------------

  postStatus() {
    this.status.valid(this.statusText) && this.status.post(this.statusText)
  }

  // ---------------------------------------------------------
  // React to an existing post
  // ---------------------------------------------------------

  react(reaction: string, status) {
    if (this.status.alreadyReacted(status.$key))
     return
    this.status.react(reaction, status)
      this.status.setCookie({statusId: status.$key, isLiked: true})
  }
}
