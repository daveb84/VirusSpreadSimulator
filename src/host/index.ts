import './css/main.css'
import { el, onClick, val, subscribe } from './dom'
import { createApp, onWalkerNotFound, onStep } from '../app'

const canvas = el('renderCanvas') as HTMLCanvasElement

const app = createApp(canvas)

onClick('start-button', () => app.start())
onClick('stop-button', () => app.stop())

const add = () => {
  const amountVal = val('amount-tb')

  const checkBox = el('infected-cb') as HTMLInputElement

  const amount = parseInt(amountVal)

  if (!isNaN(amount)) {
    app.add(amount, checkBox.checked)
  }
}

onClick('add-button', add)

const bindReplayButton = (button: string, start: boolean) => {
  const handler = () => {
    const personVal = parseInt(val('person-tb'))
    const moveVal = parseInt(val('move-tb'))

    if (!isNaN(personVal) && !isNaN(moveVal)) {
      app.moveWalker(personVal, moveVal, start)
    }
  }

  onClick(button, handler)
}

bindReplayButton('move-button', false)
bindReplayButton('replay-button', true)

subscribe('step', onStep, (step) => `Step ${step}`)
subscribe('replay-error', onWalkerNotFound, (walker) => `Person not found`)
