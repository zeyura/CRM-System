export default function dateFilter(val, format = 'date') {
    // format = 'date' or 'time' or 'datetime'

    // https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat

    const options = {};

    if(format.includes('date')) {
        options.day    = '2-digit'; // "numeric" и "2-digit"
        options.month  = 'long';    //  "numeric", "2-digit", "narrow", "short" и "long".
        options.year   = 'numeric'; //  "numeric" и "2-digit"
    }

    if(format.includes('time')) {
        options.hour    = '2-digit'; // "numeric" и "2-digit"
        options.minute  = '2-digit'; // "numeric" и "2-digit"
        options.second  = '2-digit'; // "numeric" и "2-digit"
    }
    //
    // для datetime сработают оба if

    return new Intl.DateTimeFormat('ru-RU', options).format(new Date(val));
}
