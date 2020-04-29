import { getCommonMaterials } from '../materials'
import { virusSettings, regions } from '../settings'
import { Mesh } from '@babylonjs/core'
import { onProcessCycleBegin, IProcessStep } from '../appEvents'
import { Travel } from './travel'
import { FlatRegion } from '../vectors'

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
  private dead = false

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

  public get isIsolating() {
    return this.isolating
  }

  public get isDead() {
    return this.dead
  }

  constructor(
    public readonly mesh: Mesh,
    private getProcessStep: () => IProcessStep,
    private travel: Travel,
    private home?: FlatRegion
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

    switch (state) {
      case VirusState.Incubating:
        this.mesh.material = this.materials.incubating
        this.setStateDelayed(VirusState.Ill, virusSettings.incubation)
        break

      case VirusState.Ill:
        this.mesh.material = this.materials.ill
        const recover = Math.random() > virusSettings.deathRate

        if (recover) {
          this.setStateDelayed(VirusState.Recovered, virusSettings.ill)
        } else {
          this.setStateDelayed(VirusState.Died, virusSettings.ill)
        }
        break

      case VirusState.Recovered:
        this.mesh.material = this.materials.recovered
        this.updateIsolation(false)
        break

      case VirusState.Died:
        this.mesh.material = this.materials.died
        this.die()
        break
    }
  }

  private setStateDelayed(state: VirusState, delay: number) {
    const targetHour = this.getProcessStep().hours + delay

    const observer = onProcessCycleBegin.add((event: IProcessStep) => {
      if (event.hours >= targetHour) {
        this.setState(state)

        onProcessCycleBegin.remove(observer)
      }
    })
  }

  updateIsolation(isolate: boolean) {
    if (isolate !== this.isolating) {
      this.isolating = isolate

      if (this.isolating) {
        this.travel.stop()

        if (this.home) {
          this.mesh.position = this.home.getRandomPoint()
        }

        this.mesh.rotation.z = Math.PI / 2
      } else {
        this.mesh.rotation.z = 0
        this.travel.start()
      }
    }
  }

  die() {
    this.travel.stop()
    this.dead = true
    this.mesh.position = regions.walkerGraveYard.getRandomPoint()
    this.mesh.rotation.z = Math.PI / 2
  }
}
