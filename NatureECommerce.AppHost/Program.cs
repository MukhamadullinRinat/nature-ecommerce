var builder = DistributedApplication.CreateBuilder(args);

var cache = builder.AddRedis("cache");

var apiService = builder.AddProject<Projects.NatureECommerce_ApiService>("apiservice");

// Add unified ecommerceshop service (backend serves frontend)
var ecommerceShop = builder.AddNpmApp("ecommerceshop", "../ecommerceshop/backend", "start:prod")
    .WithHttpEndpoint(port: 5001, env: "PORT")
    .WithEnvironment("NODE_ENV", "production")
    .WithEnvironment("FRONTEND_URL", "http://localhost:5001");

builder.AddProject<Projects.NatureECommerce_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithReference(cache)
    .WaitFor(cache)
    .WithReference(apiService)
    .WaitFor(apiService);

builder.Build().Run();
