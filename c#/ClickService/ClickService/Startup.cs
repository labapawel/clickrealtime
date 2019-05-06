using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore;
namespace ClickService
{
  public class Startup
  {
    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddCors(options =>
      {
        options.AddPolicy("AllowCors",
        builder =>
        {
          builder
                         .AllowAnyMethod()
                         .AllowAnyHeader()
                         .AllowAnyOrigin()
                         .AllowCredentials();
        });
      });
      services.AddSignalR( config => {
        config.KeepAliveInterval = TimeSpan.FromSeconds(10);
        config.HandshakeTimeout = TimeSpan.FromSeconds(5);
      });
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }

      app.UseCors("AllowCors");
      
      app.UseSignalR(SignalR => {
        
        SignalR.MapHub<ClickController>("/clickService");
      });
    }
  }
}
