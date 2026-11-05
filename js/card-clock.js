(function () {
  var WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  var CLOCK_HTML =
    '<div class="card-widget card-clock"><div class="card-glass"><div class="card-background"><div class="card-content"><div id="hexo_electric_clock">' +
    '<div class="clock-row">' +
    '<span id="card-clock-clockdate" class="card-clock-clockdate"></span>' +
    '</div>' +
    '<div class="clock-row"><span id="card-clock-time" class="card-clock-time"></span></div>' +
    '<div class="clock-row clock-row--ampm">' +
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

  function init() {
    mountWidget()
    updateTime()
    setInterval(updateTime, 1000)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
