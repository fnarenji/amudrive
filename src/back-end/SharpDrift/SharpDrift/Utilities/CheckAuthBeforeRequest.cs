using System;
using Nancy;
using Nancy.Bootstrapper;
using ImpromptuInterface;
using Nancy.Responses;
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
                    var a = ctx.Request.Cookies["authToken"];
                    Console.WriteLine(a);
                    var authToken = AES.Decrypt(Convert.FromBase64String(a));

                    var authTokenPieces = authToken.Split(':');
                    var userId = authTokenPieces[0];
                    var tokenCreationDate = DateTime.FromBinary(Int64.Parse(authTokenPieces[1]));
                    var remoteIp = authTokenPieces[1];

                    if (remoteIp == ctx.Request.UserHostAddress &&
                        DateTime.UtcNow.Subtract(tokenCreationDate).TotalHours < 48)
                    {
                        ctx.CurrentUser = new {Username = userId}.ActLike<IUserIdentity>();
                        return ctx.Response;
                    }
                }

                return ctx.Response;
            });
        }
    }
}
