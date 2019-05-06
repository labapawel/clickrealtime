import { Component, OnInit } from "@angular/core";
import * as signalR from "@aspnet/signalr";

@Component({
  selector: "app-klikacz",
  templateUrl: "./klikacz.component.html",
  styleUrls: ["./klikacz.component.css"]
})
export class KlikaczComponent implements OnInit {
  counter = 0;
  isConnect = false;
  firstRun = true;
  myID: string;
  countClients = 0;
  private connect: signalR.HubConnection;
  constructor() {}

  ngOnInit() {
    this.connect = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:55560/clickService")
      .build();

    this.connect.on("sendID", id => {
      this.myID = id;
    });

    this.connect.on("sendCount", count => {
      this.countClients = count;
    });
  }

  Connect() {
    this.firstRun = false;
    setInterval(() => {
      try {
        this.ConnectInit();
      } catch (e) {}
    }, 5000);

    try {
      this.ConnectInit();
    } catch (e) {}
  }

  sendCounter() {
    if (this.isConnect) {
      this.connect.invoke('ChangeState', this.counter);
    }
  }

  Click() {
    this.counter++;
    this.sendCounter();
  }

  ConnectInit() {
    this.isConnect = this.connect.state != 0;
    if (!this.isConnect) {
      this.connect
        .start()
        .then(() => {
          // kiedy połączymy się z serwerem signalR
          this.isConnect = true;
          setTimeout( () => {
              this.sendCounter();
          }, 300);
        })
        .catch(error => {
          // gdy pojawią się wyjątki
          console.error(error);
        });
    }
  }
}
