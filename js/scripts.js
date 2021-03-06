var weather;

// execute when the DOM is fully loaded
$(function() {

    // Get location
    $.getJSON('http://ip-api.com/json')
    .done(function(data) {
        // set location
        $('#location').html(data.city + ', ' + data.region);
        // update weather
        updateWeather(data);
    })
    .fail(function(response){
        console.log('failed location');
    })

    // bind changeUnits to click event
    $('#temp-unit').click(changeUnits);

}); // end document ready function

/**
 * Updates weather and forecast
 */
function updateWeather(position) {
    var apiKey = '465cab54ef44142a5931314ebe072540';

    var url = 'https://api.darksky.net/forecast/' + apiKey + '/' +
              position.lat + ',' +
              position.lon;

    var parameters = {
        url: url,
        dataType: 'jsonp'
    };
    $.getJSON(parameters)
    .done(function(data) {

        // Update current weather
        updateCurrent(data);

        // Update 6 day forecast
        updateForecast(data);

    }) // end success function

    .fail(function() {
        console.log("failed")
    });

} // end updateWeather function

/**
 * Updates current weather
 */
function updateCurrent(data) {
    // Get current weather data
    weather = {
        current: {
            tempF: Math.round(data.currently.temperature),
            tempFmin: Math.round(data.daily.data[0].temperatureMin),
            tempFmax: Math.round(data.daily.data[0].temperatureMax)
        }
    };

    // set current data
    $('#temp').html(weather.current.tempF + ' &deg;F');
    $('#icon').html(getIcon(data.currently.icon));
    $('body').addClass(getBackground(data.currently.icon));
}

function updateForecast(data) {
    // Get next 6 day data
    var temps = [],
        icons = [];

    weather.forecast = {
        tempMaxF: [],
        tempMinF: []
    }
    for (var i = 0; i < 6; i++) {
        weather.forecast.tempMaxF.push(Math.round(data.daily.data[i+1].temperatureMax));
        weather.forecast.tempMinF.push(Math.round(data.daily.data[i+1].temperatureMin));

        temps[i] = weather.forecast.tempMaxF[i].toString() + '/' +
                   weather.forecast.tempMinF[i].toString() + ' &deg;F';

        icons[i] = getIcon(data.daily.data[i+1].icon);
    }

    // Set next 6 day data
    $('#temps').html(temps.join('<br>'));
    $('#icons').html(icons.join('<br>'));

    // Set weekdays for 6 day forecast
    var weekday = [];
    weekday[0]=  "SU";
    weekday[1] = "MO";
    weekday[2] = "TU";
    weekday[3] = "WE";
    weekday[4] = "TH";
    weekday[5] = "FR";
    weekday[6] = "SA";

    var today = new Date().getDay();

    // Update days of week;
    var days = '';
    for (i = 0; i < 6; i++) {
        days += weekday[(today + i + 1) % 7] + '<br>';
    }

    $('#days').html(days);

}

/**
 * Changes units between F and C
 */
function changeUnits() {
    var temps = [];
    if ($('#temp-unit').html() === 'Switch to F') {
        $('#temp-unit').html('Switch to C');
        $('#temp').html(weather.current.tempF + ' &deg;F');

        for (i = 0; i < 6; i++) {
            temps[i] = weather.forecast.tempMaxF[i].toString() + '/' +
                       weather.forecast.tempMinF[i].toString() + ' &deg;F';
        }
    } else if ($('#temp-unit').html() === 'Switch to C') {
        $('#temp-unit').html('Switch to F');
        $('#temp').html(convertToCelsius(weather.current.tempF) + ' &deg;C');

        for (i = 0; i < 6; i++) {
            temps[i] = convertToCelsius(weather.forecast.tempMaxF[i]).toString() + '/' +
                       convertToCelsius(weather.forecast.tempMinF[i]).toString() + ' &deg;C';
        }
    }

    $('#temps').html(temps.join('<br>'));
}

/**
 * Converts Farenheit to Celsius
 */
function convertToCelsius(tempFarenheit) {
    return Math.round( (tempFarenheit - 32) * (5/9) );
}

/**
 * Returns icon based on weather condition
 */
function getIcon(condition) {

    switch(condition) {
        case 'clear-day':
            return '<i class="wi wi-day-sunny"></i>';
            break;
        case 'clear-night':
            return '<i class="wi wi-night-clear"></i>';
            break;
        case 'rain':
            return '<i class="wi wi-rain"></i>';
            break;
        case 'snow':
            return '<i class="wi wi-snow"></i>';
            break;
        case 'sleet':
            return '<i class="wi wi-sleet"></i>';
            break;
        case 'wind':
            return '<i class="wi wi-windy"></i>';
            break;
        case 'fog':
            return '<i class="wi wi-fog"></i>';
            break;
        case 'cloudy':
            return '<i class="wi wi-cloudy"></i>';
            break;
        case 'partly-cloudy-day':
            return '<i class="wi wi-day-cloudy"></i>';
            break;
        case 'partly-cloudy-night':
            return '<i class="wi wi-night-alt-cloudy"></i>';
            break;
        default:
            return 'wi-refresh';
    };

}

/**
 * Returns background class based on weather condition
 */
function getBackground(condition) {

    switch(condition) {
        case 'clear-day':
            return 'clearday';
            break;
        case 'clear-night':
            return 'clearnight';
            break;
        case 'rain':
            return 'rainy';
            break;
        case 'cloudy':
            return 'cloudyday';
            break;
        case 'partly-cloudy-day':
            return 'cloudyday';
            break;
        case 'partly-cloudy-night':
            return 'cloudynight';
            break;
        default:
            return '';
    };

}
