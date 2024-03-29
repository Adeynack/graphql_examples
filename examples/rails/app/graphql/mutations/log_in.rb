# frozen_string_literal: true

module Mutations
  class LogIn < BaseMutation
    argument :email, String, required: true
    argument :password, String, required: true

    field :token, String, null: false
    field :user, Types::UserType, null: false

    def authorized?(**args)
      true
    end

    def resolve(email:, password:)
      api_session = User.create_new_session(
        email:,
        password:,
        rails_session: context[:session],
        current_api_session: context[:current_api_session]
      )
      {token: api_session.token, user: api_session.user}
    rescue User::CreateNewSessionError => e
      raise GraphQL::ExecutionError, e.message
    end

    private

    def fail_with_message(message, user: nil)
      context[:session][:user_id] = nil
      raise GraphQL::ExecutionError, message
    end
  end
end
