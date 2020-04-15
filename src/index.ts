import './css/main.css'
import { createApp } from './app'

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement

const app = createApp(canvas)

const button = document.getElementById('test-button') as HTMLButtonElement

button.addEventListener(
  'click',
  () => {
    app.go()
  },
  true
)
