# frozen_string_literal: true

module EnumerableRefinements
  # TODO: Apply refinements to all `Enumerable`

  refine Hash do
    def deep_presence
      deep_presence_element(self)
    end

    private

    def deep_presence_element(element)
      case element
      when Hash
        element = element
          .transform_values { |e| deep_presence_element(e) }
          .compact
      when Array || Set
        element = element
          .map { |e| deep_presence_element(e) }
          .compact
      end
      element.presence
    end
  end
end
