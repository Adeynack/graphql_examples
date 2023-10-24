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
  has_many :posts, foreign_key: "author_id", dependent: :restrict_with_exception, inverse_of: :author
  has_many :reactions, dependent: :restrict_with_exception

  validates :email,
    presence: true,
    format: {with: /(.+)@(.+)/, message: "has invalid format"},
    uniqueness: {case_sensitive: false},
    length: {minimum: 4, maximum: 254}
  validates :name, presence: true

  class CreateNewSessionError < StandardError; end

  class << self
    def create_new_session(email:, password:, session:)
      user = User.find_by(email:) || raise(CreateNewSessionError, "User not found")
      raise(CreateNewSessionError, "Incorrect password") unless user.authenticate(password)

      api_session = user.api_sessions.create!

      # Set the user_id to the session to allow users of GraphiQL to log in (cookie-based)
      session[:api_session_token] = api_session.token

      api_session
    rescue
      session[:api_session_token] = nil
      raise
    end
  end
end
