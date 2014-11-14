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
                                vehicle = await conn.SingleSqlAsync<Vehicle>("SELECT * FROM VEHICLE WHERE idClient = @IdClient",
                                                                            new { IdClient = Int32.Parse(Context.CurrentUser.UserName) })
                            }.ToJson();
            };

            Patch["/vehicles", true] = async (x, ctx) =>
            {
                using (var conn = DAL.Conn)
                {
                    var v = this.Bind<Vehicle>();
                    v.IdClient = Int32.Parse(Context.CurrentUser.UserName);

                    await conn.ExecuteSqlAsync(String.Join(" ", "UPDATE VEHICLE SET name = @name,",
                                                                                   "bv = @bv,",
                                                                                   "animals = @animals,",
                                                                                   "smoking = @smoking,",
                                                                                   "eat = @eat,",
                                                                                   "WHERE idClient = @IdClient AND idVehicle = @idVehicle"), v);

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