using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using Insight.Database;
using Nancy;
using Nancy.ModelBinding;
using SharpDrift.DataModel;
using SharpDrift.Utilities;
using SharpDrift.Utilities.Data;
using SharpDrift.Utilities.Security;

namespace SharpDrift.Modules
{
    public class JoinModule : NancyModule
    {
        public JoinModule()
        {
            this.RequiresAuthentication();

            Post["/carpooling/join", true] = async (x, ctx) =>
            {
                using (var conn = DAL.Conn)
                {
                    var c = this.Bind<Join>();
                    c.IdClient = Int32.Parse(Context.CurrentUser.UserName);

                    await conn.ExecuteSqlAsync(String.Join(" ", "INSERT INTO joins VALUES (@IdClient , @IdCarPooling , @Accepted)"), c);

                    return new
                    {
                        success = true,
                        join = c
                    }.ToJson();
                }
            };
        }
    }
}
