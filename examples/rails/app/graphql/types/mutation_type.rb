# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :create_user, mutation: Mutations::CreateUser
    field :delete_user, mutation: Mutations::DeleteUser
    field :log_in, mutation: Mutations::LogIn
    field :log_out, mutation: Mutations::LogOut
    field :update_user, mutation: Mutations::UpdateUser
  end
end
