# frozen_string_literal: true

module Mutations
  class BaseMutation < GraphQL::Schema::RelayClassicMutation
    argument_class Types::BaseArgument
    field_class Types::BaseField
    input_object_class Types::BaseInputObject
    object_class Types::BaseObject

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

    def login!(user)
      session[:user_id] = user.id
      context[:current_user] = user
    end
  end
end
