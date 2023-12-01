# frozen_string_literal: true

class DataResetsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    system "bin/rails db:truncate_all db:fixtures:load"
    render html: "OK\n"
  end
end
