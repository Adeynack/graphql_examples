# frozen_string_literal: true

module Mutations
  class LogOut < BaseMutation
    def resolve
      context[:current_api_session]&.destroy!
      {}
    end
  end
end
