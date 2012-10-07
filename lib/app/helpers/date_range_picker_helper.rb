module DateRangePicker
  module DateRangePickerHelper

    puts "no self"

    def date_range_picker(attr = {})
      random_num = Random.rand(10000...99999);
      range_picker_id = attr[:range_picker_id] || "date-range-picker-"+random_num.to_s;
      range_picker_obj_name = attr[:js_obj_name] || "dataRangePicker"+random_num.to_s;
      html = '<div class="' + (attr[:class] || '') + '" id="'+range_picker_id+'" ></div>';
      html += javascript_tag(
          "$().ready(
          function () {
            #{range_picker_obj_name} = new dateRangePicker(
              '#{range_picker_id}',"+ActiveSupport::JSON.encode(attr)+")
          });");

      html.html_safe
    end
  end
end
