import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import range from 'lodash/range';

const years = range(2010, moment().year() + 1, 1);
const months = moment.months();

const CalendarHeader = ({
    date,
    changeMonth,
    changeYear,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
}) => {
    const prevMonthButtonClick = event => {
        decreaseMonth(event);
        event.target.blur();
    };

    const nextMonthButtonClick = event => {
        increaseMonth(event);
        event.target.blur();
    };

    const onMonthChange = ({ target }) => {
        const { value } = target;
        changeMonth(value);
        target.blur();
    };

    const onYearChange = ({ target }) => {
        const { value } = target;
        changeYear(value);
        target.blur();
    };

    return (
        <div
            style={{
                margin: '0 12px',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <button
                type="button"
                className="react-datepicker__navigation react-datepicker__navigation--previous"
                onClick={prevMonthButtonClick}
                disabled={prevMonthButtonDisabled}
                style={{
                    top: '14px',
                }}
            />
            <select
                value={months[date.month()]}
                onChange={onMonthChange}
                style={{
                    fontWeight: 'bold',
                    width: '92px',
                    padding: '.5em .5em',
                }}
            >
                {months.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <select
                value={date.year()}
                onChange={onYearChange}
                style={{
                    fontWeight: 'bold',
                    width: '60px',
                    padding: '.5em .5em',
                }}
            >
                {years.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <button
                type="button"
                className="react-datepicker__navigation react-datepicker__navigation--next"
                onClick={nextMonthButtonClick}
                disabled={nextMonthButtonDisabled}
                style={{
                    top: '14px',
                }}
            />
        </div>
    );
};

CalendarHeader.propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    changeMonth: PropTypes.func.isRequired,
    changeYear: PropTypes.func.isRequired,
    decreaseMonth: PropTypes.func.isRequired,
    increaseMonth: PropTypes.func.isRequired,
    prevMonthButtonDisabled: PropTypes.bool.isRequired,
    nextMonthButtonDisabled: PropTypes.bool.isRequired,
};
export default CalendarHeader;
