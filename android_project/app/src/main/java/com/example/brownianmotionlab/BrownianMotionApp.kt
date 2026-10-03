package com.example.brownianmotionlab

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.FileDownload
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Science
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.brownianmotionlab.model.ExperimentPreset
import com.example.brownianmotionlab.ui.BrownianMotionScreen
import com.example.brownianmotionlab.ui.theme.BrownianMotionLabTheme
import com.example.brownianmotionlab.ui.theme.LabDarkBackground
import com.example.brownianmotionlab.ui.theme.LabPrimaryCyan
import com.example.brownianmotionlab.ui.theme.LabSecondaryAmber
import com.example.brownianmotionlab.ui.theme.LabSurface
import com.example.brownianmotionlab.ui.theme.LabSurfaceBorder
import com.example.brownianmotionlab.ui.theme.LabTextPrimary
import com.example.brownianmotionlab.ui.theme.LabTextSecondary
import com.example.brownianmotionlab.viewmodel.BrownianMotionViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BrownianMotionApp(
    viewModel: BrownianMotionViewModel = viewModel()
) {
    var showPresetsDialog by remember { mutableStateOf(false) }
    var showInfoDialog by remember { mutableStateOf(false) }
    var showCsvDialog by remember { mutableStateOf(false) }

    BrownianMotionLabTheme {
        Scaffold(
            topBar = {
                CenterAlignedTopAppBar(
                    title = {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "Brownian Motion Lab",
                                style = MaterialTheme.typography.titleMedium,
                                color = LabTextPrimary
                            )
                            Text(
                                text = "Virtual Physics Experiment",
                                style = MaterialTheme.typography.labelSmall,
                                color = LabPrimaryCyan
                            )
                        }
                    },
                    navigationIcon = {
                        IconButton(onClick = { showPresetsDialog = true }) {
                            Icon(
                                Icons.Default.Science,
                                contentDescription = "Experiment Presets",
                                tint = LabSecondaryAmber
                            )
                        }
                    },
                    actions = {
                        IconButton(onClick = { showCsvDialog = true }) {
                            Icon(
                                Icons.Default.FileDownload,
                                contentDescription = "Export Data",
                                tint = LabTextSecondary
                            )
                        }
                        IconButton(onClick = { showInfoDialog = true }) {
                            Icon(
                                Icons.Default.Info,
                                contentDescription = "Physics Information",
                                tint = LabPrimaryCyan
                            )
                        }
                    },
                    colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                        containerColor = LabDarkBackground,
                        titleContentColor = LabTextPrimary
                    )
                )
            },
            containerColor = LabDarkBackground
        ) { innerPadding ->
            BrownianMotionScreen(
                viewModel = viewModel,
                modifier = Modifier.padding(innerPadding)
            )

            // Presets Dialog
            if (showPresetsDialog) {
                AlertDialog(
                    onDismissRequest = { showPresetsDialog = false },
                    title = { Text("Choose Experiment Preset", color = LabTextPrimary) },
                    text = {
                        Column {
                            for (preset in ExperimentPreset.values()) {
                                TextButton(
                                    onClick = {
                                        viewModel.applyPreset(preset)
                                        showPresetsDialog = false
                                    },
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Column(modifier = Modifier.fillMaxWidth()) {
                                        Text(preset.title, color = LabPrimaryCyan, style = MaterialTheme.typography.titleMedium)
                                        Text(preset.description, color = LabTextSecondary, style = MaterialTheme.typography.bodyMedium)
                                    }
                                }
                            }
                        }
                    },
                    confirmButton = {
                        TextButton(onClick = { showPresetsDialog = false }) {
                            Text("Close", color = LabTextSecondary)
                        }
                    },
                    containerColor = LabSurface
                )
            }

            // Info Dialog
            if (showInfoDialog) {
                AlertDialog(
                    onDismissRequest = { showInfoDialog = false },
                    title = { Text("About Brownian Motion Lab", color = LabTextPrimary) },
                    text = {
                        Text(
                            text = "Brownian Motion Lab is an interactive virtual physics simulation reproducing the erratic stochastic motion of microscopic particles suspended in a fluid.\n\n" +
                                    "Kinetic theory explains this phenomenon through continuous bombardment by rapid thermal molecules.\n\n" +
                                    "Formulas implemented:\n" +
                                    "• Kinetic Energy: KE = ½mv² ∝ k_B T\n" +
                                    "• 2D Mean Squared Displacement: ⟨(Δr)²⟩ ≈ 4Dt\n" +
                                    "• Einstein-Stokes Diffusion: D = (k_B T) / (6πηr)\n\n" +
                                    "Note: This is an educational numerical simulation balancing performance with realistic collision kinematics.",
                            color = LabTextSecondary,
                            style = MaterialTheme.typography.bodyMedium
                        )
                    },
                    confirmButton = {
                        TextButton(onClick = { showInfoDialog = false }) {
                            Text("Got it", color = LabPrimaryCyan)
                        }
                    },
                    containerColor = LabSurface
                )
            }

            // CSV Export Preview Dialog
            if (showCsvDialog) {
                val csvData = viewModel.generateCsvExportData()
                AlertDialog(
                    onDismissRequest = { showCsvDialog = false },
                    title = { Text("Export Experiment Telemetry", color = LabTextPrimary) },
                    text = {
                        Column {
                            Text(
                                "CSV telemetry data captures time-series MSD coordinates for classroom lab report analysis:",
                                color = LabTextSecondary,
                                style = MaterialTheme.typography.bodyMedium
                            )
                            Spacer(Modifier.padding(vertical = 4.dp))
                            Text(
                                text = if (csvData.lines().size > 1) csvData.lines().take(6).joinToString("\n") + "\n..." else "Run the simulation to record data points.",
                                color = LabPrimaryCyan,
                                style = MaterialTheme.typography.labelSmall
                            )
                        }
                    },
                    confirmButton = {
                        TextButton(onClick = { showCsvDialog = false }) {
                            Text("Done", color = LabPrimaryCyan)
                        }
                    },
                    containerColor = LabSurface
                )
            }
        }
    }
}
