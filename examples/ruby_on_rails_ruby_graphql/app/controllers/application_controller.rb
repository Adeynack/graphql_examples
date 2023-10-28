# frozen_string_literal: true

class ApplicationController < ActionController::Base
  attr_reader :current_api_session
  before_action :set_current_api_session

  private

  def set_current_api_session
    puts "\n\n==== set_current_api_session ========================".purple
    @current_api_session = nil
    session_used = false

    token = request.headers["Authorization"].presence
    puts "token from headers: #{token}".purple
    if token
      return fail_from_invalid_token(session_used:) unless token.start_with?("Bearer ") # not a bearer token? fail
      token = token.delete_prefix("Bearer ")
    else
      # fall back to the session cookie, if no Authorization header is present
      token = session[:api_session_token].presence
      puts "token from session: #{token}".purple
      return unless token # no token, no session, carry on
      session_used = true
    end

    @current_api_session = ApiSession.find_by(token:)
    ap @current_api_session
    fail_from_invalid_token(session_used:) unless @current_api_session
  ensure
    puts "==== [END] set_current_api_session ========================\n\n".purple
  end

  def fail_from_invalid_token(session_used:)
    puts "fail from invalid token // session_used: #{session_used}".red
    session.delete(:api_session_token) if session_used
    render json: {status: 401, title: "Invalid bearer token"}, status: :unauthorized
  end
end
