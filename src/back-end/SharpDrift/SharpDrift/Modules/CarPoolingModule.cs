using System;
using System.Collections;
using System.Collections.Generic;
using Insight.Database;
using Nancy;
using Nancy.Extensions;
using Nancy.ModelBinding;
using SharpDrift.DataModel;
using SharpDrift.Utilities;
using SharpDrift.Utilities.Data;
using SharpDrift.Utilities.Security;

namespace SharpDrift.Modules
{
    public class CarPoolingModule : NancyModule
    {
        public CarPoolingModule()
        {
            this.RequiresAuthentication();

            Post["/carPoolings/search", true] = async (x, ctx) =>
            {
                using (var conn = DAL.Conn)
                {
                    var data = this.BindAnonymous(new
                                                    {
                                                        @long = .0,
                                                        lat = .0,
                                                        radius = .0,
                                                        idCampus = 0,
                                                        campusToAddress = false,
                                                        minMeetTime = new DateTime(),
                                                        maxMeetTime = new DateTime()
                                                    });

                    IList<CarPooling> carPoolings = await conn.QuerySqlAsync<CarPooling>(String.Join(" ",
                                                                                                    "SELECT *",
                                                                                                    "FROM carPooling",
                                                                                                    "WHERE pow(@long - long, 2) + pow(@lat - lat, 2) < pow(@radius, 2)",
                                                                                                    "AND idCampus = @idCampus",
                                                                                                    "AND campusToAddress = @campusToAddress",
                                                                                                    "AND meetTime BETWEEN @minMeetTime AND @maxMeetTime"), data);

                    return new
                            {
                                success = true,
                                carPoolings = carPoolings
                            }.ToJson();
                }
            };


        }
    }
}
