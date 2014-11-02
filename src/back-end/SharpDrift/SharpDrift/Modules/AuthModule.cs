using System;
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
            Get["/auth/login/{username}/{password_sha512}", true] = async(x, ctx) =>
            {
                var valid = await DataAccessLayer.Connection.SingleSqlAsync<int?>("SELECT idclient FROM client WHERE username = :u AND password = :p", new { u = x.username, p = x.password_sha512 });
                if (valid == null)
                    return "false";

                String authenticationString = String.Format("{0}:{1}:{2}", x.username, DateTime.UtcNow.ToBinary(), Request.UserHostAddress);

                var a = Convert.ToBase64String(await AES.EncryptAsync(authenticationString));
                Console.WriteLine(a);
                return ((Response)"true").WithCookie("authToken", a);
            };
        }
    }
}
