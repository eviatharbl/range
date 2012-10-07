require "app/helpers/date_range_picker_helper.rb"
module DateRangePicker
  ActionController::Base.helper(DateRangePicker::DateRangePickerHelper)

  #module Rails
  #  class Engine < ::Rails::Engine
  #    # Rails, will you please look in our vendor? thx
  #  end
  #end

end
