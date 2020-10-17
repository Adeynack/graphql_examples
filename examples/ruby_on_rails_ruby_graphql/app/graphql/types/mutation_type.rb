# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :logout, mutation: Mutations::Logout
    field :login, mutation: Mutations::Login
    field :delete_user, mutation: Mutations::DeleteUser
    field :update_user, mutation: Mutations::UpdateUser
    field :create_user, mutation: Mutations::CreateUser
  end
end
