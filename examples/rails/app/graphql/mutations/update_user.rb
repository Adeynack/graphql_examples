# frozen_string_literal: true

module Mutations
  class UpdateUser < BaseMutation
    argument :id, ID, required: true
    argument :email, String, required: false
    argument :name, String, required: false
    argument :password, String, required: false

    field :user, Types::UserType, null: false

    def resolve(id:, **)
      user = User.find_by(id:) || raise(GraphQL::ExecutionError, "User not found")
      user.update!(**)
      {user:}
    end
  end
end
