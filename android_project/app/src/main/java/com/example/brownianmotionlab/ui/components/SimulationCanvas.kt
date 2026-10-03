package com.example.brownianmotionlab.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.dp
import com.example.brownianmotionlab.model.SimulationUiState
import com.example.brownianmotionlab.ui.theme.BrownianParticleCore
import com.example.brownianmotionlab.ui.theme.BrownianParticleHalo
import com.example.brownianmotionlab.ui.theme.CollisionRippleColor
import com.example.brownianmotionlab.ui.theme.GasParticleColor
import com.example.brownianmotionlab.ui.theme.GasParticleGlow
import com.example.brownianmotionlab.ui.theme.LabChamberBackground
import com.example.brownianmotionlab.ui.theme.LabChamberBorder
import com.example.brownianmotionlab.ui.theme.TrailColor
import com.example.brownianmotionlab.ui.theme.VelocityVectorColor
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun SimulationCanvas(
    uiState: SimulationUiState,
    onChamberSizeChanged: (Float, Float) -> Unit,
    onBrownianDragged: (Float, Float) -> Unit,
    modifier: Modifier = Modifier
) {
    val shape = RoundedCornerShape(20.dp)

    BoxWithConstraints(
        modifier = modifier
            .clip(shape)
            .background(LabChamberBackground)
            .border(1.5.dp, LabChamberBorder, shape)
            .pointerInput(Unit) {
                detectDragGestures { change, _ ->
                    change.consume()
                    onBrownianDragged(change.position.x, change.position.y)
                }
            }
    ) {
        val widthPx = constraints.maxWidth.toFloat()
        val heightPx = constraints.maxHeight.toFloat()

        LaunchedEffect(widthPx, heightPx) {
            if (widthPx > 10f && heightPx > 10f) {
                onChamberSizeChanged(widthPx, heightPx)
            }
        }

        Canvas(modifier = Modifier.fillMaxSize()) {
            val bp = uiState.brownianParticle
            val params = uiState.parameters

            // 1. Subtle scientific background grid
            val gridStep = 40.dp.toPx()
            var gx = gridStep
            while (gx < size.width) {
                drawLine(
                    color = Color(0x0CFFFFFF),
                    start = Offset(gx, 0f),
                    end = Offset(gx, size.height),
                    strokeWidth = 1f
                )
                gx += gridStep
            }
            var gy = gridStep
            while (gy < size.height) {
                drawLine(
                    color = Color(0x0CFFFFFF),
                    start = Offset(0f, gy),
                    end = Offset(size.width, gy),
                    strokeWidth = 1f
                )
                gy += gridStep
            }

            // 2. Collision ripple flashes
            if (params.showCollisions) {
                val now = System.currentTimeMillis()
                for (event in uiState.collisionEvents) {
                    val age = now - event.timestamp
                    if (age in 0..350) {
                        val progress = age / 350f
                        val rippleRadius = 6f + progress * 24f
                        val alpha = (1f - progress) * 0.8f
                        drawCircle(
                            color = CollisionRippleColor.copy(alpha = alpha),
                            radius = rippleRadius,
                            center = Offset(event.x, event.y),
                            style = Stroke(width = 2.dp.toPx() * (1f - progress))
                        )
                    }
                }
            }

            // 3. Brownian Particle Trajectory Trails
            if (params.showTrails && bp.trail.size > 1) {
                val trailSize = bp.trail.size
                for (i in 0 until trailSize - 1) {
                    val p1 = bp.trail[i]
                    val p2 = bp.trail[i + 1]
                    val alpha = ((i + 1).toFloat() / trailSize).coerceIn(0.1f, 0.9f)
                    val strokeW = (1f + (i.toFloat() / trailSize) * 2.5f).dp.toPx()

                    drawLine(
                        color = TrailColor.copy(alpha = alpha),
                        start = p1,
                        end = p2,
                        strokeWidth = strokeW,
                        cap = StrokeCap.Round
                    )
                }
            }

            // 4. Gas Particles (Thermal bath)
            val gasRadiusPx = params.particleSize.dp.toPx()
            for (p in uiState.gasParticles) {
                val center = Offset(p.x, p.y)

                // Subtle halo glow
                drawCircle(
                    color = GasParticleGlow,
                    radius = gasRadiusPx * 1.8f,
                    center = center
                )

                // Core particle
                drawCircle(
                    color = GasParticleColor,
                    radius = gasRadiusPx,
                    center = center
                )

                // Optional velocity vectors on gas particles
                if (params.showVelocityVectors) {
                    val vx = p.vx * 0.25f
                    val vy = p.vy * 0.25f
                    val end = Offset(p.x + vx, p.y + vy)
                    drawLine(
                        color = VelocityVectorColor.copy(alpha = 0.5f),
                        start = center,
                        end = end,
                        strokeWidth = 1.dp.toPx()
                    )
                }
            }

            // 5. Macro Brownian Particle
            val bpCenter = Offset(bp.x, bp.y)
            val bpRadiusPx = bp.radius.dp.toPx()

            // Outer radiant halo
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(BrownianParticleHalo, Color.Transparent),
                    center = bpCenter,
                    radius = bpRadiusPx * 2.2f
                ),
                radius = bpRadiusPx * 2.2f,
                center = bpCenter
            )

            // Outer boundary ring
            drawCircle(
                color = BrownianParticleCore.copy(alpha = 0.4f),
                radius = bpRadiusPx + 3.dp.toPx(),
                center = bpCenter,
                style = Stroke(width = 1.5.dp.toPx())
            )

            // Inner solid sphere with radial shading
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(Color(0xFFFFD54F), BrownianParticleCore, Color(0xFFE65100)),
                    center = Offset(bp.x - bpRadiusPx * 0.3f, bp.y - bpRadiusPx * 0.3f),
                    radius = bpRadiusPx
                ),
                radius = bpRadiusPx,
                center = bpCenter
            )

            // Target crosshair in center for precision tracking
            val crosshairLen = 4.dp.toPx()
            drawLine(
                color = Color.White.copy(alpha = 0.7f),
                start = Offset(bp.x - crosshairLen, bp.y),
                end = Offset(bp.x + crosshairLen, bp.y),
                strokeWidth = 1.dp.toPx()
            )
            drawLine(
                color = Color.White.copy(alpha = 0.7f),
                start = Offset(bp.x, bp.y - crosshairLen),
                end = Offset(bp.x, bp.y + crosshairLen),
                strokeWidth = 1.dp.toPx()
            )

            // Brownian velocity vector
            if (params.showVelocityVectors) {
                val vecScale = 0.4f
                val vecEnd = Offset(bp.x + bp.vx * vecScale, bp.y + bp.vy * vecScale)
                drawLine(
                    color = VelocityVectorColor,
                    start = bpCenter,
                    end = vecEnd,
                    strokeWidth = 2.5.dp.toPx(),
                    cap = StrokeCap.Round
                )
                // Arrow head
                val angle = atan2(bp.vy, bp.vx)
                val arrowLen = 10.dp.toPx()
                val a1 = angle + Math.PI * 0.85
                val a2 = angle - Math.PI * 0.85
                val arrowP1 = Offset(
                    (vecEnd.x + arrowLen * cos(a1)).toFloat(),
                    (vecEnd.y + arrowLen * sin(a1)).toFloat()
                )
                val arrowP2 = Offset(
                    (vecEnd.x + arrowLen * cos(a2)).toFloat(),
                    (vecEnd.y + arrowLen * sin(a2)).toFloat()
                )
                val arrowPath = Path().apply {
                    moveTo(vecEnd.x, vecEnd.y)
                    lineTo(arrowP1.x, arrowP1.y)
                    lineTo(arrowP2.x, arrowP2.y)
                    close()
                }
                drawPath(path = arrowPath, color = VelocityVectorColor)
            }
        }
    }
}
