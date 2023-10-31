# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id              :uuid             not null, primary key
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  email           :string           not null
#  name            :string           not null
#  password_digest :string
#
class User < ApplicationRecord
  has_secure_password

  has_many :api_sessions, dependent: :delete_all
  has_many :posts, foreign_key: "author_id", dependent: :destroy, inverse_of: :author
  has_many :reactions, dependent: :destroy

  validates :email,
    presence: true,
    format: {with: /(.+)@(.+)/, message: "has invalid format"},
    uniqueness: {case_sensitive: false},
    length: {minimum: 4, maximum: 254}
  validates :name, presence: true

  class CreateNewSessionError < StandardError; end

  class << self
    def create_new_session(email:, password:, rails_session:, current_api_session:)
      user = User.find_by(email:) || raise(CreateNewSessionError, "User not found")
      raise(CreateNewSessionError, "Incorrect password") unless user.authenticate(password)

      # if the request is already authenticated by bearer token, `current_api_session` is already set.
      # otherwise, if the token of the current session is still valid, use the same session (do not create a new one for nothing)
      current_api_session ||= rails_session[:api_session_token].presence&.then { |token| user.api_sessions.find_by(token:) }
      # otherwise, create a new session
      current_api_session ||= user.api_sessions.create!

      # Set the user_id to the session to allow users of GraphiQL to log in (cookie-based)
      rails_session[:api_session_token] = current_api_session.token

      current_api_session
    rescue
      rails_session[:api_session_token] = nil
      raise
    end
  end
end
