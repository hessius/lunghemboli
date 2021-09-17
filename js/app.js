var $ = Dom7
var $$ = Dom7

var app = new Framework7({
  name: 'Lunghemboli', // App name
  theme: 'aurora', // Automatic theme detection
  el: '#app', // App root element

  // App store
  store: store,
  // App routes
  routes: routes
})

const pesiColor = {
  1: '#2a9d8f',
  2: '#2a9d8f',
  3: '#e9c46a',
  4: '#f4a261',
  5: '#e76f51'
}

const gauge = app.gauge.get('.pesi-gauge')
let numOr0 = n => (isNaN(n) ? 0 : n)
let pesi = 0

let updatePesi = () => {
  if (!$$('#pesi-form input[name=age]')[0].value) {
    $$('#result').hide()
    $$('#noresult').show()
    return
  } else {
    $$('#result').show()
    $$('#noresult').hide()
  }

  newPesi = numOr0(Number($$('#pesi-form input[name=age]')[0].value))

  $$('#pesi-form input:checked').forEach(
    e => (newPesi = newPesi + numOr0(Number(e.dataset.points)))
  )
  let pesiClass = 0
  if (newPesi < 66) {
    pesiClass = 1
  } else if (newPesi < 86) {
    pesiClass = 2
  } else if (newPesi < 106) {
    pesiClass = 3
  } else if (newPesi < 126) {
    pesiClass = 4
  } else {
    pesiClass = 5
  }

  let pesiFraction = newPesi / 200

  gauge.update({
    value: pesiFraction > 1 ? 1 : pesiFraction,
    valueText: newPesi,
    labelText: `Riskklass ${pesiClass}`,
    valueTextColor: pesiColor[pesiClass],
    borderColor: pesiColor[pesiClass]
  })
  $$('.pesiclass').hide()
  $$(`#pesi${pesiClass}`).show()
  return newPesi
}

let updateTreatment = () => {
  let radiology =
    $$('form#radiology-form input').length ==
    $$('form#radiology-form input:checked').length
  let pesi = updatePesi() <= 85
  let patient =
    $$('form#patient-form input').length ==
    $$('form#patient-form input:checked').length
  if (radiology && pesi && patient) {
    $$('#treatOut').show()
    //.removeClass('hidden')
    $$('#treatIn').hide()
  } else {
    $$('#treatIn').show()
    //.removeClass('hidden')
    $$('#treatOut').hide()
  }
  if (!pesi) {
    $$('#pesiExpl').show()
  } else {
    $$('#pesiExpl').hide()
  }
  if (!radiology) {
    $$('#radiologyExpl').show()
  } else {
    $$('#radiologyExpl').hide()
  }
  if (!patient) {
    $$('#patientExpl').show()
  } else {
    $$('#patientExpl').hide()
  }
  updateFollowUp()
}

let updateFollowUp = () => {
  let age = numOr0(Number($$('#pesi-form input[name=age]')[0].value))
  let malignancy = $$('#malignancy input').prop('checked')
  $$(
    '#cancerTreat, #cancerSVF, #cancerPV, .PV, #haemaCoagulation, #haemaTreat, #pvTreat, #addAge'
  ).hide()
  //.removeClass('hidden')

  if (malignancy) {
    $$('#screening-needed input, #svf-needed input, #length-life input').prop(
      'checked',
      false
    )
    $$('#screening-needed, #svf-needed, #length-life').hide()
    //.removeClass('hidden')
    $$()
    $$('#cancerTreat').show()
  } else {
    $$('#screening-needed').show()
  }

  let screeningNeeded = $$('#screening-needed input').prop('checked')
  let svfNeeded = $$('#svf-needed input').prop('checked')
  let lengthLife = $$('#length-life input').prop('checked')

  if (screeningNeeded) {
    $$('#svf-needed').show()
    if (svfNeeded) {
      $$('#cancerSVF').show()
    } else {
      $$('#cancerPV, .PV').show()
    }
  } else if (!malignancy) {
    $$('#svf-needed').hide()
    $$('#svf-needed input').prop('checked', false)
  }
  //if (!malignancy && !screeningNeeded && age && age < 50) {
  if (!malignancy && age && age < 50) {
    $$('#haemaCoagulation').show()
    $$('#length-life').hide()
    $$('#length-life input').prop('checked', false)
    //} else if (!malignancy && !screeningNeeded && age && age > 49) {
  } else if (!malignancy && age && age > 49) {
    $$('#length-life').show()
    if (!lengthLife) {
      $$('#haemaTreat').show()
    } else {
      $$('#pvTreat, .PV').show()
    }
    //} else if (!malignancy && !screeningNeeded && !age) {
  } else if (!malignancy && !age) {
    $$('#addAge').show()
  }
}

$$(
  'form#radiology-form input, form#patient-form input, form#pesi-form input'
).on('keyup keydown change', updateTreatment)

$$('form#followup-form').on('keyup keydown change', updateFollowUp)

// $$('#radiology-form input, #patient-form input,').on(
//   'keyup keydown change',
//   updateTreatment
// )
$$('.hidden')
  .hide()
  .removeClass('hidden')

// Custom toggle

$$('button.yes').on('click', function (e) {
  $$(this)
    .children('input')
    .prop('checked', true)
})
$$('button.no').on('click', function (e) {
  $$(this)
    .siblings()
    .children('input')
    .prop('checked', false)
})
$$('.segmented button').on('click', function (e) {
  e.preventDefault()
  updateTreatment()
  updateFollowUp()
  updatePesi()
  $$(this)
    .siblings()
    .removeClass('button-active')
  $$(this).addClass('button-active')
})
if (window.navigator.userAgent.match(/MSIE|Trident/) !== null) {
  alert(
    'Du använder en gammal webbläsare som inte längre stöds. Öppna sidan i Edge / Chrome / Firefox / Safari eller annan valfri webbläsare.'
  )
}
