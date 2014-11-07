using System;
using System.Web;
using Nancy;
using Nancy.Bootstrapper;
using ImpromptuInterface;
using Nancy.Security;

namespace SharpDrift.Utilities
{
    public class CheckAuthBeforeRequest : IApplicationStartup 
    {
        public void Initialize(IPipelines pipelines)
        {
            pipelines.BeforeRequest.AddItemToStartOfPipeline(ctx =>
            {
                if (ctx.Request.Cookies.ContainsKey("authToken"))
                {
                    try
                    {
                        var a = HttpServerUtility.UrlTokenDecode(ctx.Request.Cookies["authToken"]);
                        var authToken = AES.Decrypt(a);

                        if (AuthTokenManager.ValidateAuthToken(authToken, ctx.Request.UserHostAddress))
                            ctx.CurrentUser = new { UserName = AuthTokenManager.ParseUserId(authToken) }.ActLike<IUserIdentity>();
                    }
                    catch
                    {
                        Console.WriteLine("Wrong authToken format.");
                    }
                }
                return ctx.Response;
            });
        }
    }
}
