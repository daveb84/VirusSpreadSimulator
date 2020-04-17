import './css/main.css'
import { createApp } from './app'

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement

const app = createApp(canvas)

const bindButton = (id: string, handler: () => void) => {
  const button = document.getElementById(id) as HTMLButtonElement

  button.addEventListener('click', handler, true)
}

bindButton('start-button', app.start)
bindButton('stop-button', app.stop)

const add = () => {
  const textBox = document.getElementById('amount-tb') as HTMLInputElement
  const checkBox = document.getElementById('infected-cb') as HTMLInputElement

  const amount = parseInt(textBox.value)

  if (!isNaN(amount)) {
    app.add(amount, checkBox.checked)
  }
}

bindButton('add-button', add)
