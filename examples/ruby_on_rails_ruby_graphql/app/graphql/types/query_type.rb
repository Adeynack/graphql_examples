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
      nil # TODO
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

    ############################################################################
    # Auto-Generated Extra Stuff. Commented for the moment.
    ############################################################################

    # field :node, Types::NodeType, null: true, description: "Fetches an object given its ID." do
    #   argument :id, ID, required: true, description: "ID of the object."
    # end

    # def node(id:)
    #   context.schema.object_from_id(id, context)
    # end

    # field :nodes, [Types::NodeType, null: true], null: true, description: "Fetches a list of objects given a list of IDs." do
    #   argument :ids, [ID], required: true, description: "IDs of the objects."
    # end

    # def nodes(ids:)
    #   ids.map { |id| context.schema.object_from_id(id, context) }
    # end
  end
end
