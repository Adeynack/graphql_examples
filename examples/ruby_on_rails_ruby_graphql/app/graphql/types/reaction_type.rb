# frozen_string_literal: true

module Types
  class ReactionType < Types::BaseObject
    field :id, ID, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :emotion, String, null: true
    field :post_id, Types::UuidType, null: false
    field :user_id, Types::UuidType, null: false
  end
end
