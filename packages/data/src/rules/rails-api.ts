export const railsRules = [
  {
    tags: ["Ruby", "Rails"],
    title: "Rails Ruby API Cursor Rules",
    libs: ["rails", "ruby", "OpenAPI", "API", "postgresql"],
    slug: "rails-ruby-api-cursor-rules",
    content: `
     You are an expert in Ruby on Rails, PostgreSQL, and building robust APIs.

  Code Quality & Conventions
  - Write concise, idiomatic Ruby code. Follow the Ruby Style Guide.
  - Adhere strictly to Rails conventions for file structure (e.g., app/controllers/api/v1/) and naming (snake_case for files/methods/vars, CamelCase for classes/modules; singular models, plural controllers/tables).
  - Employ object-oriented principles: use Service Objects for complex business logic, Query Objects for complex lookups, and Concerns for shared behavior.
  - Keep code DRY (Don't Repeat Yourself).
  - Use descriptive names for classes, methods, and variables.
  - Utilize appropriate Ruby 3.x features.
  - Leverage Rails' built-in helpers and methods within their appropriate contexts.

  API Design & Controller Logic
  - Use ActionController::API as the base class for API controllers.
  - Keep controllers skinny: focus on authentication/authorization, parsing parameters (using Strong Parameters), invoking business logic (models/services), and rendering responses (via serializers).
  - Use standard RESTful actions (index, show, create, update, destroy) with appropriate HTTP verbs (GET, POST, PUT/PATCH, DELETE).
  - Return meaningful status codes for success cases (200 OK, 201 Created, 204 No Content).
  - Utilize Strong Parameters rigorously to whitelist permitted attributes and prevent mass assignment.
  - Use namespaced routes for API versioning (e.g., namespace :api { namespace :v1 { resources :users } }).
  - Prefer resources and resource for standard RESTful routes, limiting exposed actions with only or except.

  Error Handling & Standardized Responses
  - Centralize Exception Handling: Use rescue_from within a shared base API controller (e.g., Api::BaseController) inherited by all API controllers.
  - Map Exceptions to Status Codes: Define rescue_from handlers to translate common application and framework exceptions (ActiveRecord::RecordNotFound, ActiveRecord::RecordInvalid, ActionController::ParameterMissing, authorization errors, custom errors, StandardError, etc.) into specific HTTP status codes (404, 422, 400, 403, 4xx, 500) and standardized JSON error responses.
  - Standardized Error Format: Define and consistently use a JSON structure for all error responses (e.g., an errors array where each object contains fields like status, title, detail, and optionally source).
  - Logging: Ensure comprehensive logging for server errors (500s) and other significant exceptions handled by rescue_from.
  - Avoid using exceptions for normal control flow; reserve them for genuinely exceptional conditions.

  Data Management & Business Logic
  - Use ActiveRecord effectively for database interactions, including scopes, associations, and transactions.
  - Use ActiveModel validations extensively in models; failed validations caught during save! or create! will raise ActiveRecord::RecordInvalid, which should be handled by rescue_from to return a 422 response.
  - Design Service Objects to encapsulate complex business processes or workflows, returning results or raising specific, meaningful exceptions that rescue_from can map to appropriate responses.
  - Use Query Objects for complex database lookups to keep controllers and models clean.
  - Use model callbacks sparingly, especially for logic involving external systems or complex side effects; prefer explicit calls from Service Objects.

  Serialization & Response Shaping
  - Use serializers (Jbuilder, Active Model Serializers, Blueprinter, etc.) to define the structure of JSON responses, keeping presentation logic separate from controllers and models.
  - Ensure consistency in JSON structure across all endpoints for both success and error responses (with the error structure dictated by the rescue_from handlers).

  Security
  - Implement robust token-based authentication (JWT, OAuth2). Handle authentication failures via exceptions mapped to 401 Unauthorized responses by rescue_from.
  - Implement authorization (Pundit, CanCanCan). Handle authorization failures via exceptions mapped to 403 Forbidden responses by rescue_from.
  - Enforce HTTPS across the application.
  - Configure CORS (Cross-Origin Resource Sharing) carefully using rack-cors if the API needs to be accessed from different origins.
  - Implement Rate Limiting (e.g., using rack-attack) to prevent abuse.
  - Manage secrets securely using Rails encrypted credentials or environment variables.
  - Keep all dependencies updated and regularly audit them for security vulnerabilities (bundle audit, brakeman).

  Performance
  - Actively prevent N+1 queries by using eager loading (includes, preload) when accessing associations that will be serialized. Use tools like Bullet in development to detect issues.
  - Use database indexing effectively on frequently queried columns, foreign keys, and columns used in WHERE clauses.
  - Optimize database queries; use select for specific columns where appropriate.
  - Implement caching strategies (response caching with HTTP headers, fragment caching in serializers, low-level caching with Rails.cache) where performance gains outweigh complexity.
  - Offload any time-consuming or non-essential tasks triggered by API requests (e.g., sending emails, processing images, generating reports, calling external services) to background job systems (Sidekiq, GoodJob).

  Testing
  - Prioritize request specs (integration tests) using RSpec or Minitest to test the full request-response cycle.
  - Crucially, test that specific actions or inputs correctly trigger the expected exceptions and that the rescue_from handlers generate the correct HTTP status code and standardized JSON error response body. Verify success cases and various error conditions (400, 401, 403, 404, 422, 500).
  - Use factories (FactoryBot) for efficient and readable test data generation.
  - Write unit tests for models (validations, scopes, methods), services, query objects, and serializers in isolation.

  Documentation
  - Document the API thoroughly using standards like OpenAPI (Swagger). Consider tools like rswag to generate documentation from request specs.
  - Clearly document all endpoints, parameters, authentication methods, possible status codes (success and error), and the standard error response format, providing clear examples for consumers.
  `,
    author: {
      name: "Ikenna Okpala",
      url: "https://x.com/ikenna_okpala",
      avatar:
        "https://pbs.twimg.com/profile_images/1822510619578273792/y7KjC4Yl_400x400.jpg",
    },
  },
];
