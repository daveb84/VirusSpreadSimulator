import './css/main.css'
import { createApp } from '../app'

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement

const debug = (message: string) => {
  document.getElementById('debug-message').innerHTML = message
}

const app = createApp(canvas, debug)

const bindButton = (id: string, handler: () => void) => {
  const button = document.getElementById(id) as HTMLButtonElement

  button.addEventListener('click', handler, true)
}

bindButton('start-button', () => app.start())
bindButton('stop-button', () => app.stop())

const add = () => {
  const textBox = document.getElementById('amount-tb') as HTMLInputElement
  const checkBox = document.getElementById('infected-cb') as HTMLInputElement

  const amount = parseInt(textBox.value)

  if (!isNaN(amount)) {
    app.add(amount, checkBox.checked)
  }
}

bindButton('add-button', add)

const bindReplayButton = (button: string, action: (index: number) => void) => {
  const handler = () => {
    const textBox = document.getElementById('replay-tb') as HTMLInputElement
    const index = parseInt(textBox.value)

    if (!isNaN(index)) {
      action(index)
    }
  }

  bindButton(button, handler)
}

bindReplayButton('move-button', (index: number) => app.moveBack(index))
bindReplayButton('replay-button', (index: number) => app.replayMove(index))
