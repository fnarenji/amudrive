using System;
using System.Data.Common;
using Insight.Database;
using Nancy;
using SharpDrift.DataModel;
using SharpDrift.Utilities;
using SharpDrift.Utilities.Data;

namespace SharpDrift.Modules
{
    public class CampusModule : NancyModule
    {
        public CampusModule()
        {
            Get["/campuses", true] = async (x, ctx) =>
            {
                using (DbConnection conn = DAL.Conn)
                {
                    var a = new
                    {
                        success = true,
                        campuses = await conn.QuerySqlAsync<Campus>("SELECT * FROM CAMPUS")
                    }.ToJson();
                    Console.WriteLine(a);
                    return a;
                }
            };
        }
    }
}