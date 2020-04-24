import { getCommonMaterials } from '../materials'
import { virusSettings } from '../settings'
import { Mesh } from '@babylonjs/core'
import { onProcessCycleBegin, IProcessStep } from '../appEvents'

export enum VirusState {
  NotCaught = 0,
  Incubating = 1,
  Ill = 2,
  Recovered = 3,
  Died = 4,
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
    private onIsolationChanged: (isolate: boolean) => void,
    private onDie: () => void
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
      this.setStateDelayed(VirusState.Ill, virusSettings.incubation, true)
    } else if (state === VirusState.Ill) {
      this.mesh.material = this.materials.ill

      const recover = Math.random() > virusSettings.deathRate
      if (recover) {
        this.setStateDelayed(VirusState.Recovered, virusSettings.ill)
      } else {
        this.setDelayed(() => {
          this._state = VirusState.Died
          this.onDie()
        }, virusSettings.ill)
      }
    } else if (state === VirusState.Recovered) {
      this.mesh.material = this.materials.recovered
    }
  }

  private setStateDelayed(state: VirusState, delay: number, isolate = false) {
    const action = () => this.setStateAndIsolate(state, isolate)
    this.setDelayed(action, delay)
  }

  private setStateAndIsolate(state: VirusState, isolate = false) {
    this.setState(state)

    const previousIsolating = this.isolating
    this.isolating = isolate

    if (isolate !== previousIsolating) {
      this.onIsolationChanged(isolate)
    }
  }

  private setDelayed(action: () => void, delay: number) {
    const targetStep = this.getProcessStep().sceneStepId + delay

    const observer = onProcessCycleBegin.add((event: IProcessStep) => {
      if (event.sceneStepId >= targetStep) {
        action()

        onProcessCycleBegin.remove(observer)
      }
    })
  }
}
