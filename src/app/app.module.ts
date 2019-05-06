import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { KlikaczComponent } from './klikacz/klikacz.component';
import { ViewClientComponent } from './view-client/view-client.component';

@NgModule({
  declarations: [
    AppComponent,
    KlikaczComponent,
    ViewClientComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
