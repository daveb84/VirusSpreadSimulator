import { Observable } from '@babylonjs/core'

export const el = (id: string) => document.getElementById(id)

export const onClick = (id: string, handler: (event?: Event) => void) => {
  const button = el(id)

  button.addEventListener('click', handler, true)
}

export const val = (id: string) => {
  const element = el(id) as HTMLInputElement

  return element.value
}

export const subscribe = <T>(
  id: string,
  event: Observable<T>,
  display?: (value: T) => string
) => {
  const element = el(id)

  event.add((data) => {
    element.innerHTML = display ? display(data) : (data as any)
  })
}
