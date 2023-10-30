# frozen_string_literal: true

module Types
  class UserType < Types::BaseObject
    field :id, ID, null: false
    field :email, String, null: false
    field :name, String, null: false
    field :posts, [Types::PostType], null: false
    field :reactions, [Types::ReactionType], null: false
  end
end
