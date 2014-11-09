using Nancy;
using Insight.Database;
using SharpDrift.Utilities;
using SharpDrift.DataModel;
using SharpDrift.Utilities.Data;
using SharpDrift.Utilities.Security;

namespace SharpDrift.Modules
{
    public class CampusModule : NancyModule
    {
        public CampusModule()
        {
            this.RequiresAuthentication();
            
            Get["/campuses", true] = async (x, ctx) =>
            {
                using (var conn = DAL.Conn)
                {
                    return new
                            {
                                success = true,
                                campus = await conn.QuerySqlAsync<Campus>("SELECT * FROM CAMPUS")
                            }.ToJson();
                }
            };
        }
    }
}
