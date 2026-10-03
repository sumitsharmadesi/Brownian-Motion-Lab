package com.example.brownianmotionlab.physics

import androidx.compose.ui.geometry.Offset
import com.example.brownianmotionlab.model.BrownianParticleState
import java.util.ArrayDeque

/**
 * Mutable physics representation of the observed macro Brownian particle.
 */
class BrownianParticle(
    var position: Vector2D,
    var velocity: Vector2D = Vector2D.ZERO,
    var radius: Float = 22f,
    var mass: Float = 2.0f
) {
    var initialPosition: Vector2D = position
    private val trailDeque: ArrayDeque<Offset> = ArrayDeque()

    fun resetTrajectory(newPos: Vector2D) {
        position = newPos
        initialPosition = newPos
        velocity = Vector2D.ZERO
        trailDeque.clear()
        trailDeque.add(Offset(newPos.x, newPos.y))
    }

    fun recordTrail(maxTrailLength: Int) {
        if (maxTrailLength <= 0) {
            trailDeque.clear()
            return
        }
        trailDeque.add(Offset(position.x, position.y))
        while (trailDeque.size > maxTrailLength) {
            trailDeque.removeFirst()
        }
    }

    fun getDisplacementSquared(): Float {
        return position.distanceSquaredTo(initialPosition)
    }

    fun toState(): BrownianParticleState = BrownianParticleState(
        x = position.x,
        y = position.y,
        vx = velocity.x,
        vy = velocity.y,
        radius = radius,
        mass = mass,
        trail = trailDeque.toList()
    )
}
