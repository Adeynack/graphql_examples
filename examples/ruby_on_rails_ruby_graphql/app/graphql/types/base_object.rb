# frozen_string_literal: true

module Types
  class BaseObject < GraphQL::Schema::Object
    field_class Types::BaseField

    protected

    def session
      context[:session]
    end

    def current_user
      context[:current_user]
    end

    def current_user!
      current_user || raise(GraphQL::ExecutionError, "Not Authenticated")
    end
  end
end
