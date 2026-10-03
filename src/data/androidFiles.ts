export interface AndroidFileItem {
  path: string;
  category: 'gradle' | 'manifest' | 'kotlin' | 'resource' | 'doc';
  description: string;
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidFileItem[] = [
  {
    path: 'settings.gradle.kts',
    category: 'gradle',
    description: 'Gradle repository management and sub-project inclusion',
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "BrownianMotionLab"
include(":app")
`,
  },
  {
    path: 'build.gradle.kts',
    category: 'gradle',
    description: 'Top-level root build configuration with Compose plugin',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.compose.compiler) apply false
}
`,
  },
  {
    path: 'gradle/libs.versions.toml',
    category: 'gradle',
    description: 'Gradle Version Catalog for Android SDK 35 & Compose',
    content: `[versions]
agp = "8.8.0"
kotlin = "2.1.0"
coreKtx = "1.15.0"
lifecycleRuntimeKtx = "2.8.7"
activityCompose = "1.10.0"
composeBom = "2025.02.00"
coroutines = "1.10.1"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended" }
kotlinx-coroutines-android = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-android", version.ref = "coroutines" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
`,
  },
  {
    path: 'app/build.gradle.kts',
    category: 'gradle',
    description: 'App module build script: SDK 35, Jetpack Compose, Material 3',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.compose.compiler)
}

android {
    namespace = "com.example.brownianmotionlab"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.brownianmotionlab"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
        freeCompilerArgs = freeCompilerArgs + listOf(
            "-opt-in=androidx.compose.material3.ExperimentalMaterial3Api",
            "-opt-in=kotlinx.coroutines.ExperimentalCoroutinesApi"
        )
    }

    buildFeatures {
        compose = true
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.material.icons.extended)
    implementation(libs.kotlinx.coroutines.android)

    debugImplementation(libs.androidx.ui.tooling)
}
`,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    category: 'manifest',
    description: 'Android manifest with MainActivity and dark theme registration',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <application
        android:allowBackup="true"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/Theme.BrownianMotionLab">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden"
            android:theme="@style/Theme.BrownianMotionLab">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`,
  },
  {
    path: 'app/src/main/res/values/strings.xml',
    category: 'resource',
    description: 'String resource definitions',
    content: `<resources>
    <string name="app_name">Brownian Motion Lab</string>
    <string name="app_subtitle">Virtual Physics Experiment</string>
    <string name="start">Start</string>
    <string name="running">Running</string>
    <string name="pause">Pause</string>
    <string name="reset">Reset</string>
</resources>
`,
  },
  {
    path: 'app/src/main/res/values/colors.xml',
    category: 'resource',
    description: 'System color resource definitions',
    content: `<resources>
    <color name="primary">#00E5FF</color>
    <color name="primary_container">#004D5A</color>
    <color name="secondary">#FF9100</color>
    <color name="background">#0B111E</color>
    <color name="surface">#121A2B</color>
    <color name="surface_variant">#1A253C</color>
</resources>
`,
  },
  {
    path: 'app/src/main/res/values/themes.xml',
    category: 'resource',
    description: 'Application theme definitions',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.BrownianMotionLab" parent="android:Theme.Material.NoActionBar">
        <item name="android:statusBarColor">@color/background</item>
        <item name="android:navigationBarColor">@color/background</item>
        <item name="android:windowBackground">@color/background</item>
    </style>
</resources>
`,
  },
  {
    path: 'app/src/main/java/com/example/brownianmotionlab/model/SimulationParameters.kt',
    category: 'kotlin',
    description: 'Data model for experiment parameters and predefined scenarios',
    content: `package com.example.brownianmotionlab.model

/**
 * Physical and visualization parameters for the Brownian Motion experiment.
 */
data class SimulationParameters(
    val temperature: Float = 25f,            // Degrees Celsius (0 to 100)
    val particleCount: Int = 150,           // Number of thermal bath particles (10 to 300)
    val particleSize: Float = 4f,           // Radius in dp of gas particles (2 to 10)
    val brownianMass: Float = 2f,           // Relative mass ratio of Brownian particle (0.5 to 10)
    val simulationSpeed: Float = 1f,        // Time scaling factor (0.25x to 3x)
    val trailLength: Int = 10,              // Number of past positions retained (0 to 30)
    val showTrails: Boolean = true,         // Draw path of Brownian particle
    val showVelocityVectors: Boolean = false,// Draw arrows showing particle velocity
    val showCollisions: Boolean = true      // Render visual collision flash pulses
)

enum class ExperimentPreset(
    val title: String,
    val description: String,
    val parameters: SimulationParameters
) {
    STANDARD(
        title = "Room Temperature",
        description = "Standard equilibrium baseline at 25 °C with 150 particles.",
        parameters = SimulationParameters(
            temperature = 25f,
            particleCount = 150,
            brownianMass = 2f,
            particleSize = 4f,
            trailLength = 15,
            showTrails = true
        )
    ),
    HIGH_TEMPERATURE(
        title = "High Temperature (85 °C)",
        description = "Increased thermal energy yields higher RMS velocity and rapid displacement.",
        parameters = SimulationParameters(
            temperature = 85f,
            particleCount = 150,
            brownianMass = 2f,
            particleSize = 4f,
            trailLength = 20,
            showTrails = true
        )
    ),
    CRYOGENIC(
        title = "Low Temperature (5 °C)",
        description = "Thermal velocities decrease; collisions impart minimal kinetic energy.",
        parameters = SimulationParameters(
            temperature = 5f,
            particleCount = 150,
            brownianMass = 2f,
            particleSize = 4f,
            trailLength = 10,
            showTrails = true
        )
    ),
    HIGH_DENSITY(
        title = "High Density (280 Particles)",
        description = "High collision frequency shortens the mean free path drastically.",
        parameters = SimulationParameters(
            temperature = 30f,
            particleCount = 280,
            brownianMass = 2.5f,
            particleSize = 3.5f,
            trailLength = 25,
            showTrails = true
        )
    ),
    MASSIVE_PARTICLE(
        title = "Massive Particle (Mass = 8.0)",
        description = "High inertia resists momentum transfer from individual molecular impacts.",
        parameters = SimulationParameters(
            temperature = 35f,
            particleCount = 180,
            brownianMass = 8f,
            particleSize = 4f,
            trailLength = 15,
            showTrails = true
        )
    ),
    NANOPARTICLE(
        title = "Light Nanoparticle (Mass = 0.6)",
        description = "Low inertia causes violent erratic trajectories from every collision.",
        parameters = SimulationParameters(
            temperature = 30f,
            particleCount = 130,
            brownianMass = 0.6f,
            particleSize = 4f,
            trailLength = 30,
            showTrails = true
        )
    )
}
`,
  },
  {
    path: 'app/src/main/java/com/example/brownianmotionlab/model/SimulationStatistics.kt',
    category: 'kotlin',
    description: 'Data model for real-time telemetry (speeds, collision count, MSD)',
    content: `package com.example.brownianmotionlab.model

data class SimulationStatistics(
    val simulationTime: Float = 0f,
    val averageParticleSpeed: Float = 0f,
    val brownianParticleSpeed: Float = 0f,
    val collisionCount: Long = 0L,
    val meanSquaredDisplacement: Float = 0f,
    val diffusionCoefficient: Float = 0f,
    val theoreticalMsd: Float = 0f
)
`,
  },
  {
    path: 'app/src/main/java/com/example/brownianmotionlab/model/SimulationState.kt',
    category: 'kotlin',
    description: 'Immutable UI state snapshots observed by Compose',
    content: `package com.example.brownianmotionlab.model

import androidx.compose.ui.geometry.Offset

data class BrownianParticleState(
    val x: Float,
    val y: Float,
    val vx: Float,
    val vy: Float,
    val radius: Float,
    val mass: Float,
    val trail: List<Offset> = emptyList()
)

data class GasParticleState(
    val id: Int,
    val x: Float,
    val y: Float,
    val vx: Float,
    val vy: Float,
    val radius: Float
)

data class CollisionEvent(
    val x: Float,
    val y: Float,
    val intensity: Float,
    val timestamp: Long
)

data class MsdDataPoint(
    val time: Float,
    val measuredMsd: Float,
    val theoreticalMsd: Float
)

data class SimulationUiState(
    val isRunning: Boolean = false,
    val brownianParticle: BrownianParticleState = BrownianParticleState(0f, 0f, 0f, 0f, 24f, 2f),
    val gasParticles: List<GasParticleState> = emptyList(),
    val collisionEvents: List<CollisionEvent> = emptyList(),
    val statistics: SimulationStatistics = SimulationStatistics(),
    val parameters: SimulationParameters = SimulationParameters(),
    val msdHistory: List<MsdDataPoint> = emptyList(),
    val chamberWidth: Float = 600f,
    val chamberHeight: Float = 600f
)
`,
  },
  {
    path: 'app/src/main/java/com/example/brownianmotionlab/physics/Vector2D.kt',
    category: 'kotlin',
    description: '2D vector operations and distance mathematics',
    content: `package com.example.brownianmotionlab.physics

import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt

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
`,
  },
  {
    path: 'app/src/main/java/com/example/brownianmotionlab/physics/GasParticle.kt',
    category: 'kotlin',
    description: 'Physical state of thermal bath particles',
    content: `package com.example.brownianmotionlab.physics

import com.example.brownianmotionlab.model.GasParticleState

class GasParticle(
    val id: Int,
    var position: Vector2D,
    var velocity: Vector2D,
    var radius: Float = 4f,
    var mass: Float = 0.1f
) {
    fun toState(): GasParticleState = GasParticleState(
        id = id,
        x = position.x,
        y = position.y,
        vx = velocity.x,
        vy = velocity.y,
        radius = radius
    )
}
`,
  },
  {
    path: 'app/src/main/java/com/example/brownianmotionlab/physics/BrownianParticle.kt',
    category: 'kotlin',
    description: 'Observed colloid particle with trajectory ring buffer',
    content: `package com.example.brownianmotionlab.physics

import androidx.compose.ui.geometry.Offset
import com.example.brownianmotionlab.model.BrownianParticleState
import java.util.ArrayDeque

class BrownianParticle(
    var position: Vector2D,
    var velocity: Vector2D = Vector2D.ZERO,
    var radius: Float = 22f,
    var mass: Float = 2.0f
) {
    var initialPosition: Vector2D = position
    private val trailDeque: ArrayDeque<Offset> = ArrayDeque()

    fun resetTrajectory(newPos: Vector2D) {
        position = newPos
        initialPosition = newPos
        velocity = Vector2D.ZERO
        trailDeque.clear()
        trailDeque.add(Offset(newPos.x, newPos.y))
    }

    fun recordTrail(maxTrailLength: Int) {
        if (maxTrailLength <= 0) {
            trailDeque.clear()
            return
        }
        trailDeque.add(Offset(position.x, position.y))
        while (trailDeque.size > maxTrailLength) {
            trailDeque.removeFirst()
        }
    }

    fun getDisplacementSquared(): Float = position.distanceSquaredTo(initialPosition)

    fun toState(): BrownianParticleState = BrownianParticleState(
        x = position.x,
        y = position.y,
        vx = velocity.x,
        vy = velocity.y,
        radius = radius,
        mass = mass,
        trail = trailDeque.toList()
    )
}
`,
  },
  {
    path: 'app/src/main/java/com/example/brownianmotionlab/physics/CollisionDetector.kt',
    category: 'kotlin',
    description: 'Elastic momentum transfer and wall collision resolver',
    content: `package com.example.brownianmotionlab.physics

import kotlin.math.sqrt

object CollisionDetector {

    fun resolveBoundaryCollision(
        particlePos: Vector2D,
        particleVel: Vector2D,
        radius: Float,
        chamberWidth: Float,
        chamberHeight: Float,
        restitution: Float = 0.98f
    ): Pair<Vector2D, Vector2D> {
        var x = particlePos.x
        var y = particlePos.y
        var vx = particleVel.x
        var vy = particleVel.y

        val minX = radius
        val maxX = chamberWidth - radius
        val minY = radius
        val maxY = chamberHeight - radius

        if (x < minX) {
            x = minX
            vx = -vx * restitution
        } else if (x > maxX) {
            x = maxX
            vx = -vx * restitution
        }

        if (y < minY) {
            y = minY
            vy = -vy * restitution
        } else if (y > maxY) {
            y = maxY
            vy = -vy * restitution
        }

        return Pair(Vector2D(x, y), Vector2D(vx, vy))
    }

    fun resolveBrownianGasCollision(brownian: BrownianParticle, gas: GasParticle): Boolean {
        val deltaPos = brownian.position - gas.position
        val distSq = deltaPos.lengthSquared()
        val minDist = brownian.radius + gas.radius

        if (distSq < minDist * minDist && distSq > 0.0001f) {
            val dist = sqrt(distSq)
            val normal = deltaPos / dist
            val relVel = brownian.velocity - gas.velocity
            val velAlongNormal = relVel.dot(normal)

            if (velAlongNormal < 0f) {
                val m1 = brownian.mass
                val m2 = gas.mass
                val impulseScalar = -(2f * velAlongNormal) / (m1 + m2)
                val impulse = normal * impulseScalar

                brownian.velocity = brownian.velocity + (impulse / m1)
                gas.velocity = gas.velocity - (impulse / m2)

                val overlap = minDist - dist
                val correction = normal * (overlap * 0.5f)
                brownian.position = brownian.position + (correction * (m2 / (m1 + m2)))
                gas.position = gas.position - (correction * (m1 / (m1 + m2)))
                return true
            }
        }
        return false
    }

    fun resolveGasGasCollision(p1: GasParticle, p2: GasParticle): Boolean {
        val deltaPos = p1.position - p2.position
        val distSq = deltaPos.lengthSquared()
        val minDist = p1.radius + p2.radius

        if (distSq < minDist * minDist && distSq > 0.0001f) {
            val dist = sqrt(distSq)
            val normal = deltaPos / dist
            val relVel = p1.velocity - p2.velocity
            val velAlongNormal = relVel.dot(normal)

            if (velAlongNormal < 0f) {
                val impulse = normal * (-velAlongNormal)
                p1.velocity = p1.velocity + impulse
                p2.velocity = p2.velocity - impulse

                val overlap = minDist - dist
                val correction = normal * (overlap * 0.5f)
                p1.position = p1.position + correction
                p2.position = p2.position - correction
                return true
            }
        }
        return false
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/example/brownianmotionlab/physics/PhysicsEngine.kt',
    category: 'kotlin',
    description: 'Sub-stepped physics engine with Stokes drag and spatial bins',
    content: `package com.example.brownianmotionlab.physics

import com.example.brownianmotionlab.model.*
import java.util.concurrent.CopyOnWriteArrayList
import kotlin.math.*
import kotlin.random.Random

class PhysicsEngine {
    var chamberWidth: Float = 600f; private set
    var chamberHeight: Float = 600f; private set

    private var parameters = SimulationParameters()
    private val brownianParticle = BrownianParticle(Vector2D(300f, 300f), radius = 24f, mass = 2f)
    private val gasParticles = ArrayList<GasParticle>()
    private val collisionEvents = CopyOnWriteArrayList<CollisionEvent>()

    private var totalCollisions: Long = 0L
    private var simulationTime: Float = 0f
    private var lastMsdSampleTime: Float = 0f
    private val msdHistory = ArrayList<MsdDataPoint>()

    fun setChamberSize(width: Float, height: Float) {
        if (width > 50f && height > 50f) {
            val oldW = chamberWidth
            val oldH = chamberHeight
            chamberWidth = width
            chamberHeight = height
            if (oldW > 0 && oldH > 0) {
                val nx = (brownianParticle.position.x / oldW) * width
                val ny = (brownianParticle.position.y / oldH) * height
                brownianParticle.position = Vector2D(nx.coerceIn(30f, width - 30f), ny.coerceIn(30f, height - 30f))
            }
        }
    }

    fun initSimulation(params: SimulationParameters) {
        parameters = params
        brownianParticle.mass = params.brownianMass
        brownianParticle.radius = 22f + (params.brownianMass - 0.5f) * 1.5f
        brownianParticle.resetTrajectory(Vector2D(chamberWidth / 2f, chamberHeight / 2f))
        totalCollisions = 0L
        simulationTime = 0f
        lastMsdSampleTime = 0f
        msdHistory.clear()
        collisionEvents.clear()
        spawnGasParticles(params.particleCount, params.temperature, params.particleSize)
    }

    fun updateParameters(newParams: SimulationParameters) {
        val oldParams = parameters
        parameters = newParams
        brownianParticle.mass = newParams.brownianMass
        brownianParticle.radius = 22f + (newParams.brownianMass - 0.5f) * 1.5f
        if (newParams.particleCount != oldParams.particleCount) {
            adjustParticleCount(newParams.particleCount, newParams.temperature, newParams.particleSize)
        }
        if (newParams.temperature != oldParams.temperature) {
            rescaleThermalVelocities(newParams.temperature)
        }
        if (newParams.particleSize != oldParams.particleSize) {
            for (p in gasParticles) p.radius = newParams.particleSize
        }
    }

    private fun spawnGasParticles(count: Int, tempCelsius: Float, radius: Float) {
        gasParticles.clear()
        val tempKelvin = tempCelsius + 273.15f
        val baseSpeed = sqrt(tempKelvin * 0.75f) * 4.5f
        for (i in 0 until count) {
            var pos: Vector2D
            var attempts = 0
            do {
                val x = Random.nextFloat() * (chamberWidth - 2 * radius) + radius
                val y = Random.nextFloat() * (chamberHeight - 2 * radius) + radius
                pos = Vector2D(x, y)
                attempts++
            } while (attempts < 20 && pos.distanceTo(brownianParticle.position) < brownianParticle.radius + radius + 10f)

            val u1 = max(0.00001f, Random.nextFloat())
            val u2 = Random.nextFloat()
            val speed = baseSpeed * sqrt(-2f * ln(u1))
            val angle = (u2 * 2f * PI).toFloat()
            val vel = Vector2D.fromAngleAndMagnitude(angle, speed)
            gasParticles.add(GasParticle(i, pos, vel, radius, 0.12f))
        }
    }

    private fun adjustParticleCount(targetCount: Int, tempCelsius: Float, radius: Float) {
        if (targetCount > gasParticles.size) {
            val toAdd = targetCount - gasParticles.size
            val tempKelvin = tempCelsius + 273.15f
            val baseSpeed = sqrt(tempKelvin * 0.75f) * 4.5f
            var nextId = gasParticles.size
            repeat(toAdd) {
                val x = Random.nextFloat() * (chamberWidth - 2 * radius) + radius
                val y = Random.nextFloat() * (chamberHeight - 2 * radius) + radius
                val angle = Random.nextFloat() * 2f * PI.toFloat()
                gasParticles.add(GasParticle(nextId++, Vector2D(x, y), Vector2D.fromAngleAndMagnitude(angle, baseSpeed), radius, 0.12f))
            }
        } else if (targetCount < gasParticles.size) {
            while (gasParticles.size > targetCount) gasParticles.removeAt(gasParticles.size - 1)
        }
    }

    private fun rescaleThermalVelocities(tempCelsius: Float) {
        val tempKelvin = tempCelsius + 273.15f
        val targetRms = sqrt(tempKelvin * 0.75f) * 4.5f
        for (p in gasParticles) {
            val currentSpeed = p.velocity.length()
            if (currentSpeed > 0.001f) {
                p.velocity = p.velocity * (0.8f + 0.2f * (targetRms / currentSpeed))
            } else {
                val angle = Random.nextFloat() * 2f * PI.toFloat()
                p.velocity = Vector2D.fromAngleAndMagnitude(angle, targetRms)
            }
        }
    }

    fun update(rawDt: Float) {
        val dt = (rawDt * parameters.simulationSpeed).coerceIn(0.001f, 0.05f)
        val subSteps = 3
        val subDt = dt / subSteps

        val now = System.currentTimeMillis()
        collisionEvents.removeAll { now - it.timestamp > 350 }

        for (step in 0 until subSteps) {
            for (p in gasParticles) {
                p.position = p.position + (p.velocity * subDt)
                val (newPos, newVel) = CollisionDetector.resolveBoundaryCollision(p.position, p.velocity, p.radius, chamberWidth, chamberHeight)
                p.position = newPos
                p.velocity = newVel
            }

            brownianParticle.velocity = brownianParticle.velocity * 0.9985f
            brownianParticle.position = brownianParticle.position + (brownianParticle.velocity * subDt)
            val (bpPos, bpVel) = CollisionDetector.resolveBoundaryCollision(brownianParticle.position, brownianParticle.velocity, brownianParticle.radius, chamberWidth, chamberHeight, 0.85f)
            brownianParticle.position = bpPos
            brownianParticle.velocity = bpVel

            for (p in gasParticles) {
                if (CollisionDetector.resolveBrownianGasCollision(brownianParticle, p)) {
                    totalCollisions++
                    if (parameters.showCollisions && collisionEvents.size < 12) {
                        collisionEvents.add(CollisionEvent((brownianParticle.position.x + p.position.x) / 2f, (brownianParticle.position.y + p.position.y) / 2f, min(1f, p.velocity.length() / 80f), System.currentTimeMillis()))
                    }
                }
            }

            resolveGasGasCollisions()
        }

        if (parameters.showTrails) brownianParticle.recordTrail(parameters.trailLength)
        simulationTime += dt

        if (simulationTime - lastMsdSampleTime >= 0.25f) {
            lastMsdSampleTime = simulationTime
            sampleMsd()
        }
    }

    private fun resolveGasGasCollisions() {
        val cellSize = 30f
        val cols = max(1, (chamberWidth / cellSize).toInt() + 1)
        val rows = max(1, (chamberHeight / cellSize).toInt() + 1)
        val grid = HashMap<Int, ArrayList<GasParticle>>()

        for (p in gasParticles) {
            val c = (p.position.x / cellSize).toInt().coerceIn(0, cols - 1)
            val r = (p.position.y / cellSize).toInt().coerceIn(0, rows - 1)
            grid.getOrPut(r * cols + c) { ArrayList() }.add(p)
        }

        for ((key, list) in grid) {
            val r = key / cols
            val c = key % cols
            for (i in 0 until list.size) {
                for (j in i + 1 until list.size) {
                    CollisionDetector.resolveGasGasCollision(list[i], list[j])
                }
            }
            val neighborOffsets = arrayOf(Pair(0, 1), Pair(1, 0), Pair(1, 1), Pair(-1, 1))
            for ((dr, dc) in neighborOffsets) {
                val nr = r + dr
                val nc = c + dc
                if (nr in 0 until rows && nc in 0 until cols) {
                    grid[nr * cols + nc]?.let { nList ->
                        for (p1 in list) {
                            for (p2 in nList) {
                                CollisionDetector.resolveGasGasCollision(p1, p2)
                            }
                        }
                    }
                }
            }
        }
    }

    private fun sampleMsd() {
        val currentMsd = brownianParticle.getDisplacementSquared()
        val tempK = parameters.temperature + 273.15f
        val theoreticalD = (tempK * 0.08f) / (brownianParticle.radius * parameters.brownianMass)
        val theoreticalMsd = 4f * theoreticalD * simulationTime * 12f

        msdHistory.add(MsdDataPoint(simulationTime, currentMsd, theoreticalMsd))
        if (msdHistory.size > 150) msdHistory.removeAt(0)
    }

    fun resetStatistics() {
        totalCollisions = 0L
        simulationTime = 0f
        lastMsdSampleTime = 0f
        msdHistory.clear()
        collisionEvents.clear()
        brownianParticle.initialPosition = brownianParticle.position
    }

    fun dragBrownianParticle(newPos: Vector2D) {
        val clampedX = newPos.x.coerceIn(brownianParticle.radius, chamberWidth - brownianParticle.radius)
        val clampedY = newPos.y.coerceIn(brownianParticle.radius, chamberHeight - brownianParticle.radius)
        brownianParticle.position = Vector2D(clampedX, clampedY)
        brownianParticle.velocity = Vector2D.ZERO
    }

    fun createUiState(isRunning: Boolean): SimulationUiState {
        var totalSpeed = 0f
        for (p in gasParticles) totalSpeed += p.velocity.length()
        val avgSpeed = if (gasParticles.isNotEmpty()) totalSpeed / gasParticles.size else 0f
        val bpSpeed = brownianParticle.velocity.length()
        val currentMsd = brownianParticle.getDisplacementSquared()
        val tempK = parameters.temperature + 273.15f
        val diffusionD = (tempK * 0.08f) / (brownianParticle.radius * parameters.brownianMass)

        val stats = SimulationStatistics(
            simulationTime = simulationTime,
            averageParticleSpeed = avgSpeed,
            brownianParticleSpeed = bpSpeed,
            collisionCount = totalCollisions,
            meanSquaredDisplacement = currentMsd,
            diffusionCoefficient = diffusionD,
            theoreticalMsd = 4f * diffusionD * simulationTime * 12f
        )

        return SimulationUiState(
            isRunning = isRunning,
            brownianParticle = brownianParticle.toState(),
            gasParticles = gasParticles.map { it.toState() },
            collisionEvents = collisionEvents.toList(),
            statistics = stats,
            parameters = parameters,
            msdHistory = msdHistory.toList(),
            chamberWidth = chamberWidth,
            chamberHeight = chamberHeight
        )
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/example/brownianmotionlab/viewmodel/BrownianMotionViewModel.kt',
    category: 'kotlin',
    description: 'MVVM ViewModel driving the 60 Hz coroutine loop',
    content: `package com.example.brownianmotionlab.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.brownianmotionlab.model.*
import com.example.brownianmotionlab.physics.PhysicsEngine
import com.example.brownianmotionlab.physics.Vector2D
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

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
            val targetFrameTimeNs = 16_666_667L

            while (isActive) {
                val now = System.nanoTime()
                val deltaSec = ((now - lastTime) / 1_000_000_000f).coerceIn(0.005f, 0.04f)
                lastTime = now

                physicsEngine.update(deltaSec)
                _uiState.value = physicsEngine.createUiState(isRunning = true)

                val elapsed = System.nanoTime() - now
                val sleepNs = targetFrameTimeNs - elapsed
                if (sleepNs > 1_000_000L) delay(sleepNs / 1_000_000L) else delay(1)
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
        if (simulationJob?.isActive == true) pauseSimulation() else startSimulation()
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

    fun updateTemperature(temp: Float) = updateParameters(_uiState.value.parameters.copy(temperature = temp))
    fun updateParticleCount(count: Int) = updateParameters(_uiState.value.parameters.copy(particleCount = count))
    fun updateParticleSize(size: Float) = updateParameters(_uiState.value.parameters.copy(particleSize = size))
    fun updateBrownianMass(mass: Float) = updateParameters(_uiState.value.parameters.copy(brownianMass = mass))
    fun updateSimulationSpeed(speed: Float) = updateParameters(_uiState.value.parameters.copy(simulationSpeed = speed))
    fun updateTrailLength(length: Int) = updateParameters(_uiState.value.parameters.copy(trailLength = length))
    fun toggleTrails(show: Boolean) = updateParameters(_uiState.value.parameters.copy(showTrails = show))
    fun toggleVelocityVectors(show: Boolean) = updateParameters(_uiState.value.parameters.copy(showVelocityVectors = show))
    fun toggleCollisions(show: Boolean) = updateParameters(_uiState.value.parameters.copy(showCollisions = show))

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
        sb.append("Time(s),Measured_MSD(px^2),Theoretical_MSD(px^2),Temperature(C),Particle_Count,Brownian_Mass\\n")
        for (dp in state.msdHistory) {
            sb.append(String.format(java.util.Locale.US, "%.2f,%.2f,%.2f,%.1f,%d,%.2f\\n",
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
`,
  },
  {
    path: 'app/src/main/java/com/example/brownianmotionlab/ui/theme/Color.kt',
    category: 'kotlin',
    description: 'Dark laboratory color scheme for scientific clarity',
    content: `package com.example.brownianmotionlab.ui.theme

import androidx.compose.ui.graphics.Color

val LabDarkBackground = Color(0xFF0B111E)
val LabChamberBackground = Color(0xFF060A13)
val LabChamberBorder = Color(0xFF1E2D4A)

val LabSurface = Color(0xFF111927)
val LabSurfaceVariant = Color(0xFF182236)
val LabSurfaceBorder = Color(0xFF1E293B)

val LabPrimaryCyan = Color(0xFF00E5FF)
val LabPrimaryGlow = Color(0x3300E5FF)
val LabSecondaryAmber = Color(0xFFFF9100)
val LabAmberGlow = Color(0x44FF9100)

val LabAccentEmerald = Color(0xFF00E676)
val LabAccentCoral = Color(0xFFFF5252)

val LabTextPrimary = Color(0xFFF1F5F9)
val LabTextSecondary = Color(0xFF94A3B8)
val LabTextMuted = Color(0xFF64748B)

val GasParticleColor = Color(0xFF38BDF8)
val GasParticleGlow = Color(0x5538BDF8)
val BrownianParticleCore = Color(0xFFFF9100)
val BrownianParticleHalo = Color(0x66FFAB40)
val TrailColor = Color(0xFFFFD54F)
val VelocityVectorColor = Color(0xFF00E5FF)
val CollisionRippleColor = Color(0xFFFF5252)
`,
  },
  {
    path: 'app/src/main/java/com/example/brownianmotionlab/ui/theme/Type.kt',
    category: 'kotlin',
    description: 'Typography definition pairing clean sans and monospace telemetry',
    content: `package com.example.brownianmotionlab.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val Typography = Typography(
    headlineLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Bold,
        fontSize = 26.sp,
        lineHeight = 32.sp
    ),
    headlineMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.SemiBold,
        fontSize = 20.sp,
        lineHeight = 26.sp
    ),
    titleMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.SemiBold,
        fontSize = 16.sp,
        lineHeight = 22.sp
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Normal,
        fontSize = 15.sp,
        lineHeight = 22.sp
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Normal,
        fontSize = 13.sp,
        lineHeight = 18.sp
    ),
    labelSmall = TextStyle(
        fontFamily = FontFamily.Monospace,
        fontWeight = FontWeight.Medium,
        fontSize = 11.sp,
        lineHeight = 15.sp,
        letterSpacing = 0.5.sp
    )
)
`,
  },
  {
    path: 'app/src/main/java/com/example/brownianmotionlab/ui/theme/Theme.kt',
    category: 'kotlin',
    description: 'Material 3 theme configuration',
    content: `package com.example.brownianmotionlab.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LabDarkColorScheme = darkColorScheme(
    primary = LabPrimaryCyan,
    onPrimary = LabDarkBackground,
    primaryContainer = Color(0xFF00363D),
    onPrimaryContainer = LabPrimaryCyan,
    secondary = LabSecondaryAmber,
    onSecondary = LabDarkBackground,
    secondaryContainer = Color(0xFF4E2600),
    onSecondaryContainer = LabSecondaryAmber,
    tertiary = LabAccentEmerald,
    background = LabDarkBackground,
    onBackground = LabTextPrimary,
    surface = LabSurface,
    onSurface = LabTextPrimary,
    surfaceVariant = LabSurfaceVariant,
    onSurfaceVariant = LabTextSecondary,
    outline = LabSurfaceBorder
)

@Composable
fun BrownianMotionLabTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = LabDarkBackground.toArgb()
            window.navigationBarColor = LabDarkBackground.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
            WindowCompat.getInsetsController(window, view).isAppearanceLightNavigationBars = false
        }
    }

    MaterialTheme(
        colorScheme = LabDarkColorScheme,
        typography = Typography,
        content = content
    )
}
`,
  },
  {
    path: 'app/src/main/java/com/example/brownianmotionlab/ui/components/ParameterSlider.kt',
    category: 'kotlin',
    description: 'Accessible Material 3 slider component',
    content: `package com.example.brownianmotionlab.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.example.brownianmotionlab.ui.theme.*

@Composable
fun ParameterSlider(
    label: String,
    value: Float,
    onValueChange: (Float) -> Unit,
    valueRange: ClosedFloatingPointRange<Float>,
    displayValue: String,
    modifier: Modifier = Modifier,
    steps: Int = 0
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .semantics(mergeDescendants = true) {
                contentDescription = "$label: $displayValue"
            }
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(label, style = MaterialTheme.typography.bodyMedium, color = LabTextSecondary)
            Text(displayValue, style = MaterialTheme.typography.labelSmall, color = LabPrimaryCyan)
        }
        Slider(
            value = value,
            onValueChange = onValueChange,
            valueRange = valueRange,
            steps = steps,
            colors = SliderDefaults.colors(
                thumbColor = LabPrimaryCyan,
                activeTrackColor = LabPrimaryCyan,
                inactiveTrackColor = LabSurfaceBorder
            ),
            modifier = Modifier.fillMaxWidth()
        )
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/example/brownianmotionlab/ui/components/SimulationCanvas.kt',
    category: 'kotlin',
    description: 'Hardware accelerated simulation viewport with pointer gestures',
    content: `package com.example.brownianmotionlab.ui.components

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
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.dp
import com.example.brownianmotionlab.model.SimulationUiState
import com.example.brownianmotionlab.ui.theme.*
import kotlin.math.*

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

            val gridStep = 40.dp.toPx()
            var gx = gridStep
            while (gx < size.width) {
                drawLine(Color(0x0CFFFFFF), Offset(gx, 0f), Offset(gx, size.height), 1f)
                gx += gridStep
            }
            var gy = gridStep
            while (gy < size.height) {
                drawLine(Color(0x0CFFFFFF), Offset(0f, gy), Offset(size.width, gy), 1f)
                gy += gridStep
            }

            if (params.showCollisions) {
                val now = System.currentTimeMillis()
                for (event in uiState.collisionEvents) {
                    val age = now - event.timestamp
                    if (age in 0..350) {
                        val progress = age / 350f
                        drawCircle(
                            color = CollisionRippleColor.copy(alpha = (1f - progress) * 0.8f),
                            radius = 6f + progress * 24f,
                            center = Offset(event.x, event.y),
                            style = Stroke(width = 2.dp.toPx() * (1f - progress))
                        )
                    }
                }
            }

            if (params.showTrails && bp.trail.size > 1) {
                val trailSize = bp.trail.size
                for (i in 0 until trailSize - 1) {
                    val p1 = bp.trail[i]
                    val p2 = bp.trail[i + 1]
                    val alpha = ((i + 1).toFloat() / trailSize).coerceIn(0.1f, 0.9f)
                    drawLine(
                        color = TrailColor.copy(alpha = alpha),
                        start = p1,
                        end = p2,
                        strokeWidth = (1f + (i.toFloat() / trailSize) * 2.5f).dp.toPx(),
                        cap = StrokeCap.Round
                    )
                }
            }

            val gasRadiusPx = params.particleSize.dp.toPx()
            for (p in uiState.gasParticles) {
                val center = Offset(p.x, p.y)
                drawCircle(GasParticleGlow, gasRadiusPx * 1.8f, center)
                drawCircle(GasParticleColor, gasRadiusPx, center)

                if (params.showVelocityVectors) {
                    val end = Offset(p.x + p.vx * 0.25f, p.y + p.vy * 0.25f)
                    drawLine(VelocityVectorColor.copy(alpha = 0.5f), center, end, 1.dp.toPx())
                }
            }

            val bpCenter = Offset(bp.x, bp.y)
            val bpRadiusPx = bp.radius.dp.toPx()

            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(BrownianParticleHalo, Color.Transparent),
                    center = bpCenter,
                    radius = bpRadiusPx * 2.2f
                ),
                radius = bpRadiusPx * 2.2f,
                center = bpCenter
            )

            drawCircle(
                color = BrownianParticleCore.copy(alpha = 0.4f),
                radius = bpRadiusPx + 3.dp.toPx(),
                center = bpCenter,
                style = Stroke(width = 1.5.dp.toPx())
            )

            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(Color(0xFFFFD54F), BrownianParticleCore, Color(0xFFE65100)),
                    center = Offset(bp.x - bpRadiusPx * 0.3f, bp.y - bpRadiusPx * 0.3f),
                    radius = bpRadiusPx
                ),
                radius = bpRadiusPx,
                center = bpCenter
            )

            val crosshairLen = 4.dp.toPx()
            drawLine(Color.White.copy(alpha = 0.7f), Offset(bp.x - crosshairLen, bp.y), Offset(bp.x + crosshairLen, bp.y), 1.dp.toPx())
            drawLine(Color.White.copy(alpha = 0.7f), Offset(bp.x, bp.y - crosshairLen), Offset(bp.x, bp.y + crosshairLen), 1.dp.toPx())

            if (params.showVelocityVectors) {
                val vecEnd = Offset(bp.x + bp.vx * 0.4f, bp.y + bp.vy * 0.4f)
                drawLine(VelocityVectorColor, bpCenter, vecEnd, 2.5.dp.toPx(), StrokeCap.Round)
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/example/brownianmotionlab/ui/components/ExperimentControls.kt',
    category: 'kotlin',
    description: 'Experiment parameter sliders and action buttons',
    content: `package com.example.brownianmotionlab.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.example.brownianmotionlab.model.SimulationParameters
import com.example.brownianmotionlab.ui.theme.*
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
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Experiment Controls", style = MaterialTheme.typography.titleMedium, color = LabTextPrimary)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                if (isRunning) {
                    Button(onClick = onPause, colors = ButtonDefaults.buttonColors(containerColor = LabSecondaryAmber, contentColor = LabDarkBackground), shape = RoundedCornerShape(8.dp)) {
                        Icon(Icons.Default.Pause, "Pause")
                        Spacer(Modifier.width(4.dp))
                        Text("Pause")
                    }
                } else {
                    Button(onClick = onStart, colors = ButtonDefaults.buttonColors(containerColor = LabPrimaryCyan, contentColor = LabDarkBackground), shape = RoundedCornerShape(8.dp)) {
                        Icon(Icons.Default.PlayArrow, "Start")
                        Spacer(Modifier.width(4.dp))
                        Text("Start")
                    }
                }
                OutlinedButton(onClick = onReset, colors = ButtonDefaults.outlinedButtonColors(contentColor = LabTextSecondary), shape = RoundedCornerShape(8.dp)) {
                    Icon(Icons.Default.Refresh, "Reset")
                    Spacer(Modifier.width(4.dp))
                    Text("Reset")
                }
            }
        }

        Spacer(Modifier.height(12.dp))

        ParameterSlider("Temperature", parameters.temperature, onTemperatureChange, 0f..100f, String.format(Locale.US, "%.0f °C", parameters.temperature))
        ParameterSlider("Particle Density", parameters.particleCount.toFloat(), { onParticleCountChange(it.toInt()) }, 10f..300f, "\${parameters.particleCount} particles")
        ParameterSlider("Particle Size", parameters.particleSize, onParticleSizeChange, 2f..10f, String.format(Locale.US, "%.1f dp", parameters.particleSize))
        ParameterSlider("Brownian Particle Mass", parameters.brownianMass, onBrownianMassChange, 0.5f..10f, String.format(Locale.US, "%.1f M₀", parameters.brownianMass))
        ParameterSlider("Simulation Speed", parameters.simulationSpeed, onSimulationSpeedChange, 0.25f..3f, String.format(Locale.US, "%.2fx", parameters.simulationSpeed))
        ParameterSlider("Trail Length", parameters.trailLength.toFloat(), { onTrailLengthChange(it.toInt()) }, 0f..30f, "\${parameters.trailLength} pts")

        Spacer(Modifier.height(8.dp))
        Text("Visual Indicators", style = MaterialTheme.typography.bodyMedium, color = LabTextSecondary)
        Spacer(Modifier.height(6.dp))

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            FilterChip(
                selected = parameters.showTrails,
                onClick = { onToggleTrails(!parameters.showTrails) },
                label = { Text("Particle Trails") }
            )
            FilterChip(
                selected = parameters.showVelocityVectors,
                onClick = { onToggleVelocityVectors(!parameters.showVelocityVectors) },
                label = { Text("Vectors") }
            )
            FilterChip(
                selected = parameters.showCollisions,
                onClick = { onToggleCollisions(!parameters.showCollisions) },
                label = { Text("Collisions") }
            )
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/example/brownianmotionlab/ui/components/StatisticsCard.kt',
    category: 'kotlin',
    description: 'Telemetry readout cards for physical observables',
    content: `package com.example.brownianmotionlab.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.example.brownianmotionlab.model.SimulationParameters
import com.example.brownianmotionlab.model.SimulationStatistics
import com.example.brownianmotionlab.ui.theme.*
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
            Text("Live Experiment Data", style = MaterialTheme.typography.titleMedium, color = LabTextPrimary)
            TextButton(onClick = onResetStats) {
                Text("Zero Stats", color = LabSecondaryAmber)
            }
        }

        Spacer(Modifier.height(8.dp))

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                MetricItem("Temperature", String.format(Locale.US, "%.0f °C", parameters.temperature))
                MetricItem("Particle Count", "\${parameters.particleCount}")
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
        Text(label, style = MaterialTheme.typography.bodyMedium, color = LabTextSecondary)
        Text(value, style = MaterialTheme.typography.labelSmall, color = LabPrimaryCyan)
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/example/brownianmotionlab/ui/components/ExperimentGraph.kt',
    category: 'kotlin',
    description: 'Real-time MSD vs Time Canvas line graph with Einstein 4Dt curve',
    content: `package com.example.brownianmotionlab.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp
