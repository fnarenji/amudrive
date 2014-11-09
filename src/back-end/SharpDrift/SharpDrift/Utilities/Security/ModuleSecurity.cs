using Nancy;

namespace SharpDrift.Utilities.Security
{
    static class ModuleSecurity
    {
        public static void RequiresAuthentication(this NancyModule module)
        {
            module.Before.AddItemToEndOfPipeline(RequiresAuthentication);
        }

        private static Response RequiresAuthentication(NancyContext context)
        {
            return context.CurrentUser != null ? context.Response
                                               : new
                                                {
                                                    success = false, 
                                                    reason = "y_u_no_auth?"
                                                }.ToJson().WithStatusCode(HttpStatusCode.Unauthorized);
        }

    }
}
