# frozen_string_literal: true

module Mutations
  class DeleteUser < BaseMutation
    argument :id, ID, required: true

    def resolve(id:)
      user = User.find_by(id:) || raise(GraphQL::ExecutionError, "User not found")
      user.destroy!
      {}
    end
  end
end
