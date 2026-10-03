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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.example.brownianmotionlab.model.SimulationParameters
import com.example.brownianmotionlab.ui.theme.LabDarkBackground
import com.example.brownianmotionlab.ui.theme.LabPrimaryCyan
import com.example.brownianmotionlab.ui.theme.LabSecondaryAmber
import com.example.brownianmotionlab.ui.theme.LabSurface
import com.example.brownianmotionlab.ui.theme.LabSurfaceBorder
import com.example.brownianmotionlab.ui.theme.LabTextPrimary
import com.example.brownianmotionlab.ui.theme.LabTextSecondary
import java.util.Locale

@Composable
fun ExperimentControls(
    parameters: SimulationParameters,
    isRunning: Boolean,
    onStart: () -> Unit,
    onPause: () -> Unit,
    onReset: () -> Unit,
    onTemperatureChange: (Float) -> Unit,
    onParticleCountChange: (Int) -> Unit,
    onParticleSizeChange: (Float) -> Unit,
    onBrownianMassChange: (Float) -> Unit,
    onSimulationSpeedChange: (Float) -> Unit,
    onTrailLengthChange: (Int) -> Unit,
    onToggleTrails: (Boolean) -> Unit,
    onToggleVelocityVectors: (Boolean) -> Unit,
    onToggleCollisions: (Boolean) -> Unit,
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
        // Section Title & Playback Action Buttons
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Experiment Controls",
                style = MaterialTheme.typography.titleMedium,
                color = LabTextPrimary
            )

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                if (isRunning) {
                    Button(
                        onClick = onPause,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = LabSecondaryAmber,
                            contentColor = LabDarkBackground
                        ),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Icon(Icons.Default.Pause, contentDescription = "Pause Simulation")
                        Spacer(Modifier.width(4.dp))
                        Text("Pause")
                    }
                } else {
                    Button(
                        onClick = onStart,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = LabPrimaryCyan,
                            contentColor = LabDarkBackground
                        ),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Icon(Icons.Default.PlayArrow, contentDescription = "Start Simulation")
                        Spacer(Modifier.width(4.dp))
                        Text("Start")
                    }
                }

                OutlinedButton(
                    onClick = onReset,
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = LabTextSecondary),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Icon(Icons.Default.Refresh, contentDescription = "Reset Simulation")
                    Spacer(Modifier.width(4.dp))
                    Text("Reset")
                }
            }
        }

        Spacer(Modifier.height(12.dp))

        // Sliders
        ParameterSlider(
            label = "Temperature",
            value = parameters.temperature,
            onValueChange = onTemperatureChange,
            valueRange = 0f..100f,
            displayValue = String.format(Locale.US, "%.0f °C", parameters.temperature)
        )

        ParameterSlider(
            label = "Particle Density",
            value = parameters.particleCount.toFloat(),
            onValueChange = { onParticleCountChange(it.toInt()) },
            valueRange = 10f..300f,
            displayValue = "${parameters.particleCount} particles"
        )

        ParameterSlider(
            label = "Particle Size",
            value = parameters.particleSize,
            onValueChange = onParticleSizeChange,
            valueRange = 2f..10f,
            displayValue = String.format(Locale.US, "%.1f dp", parameters.particleSize)
        )

        ParameterSlider(
            label = "Brownian Particle Mass",
            value = parameters.brownianMass,
            onValueChange = onBrownianMassChange,
            valueRange = 0.5f..10f,
            displayValue = String.format(Locale.US, "%.1f M₀", parameters.brownianMass)
        )

        ParameterSlider(
            label = "Simulation Speed",
            value = parameters.simulationSpeed,
            onValueChange = onSimulationSpeedChange,
            valueRange = 0.25f..3f,
            displayValue = String.format(Locale.US, "%.2fx", parameters.simulationSpeed)
        )

        ParameterSlider(
            label = "Trail Length",
            value = parameters.trailLength.toFloat(),
            onValueChange = { onTrailLengthChange(it.toInt()) },
            valueRange = 0f..30f,
            displayValue = "${parameters.trailLength} pts"
        )

        Spacer(Modifier.height(8.dp))

        // Visualization Toggles
        Text(
            text = "Visual Indicators",
            style = MaterialTheme.typography.bodyMedium,
            color = LabTextSecondary
        )
        Spacer(Modifier.height(6.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            FilterChip(
                selected = parameters.showTrails,
                onClick = { onToggleTrails(!parameters.showTrails) },
                label = { Text("Particle Trails") },
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = LabPrimaryCyan.copy(alpha = 0.2f),
                    selectedLabelColor = LabPrimaryCyan
                )
            )

            FilterChip(
                selected = parameters.showVelocityVectors,
                onClick = { onToggleVelocityVectors(!parameters.showVelocityVectors) },
                label = { Text("Vectors") },
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = LabPrimaryCyan.copy(alpha = 0.2f),
                    selectedLabelColor = LabPrimaryCyan
                )
            )

            FilterChip(
                selected = parameters.showCollisions,
                onClick = { onToggleCollisions(!parameters.showCollisions) },
                label = { Text("Collisions") },
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = LabSecondaryAmber.copy(alpha = 0.2f),
                    selectedLabelColor = LabSecondaryAmber
                )
            )
        }
    }
}
