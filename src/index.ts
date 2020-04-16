import './css/main.css'
import { createApp } from './app'

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement

const app = createApp(canvas)

const startButton = document.getElementById('start-button') as HTMLButtonElement
const stopButton = document.getElementById('stop-button') as HTMLButtonElement

startButton.addEventListener('click', app.start, true)
stopButton.addEventListener('click', app.stop, true)
