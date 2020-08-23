    var startDate,
        endDate,
        updateStartDate = function() {
            startPicker.setStartRange(startDate);
            endPicker.setStartRange(startDate);
            endPicker.setMinDate(startDate);
        },
        updateEndDate = function() {
            startPicker.setEndRange(endDate);
            startPicker.setMaxDate(endDate);
            endPicker.setEndRange(endDate);
        },
        startPicker = new Pikaday({
            field: document.getElementById('start'),
            minDate: new Date(2019, 10, 1),
            maxDate: new Date(2019, 11, 1),
            onSelect: function() {
                startDate = this.getDate();
                updateStartDate();
            },
            defaultDate: new Date(2019 ,10, 1),
            format: 'YYYYMMDD'
        }),
        endPicker = new Pikaday({
            field: document.getElementById('end'),
            minDate: new Date(2019, 10, 1),
            maxDate: new Date(2019, 11, 1),
            onSelect: function() {
                endDate = this.getDate();
                updateEndDate();
            },
            defaultDate: new Date(2019 ,10, 1),
            format: 'YYYYMMDD'

        }),
        _startDate = new Date(2019, 10, 1),
        _endDate = endPicker.getDate();

        if (_startDate) {
            startDate = _startDate;
            updateStartDate();
        }

        if (_endDate) {
            endDate = _endDate;
            updateEndDate();
        }
