# frozen_string_literal: true

module Mutations
  class UpdateUser < BaseMutation
    field :user, Types::UserType, null: false

    argument :id, ID, required: true
    argument :email, String, required: false
    argument :name, String, required: false
    argument :password, String, required: false

    def resolve(id:, **args)
      user = User.find(id)
      # TODO: Ensure user is admin or updating himself
      user.update! args
      { user: user }
    end
  end
end
