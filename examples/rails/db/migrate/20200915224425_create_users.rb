# frozen_string_literal: true

class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users, id: :uuid do |t|
      t.timestamps
      t.string :email, null: false
      t.string :name, null: false
      t.string :password_digest
    end
    add_index :users, :email, unique: true
  end
end
