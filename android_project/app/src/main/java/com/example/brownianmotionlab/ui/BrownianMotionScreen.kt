package com.example.brownianmotionlab.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.brownianmotionlab.ui.components.ExperimentControls
import com.example.brownianmotionlab.ui.components.ExperimentGraph
import com.example.brownianmotionlab.ui.components.InfoSection
import com.example.brownianmotionlab.ui.components.SimulationCanvas
import com.example.brownianmotionlab.ui.components.StatisticsCard
import com.example.brownianmotionlab.ui.theme.LabDarkBackground
import com.example.brownianmotionlab.viewmodel.BrownianMotionViewModel

@Composable
fun BrownianMotionScreen(
    viewModel: BrownianMotionViewModel,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()

    BoxWithConstraints(
        modifier = modifier
            .fillMaxSize()
            .background(LabDarkBackground)
    ) {
        val isWide = maxWidth > 840.dp

        if (isWide) {
            // Adaptive Landscape / Tablet Layout: Split Stage & Control Deck
            Row(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Left Zone: Simulation Chamber Stage
                SimulationCanvas(
                    uiState = uiState,
                    onChamberSizeChanged = { w, h -> viewModel.setChamberDimensions(w, h) },
                    onBrownianDragged = { x, y -> viewModel.onBrownianDragged(x, y) },
                    modifier = Modifier
                        .weight(1.2f)
                        .fillMaxHeight()
                )

                // Right Zone: Controls, Statistics, Real-time Graph, and Theory
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxHeight()
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    ExperimentControls(
                        parameters = uiState.parameters,
                        isRunning = uiState.isRunning,
                        onStart = { viewModel.startSimulation() },
                        onPause = { viewModel.pauseSimulation() },
                        onReset = { viewModel.resetExperiment() },
                        onTemperatureChange = { viewModel.updateTemperature(it) },
                        onParticleCountChange = { viewModel.updateParticleCount(it) },
                        onParticleSizeChange = { viewModel.updateParticleSize(it) },
                        onBrownianMassChange = { viewModel.updateBrownianMass(it) },
                        onSimulationSpeedChange = { viewModel.updateSimulationSpeed(it) },
                        onTrailLengthChange = { viewModel.updateTrailLength(it) },
                        onToggleTrails = { viewModel.toggleTrails(it) },
                        onToggleVelocityVectors = { viewModel.toggleVelocityVectors(it) },
                        onToggleCollisions = { viewModel.toggleCollisions(it) }
                    )

                    StatisticsCard(
                        statistics = uiState.statistics,
                        parameters = uiState.parameters,
                        onResetStats = { viewModel.resetStatisticsOnly() }
                    )

                    ExperimentGraph(
                        msdHistory = uiState.msdHistory
                    )

                    InfoSection(
                        onSelectPreset = { viewModel.applyPreset(it) }
                    )
                }
            }
        } else {
            // Phone Portrait Layout: Single scrollable vertical stack
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Large simulation chamber viewport
                SimulationCanvas(
                    uiState = uiState,
                    onChamberSizeChanged = { w, h -> viewModel.setChamberDimensions(w, h) },
                    onBrownianDragged = { x, y -> viewModel.onBrownianDragged(x, y) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .aspectRatio(1f)
                )

                ExperimentControls(
                    parameters = uiState.parameters,
                    isRunning = uiState.isRunning,
                    onStart = { viewModel.startSimulation() },
                    onPause = { viewModel.pauseSimulation() },
                    onReset = { viewModel.resetExperiment() },
                    onTemperatureChange = { viewModel.updateTemperature(it) },
                    onParticleCountChange = { viewModel.updateParticleCount(it) },
                    onParticleSizeChange = { viewModel.updateParticleSize(it) },
                    onBrownianMassChange = { viewModel.updateBrownianMass(it) },
                    onSimulationSpeedChange = { viewModel.updateSimulationSpeed(it) },
                    onTrailLengthChange = { viewModel.updateTrailLength(it) },
                    onToggleTrails = { viewModel.toggleTrails(it) },
                    onToggleVelocityVectors = { viewModel.toggleVelocityVectors(it) },
                    onToggleCollisions = { viewModel.toggleCollisions(it) }
                )

                StatisticsCard(
                    statistics = uiState.statistics,
                    parameters = uiState.parameters,
                    onResetStats = { viewModel.resetStatisticsOnly() }
                )

                ExperimentGraph(
                    msdHistory = uiState.msdHistory
                )

                InfoSection(
                    onSelectPreset = { viewModel.applyPreset(it) }
                )

                Spacer(Modifier.height(24.dp))
            }
        }
    }
}
