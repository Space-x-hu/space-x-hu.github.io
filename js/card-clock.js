(function () {
  var WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  var WEATHER_CITY = 'Beijing'
  var CLOCK_HTML =
    '<div class="card-widget card-clock"><div class="card-glass"><div class="card-background"><div class="card-content"><div id="hexo_electric_clock">' +
    '<div class="clock-row">' +
    '<span id="card-clock-clockdate" class="card-clock-clockdate"></span>' +
    '<span id="card-clock-weather" class="card-clock-weather is-hidden"></span>' +
    '<span id="card-clock-humidity" class="card-clock-humidity is-hidden"></span>' +
    '</div>' +
    '<div class="clock-row"><span id="card-clock-time" class="card-clock-time"></span></div>' +
    '<div class="clock-row">' +
    '<span class="card-clock-ip"></span>' +
    '<span id="card-clock-location" class="card-clock-location is-hidden"></span>' +
    '<span id="card-clock-dackorlight" class="card-clock-dackorlight"></span>' +
    '</div>' +
    '</div></div></div></div></div>'

  function zeroPadding(num, digit) {
    var zero = ''
    for (var i = 0; i < digit; i++) zero += '0'
    return (zero + num).slice(-digit)
  }

  function mountWidget() {
    var sticky = document.getElementsByClassName('sticky_layout')[0]
    if (!sticky || sticky.querySelector('.card-clock')) return
    sticky.insertAdjacentHTML('afterbegin', CLOCK_HTML)
  }

  function updateTime() {
    var cd = new Date()
    var timeEl = document.getElementById('card-clock-time')
    var dateEl = document.getElementById('card-clock-clockdate')
    var ampmEl = document.getElementById('card-clock-dackorlight')
    if (!timeEl || !dateEl || !ampmEl) return

    timeEl.textContent =
      zeroPadding(cd.getHours(), 2) +
      ':' +
      zeroPadding(cd.getMinutes(), 2) +
      ':' +
      zeroPadding(cd.getSeconds(), 2)
    dateEl.textContent =
      zeroPadding(cd.getFullYear(), 4) +
      '-' +
      zeroPadding(cd.getMonth() + 1, 2) +
      '-' +
      zeroPadding(cd.getDate(), 2) +
      ' ' +
      WEEK[cd.getDay()]
    ampmEl.textContent = cd.getHours() >= 12 ? 'PM' : 'AM'
  }

  function loadWeather() {
    var weatherEl = document.getElementById('card-clock-weather')
    var humidityEl = document.getElementById('card-clock-humidity')
    var locationEl = document.getElementById('card-clock-location')
    if (!weatherEl || !humidityEl || !locationEl) return

    var url =
      'https://wttr.in/' +
      encodeURIComponent(WEATHER_CITY) +
      '?format=%l+%c+%t+%h'

    fetch(url, { headers: { Accept: 'text/plain' } })
      .then(function (res) {
        if (!res.ok) throw new Error('weather unavailable')
        return res.text()
      })
      .then(function (text) {
        if (!text || /<\s*html/i.test(text) || text.length > 120) {
          throw new Error('invalid weather payload')
        }
        var parts = text.trim().split(/\s+/)
        if (parts.length < 4) throw new Error('unexpected weather format')
        locationEl.textContent = parts[0]
        weatherEl.textContent = parts[1] + ' ' + parts[2]
        humidityEl.textContent = parts[3].replace(/°C/i, '') + ' *C'
        weatherEl.classList.remove('is-hidden')
        humidityEl.classList.remove('is-hidden')
        locationEl.classList.remove('is-hidden')
      })
      .catch(function () {
        weatherEl.textContent = ''
        humidityEl.textContent = ''
        locationEl.textContent = ''
      })
  }

  function init() {
    mountWidget()
    updateTime()
    setInterval(updateTime, 1000)
    loadWeather()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
