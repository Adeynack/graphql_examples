# frozen_string_literal: true

module Mutations
  class Login < BaseMutation
    field :user, Types::UserType, null: true

    argument :email, String, required: true
    argument :password, String, required: true

    def resolve(email:, password:)
      user = User.find_by(email: email)&.authenticate(password) || nil
      login!(user) if user
      { user: user }
    end
  end
end
