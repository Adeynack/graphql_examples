# frozen_string_literal: true

module Mutations
  class CreateUser < BaseMutation
    argument :email, String, required: true
    argument :name, String, required: true
    argument :password, String, required: true

    field :user, Types::UserType, null: false

    def resolve(email:, name:, password:)
      user = User.create!(email:, name:, password:)

      {user:}
    end
  end
end
