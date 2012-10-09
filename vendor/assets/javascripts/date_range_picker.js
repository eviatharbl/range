function dateRangePicker(containerId, attr) {
    var self = this;
    this.init = function (containerId, attr) {

        this.container = document.getElementById(containerId);
        this.callbacks = attr["callbacks"] || [];
        this.cookieName = attr["cookie_name"] || "date_range_picker_preset";
        this.startDateInputId = attr["start_date_input_id"];
        this.endDateInputId = attr["end_date_input_id"];

        this.loadPresets();

        this.render();

        if (!this.loadFromSession())
            this.setPreset(attr['default_preset'] == null ? "Last Month" : attr['default_preset']);
    };

    this.setRange = function (startDate, endDate) {
        this.setStartDate(startDate);
        this.setEndDate(endDate);
    };

    this.setStartDate = function (date) {

        this.startDate = (this.is_valid_date(date) ? new Date(date) : new Date());
        if (this.currentPreset == "Custom") {
            $("#" + this.container.id + " .start-date").val($.datepicker.formatDate('dd-mm-yy', this.startDate));
        } else
            $("#" + this.container.id + " .start-date").html($.datepicker.formatDate('M dd, yy', this.startDate));

    };

    this.setEndDate = function (date) {
        this.endDate = (this.is_valid_date(date) ? new Date(date) : new Date());
        if (this.currentPreset == "Custom")
            $("#" + this.container.id + " .end-date").val($.datepicker.formatDate('dd-mm-yy', this.endDate));
        else
            $("#" + this.container.id + " .end-date").html($.datepicker.formatDate('M dd, yy', this.endDate));
    };


    this.loadPresets = function () {
        this.presets = [];
        this.presets["Custom"] = new CustomPreset(this);
        this.presets["This month"] = new ThisMonthPreset(this);
        this.presets["Last Month"] = new LastMonthPreset(this);
        this.presets["2 Months Before"] = new TwoMonthsBeforePreset(this);
        this.presets["3 Months Before"] = new ThreeMonthsBeforePreset(this);
        this.presets["4 Months Before"] = new FourMonthsBeforePreset(this);
    };

    this.renderPresets = function () {
        var i = 0;

        for (var preset in this.presets) {
            var html = "<li class='preset" + i + "-" + containerId + (i == 0 ? ' border-under' : '') + "' data='" + preset + "'><a>" + this.presets[preset].getTitle() + "</a></li>";
            $("#" + this.container.id + " .dropdown-menu").append(html);
            $(".preset" + i + "-" + containerId).click(function () {
                self.setPreset($(this).attr('data'));
            });
            i++;
        }
    };

    this.getStartDate = function () {
        return this.startDate
    };

    this.getEndDate = function () {
        return this.endDate
    };


    this.setCustomFormat = function () {
        $("#" + this.container.id + " .text").html(
            '<table class="date-range-picker-custom"><tr><td>' +
                '<input id="' + this.container.id + '_start_date_field" type="text" name="range-picker-start-date" class="start-date range-date-picker-field date-picker">' +
                '<span> - </span>' +
                '<input id="' + this.container.id + '_end_date_field" type="text" name="range-picker-end-date" class="end-date range-date-picker-field date-picker">' +
                '<input type="button" value="Go" class="go-button"/>' +
                '</td></tr></table>'
        );


        $("#" + this.container.id + '_start_date_field').datepicker({
            dateFormat:"dd-mm-yy",
            maxDate: self.getEndDate(),
            onSelect:function (selectedDate) {
                $("#" + self.container.id + '_end_date_field').datepicker("option", "minDate", selectedDate);
            }
        });

        $("#" + this.container.id + '_end_date_field').datepicker({
            dateFormat:"dd-mm-yy",
            minDate: self.getStartDate(),
            onSelect:function (selectedDate) {
                $("#" + self.container.id + '_start_date_field').datepicker("option", "maxDate", selectedDate);
            }
        });

        $('#' + this.container.id + '_start_date_field').datepicker("setDate", this.getStartDate());
        $('#' + this.container.id + '_end_date_field').datepicker("setDate", this.getEndDate());

        $(".range-date-picker-field").bind('click', false);

        $(".go-button").bind('click', false);
        $(".date-picker").focus(function () {
            $(".date-range-picker").removeClass("open")
        });

        $(".go-button").click(
            function () {
                self.setStartDate($.datepicker.parseDate("dd-mm-yy", $('#' + self.container.id + '_start_date_field').val()));
                self.setEndDate($.datepicker.parseDate("dd-mm-yy", $('#' + self.container.id + '_end_date_field').val()));
                self.applyPreset()
            });
    };

    this.setPresetFormat = function (title) {
        $("#" + this.container.id + " .text").html(
            '<span class="title">' + title + '</span><br>' +
                '<span class="dates"><span class="start-date"></span> - <span class="end-date"></span></span>'
        );
    };

    this.render = function () {

        var obj = $("#" + this.container.id);
        obj.addClass("btn-group date-range-picker");
        obj.append(
            '<a class="btn text" href="#"  data-toggle="dropdown" ></a>' +
                '<a class="btn dropdown-btn" data-toggle="dropdown" href="#"><span class="caret"></span></a>' +
                '<ul class="dropdown-menu"></ul>'
        );

        this.renderPresets();
    };


    this.setPreset = function (preset) {
        this.currentPreset = preset;
        if (preset == "Custom")
            this.setCustomFormat();
        else
            this.setPresetFormat(this.presets[preset].getTitle());
        this.presets[preset].apply();
        if (preset != "Custom") {
            this.applyPreset();
        }
    };


    this.applyPreset = function () {
        this.saveToSession();
        this.setExternalFormData();
        this.invokeCallbacks();
    };


    this.setExternalFormData = function () {
        if (this.startDateInputId != null)
            $("#" + this.startDateInputId).val($.datepicker.formatDate("dd-mm-yy", this.getStartDate()));
        if (this.endDateInputId != null)
            $("#" + this.endDateInputId).val($.datepicker.formatDate("dd-mm-yy", this.getEndDate()));
    };


    this.invokeCallbacks = function () {
        for (var callbackMethod in this.callbacks) {
            if (typeof window[this.callbacks[callbackMethod]] == 'function')
                f = window[this.callbacks[callbackMethod]]
            else if (typeof this.callbacks[callbackMethod] == 'function')
                f = this.callbacks[callbackMethod]
            else {
                f = eval(this.callbacks[callbackMethod]);
            }
            f(this.getStartDate(), this.getEndDate(), this);
        }
    };


    this.saveToSession = function () {
        var cookie = {};
        cookie.preset = this.currentPreset;
        cookie.startDate = this.startDate;
        cookie.endDate = this.endDate;
        setCookie(this.cookieName, JSON.stringify(cookie));
    };

    this.loadFromSession = function () {
        var cookie = eval('(' + getCookie(this.cookieName) + ')');
        if (cookie == null || cookie.preset == null)
            return false;

        this.setStartDate(cookie.startDate);
        this.setEndDate(cookie.endDate);
        this.setPreset(cookie.preset);
        if (this.currentPreset == "Custom")
            this.applyPreset();
        return true;
    };

    this.is_valid_date = function (date) {
        var d = new Date(date);
        if (Object.prototype.toString.call(d) !== "[object Date]")
            return false;
        return !isNaN(d.getTime());
    };

    this.init(containerId, attr);

    // presets
    function CustomPreset(obj) {
        this.getTitle = function () {
            return "Custom";

        };
        this.apply = function () {

        };

    }

    function LastMonthPreset(obj) {
        this.getTitle = function () {
            return theMonthBeforeXMonthsName(obj, 1);
        };
        this.apply = function () {
            theMonthBeforeXMonths(obj, 1);
        };
    }

    function TwoMonthsBeforePreset(obj) {
        this.getTitle = function () {
            return theMonthBeforeXMonthsName(obj, 2);
        };
        this.apply = function () {
            theMonthBeforeXMonths(obj, 2);
        };
    }


    function ThreeMonthsBeforePreset(obj) {
        this.getTitle = function () {
            return theMonthBeforeXMonthsName(obj, 3);
        };
        this.apply = function () {
            theMonthBeforeXMonths(obj, 3);
        };
    }


    function FourMonthsBeforePreset(obj) {
        this.getTitle = function () {
            return theMonthBeforeXMonthsName(obj, 4);
        };
        this.apply = function () {
            theMonthBeforeXMonths(obj, 4);
        };
    }


    function LastThreeMonthsPreset(obj) {
        this.getTitle = function () {
            return "Last 3 months";
        };
        this.apply = function () {
            lastXMonths(obj, 3);
        };
    }

    function ThisMonthPreset(obj) {
        this.getTitle = function () {
            return "This month";
        };
        this.apply = function () {
            obj.setStartDate((new Date().setDate(1)));
            obj.setEndDate(new Date());

        };
    }

    function lastXMonths(obj, months) {
        var now = new Date();
        var lastMonth = ((now.getMonth() - months ) % 12);
        obj.setStartDate(new Date(now.getFullYear(), lastMonth, 1));
        obj.setEndDate(new Date(now.getFullYear(), lastMonth + months, 0));
    }

    function theMonthBeforeXMonths(obj, x) {
        var now = new Date();
        var lastMonth = ((now.getMonth() - x ) % 12);
        obj.setStartDate(new Date(now.getFullYear(), lastMonth, 1));
        obj.setEndDate(new Date(now.getFullYear(), lastMonth + 1, 0));
    }

    function theMonthBeforeXMonthsName(obj, x) {
        d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - x);
        return d.toString("MMMM");
    }

    // cookies
    function setCookie(cookieName, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = encodeURI(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = cookieName + "=" + c_value;
    }

    function getCookie(cookieName) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == cookieName) {
                return decodeURI(y);
            }
        }
        return null;
    }
}
