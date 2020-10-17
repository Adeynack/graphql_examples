# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    using EnumerableRefinements

    field :users, [Types::UserType], null: false
    def users
      User.all
    end

    field :user, Types::UserType, null: false do
      argument :id, ID, required: false
      argument :email, String, required: false
    end
    def user(id: nil, email: nil)
      identification = {
        id: id,
        email: email
      }.deep_presence
      raise GraphQL::ExecutionError, "An ID or an email is require to identify a user" if identification.blank?

      User.find_by identification
    end

    field :posts, [Types::PostType], null: false
    def posts
      Post.order(created_at: :desc)
    end

    field :post, Types::PostType, null: false do
      argument :id, ID, required: true
    end
    def post(id:)
      Post.find(id)
    end
  end
end
