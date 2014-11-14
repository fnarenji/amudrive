using System;
using Insight.Database;
using Nancy;
using Nancy.ModelBinding;
using SharpDrift.DataModel;
using SharpDrift.Utilities;
using SharpDrift.Utilities.Data;
using SharpDrift.Utilities.Security;

namespace SharpDrift.Modules
{
    public class VehicleModule : NancyModule
    {
        public VehicleModule()
        {
            this.RequiresAuthentication();

            Get["/vehicles", true] = async (x, ctx) =>
            {
                using (var conn = DAL.Conn)
                    return new
                            {
                                success = true,
                                vehicles = await conn.QuerySqlAsync<Vehicle>("SELECT * FROM VEHICLE WHERE idClient = @IdClient",
                                                                            new { IdClient = Int32.Parse(Context.CurrentUser.UserName) })
                            }.ToJson();
            };

            Put["/vehicles", true] = async (x, ctx) =>
            {
                using (var conn = DAL.Conn)
                {
                    var v = this.Bind<Vehicle>();
                    v.IdClient = Int32.Parse(Context.CurrentUser.UserName);
                    var vSerialized = v.Expand();
                    vSerialized["BV"] = v.BV.ToString()[0];

                    await conn.ExecuteSqlAsync(String.Join(" ", "UPDATE VEHICLE SET name = @Name,",
                                                                                   "bv = @BV,",
                                                                                   "animals = @Animals,",
                                                                                   "smoking = @Smoking,",
                                                                                   "eat = @Eat",
                                                                                   "WHERE idClient = @IdClient AND idVehicle = @IdVehicle"), v);

                      return new
                            {
                                success = true,
                                vehicle = v
                            }.ToJson();
                }
            };
        }
    }
}