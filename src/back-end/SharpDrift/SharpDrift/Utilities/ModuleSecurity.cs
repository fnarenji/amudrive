using System;
using Nancy;

namespace SharpDrift.Utilities
{
    static class ModuleSecurity
    {
        public static void RequiresAuthentication(this NancyModule module)
        {
            module.Before.AddItemToEndOfPipeline(RequiresAuthentication);
        }

        private static Response RequiresAuthentication(NancyContext context)
        {
            if (context.CurrentUser == null ||
                String.IsNullOrWhiteSpace(context.CurrentUser.UserName))
            {
                return "y_u_no_auth?";
            }
            return null;
        }

    }
}
