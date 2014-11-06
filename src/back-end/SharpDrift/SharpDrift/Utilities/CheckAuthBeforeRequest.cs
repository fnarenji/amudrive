using System;
using System.Collections.Generic;
using System.Web;
using Nancy;
using Nancy.Bootstrapper;
using ImpromptuInterface;
using Nancy.Responses;
using Nancy.Security;

namespace SharpDrift.Utilities
{
    public class CheckAuthBeforeRequest : IApplicationStartup 
    {
        class AuthToken : IUserIdentity
        {
            public string UserName { get; set; }
            public IEnumerable<string> Claims { get; private set; }
        }

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

                        var authTokenPieces = authToken.Split(new[] { ':' }, 3);
                        var userId = authTokenPieces[0];
                        var tokenCreationDate = DateTime.FromBinary(Int64.Parse(authTokenPieces[1]));
                        var remoteIp = authTokenPieces[2];

                        Console.WriteLine("Validating authentication token for {0} from {1} since {2}.", userId, remoteIp, tokenCreationDate);
                        if (remoteIp == ctx.Request.UserHostAddress &&
                            DateTime.UtcNow.Subtract(tokenCreationDate).TotalHours < 48)
                        {
                            ctx.CurrentUser = new AuthToken {UserName = userId};
                            Console.WriteLine("Valid authentication token for {0} from {1} since {2}.", userId, remoteIp, tokenCreationDate);
                        }
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
