using System;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.Diagnostics;
using Nancy.Hosting.Self;
using Nancy.Responses;
using Nancy.TinyIoc;
using Fos;
using Fos.Owin;
using Insight.Database.Providers.PostgreSQL;
using Nancy;
using Nancy.Owin;
using Owin;

namespace SharpDrift
{
    public class CustomBootstrapper : DefaultNancyBootstrapper
    {
        protected override void ApplicationStartup(TinyIoCContainer container, IPipelines pipelines)
        {
            pipelines.AfterRequest.AddItemToEndOfPipeline(ctx => ctx.Response.WithHeader("Access-Control-Allow-Origin", "http://localhost")
                                                                            .WithHeader("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE")
                                                                            .WithHeader("Access-Control-Allow-Headers", "Accept, Origin, Content-type")
                                                                            .WithHeader("Access-Control-Allow-Credentials", "true"));

            
            pipelines.OnError.AddItemToEndOfPipeline((ctx, e) =>
            {
                ctx.Response = new TextResponse(e.ToString());
                ctx.Response.WithHeader("Access-Control-Allow-Origin", "http://localhost")
                            .WithHeader("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE")
                            .WithHeader("Access-Control-Allow-Headers", "Accept, Origin, Content-type")
                            .WithHeader("Access-Control-Allow-Credentials", "true");

                return ctx.Response;
            });
        }

        protected override DiagnosticsConfiguration DiagnosticsConfiguration
        {
            get { return new DiagnosticsConfiguration { Password = @"azerty" }; }
        }
    }
    
    class Program
    {
        private static void ConfigureOwin(IAppBuilder builder)
        {
            builder.UseNancy(new NancyOptions { Bootstrapper = new CustomBootstrapper() });
        }

        public static void Main(string[] args)
        {
            PostgreSQLInsightDbProvider.RegisterProvider();
            //using (var fosServer = new FosSelfHost(ConfigureOwin))
            //{
            //    fosServer.Bind(System.Net.IPAddress.Loopback, 3734);
            //    fosServer.Start(false);
            //}
            using (var host = new NancyHost(new Uri("http://0.0.0.0:3734")))
            {
                host.Start();
                Console.ReadLine();
            }
        }
    }
}
