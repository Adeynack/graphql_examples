# frozen_string_literal: true

module Types
  class PostType < Types::BaseObject
    field :id, ID, null: false
    field :author_id, Types::UuidType, null: false
    field :parent_id, Types::UuidType, null: true
    field :text, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :comment, [MessageType], null: false
    field :reactions, [ReactionType], null: false
  end
end
