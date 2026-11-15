---
name: dotnet-core-best-practices
description: "Apply practical C#/.NET and ASP.NET Core best practices when implementing, debugging, or reviewing web APIs, background workers, and distributed services."
---

# .NET Core Best Practices

Use these practices for .NET and ASP.NET Core work. First inspect the target project's framework, dependencies, architecture, and nearby code; adapt recommendations to the repository rather than imposing unrelated conventions.

## Implementation workflow

1. Identify the affected project(s), target framework, existing patterns, and related tests.
2. Trace the relevant request, data, or message flow before editing.
3. Make the smallest complete change, preserving existing contracts and behavior unless the task calls for a change.
4. Add or update focused tests for changed behavior and edge cases.
5. Run the smallest relevant test/build command; report any validation that could not be completed.

## C# and async

- Enable nullable reference types where the project supports them; use explicit null checks and meaningful types rather than suppressing warnings.
- Prefer small, cohesive types and methods. Use descriptive names, immutable data where practical, and established formatting and analyzers.
- Use `async`/`await` for asynchronous I/O. Avoid blocking with `.Result`, `.Wait()`, or sync-over-async.
- Accept and propagate `CancellationToken` through request handlers, service methods, database operations, and outbound calls when supported. Honor `HttpContext.RequestAborted` where appropriate.
- Do not use `Task.Run` to wrap naturally asynchronous I/O. Avoid `async void` except for framework-required event handlers.
- Dispose owned `IDisposable`/`IAsyncDisposable` resources deterministically; prefer framework-managed lifetimes and `using`/`await using`.

## ASP.NET Core and dependency injection

- Register services through the built-in container and use the narrowest appropriate lifetime: singleton for stateless shared services, scoped for request/unit-of-work services, and transient for lightweight services with no shared state.
- Do not inject a scoped service into a singleton. Use a scope factory for background services that need scoped dependencies.
- Keep controllers and endpoint handlers thin: validate and translate HTTP concerns there, and put reusable application behavior in services.
- Use framework binding and validation deliberately. Validate untrusted input at boundaries and return consistent, meaningful client errors without exposing internal exceptions.
- Use appropriate HTTP methods and status codes; keep API contracts and serialization behavior stable unless explicitly changing them.
- Order middleware correctly, especially authentication before authorization. Apply authentication and authorization policies explicitly to protected endpoints.

## Data access and messaging

- Keep database work asynchronous and propagate cancellation. Avoid loading entire tables or issuing per-row queries; project only required fields and use pagination for potentially large result sets.
- Use transactions for operations that must commit atomically. For event-driven workflows, use the repository's established outbox/idempotency patterns where applicable.
- Avoid retrying non-transient failures. Bound retries, use backoff, and consider timeouts and idempotency before retrying writes or message handling.
- Do not silently swallow exceptions or return success-shaped fallback values. Handle expected failures explicitly and preserve enough context for diagnosis.

## Configuration and security

- Use the options/configuration system for environment-specific settings. Keep secrets out of source control and logs; use the repository's established secret provider or environment configuration.
- Validate required configuration at startup where practical so failures are clear and early.
- Treat request data, headers, tokens, database values, and messages as untrusted. Enforce authorization at the server, not just in clients.
- Use HTTPS and secure authentication/token validation settings appropriate to the deployment. Do not disable certificate or token validation as a production workaround.
- Avoid logging credentials, access tokens, sensitive personal data, or full request bodies. Keep package versions and dependency changes scoped to the task.

## Resilience, logging, and operations

- Use structured logging with stable event messages and useful contextual identifiers; do not log-and-hide failures.
- Configure explicit timeouts for outbound network calls. Use bounded, policy-driven retries only for transient failures, and avoid retry multiplication across layers.
- Make background work cancellation-aware and ensure hosted services handle shutdown and failures deliberately.
- Expose health checks and diagnostic signals consistent with the service's deployment needs; do not report healthy when required dependencies are unavailable.

## Testing and verification

- Test behavior at the appropriate level: unit tests for isolated logic, integration tests for framework/data/messaging boundaries, and API tests for HTTP contracts.
- Cover validation failures, cancellation or error paths where relevant, and authorization boundaries for protected functionality.
- Keep tests deterministic: avoid real external services unless the test is explicitly an integration test, and clean up test-owned data/resources.
- Run the targeted tests and build for changed projects. Do not claim validation passed unless the command completed successfully.
