import './css/main.css'
import { el, onClick, val, subscribe, show, onChange } from './dom'
import {
  createApp,
  onWalkerMoveNotFound,
  onProcessWeekHour,
  onProcessCycleComplete,
  onWalkerSelected,
  onWalkerNotFound,
} from '../app'
import { traceEnabled } from '../app/settings'

// create app
const canvas = el('renderCanvas') as HTMLCanvasElement

const app = createApp(canvas)

// bind state
const stateElements: any = {}

onProcessCycleComplete.add((step) => {
  const state = app.getState()

  for (let prop in state) {
    if (!stateElements[prop]) {
      stateElements[prop] = el(`count-${prop}`)
    }
    stateElements[prop].innerHTML = state[prop]
  }
})

subscribe('step', onProcessWeekHour)

// bind start/stop
onClick('start-button', () => app.start())
onClick('stop-button', () => app.stop())

// bind lockdown
// onChange('lockdown-cb', (event) => {
//   app.lockdown((event.target as any).checked)
// })

onClick('lockdown-button', () => {
  const level = parseInt(val('lockdown-tb'))

  if (!isNaN(level)) {
    app.setLockdownLevel(level / 100)
  }
})

// bind add
const add = (withHome: boolean) => () => {
  const amountVal = val('amount-tb')

  const checkBox = el('infected-cb') as HTMLInputElement

  const amount = parseInt(amountVal)

  if (!isNaN(amount)) {
    app.add(amount, checkBox.checked, withHome)
  }
}

onClick('add-button', add(false))
onClick('add-home-button', add(true))

// bind selected walker
let selectedWalker = -1

onWalkerSelected.add((walker) => {
  selectedWalker = walker.walkerIndex
  show('walker-selected', true)

  const walkerIndexTb = el('walker-tb') as HTMLInputElement
  walkerIndexTb.value = selectedWalker.toString()

  el('walker-moves').innerHTML =
    walker.moveCount <= 0 ? '0 available' : `0-${walker.moveCount}`
})

// bind infect walker
onClick('infect-button', () => app.infect(selectedWalker))

// bind replay moves
const bindReplayButton = (id: string, start: boolean) => {
  const handler = () => {
    const moveVal = parseInt(val('move-tb'))

    if (selectedWalker > -1 && !isNaN(moveVal)) {
      app.moveWalker(selectedWalker, moveVal, start)
    }
  }

  onClick(id, handler)
}

bindReplayButton('move-button', false)
bindReplayButton('replay-button', true)

subscribe('move-error', onWalkerMoveNotFound, () => `Move not found`)
subscribe('move-error', onWalkerNotFound, () => `Walker not found`)

// bind show traces
if (traceEnabled) {
  show('moves-panel', true)
}
onClick('show-moves-button', () => app.toggleTraces(selectedWalker))
