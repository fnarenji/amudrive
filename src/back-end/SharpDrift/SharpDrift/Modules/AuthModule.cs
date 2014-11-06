using System;
using System.Web;
using System.Security.Cryptography;
using System.Text;
using Insight.Database;
using Nancy;
using SharpDrift.Utilities;

namespace SharpDrift.Modules
{
    public class AuthModule : NancyModule
    {
        public AuthModule()
        {
            // TODO: Add length to password_sha512 field
            Get["/auth/login/{username}/{password_sha512}", true] = async (x, ctx) =>
                {
                    using (var conn = DAL.Conn)
                    {
                        var valid = conn.SingleSqlAsync<int?>("SELECT idclient FROM client WHERE username = @u AND password = @p",
                                                                new { u = x.username, p = x.password_sha512 });

                        if (valid == null)
                            return "false";

                        String authenticationString = String.Format("{0}:{1}:{2}",
                                                                    x.username,
                                                                    DateTime.UtcNow.ToBinary(),
                                                                    Request.UserHostAddress);

                        var encryptedAuthToken = HttpServerUtility.UrlTokenEncode(await AES.EncryptAsync(authenticationString));
                        return ((Response)"true").WithCookie("authToken", encryptedAuthToken);
                    }
                };
        }
    }
}
