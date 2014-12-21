using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
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
                using (DbConnection conn = DAL.Conn)
                    return new
                    {
                        success = true,
                        vehicles = await conn.QuerySqlAsync<Vehicle>("SELECT * FROM VEHICLE WHERE idClient = @IdClient",
                            new {IdClient = Int32.Parse(Context.CurrentUser.UserName)})
                    }.ToJson();
            };

            Put["/vehicles", true] = async (x, ctx) =>
            {
                using (DbConnection conn = DAL.Conn)
                {
                    var v = this.Bind<Vehicle>();
                    v.IdClient = Int32.Parse(Context.CurrentUser.UserName);

                    await conn.ExecuteSqlAsync(string.Join(" ", "UPDATE VEHICLE SET name = @Name,",
                        "bv = '" + v.BV.ToString() + "',",
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

            Post["/vehicles", true] = async (x, ctx) =>
            {
                using (DbConnection conn = DAL.Conn)
                {
                    var v = this.Bind<Vehicle>();
                    v.IdClient = Int32.Parse(Context.CurrentUser.UserName);

                    var reasons = new List<string>();

                    if (string.IsNullOrEmpty(v.Name))
                        reasons.Add("Tous les champs doivent être remplis.");

                     if (reasons.Any())
                    {
                        return new
                        {
                            success = false,
                            reasons = reasons,
                        }.ToJson();
                    }

                    v = await conn.InsertSqlAsync(string.Join(" ",
                        "INSERT INTO vehicle VALUES (DEFAULT, @IdClient, @name, '" + v.BV.ToString() + "', @animals , @smoking, @eat) RETURNING *"), v);
                    return new
                    {
                        success = true,
                        vehicle = v
                    }.ToJson();
                }
            };

            Delete["/vehicles", true] = async (x, ctx) =>
            {
                using (DbConnection conn = DAL.Conn)
                {
                    var v = this.Bind<Vehicle>();
                    v.IdClient = Int32.Parse(Context.CurrentUser.UserName);

                    await
                        conn.ExecuteSqlAsync(string.Join(" ",
                            "DELETE FROM VEHICLE WHERE idClient = @IdClient AND idVehicle = @IdVehicle"), v);

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