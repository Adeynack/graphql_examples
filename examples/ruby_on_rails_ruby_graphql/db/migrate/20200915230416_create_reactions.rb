# frozen_string_literal: true

class CreateReactions < ActiveRecord::Migration[6.0]
  def change
    create_table :reactions, id: :uuid do |t|
      t.timestamps
      t.string :emotion
      t.references :post, null: false, foreign_key: true, type: :uuid
      t.references :user, null: false, foreign_key: true, type: :uuid
    end

    add_index :reactions, [:post_id, :user_id], unique: true
  end
end
