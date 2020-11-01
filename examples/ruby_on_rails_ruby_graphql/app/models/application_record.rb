# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  class << self
    def enum_a(name_to_values)
      raise ArgumentError, "expecting one key-value" unless name_to_values.count == 1

      name, values = name_to_values.first
      values_hash = values.map { |e| [e.to_sym, e.to_s] }.to_h
      enum name => values_hash
    end
  end
end
