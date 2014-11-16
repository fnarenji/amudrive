using System;
using System.Web;
using ImpromptuInterface;
using Nancy.Bootstrapper;
using Nancy.Security;

namespace SharpDrift.Utilities.Security
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
                        byte[] encryptedAuthToken = HttpServerUtility.UrlTokenDecode(ctx.Request.Cookies["authToken"]);
                        string authToken = AES.Decrypt(encryptedAuthToken);

                        if (AuthTokenManager.ValidateAuthToken(authToken, ctx.Request.UserHostAddress))
                            ctx.CurrentUser =
                                new {UserName = AuthTokenManager.ParseUserId(authToken)}.ActLike<IUserIdentity>();
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