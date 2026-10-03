package com.example.brownianmotionlab.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.example.brownianmotionlab.model.SimulationParameters
import com.example.brownianmotionlab.model.SimulationStatistics
import com.example.brownianmotionlab.ui.theme.LabPrimaryCyan
import com.example.brownianmotionlab.ui.theme.LabSecondaryAmber
import com.example.brownianmotionlab.ui.theme.LabSurface
import com.example.brownianmotionlab.ui.theme.LabSurfaceBorder
import com.example.brownianmotionlab.ui.theme.LabTextPrimary
import com.example.brownianmotionlab.ui.theme.LabTextSecondary
import java.util.Locale

@Composable
fun StatisticsCard(
    statistics: SimulationStatistics,
    parameters: SimulationParameters,
    onResetStats: () -> Unit,
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
            Text(
                text = "Live Experiment Data",
                style = MaterialTheme.typography.titleMedium,
                color = LabTextPrimary
            )
            TextButton(onClick = onResetStats) {
                Text("Zero Stats", color = LabSecondaryAmber)
            }
        }

        Spacer(Modifier.height(8.dp))

        // 2-column grid of metrics
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                MetricItem("Temperature", String.format(Locale.US, "%.0f °C", parameters.temperature))
                MetricItem("Particle Count", "${parameters.particleCount}")
                MetricItem("Avg Particle Speed", String.format(Locale.US, "%.1f m/s", statistics.averageParticleSpeed))
                MetricItem("Simulation Time", String.format(Locale.US, "%.1f s", statistics.simulationTime))
            }
            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                MetricItem("Brownian Speed", String.format(Locale.US, "%.2f m/s", statistics.brownianParticleSpeed))
                MetricItem("Total Collisions", "%,d".format(statistics.collisionCount))
                MetricItem("Mean Squared Displ.", String.format(Locale.US, "%.0f px²", statistics.meanSquaredDisplacement))
                MetricItem("Diffusion Coeff. (D)", String.format(Locale.US, "%.3f", statistics.diffusionCoefficient))
            }
        }
    }
}

@Composable
private fun MetricItem(label: String, value: String) {
    Column {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            color = LabTextSecondary
        )
        Text(
            text = value,
            style = MaterialTheme.typography.labelSmall,
            color = LabPrimaryCyan
        )
    }
}
