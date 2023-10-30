# frozen_string_literal: true

module Types
  class ReactionType < Types::BaseObject
    field :id, ID, null: false
    field :emotion, EmotionType, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :post, Types::PostType, null: false
    field :user, Types::UserType, null: false
  end
end
