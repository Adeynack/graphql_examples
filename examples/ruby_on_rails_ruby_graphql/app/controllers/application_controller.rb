# frozen_string_literal: true

class ApplicationController < ActionController::Base
  attr_reader :current_api_session
  before_action :set_current_api_session

  private

  def set_current_api_session
    token = request.headers["Authorization"]
    if token.present?
      return unless token.start_with?("Bearer ")
      token = token.delete_prefix("Bearer ")
    end

    # fall back to the session cookie, if no Authorization header is present
    token ||= session[:api_session_token]

    @current_api_session = token&.then { ApiSession.find_by(token: _1) }
  end
end
