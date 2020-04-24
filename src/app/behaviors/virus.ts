import { getCommonMaterials } from '../materials'
import { virusDuration } from '../settings'
import { Mesh } from '@babylonjs/core'
import { onProcess, IProcessStep } from '../appEvents'

export enum VirusState {
  NotCaught = 0,
  Incubating = 1,
  Ill = 2,
  Recovered = 3,
}

export class Virus {
  private _state: VirusState
  private materials = getCommonMaterials()
  private isolating = false

  public get state() {
    return this._state
  }

  public get canSpread() {
    return (
      this._state === VirusState.Incubating || this._state === VirusState.Ill
    )
  }

  public get canCatch() {
    return this._state === VirusState.NotCaught
  }

  constructor(
    public readonly mesh: Mesh,
    private getProcessStep: () => IProcessStep,
    private onIsolationChanged: (isolate: boolean) => void
  ) {
    this._state = VirusState.NotCaught
  }

  public infect() {
    if (this._state === VirusState.NotCaught) {
      this.setState(VirusState.Incubating)
    }
  }

  private setState(state: VirusState) {
    this._state = state
    if (state === VirusState.Incubating) {
      this.mesh.material = this.materials.incubating
      this.setStateDelayed(VirusState.Ill, virusDuration.incubation, true)
    } else if (state === VirusState.Ill) {
      this.mesh.material = this.materials.ill
      this.setStateDelayed(VirusState.Recovered, virusDuration.ill)
    } else if (state === VirusState.Recovered) {
      this.mesh.material = this.materials.recovered
    }
  }

  private setStateDelayed(state: VirusState, delay: number, isolate = false) {
    const targetStep = this.getProcessStep().sceneStepId + delay

    const observer = onProcess.add((event: IProcessStep) => {
      if (event.sceneStepId >= targetStep) {
        this.setState(state)

        const previousIsolating = this.isolating
        this.isolating = isolate

        if (isolate !== previousIsolating) {
          this.onIsolationChanged(isolate)
        }

        onProcess.remove(observer)
      }
    })
  }
}