import com.example.brownianmotionlab.model.MsdDataPoint
import com.example.brownianmotionlab.ui.theme.*
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
        Column {
            Text("Mean Squared Displacement vs Time", style = MaterialTheme.typography.titleMedium, color = LabTextPrimary)
            Text("Einstein relation: ⟨Δr²⟩ ≈ 4Dt (2D diffusion)", style = MaterialTheme.typography.bodyMedium, color = LabTextSecondary)
        }

        Spacer(Modifier.height(12.dp))

        Row(horizontalArrangement = Arrangement.spacedBy(16.dp), verticalAlignment = Alignment.CenterVertically) {
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

            drawLine(LabSurfaceBorder, Offset(paddingLeft, paddingTop), Offset(paddingLeft, size.height - paddingBottom), 1.5.dp.toPx())
            drawLine(LabSurfaceBorder, Offset(paddingLeft, size.height - paddingBottom), Offset(size.width - paddingRight, size.height - paddingBottom), 1.5.dp.toPx())

            if (msdHistory.size >= 2) {
                val maxTime = max(1f, msdHistory.last().time)
                var maxMsd = 100f
                for (dp in msdHistory) {
                    if (dp.measuredMsd > maxMsd) maxMsd = dp.measuredMsd
                    if (dp.theoreticalMsd > maxMsd) maxMsd = dp.theoreticalMsd
                }
                maxMsd *= 1.15f

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
                drawPath(theoryPath, LabSecondaryAmber, style = Stroke(2.dp.toPx(), pathEffect = PathEffect.dashPathEffect(floatArrayOf(12f, 8f), 0f)))

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
                drawPath(measuredPath, LabPrimaryCyan, style = Stroke(2.dp.toPx(), cap = StrokeCap.Round))
            }
        }

        Spacer(Modifier.height(8.dp))
        Text(
            "Note: In 2 dimensions, diffusive displacement scales linearly with elapsed time according to Einstein's relation. Fluctuations around the line represent stochastic molecular bombardment.",
            style = MaterialTheme.typography.bodyMedium,
            color = LabTextMuted
        )
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/example/brownianmotionlab/ui/components/InfoSection.kt',
    category: 'kotlin',
    description: 'Educational concepts and guided experiment cards',
    content: `package com.example.brownianmotionlab.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.example.brownianmotionlab.model.ExperimentPreset
import com.example.brownianmotionlab.ui.theme.*

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
            modifier = Modifier.fillMaxWidth().clickable { isExpanded = !isExpanded },
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text("What is Brownian Motion?", style = MaterialTheme.typography.titleMedium, color = LabTextPrimary)
                Text("Core concepts, equations, and suggested experiments", style = MaterialTheme.typography.bodyMedium, color = LabTextSecondary)
            }
            Icon(if (isExpanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore, "Toggle", tint = LabPrimaryCyan)
        }

        Spacer(Modifier.height(8.dp))
        Text(
            "Brownian motion is the random movement of microscopic particles suspended in a fluid. The motion occurs because the particle is continuously bombarded by surrounding molecules that are too small to see.",
            style = MaterialTheme.typography.bodyLarge,
            color = LabTextPrimary
        )

        AnimatedVisibility(visible = isExpanded) {
            Column(modifier = Modifier.padding(top = 16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                InfoBlock("What are we observing?", "The central large particle represents an observable micro-scale entity. The surrounding smaller blue particles represent fluid or gas molecules in thermal motion.")
                InfoBlock("Why does the particle move randomly?", "At any microsecond, molecular impacts on one side do not perfectly balance those on the opposite side, causing stochastic net forces.")
                InfoBlock("What happens when temperature increases?", "Average kinetic energy is proportional to temperature: KE = ½mv² ∝ k_B T. Rising temperature accelerates molecular velocities and expands random walk dispersion.")
                InfoBlock("What is Mean Squared Displacement?", "In 2D diffusion, Einstein established: ⟨(Δr)²⟩ = 4Dt, where D is the diffusion coefficient.")
            }
        }
    }
}

@Composable
private fun InfoBlock(title: String, content: String) {
    Column {
        Text(title, style = MaterialTheme.typography.titleMedium, color = LabPrimaryCyan)
        Spacer(Modifier.height(4.dp))
        Text(content, style = MaterialTheme.typography.bodyMedium, color = LabTextSecondary)
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/example/brownianmotionlab/ui/BrownianMotionScreen.kt',
    category: 'kotlin',
    description: 'Adaptive responsive layout for phones, foldables, and tablets',
    content: `package com.example.brownianmotionlab.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.brownianmotionlab.ui.components.*
