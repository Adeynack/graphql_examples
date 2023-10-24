# frozen_string_literal: true

module Types
  class EmotionType < Types::BaseEnum
    description "Different emotions a user can have about a post or comment"
    value "LIKE", "User likes", value: "like"
    value "DISLIKE", "User dislikes", value: "dislike"
    value "LOVE", "User loves", value: "love"
    value "LAUGH", "User laughs", value: "laugh"
    value "CRY", "User cries", value: "cry"
    value "WOW", "User is impressed", value: "wow"
  end
end
