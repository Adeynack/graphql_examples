# frozen_string_literal: true

module Types
  class UserType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :posts, [PostType], null: false
    field :reactions, [ReactionType], null: false
  end
end