import com.example.brownianmotionlab.ui.theme.LabDarkBackground
import com.example.brownianmotionlab.viewmodel.BrownianMotionViewModel

@Composable
fun BrownianMotionScreen(
    viewModel: BrownianMotionViewModel,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()

    BoxWithConstraints(
        modifier = modifier.fillMaxSize().background(LabDarkBackground)
    ) {
        val isWide = maxWidth > 840.dp

        if (isWide) {
            Row(modifier = Modifier.fillMaxSize().padding(16.dp), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                SimulationCanvas(
                    uiState = uiState,
                    onChamberSizeChanged = { w, h -> viewModel.setChamberDimensions(w, h) },
                    onBrownianDragged = { x, y -> viewModel.onBrownianDragged(x, y) },
                    modifier = Modifier.weight(1.2f).fillMaxHeight()
                )
                Column(
                    modifier = Modifier.weight(1f).fillMaxHeight().verticalScroll(rememberScrollState()),
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
                    StatisticsCard(statistics = uiState.statistics, parameters = uiState.parameters, onResetStats = { viewModel.resetStatisticsOnly() })
                    ExperimentGraph(msdHistory = uiState.msdHistory)
                    InfoSection(onSelectPreset = { viewModel.applyPreset(it) })
                }
            }
        } else {
            Column(
                modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                SimulationCanvas(
                    uiState = uiState,
                    onChamberSizeChanged = { w, h -> viewModel.setChamberDimensions(w, h) },
                    onBrownianDragged = { x, y -> viewModel.onBrownianDragged(x, y) },
                    modifier = Modifier.fillMaxWidth().aspectRatio(1f)
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
                StatisticsCard(statistics = uiState.statistics, parameters = uiState.parameters, onResetStats = { viewModel.resetStatisticsOnly() })
                ExperimentGraph(msdHistory = uiState.msdHistory)
                InfoSection(onSelectPreset = { viewModel.applyPreset(it) })
                Spacer(Modifier.height(24.dp))
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/example/brownianmotionlab/BrownianMotionApp.kt',
    category: 'kotlin',
    description: 'Scaffold container, TopAppBar, and navigation dialogs',
    content: `package com.example.brownianmotionlab

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.FileDownload
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Science
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.brownianmotionlab.model.ExperimentPreset
import com.example.brownianmotionlab.ui.BrownianMotionScreen
import com.example.brownianmotionlab.ui.theme.*
import com.example.brownianmotionlab.viewmodel.BrownianMotionViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BrownianMotionApp(viewModel: BrownianMotionViewModel = viewModel()) {
    var showPresetsDialog by remember { mutableStateOf(false) }
    var showInfoDialog by remember { mutableStateOf(false) }

    BrownianMotionLabTheme {
        Scaffold(
            topBar = {
                CenterAlignedTopAppBar(
                    title = {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("Brownian Motion Lab", style = MaterialTheme.typography.titleMedium, color = LabTextPrimary)
                            Text("Virtual Physics Experiment", style = MaterialTheme.typography.labelSmall, color = LabPrimaryCyan)
                        }
                    },
                    navigationIcon = {
                        IconButton(onClick = { showPresetsDialog = true }) {
                            Icon(Icons.Default.Science, "Presets", tint = LabSecondaryAmber)
                        }
                    },
                    actions = {
                        IconButton(onClick = { showInfoDialog = true }) {
                            Icon(Icons.Default.Info, "Info", tint = LabPrimaryCyan)
                        }
                    },
                    colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = LabDarkBackground)
                )
            },
            containerColor = LabDarkBackground
        ) { innerPadding ->
            BrownianMotionScreen(viewModel = viewModel, modifier = Modifier.padding(innerPadding))

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
                    confirmButton = { TextButton(onClick = { showPresetsDialog = false }) { Text("Close", color = LabTextSecondary) } },
                    containerColor = LabSurface
                )
            }

            if (showInfoDialog) {
                AlertDialog(
                    onDismissRequest = { showInfoDialog = false },
                    title = { Text("About Brownian Motion Lab", color = LabTextPrimary) },
                    text = {
                        Text(
                            "Brownian Motion Lab reproduces the erratic motion of microscopic particles suspended in a fluid via kinetic collision theory.\\n\\n" +
                            "Equations implemented:\\n" +
                            "• Kinetic Energy: KE = ½mv² ∝ k_B T\\n" +
                            "• 2D Mean Squared Displacement: ⟨(Δr)²⟩ ≈ 4Dt\\n" +
                            "• Einstein Diffusion: D = (k_B T) / (6πηr)",
                            color = LabTextSecondary,
                            style = MaterialTheme.typography.bodyMedium
                        )
                    },
                    confirmButton = { TextButton(onClick = { showInfoDialog = false }) { Text("Got it", color = LabPrimaryCyan) } },
                    containerColor = LabSurface
                )
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/example/brownianmotionlab/MainActivity.kt',
    category: 'kotlin',
    description: 'ComponentActivity entry point with lifecycle handling',
    content: `package com.example.brownianmotionlab

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import com.example.brownianmotionlab.viewmodel.BrownianMotionViewModel

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
        viewModel.pauseSimulation()
    }
}
`,
  },
  {
    path: 'README.md',
    category: 'doc',
    description: 'Project setup, architectural documentation, and build commands',
    content: `# Brownian Motion Lab (Android)

An interactive virtual physics laboratory built with Kotlin and Jetpack Compose demonstrating 2D Brownian Motion using realistic kinetic particle collisions, real-time Mean Squared Displacement (MSD) telemetry, and educational physics analysis.

## Setup & Running in Android Studio
1. Open Android Studio (Ladybug 2024.2+ or latest stable).
2. Choose **Open Project** and navigate to the project directory.
3. Allow Gradle to download dependencies and sync version catalogs.
4. Select a connected device or emulator with API 26+.
5. Click **Run** (Shift + F10).
`,
  },
];
