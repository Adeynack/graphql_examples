# frozen_string_literal: true

class CreatePosts < ActiveRecord::Migration[6.0]
  def change
    create_table :posts, id: :uuid do |t|
      t.timestamps
      t.string :text
      t.references :parent, null: true, foreign_key: { to_table: :posts }, type: :uuid
      t.references :author, foreign_key: { to_table: :users }, type: :uuid
    end
  end
end
