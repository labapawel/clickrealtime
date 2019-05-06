using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace ClickService
{
  public class ClickClient
  {
    private int _counter { get; set; }
    private DateTime _updateat { get; set; }
    public int type { get; set; } // 0 - nadawca, 1 - odbiorca 
    public int count {
      get {
          return _counter;
      }
      set {
        _counter = value;
        _updateat = DateTime.Now;
      }
    } // licznik klikniec
    public bool Active { get; set; } // aktywność
    public string ClientID { get; set; }// id klienta
    public bool Group { get
      {
        return GroupName!=null && !GroupName.Equals("");
      }
    } // grupa
    public string GroupName { get; set; } // nazwa grupa

    public DateTime LogIn { get; set; }
    public DateTime? LogOut { get; set; }
    public DateTime UpdateAt {
      get {
        return _updateat;
      }
    }
  }

  public class ClickController: Hub
  {
    static Dictionary<string, ClickClient> Client = new Dictionary<string, ClickClient>();

    public void CleatClientConnection()
    {
      // czyszczenie klientów starszych niż 5 min;
      DateTime min5 = DateTime.Now.AddMinutes(-5);
      foreach (var item in Client)
      {
        if (item.Value.LogOut != null && item.Value.LogOut < min5)
          Client.Remove(item.Key);
      }

    }

    public override async Task OnConnectedAsync()
    {
      /*
       * rejstrowanie nowego połączenia
       * */

      CleatClientConnection();

      if (!Client.ContainsKey(Context.ConnectionId))
        Client.Add(Context.ConnectionId, new ClickClient() { Active = true, count = 0, ClientID = Context.ConnectionId});

      ClickClient item = Client[Context.ConnectionId];
      item.Active = true;
      item.LogOut = null;
      item.LogIn = DateTime.Now;

      int ActiveClient = Client.ToList().Where(e => e.Value.Active == true).Count();


      await Clients.Client(Context.ConnectionId).SendAsync("sendID", Context.ConnectionId);
      await Clients.All.SendAsync("sendCount", ActiveClient);
   //   await Clients.Group("VIEW").SendAsync("UpdateClient", item);
      await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
      CleatClientConnection();

      // dezaktywacja klienta 
      if (Client.ContainsKey(Context.ConnectionId))
      {
        ClickClient item = Client[Context.ConnectionId];
        item.Active = false;
        item.LogOut = DateTime.Now;

        int ActiveClient = Client.ToList().Where(e => e.Value.Active == true).Count();
        await Clients.All.SendAsync("sendCount", ActiveClient);
        await Clients.Group("VIEW").SendAsync("UpdateClient", item);
      }

      

      await base.OnDisconnectedAsync(exception);
    }

    public async Task ChangeState(int counter)
    {
      if (Client.ContainsKey(Context.ConnectionId))
      {
        ClickClient item = Client[Context.ConnectionId];
        item.count = counter;

        Debug.WriteLine(counter);
        await Clients.Group("VIEW").SendAsync("UpdateClient", item);
      }
    }

    public async Task addGroup(string GroupName)
    {
      await Groups.AddToGroupAsync(Context.ConnectionId, GroupName);
      if (Client.ContainsKey(Context.ConnectionId))
      {
        ClickClient item = Client[Context.ConnectionId];
        item.type = 1;
        await Clients.Group("VIEW").SendAsync("UpdateClient", item);
      }
    }

    public async Task GetListClient()
    {
        await Clients.Client(Context.ConnectionId).SendAsync("UpdateClients", Client.ToArray());
    }


  }


}
