# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :log_in, mutation: Mutations::LogIn
  end
end
