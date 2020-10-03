# frozen_string_literal: true

module Types
  class ReactionType < Types::BaseObject
    field :id, ID, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :emotion, String, null: true
    field :post, Types::PostType, null: false
    field :user, Types::UserType, null: false

    def created_at
      object.updated_at # if a different emotion is selected, the existing entry is updated
    end
  end
end
