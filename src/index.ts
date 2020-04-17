import './css/main.css'
import { createApp } from './app'

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement

const app = createApp(canvas)

const startButton = document.getElementById('start-button') as HTMLButtonElement
const stopButton = document.getElementById('stop-button') as HTMLButtonElement
const addButton = document.getElementById('add-button') as HTMLButtonElement

startButton.addEventListener('click', app.start, true)
stopButton.addEventListener('click', app.stop, true)

addButton.addEventListener(
  'click',
  () => {
    const textBox = document.getElementById('amount-tb') as HTMLInputElement
    const checkBox = document.getElementById('infected-cb') as HTMLInputElement

    const amount = parseInt(textBox.value)

    if (!isNaN(amount)) {
      app.add(amount, checkBox.checked)
    }
  },
  true
)
