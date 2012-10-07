require "app/helpers/date_range_picker_helper.rb"
module DateRangePicker
  ActionController::Base.helper(DateRangePicker::DateRangePickerHelper)
  puts "ok"
end
