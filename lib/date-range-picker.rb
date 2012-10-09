require "app/helpers/date_range_picker_helper.rb"
module DateRangePicker
  ActionController::Base.helper(DateRangePicker::DateRangePickerHelper)

  module Rails
    class Engine < ::Rails::Engine
      # Add vendor assets to the application assets
    end
  end
end
