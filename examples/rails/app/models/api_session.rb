# frozen_string_literal: true

# == Schema Information
#
# Table name: sessions
#
#  id         :uuid             not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :uuid             not null
#  token      :string           not null
#
class ApiSession < ApplicationRecord
  belongs_to :user

  before_validation :ensure_token

  private

  def ensure_token
    self.token = SecureRandom.base64(64) if token.blank?
  end
end
