package com.example.brownianmotionlab.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.brownianmotionlab.model.ExperimentPreset
import com.example.brownianmotionlab.model.SimulationParameters
import com.example.brownianmotionlab.model.SimulationUiState
import com.example.brownianmotionlab.physics.PhysicsEngine
import com.example.brownianmotionlab.physics.Vector2D
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

/**
 * ViewModel governing simulation lifecycle, parameter binding, and real-time state emission.
 */
class BrownianMotionViewModel : ViewModel() {

    private val physicsEngine = PhysicsEngine()
    private val _uiState = MutableStateFlow(physicsEngine.createUiState(isRunning = false))
    val uiState: StateFlow<SimulationUiState> = _uiState.asStateFlow()

    private var simulationJob: Job? = null
    private var isEngineInitialized = false

    init {
        initEngine(SimulationParameters())
        startSimulation()
    }

    fun initEngine(params: SimulationParameters) {
        physicsEngine.initSimulation(params)
        isEngineInitialized = true
        _uiState.value = physicsEngine.createUiState(isRunning = simulationJob?.isActive == true)
    }

    fun setChamberDimensions(width: Float, height: Float) {
        physicsEngine.setChamberSize(width, height)
        if (!isEngineInitialized) {
            initEngine(_uiState.value.parameters)
        } else {
            _uiState.value = physicsEngine.createUiState(isRunning = simulationJob?.isActive == true)
        }
    }

    fun startSimulation() {
        if (simulationJob?.isActive == true) return

        simulationJob = viewModelScope.launch(Dispatchers.Default) {
            var lastTime = System.nanoTime()
            val targetFrameTimeNs = 16_666_667L // ~60 FPS

            while (isActive) {
                val now = System.nanoTime()
                val deltaSec = ((now - lastTime) / 1_000_000_000f).coerceIn(0.005f, 0.04f)
                lastTime = now

                physicsEngine.update(deltaSec)
                _uiState.value = physicsEngine.createUiState(isRunning = true)

                val elapsed = System.nanoTime() - now
                val sleepNs = targetFrameTimeNs - elapsed
                if (sleepNs > 1_000_000L) {
                    delay(sleepNs / 1_000_000L)
                } else {
                    delay(1)
                }
            }
        }
        _uiState.value = _uiState.value.copy(isRunning = true)
    }

    fun pauseSimulation() {
        simulationJob?.cancel()
        simulationJob = null
        _uiState.value = physicsEngine.createUiState(isRunning = false)
    }

    fun toggleRunning() {
        if (simulationJob?.isActive == true) {
            pauseSimulation()
        } else {
            startSimulation()
        }
    }

    fun resetExperiment() {
        pauseSimulation()
        physicsEngine.initSimulation(SimulationParameters())
        _uiState.value = physicsEngine.createUiState(isRunning = false)
    }

    fun resetStatisticsOnly() {
        physicsEngine.resetStatistics()
        _uiState.value = physicsEngine.createUiState(isRunning = simulationJob?.isActive == true)
    }

    fun updateParameters(newParams: SimulationParameters) {
        physicsEngine.updateParameters(newParams)
        _uiState.value = physicsEngine.createUiState(isRunning = simulationJob?.isActive == true)
    }

    fun updateTemperature(temp: Float) {
        val updated = _uiState.value.parameters.copy(temperature = temp)
        updateParameters(updated)
    }

    fun updateParticleCount(count: Int) {
        val updated = _uiState.value.parameters.copy(particleCount = count)
        updateParameters(updated)
    }

    fun updateParticleSize(size: Float) {
        val updated = _uiState.value.parameters.copy(particleSize = size)
        updateParameters(updated)
    }

    fun updateBrownianMass(mass: Float) {
        val updated = _uiState.value.parameters.copy(brownianMass = mass)
        updateParameters(updated)
    }

    fun updateSimulationSpeed(speed: Float) {
        val updated = _uiState.value.parameters.copy(simulationSpeed = speed)
        updateParameters(updated)
    }

    fun updateTrailLength(length: Int) {
        val updated = _uiState.value.parameters.copy(trailLength = length)
        updateParameters(updated)
    }

    fun toggleTrails(show: Boolean) {
        val updated = _uiState.value.parameters.copy(showTrails = show)
        updateParameters(updated)
    }

    fun toggleVelocityVectors(show: Boolean) {
        val updated = _uiState.value.parameters.copy(showVelocityVectors = show)
        updateParameters(updated)
    }

    fun toggleCollisions(show: Boolean) {
        val updated = _uiState.value.parameters.copy(showCollisions = show)
        updateParameters(updated)
    }

    fun applyPreset(preset: ExperimentPreset) {
        updateParameters(preset.parameters)
        physicsEngine.resetStatistics()
    }

    fun onBrownianDragged(x: Float, y: Float) {
        physicsEngine.dragBrownianParticle(Vector2D(x, y))
        _uiState.value = physicsEngine.createUiState(isRunning = simulationJob?.isActive == true)
    }

    fun generateCsvExportData(): String {
        val state = _uiState.value
        val sb = StringBuilder()
        sb.append("Time(s),Measured_MSD(px^2),Theoretical_MSD(px^2),Temperature(C),Particle_Count,Brownian_Mass\n")
        for (dp in state.msdHistory) {
            sb.append(String.format(java.util.Locale.US, "%.2f,%.2f,%.2f,%.1f,%d,%.2f\n",
                dp.time, dp.measuredMsd, dp.theoreticalMsd,
                state.parameters.temperature, state.parameters.particleCount, state.parameters.brownianMass))
        }
        return sb.toString()
    }

    override fun onCleared() {
        super.onCleared()
        simulationJob?.cancel()
    }
}
