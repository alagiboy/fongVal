import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CookieService } from 'angular2-cookie/services/cookies.service';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';

import { StatusesComponent } from './statuses/statuses.component';
import { FormsModule } from '@angular/forms';
import { StatusesService } from './statuses/statuses.service';

// Define the firebase database configuration keys, get it from your Firebase application console
export const firebaseConfig = {
  apiKey: "AIzaSyDvhnIvf8F7eogrjOPexKq91ZMUluUSbTQ",
  authDomain: "fongval-e7bea.firebaseapp.com",
  databaseURL: "https://fongval-e7bea.firebaseio.com",
  projectId: "fongval-e7bea",
  storageBucket: "fongval-e7bea.appspot.com",
  messagingSenderId: "1018384034569"
};

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    SidebarComponent,
    StatusesComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule
  ],
  providers: [
    StatusesService, CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
