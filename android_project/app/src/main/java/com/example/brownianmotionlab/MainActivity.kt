package com.example.brownianmotionlab

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import com.example.brownianmotionlab.viewmodel.BrownianMotionViewModel

/**
 * Main Activity host for Brownian Motion Lab.
 * Configures edge-to-edge display and initializes Compose hierarchy.
 */
class MainActivity : ComponentActivity() {

    private val viewModel: BrownianMotionViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            BrownianMotionApp(viewModel = viewModel)
        }
    }

    override fun onPause() {
        super.onPause()
        // Reduce thermal CPU workload when app is moved to background
        viewModel.pauseSimulation()
    }
}
