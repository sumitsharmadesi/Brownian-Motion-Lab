package com.example.brownianmotionlab.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.example.brownianmotionlab.model.ExperimentPreset
import com.example.brownianmotionlab.ui.theme.LabDarkBackground
import com.example.brownianmotionlab.ui.theme.LabPrimaryCyan
import com.example.brownianmotionlab.ui.theme.LabSecondaryAmber
import com.example.brownianmotionlab.ui.theme.LabSurface
import com.example.brownianmotionlab.ui.theme.LabSurfaceBorder
import com.example.brownianmotionlab.ui.theme.LabTextPrimary
import com.example.brownianmotionlab.ui.theme.LabTextSecondary

@Composable
fun InfoSection(
    onSelectPreset: (ExperimentPreset) -> Unit,
    modifier: Modifier = Modifier
) {
    val cardShape = RoundedCornerShape(16.dp)
    var isExpanded by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(cardShape)
            .background(LabSurface)
            .border(1.dp, LabSurfaceBorder, cardShape)
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { isExpanded = !isExpanded },
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "What is Brownian Motion?",
                    style = MaterialTheme.typography.titleMedium,
                    color = LabTextPrimary
                )
                Text(
                    text = "Core concepts, equations, and suggested experiments",
                    style = MaterialTheme.typography.bodyMedium,
                    color = LabTextSecondary
                )
            }
            Icon(
                imageVector = if (isExpanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                contentDescription = if (isExpanded) "Collapse" else "Expand",
                tint = LabPrimaryCyan
            )
        }

        Spacer(Modifier.height(8.dp))
        Text(
            text = "Brownian motion is the random movement of microscopic particles suspended in a fluid. The motion occurs because the particle is continuously bombarded by surrounding molecules that are too small to see.",
            style = MaterialTheme.typography.bodyLarge,
            color = LabTextPrimary
        )

        AnimatedVisibility(visible = isExpanded) {
            Column(
                modifier = Modifier.padding(top = 16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                InfoBlock(
                    title = "What are we observing?",
                    content = "In this virtual chamber, the central large particle represents an observable micro-scale entity (like a pollen grain or colloidal gold sphere). The surrounding smaller blue particles represent fluid or gas molecules in thermal motion."
                )

                InfoBlock(
                    title = "Why does the particle move randomly?",
                    content = "At any instantaneous microsecond, the number and momentum of molecular impacts on one side do not perfectly balance those on the opposite side. This stochastic net force causes rapid fluctuations in velocity, resulting in a random walk."
                )

                InfoBlock(
                    title = "What happens when temperature increases?",
                    content = "Kinetic theory states that average thermal kinetic energy is proportional to absolute temperature: KE = ½mv² ∝ k_B T. As temperature rises, molecular velocities increase, collisions become more energetic, and the Brownian particle diffuses across larger distances."
                )

                InfoBlock(
                    title = "What happens when particle density increases?",
                    content = "A higher molecular density increases the collision frequency per unit time. While the particle receives more impacts, their spatial distribution is more uniform, shortening the mean free path."
                )

                InfoBlock(
                    title = "What is Mean Squared Displacement (MSD)?",
                    content = "Because random walk displacements average to zero in net direction, physicists calculate the mean of squared displacement: ⟨(Δr)²⟩. In 1905, Albert Einstein proved that ⟨(Δr)²⟩ = 2dDt, where d is the spatial dimension (d=2 in this 2D chamber), giving ⟨(Δr)²⟩ = 4Dt."
                )

                // Suggested Experiments
                Text(
                    text = "Suggested Experiments",
                    style = MaterialTheme.typography.titleMedium,
                    color = LabSecondaryAmber
                )

                ExperimentGuideCard(
                    title = "Experiment 1: Temperature & Velocity",
                    objective = "Observe how thermal kinetic energy alters random walk step lengths.",
                    expected = "Higher temperature leads to faster diffusion and steeper MSD slope.",
                    preset = ExperimentPreset.HIGH_TEMPERATURE,
                    onApply = onSelectPreset
                )

                ExperimentGuideCard(
                    title = "Experiment 2: Inertia & Mass Resistance",
                    objective = "Compare heavy particle resistance vs lightweight nanoparticles.",
                    expected = "A massive particle shows high inertia and resists sudden directional shifts.",
                    preset = ExperimentPreset.MASSIVE_PARTICLE,
                    onApply = onSelectPreset
                )

                ExperimentGuideCard(
                    title = "Experiment 3: High Density Collision Chamber",
                    objective = "Observe molecular bombardment at maximum solvent packing.",
                    expected = "Collision frequency spikes, damping individual excursions.",
                    preset = ExperimentPreset.HIGH_DENSITY,
                    onApply = onSelectPreset
                )

                InfoBlock(
                    title = "Real-World Applications",
                    content = "• Molecular Physics: Confirmation of the atomic nature of matter (Perrin's 1908 Nobel Prize experiments).\n• Diffusion: Drug delivery and cellular transport across biological membranes.\n• Nanotechnology: Self-assembly of colloidal nanoparticles and microfluidic sensors.\n• Financial Mathematics: Used as a mathematical analogy (geometric Brownian motion) for asset price modeling, though financial fluctuations are driven by market orders rather than physical thermal kinetics."
                )
            }
        }
    }
}

@Composable
private fun InfoBlock(title: String, content: String) {
    Column {
        Text(
            text = title,
            style = MaterialTheme.typography.titleMedium,
            color = LabPrimaryCyan
        )
        Spacer(Modifier.height(4.dp))
        Text(
            text = content,
            style = MaterialTheme.typography.bodyMedium,
            color = LabTextSecondary
        )
    }
}

@Composable
private fun ExperimentGuideCard(
    title: String,
    objective: String,
    expected: String,
    preset: ExperimentPreset,
    onApply: (ExperimentPreset) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(LabDarkBackground)
            .border(1.dp, LabSurfaceBorder, RoundedCornerShape(8.dp))
            .padding(12.dp)
    ) {
        Text(text = title, style = MaterialTheme.typography.titleMedium, color = LabTextPrimary)
        Spacer(Modifier.height(4.dp))
        Text(text = "Objective: $objective", style = MaterialTheme.typography.bodyMedium, color = LabTextSecondary)
        Text(text = "Expected: $expected", style = MaterialTheme.typography.bodyMedium, color = LabTextSecondary)
        Spacer(Modifier.height(8.dp))
        Button(
            onClick = { onApply(preset) },
            colors = ButtonDefaults.buttonColors(containerColor = LabPrimaryCyan.copy(alpha = 0.2f), contentColor = LabPrimaryCyan),
            shape = RoundedCornerShape(6.dp)
        ) {
            Text("Apply ${preset.title} Preset")
        }
    }
}
