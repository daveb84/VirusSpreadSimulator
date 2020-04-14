import './css/main.css'
import { createApp } from './anim1'

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
