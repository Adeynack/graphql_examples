# frozen_string_literal: true

module Mutations
  class DeleteUser < BaseMutation
    field :user, Types::UserType, null: false

    argument :id, ID, required: true

    def resolve(id:)
      user = User.find_by(id: id) || raise(GraphQL::ExecutionError, "no user found with ID #{id}")
      user.destroy!
      { user: user }
    end
  end
end
