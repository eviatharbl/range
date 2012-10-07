require "app/helpers/date_range_picker_helper.rb"
module DateRangePicker
  ActionController::Base.helper(DateRangePicker::DateRangePickerHelper)

  module Rails
    class Engine < ::Rails::Engine
      # Rails, will you please look in our vendor? thx
    end
  end

  base = File.join(File.dirname(__FILE__), '..')
  styles = File.join(base, 'vendor', 'assets', 'stylesheets')
  templates = File.join(base, 'templates')
  ::Compass::Frameworks.register('bootstrap', :stylesheets_directory => styles, :templates_directory => templates)
  puts "o-k"
end
