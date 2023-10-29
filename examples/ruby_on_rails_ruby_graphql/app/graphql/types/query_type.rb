# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :users, [Types::UserType], null: false
    def users
      User.order(:name)
    end

    field :user, Types::UserType, null: false do
      argument :id, ID, required: false
      argument :email, String, required: false
    end
    def user(id: nil, email: nil)
      raise GraphQL::ExecutionError, "Must provide one of id or email" if [id, email].all?(&:blank?)

      users = User.all
      users.where!(id:) if id.present?
      users.where!(email:) if email.present?
      users.first || raise(GraphQL::ExecutionError, "User not found")
    end

    field :me, Types::UserType, null: true
    def me
      context[:current_api_session]&.user
    end

    field :posts, [Types::PostType], null: false
    def posts
      Post.root.order(created_at: :desc)
    end

    field :post, Types::PostType, null: false do
      argument :id, ID, required: true
    end
    def post(id:)
      Post.find_by(id:) || raise(GraphQL::ExecutionError, "Post not found")
    end
  end
end
