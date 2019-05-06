import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'clickRealTime';
  firstScreen = true;

  clientType = "";

  showClient(type:string)
  {
    this.firstScreen = false;
    this.clientType = type;
  }
}
