# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    using EnumerableRefinements

    field :users, [Types::UserType], null: false
    def users
      User.all
    end

    field :user, Types::UserType, null: false, description: "A specific user, identified either by its ID or by its Email address." do
      argument :id, ID, required: false
      argument :email, String, required: false
    end
    def user(id: nil, email: nil)
      identification = {
        id: id,
        email: email
      }.deep_presence
      raise GraphQL::ExecutionError, "An ID or an email is require to identify a user" unless identification&.count == 1

      User.find_by identification
    end

    field :me, Types::UserType, null: true, description: "The user currently logged in, or Null if not logged in."
    def me
      current_user
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
