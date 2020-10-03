# frozen_string_literal: true

class PostwallSchema < GraphQL::Schema
  mutation(Types::MutationType)
  query(Types::QueryType)

  # Opt in to the new runtime (default in future graphql-ruby versions)
  use GraphQL::Execution::Interpreter
  use GraphQL::Analysis::AST

  # Opt in to other options
  use GraphQL::Execution::Errors
  use GraphQL::Pagination::Connections
  use GraphQL::Batch

  # Handle general API Errors

  rescue_from(ActiveRecord::RecordNotFound) do |_err, _obj, _args, _ctx, field|
    raise GraphQL::ExecutionError, "#{field.type.unwrap.graphql_name} not found"
  end

  rescue_from(ActiveRecord::RecordInvalid) do |err, _obj, _args, _ctx, _field|
    raise GraphQL::ExecutionError, "Validation Error: #{err.record.errors.full_messages.join(', ')}"
  end

  rescue_from(::StandardError) do |err, _obj, _args, _ctx, _field|
    Rails.logger.error err.message
    Rails.logger.error err.backtrace.join("\n")

    Raven.capture_exception(err)

    raise GraphQL::ExecutionError, "The server encountered an unexpected condition that prevented it from fulfilling the request"
  end
end
