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

  has_many :posts, dependent: :restrict_with_exception, inverse_of: :author
  has_many :likes, dependent: :restrict_with_exception

  validates :email, presence: true
  validates :name, presence: true
end
