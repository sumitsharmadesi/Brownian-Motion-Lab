package com.example.brownianmotionlab.physics

import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt

/**
 * 2D vector mathematics with immutable operators and utility methods.
 */
data class Vector2D(val x: Float = 0f, val y: Float = 0f) {

    operator fun plus(other: Vector2D): Vector2D = Vector2D(x + other.x, y + other.y)
    operator fun minus(other: Vector2D): Vector2D = Vector2D(x - other.x, y - other.y)
    operator fun times(scalar: Float): Vector2D = Vector2D(x * scalar, y * scalar)
    operator fun div(scalar: Float): Vector2D =
        if (scalar != 0f) Vector2D(x / scalar, y / scalar) else Vector2D()

    operator fun unaryMinus(): Vector2D = Vector2D(-x, -y)

    fun dot(other: Vector2D): Float = x * other.x + y * other.y

    fun lengthSquared(): Float = x * x + y * y

    fun length(): Float = sqrt(lengthSquared())

    fun distanceTo(other: Vector2D): Float = (this - other).length()

    fun distanceSquaredTo(other: Vector2D): Float = (this - other).lengthSquared()

    fun normalized(): Vector2D {
        val len = length()
        return if (len > 0.00001f) this / len else Vector2D(0f, 0f)
    }

    companion object {
        val ZERO = Vector2D(0f, 0f)

        fun fromAngleAndMagnitude(angleRad: Float, magnitude: Float): Vector2D =
            Vector2D(cos(angleRad) * magnitude, sin(angleRad) * magnitude)
    }
}
