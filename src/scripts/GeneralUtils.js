import moment from "moment";

const DEFAULT_FORMAT = "YYYY-MM-DD"

function log(...args) {
    GeneralUtils.log("GeneralUtils", ...args)
}

class GeneralUtils {
    static log(_classname, ...args) {
        console.log(`${_classname}: `, ...args);
    }

    static dateToStringPromise(_date, _format) {
        return new Promise((resolve) => {
            resolve(GeneralUtils.dateToString(_date, _format))
        })
    }

    static todayDateStr(){
        return GeneralUtils.dateToString(new Date())
    }

    static dateToString(_date, _format) {
        log(`convert date ${_date} to format ${_format}`)
        if (_format === undefined) {
            return moment(_date).format(DEFAULT_FORMAT);
        }
        return moment(_date).format(_format);
    }

    static stringToDatePromise(_dateAsString, _format, _delimiter) {
        return new Promise((resolve) => {
            resolve(GeneralUtils.stringToDate(_dateAsString, _format, _delimiter))
        })
    }

    static stringToDate(_dateAsString, _format, _delimiter) {
        log("stringToDate", _dateAsString)
        if (_format === undefined) {
            return new Date(_dateAsString);
        }

        let formatLowerCase=_format.toLowerCase();
        let formatItems=formatLowerCase.split(_delimiter);
        let dateItems=_dateAsString.split(_delimiter);
        let monthIndex=formatItems.indexOf("mm");
        let dayIndex=formatItems.indexOf("dd");
        let yearIndex=formatItems.indexOf("yyyy");
        let month=parseInt(dateItems[monthIndex]);
        month-=1;
        return new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
    }
}

export default GeneralUtils
