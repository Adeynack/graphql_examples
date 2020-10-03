# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :users, [UserType], null: false
    def users
      User.all
    end

    field :user, UserType, null: false do
      parameter id, ID, null: false
    end
    def user(id:)
      User.find(id)
    end

    field :posts, [PostType], null: false
    def posts
      Post.order(created_at: :desc)
    end

    field :post, PostType, null: false do
      parameter :id, ID, null: false
    end
    def post(id:)
      Post.find(id)
    end
  end
end
