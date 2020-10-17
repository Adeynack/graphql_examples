# frozen_string_literal: true

module Mutations
  class DeleteUser < BaseMutation
    field :user, Types::UserType, null: false

    argument :id, ID, required: true

    def resolve(id:)
      user = User.find(id)
      # TODO: Make sure user is admin or is deleting himself
      user.destroy!
      { user: user }
    end
  end
end
