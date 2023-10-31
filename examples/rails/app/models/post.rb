# frozen_string_literal: true

# == Schema Information
#
# Table name: posts
#
#  id         :uuid             not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  text       :string
#  parent_id  :uuid
#  author_id  :uuid
#
class Post < ApplicationRecord
  belongs_to :author, class_name: "User"
  belongs_to :parent, optional: true, class_name: "Post", touch: true

  has_many :comments, dependent: :destroy, foreign_key: :parent_id, class_name: "Post", inverse_of: :parent
  has_many :reactions, dependent: :destroy

  validates :text, presence: true

  scope :root, -> { where(parent: nil) }
end
