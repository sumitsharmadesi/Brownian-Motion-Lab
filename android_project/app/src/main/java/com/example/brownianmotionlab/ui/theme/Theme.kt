package com.example.brownianmotionlab.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
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
    val colorScheme = LabDarkColorScheme // Scientific app enforces dedicated dark laboratory theme
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
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
