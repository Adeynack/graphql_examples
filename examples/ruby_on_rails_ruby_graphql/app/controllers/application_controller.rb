# frozen_string_literal: true

class ApplicationController < ActionController::Base
  attr_reader :current_api_session
  before_action :set_current_api_session

  private

  def set_current_api_session
    @current_api_session = nil

    token = request.headers["Authorization"]
    if token.present?
      return unless token.start_with?("Bearer ")
      token = token.delete_prefix("Bearer ")
    end

    # fall back to the session cookie, if no Authorization header is present
    token ||= session[:api_session_token].presence
    if token.present?
      @current_api_session = ApiSession.find_by(token:)
      render json: {status: 401, title: "Invalid bearer token"}, status: :unauthorized unless @current_api_session
    end
  end
end
