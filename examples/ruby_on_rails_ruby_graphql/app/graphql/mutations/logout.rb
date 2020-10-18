# frozen_string_literal: true

module Mutations
  class Logout < BaseMutation
    def resolve
      session[:user_id] = nil
      {}
    end
  end
end
