package com.example.brownianmotionlab.physics

import com.example.brownianmotionlab.model.GasParticleState

/**
 * Mutable physics representation of a solvent / thermal bath particle.
 */
class GasParticle(
    val id: Int,
    var position: Vector2D,
    var velocity: Vector2D,
    var radius: Float = 4f,
    var mass: Float = 0.1f
) {
    fun toState(): GasParticleState = GasParticleState(
        id = id,
        x = position.x,
        y = position.y,
        vx = velocity.x,
        vy = velocity.y,
        radius = radius
    )
}
