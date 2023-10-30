# frozen_string_literal: true

module Types
  class PostType < Types::BaseObject
    field :id, ID, null: false
    field :author, Types::UserType, null: false
    field :parent, Types::PostType, null: true
    field :text, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :reactions, [Types::ReactionType], null: false

    field :comments, [Types::PostType], null: false
    def comments
      object.comments.order(created_at: :asc)
    end
  end
end
