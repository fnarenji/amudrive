using System;
using Nancy.Bootstrapper;

namespace SharpDrift.Utilities
{
    class CheckAuthBeforeRequest : IApplicationStartup 
    {
        public void Initialize(IPipelines pipelines) {
            pipelines.BeforeRequest.AddItemToStartOfPipeline(ctx => {
                if (ctx.Request.Cookies.ContainsKey("authToken"))
                {
                    var authToken = AES.Decrypt(Convert.FromBase64String(ctx.Request.Cookies["authToken"]));

                    var authTokenPieces = authToken.Split(':');
                    var userId = authTokenPieces[0];
                    var tokenCreationDate = DateTime.FromBinary(Int64.Parse(authTokenPieces[1]));
                    var remoteIp = authTokenPieces[1];

                    if (remoteIp == ctx.Request.UserHostAddress && DateTime.UtcNow.Subtract(tokenCreationDate).TotalHours < 48)
                    {
                        ctx.CurrentUser = new IUseruserId;
                    }
                }

                return ctx.Response;
            });
        }
    }
}
