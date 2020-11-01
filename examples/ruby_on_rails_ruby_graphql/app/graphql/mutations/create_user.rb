# frozen_string_literal: true

module Mutations
  class CreateUser < BaseMutation
    field :user, Types::UserType, null: false

    argument :email, String, required: true
    argument :name, String, required: true
    argument :password, String, required: true

    def resolve(email:, name:, password:)
      user = User.create! email: email,
                          name: name,
                          password: password
      {
        user: user
      }
    end
  end
end
