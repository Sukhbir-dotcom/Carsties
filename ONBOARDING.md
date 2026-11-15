# Carsties Developer Onboarding

Carsties is an auction marketplace built from .NET services and a Next.js web app. This guide is a starting point for navigating and working in the repository.

## Repository map

- `src/AuctionService` — auction API and auction data access.
- `src/BiddingService` — bid handling and auction lookups.
- `src/SearchService` — auction search.
- `src/IdentityService` — authentication and identity.
- `src/NotificationService` — notifications and real-time updates.
- `src/GatewayService` — API gateway.
- `src/Contracts` — shared service message contracts.
- `src/frontend/web-app` — Next.js frontend.
- `src/tests` — AuctionService unit and integration tests.
- `docker-compose.yml` — local infrastructure and application services.
- `Carsties.sln` — .NET solution.

Services communicate through RabbitMQ events; the bidding service also uses gRPC to query the auction service. The services use PostgreSQL and MongoDB for persistence.

## Getting started

Install the .NET SDK required by the projects, Docker with Compose, and Node.js/npm for frontend work. From the repository root in PowerShell:

1. Start the Docker Compose environment:

   ```powershell
   docker compose up -d
   ```

2. Build the .NET solution:

   ```powershell
   dotnet build .\Carsties.sln
   ```

3. For frontend development, install dependencies and start Next.js:

   ```powershell
   Set-Location .\src\frontend\web-app
   npm ci
   npm run dev
   ```

Check the relevant service's `appsettings*.json` and `docker-compose.yml` for local configuration before running services individually. Do not commit credentials or paste secrets into prompts.

## Tests and checks

Run the relevant test project for the code you change. For example:

```powershell
dotnet test .\src\tests\AuctionService.UnitTests\AuctionService.UnitTests.csproj
dotnet test .\src\tests\AuctionService.IntegrationTests\AuctionService.IntegrationTests.csproj
```

For frontend changes, use the scripts in `src/frontend/web-app/package.json`, such as `npm run lint` and `npm run build`.

## Example project prompt

Use this prompt with the `DotNetCore` agent for a cross-service task:

> In Carsties, prevent a bid from being placed on an auction that has already finished. First trace the existing bid request flow through `BiddingService`, its gRPC auction lookup, shared contracts, and the relevant tests. Implement the smallest complete server-side change that follows the existing patterns and preserves current API and message contracts. Add focused tests for both active and finished auctions, run the relevant test projects and build, and summarize the files changed and validation results. Follow the workspace `DotNetCore` agent and its .NET best-practices skill.

For any task, identify the affected service and its existing patterns before editing. Keep changes focused, add tests for behavior changes, and report which checks you ran.
