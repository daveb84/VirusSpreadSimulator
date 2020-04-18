import { Person } from '../meshes'
import { IObstacle } from './types'

const obstacleCollide = (person: Person, obstacle: IObstacle) => {
  if (person.moving) {
    const collide = obstacle.mesh.intersectsMesh(person.mesh, true)

    if (collide) {
      person.collideWithObstacle(obstacle)

      return true
    }
  }

  return false
}

const crawlerCollide = (person: Person, other: Person) => {
  if (!person.contagious && !other.contagious) {
    return
  }

  const collide = other.mesh.intersectsMesh(person.mesh, true)

  if (collide) {
    if (!person.contagious) {
      person.infect()
    }

    if (!other.contagious) {
      other.infect()
    }
  }
}

const boundingBoxCollide = (person: Person, obstacle: IObstacle) => {
  if (person.moving) {
    const collide = obstacle.mesh.intersectsMesh(person.mesh, true)

    if (!collide) {
      person.collideWithObstacle(obstacle)

      return true
    }
  }
}

export const processCollisions = (
  crawlers: Person[],
  obstacles: IObstacle[] = [],
  boundingBox: IObstacle = null
) => {
  const checkCrawlers = [...crawlers]
  checkCrawlers.shift()

  crawlers.forEach((person) => {
    if (boundingBox) {
      boundingBoxCollide(person, boundingBox)
    }

    obstacles.forEach((obstacle) => {
      obstacleCollide(person, obstacle)
    })

    checkCrawlers.forEach((other) => {
      crawlerCollide(person, other)
    })

    checkCrawlers.shift()
  })
}
