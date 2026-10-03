package com.example.brownianmotionlab.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp
import com.example.brownianmotionlab.model.MsdDataPoint
import com.example.brownianmotionlab.ui.theme.LabPrimaryCyan
import com.example.brownianmotionlab.ui.theme.LabSecondaryAmber
import com.example.brownianmotionlab.ui.theme.LabSurface
import com.example.brownianmotionlab.ui.theme.LabSurfaceBorder
import com.example.brownianmotionlab.ui.theme.LabTextMuted
import com.example.brownianmotionlab.ui.theme.LabTextPrimary
import com.example.brownianmotionlab.ui.theme.LabTextSecondary
import kotlin.math.max

@Composable
fun ExperimentGraph(
    msdHistory: List<MsdDataPoint>,
    modifier: Modifier = Modifier
) {
    val cardShape = RoundedCornerShape(16.dp)

    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(cardShape)
            .background(LabSurface)
            .border(1.dp, LabSurfaceBorder, cardShape)
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Mean Squared Displacement vs Time",
                    style = MaterialTheme.typography.titleMedium,
                    color = LabTextPrimary
                )
                Text(
                    text = "Einstein relation: ⟨Δr²⟩ ≈ 4Dt (2D diffusion)",
                    style = MaterialTheme.typography.bodyMedium,
                    color = LabTextSecondary
                )
            }
        }

        Spacer(Modifier.height(12.dp))

        // Legend
        Row(
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                Box(Modifier.height(3.dp).fillMaxWidth(0.08f).background(LabPrimaryCyan))
                Text("Measured MSD", style = MaterialTheme.typography.labelSmall, color = LabTextSecondary)
            }
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                Box(Modifier.height(3.dp).fillMaxWidth(0.08f).background(LabSecondaryAmber))
                Text("Theory (4Dt)", style = MaterialTheme.typography.labelSmall, color = LabTextSecondary)
            }
        }

        Spacer(Modifier.height(8.dp))

        // Canvas Graph
        Canvas(
            modifier = Modifier
                .fillMaxWidth()
                .height(180.dp)
                .background(Color(0xFF070B14))
                .border(1.dp, LabSurfaceBorder)
        ) {
            val paddingLeft = 40.dp.toPx()
            val paddingBottom = 28.dp.toPx()
            val paddingTop = 16.dp.toPx()
            val paddingRight = 16.dp.toPx()

            val plotWidth = size.width - paddingLeft - paddingRight
            val plotHeight = size.height - paddingBottom - paddingTop

            if (plotWidth <= 0 || plotHeight <= 0) return@Canvas

            // Axes
            drawLine(
                color = LabSurfaceBorder,
                start = Offset(paddingLeft, paddingTop),
                end = Offset(paddingLeft, size.height - paddingBottom),
                strokeWidth = 1.5.dp.toPx()
            )
            drawLine(
                color = LabSurfaceBorder,
                start = Offset(paddingLeft, size.height - paddingBottom),
                end = Offset(size.width - paddingRight, size.height - paddingBottom),
                strokeWidth = 1.5.dp.toPx()
            )

            // Grid lines
            val gridLines = 4
            for (i in 1..gridLines) {
                val y = paddingTop + (plotHeight / gridLines) * i
                drawLine(
                    color = Color(0x15FFFFFF),
                    start = Offset(paddingLeft, y),
                    end = Offset(size.width - paddingRight, y),
                    strokeWidth = 1f
                )
            }

            if (msdHistory.size >= 2) {
                val maxTime = max(1f, msdHistory.last().time)
                var maxMsd = 100f
                for (dp in msdHistory) {
                    if (dp.measuredMsd > maxMsd) maxMsd = dp.measuredMsd
                    if (dp.theoreticalMsd > maxMsd) maxMsd = dp.theoreticalMsd
                }
                maxMsd *= 1.15f // margin

                // Draw Theoretical line
                val theoryPath = Path()
                var firstTheory = true
                for (dp in msdHistory) {
                    val px = paddingLeft + (dp.time / maxTime) * plotWidth
                    val py = (size.height - paddingBottom) - (dp.theoreticalMsd / maxMsd) * plotHeight
                    if (firstTheory) {
                        theoryPath.moveTo(px, py.coerceIn(paddingTop, size.height - paddingBottom))
                        firstTheory = false
                    } else {
                        theoryPath.lineTo(px, py.coerceIn(paddingTop, size.height - paddingBottom))
                    }
                }
                drawPath(
                    path = theoryPath,
                    color = LabSecondaryAmber,
                    style = Stroke(
                        width = 2.dp.toPx(),
                        pathEffect = PathEffect.dashPathEffect(floatArrayOf(12f, 8f), 0f)
                    )
                )

                // Draw Measured line
                val measuredPath = Path()
                var firstMeasured = true
                for (dp in msdHistory) {
                    val px = paddingLeft + (dp.time / maxTime) * plotWidth
                    val py = (size.height - paddingBottom) - (dp.measuredMsd / maxMsd) * plotHeight
                    if (firstMeasured) {
                        measuredPath.moveTo(px, py.coerceIn(paddingTop, size.height - paddingBottom))
                        firstMeasured = false
                    } else {
                        measuredPath.lineTo(px, py.coerceIn(paddingTop, size.height - paddingBottom))
                    }
                }
                drawPath(
                    path = measuredPath,
                    color = LabPrimaryCyan,
                    style = Stroke(width = 2.dp.toPx(), cap = StrokeCap.Round)
                )
            }
        }

        Spacer(Modifier.height(8.dp))
        Text(
            text = "Note: In 2 dimensions, diffusive displacement scales linearly with elapsed time according to Einstein's relation. Fluctuations around the line represent stochastic molecular bombardment.",
            style = MaterialTheme.typography.bodyMedium,
            color = LabTextMuted
        )
    }
}
