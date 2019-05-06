import { Component, OnInit } from "@angular/core";
import * as signalR from "@aspnet/signalr";

@Component({
  selector: "app-view-client",
  templateUrl: "./view-client.component.html",
  styleUrls: ["./view-client.component.css"]
})
export class ViewClientComponent implements OnInit {
  isConnect = false;
  firstRun = true;
  myID: string;
  AllClient: Array<any> = [];
  countClients = 0;
  private connect: signalR.HubConnection;

  constructor() {}

  ngOnInit() {
    this.connect = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:55560/clickService")
      .build();

    this.connect.on('sendID', id => {
      this.myID = id;
    });

    this.connect.on('sendCount', (_count) => {
      this.countClients = _count;
    });

    this.connect.on('UpdateClient', (_client) => {
      console.log(_client);

        if(_client.type == 1)
        {
          this.AllClient = this.AllClient.filter(e => e.value.type == 0 && e.clientID != _client.clientID);
        }
        else 
        {
        let cl = this.AllClient.find(e => e.clientID == _client.clientID);
        if(cl == undefined)
          {
            this.AllClient.push(
                 _client
            )
          } else 
            {
              cl.count = _client.count;
              cl.active = _client.active;
              
            }
        }
    });

    this.connect.on("UpdateClients", clients => {
      //console.log(clients);
      this.AllClient = [];
      clients.filter(e => e.value.type == 0).forEach( (item, key) => {
       // console.log(item);
        this.AllClient.push(item.value);
      })      
    });
  }

  getAllClient() {
    this.connect.invoke("GetListClient");
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

  ConnectInit() {
    this.isConnect = this.connect.state == 0;
    if (this.isConnect) {
      this.connect
        .start()
        .then(() => {
          // kiedy połączymy się z serwerem signalR
          this.isConnect = true;
          this.connect.invoke("addGroup", "VIEW");
          this.getAllClient();
        })
        .catch(error => {
          // gdy pojawią się wyjątki
          console.error(error);
        });
    }
  }
}
