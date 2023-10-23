# frozen_string_literal: true

# == Schema Information
#
# Table name: reactions
#
#  id         :uuid             not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  emotion    :string
#  post_id    :uuid             not null
#  user_id    :uuid             not null
#
class Reaction < ApplicationRecord
  belongs_to :post
  belongs_to :user

  enum emotion: ["like", "dislike", "love", "laugh", "cry", "wow"].index_by(&:itself)
end
