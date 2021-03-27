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
  5: 'e76f51'
}

const gauge = app.gauge.get('.pesi-gauge')
let numOr0 = n => (isNaN(n) ? 0 : n)
let pesi = 0

let updatePesi = () => {
  if (!$$('#pesi-form input[name=age]')[0].value) return
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
  updateFollowUp()
}

let updateFollowUp = () => {
  let age = numOr0(Number($$('#pesi-form input[name=age]')[0].value))
  let malignancy = $$('#malignancy input').prop('checked')
  $$(
    '#cancerTreat, #cancerSVF, #cancerPV, #haemaCoagulation, #haemaDuration, #pvTreat, #addAge'
  ).hide()
  //.removeClass('hidden')

  if (malignancy) {
    $$(
      '#screening-needed input, #svf-needed input, #length-uncertain input'
    ).prop('checked', false)
    $$('#screening-needed, #svf-needed, #length-uncertain').hide()
    //.removeClass('hidden')
    $$()
    $$('#cancerTreat').show()
  } else {
    $$('#screening-needed').show()
  }

  let screeningNeeded = $$('#screening-needed input').prop('checked')
  let svfNeeded = $$('#svf-needed input').prop('checked')
  let lengthUncertain = $$('#length-uncertain input').prop('checked')

  if (screeningNeeded) {
    $$('#svf-needed').show()
    $$('#length-uncertain').hide()
    $$('#length-uncertain input').prop('checked', false)
    if (svfNeeded) {
      $$('#cancerSVF').show()
    } else {
      $$('#cancerPV').show()
    }
  } else if (!malignancy) {
    $$('#svf-needed').hide()
    $$('#svf-needed input').prop('checked', false)
  }
  if (!malignancy && !screeningNeeded && age && age < 50) {
    $$('#haemaCoagulation').show()
    $$('#length-uncertain').hide()
    $$('#length-uncertain input').prop('checked', false)
  } else if (!malignancy && !screeningNeeded && age && age > 49) {
    $$('#length-uncertain').show()
    if (lengthUncertain) {
      $$('#haemaDuration').show()
    } else {
      $$('#pvTreat').show()
    }
  } else if (!malignancy && !screeningNeeded && !age) {
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
