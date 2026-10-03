package com.example.brownianmotionlab.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.example.brownianmotionlab.ui.theme.LabPrimaryCyan
import com.example.brownianmotionlab.ui.theme.LabSurfaceBorder
import com.example.brownianmotionlab.ui.theme.LabTextMuted
import com.example.brownianmotionlab.ui.theme.LabTextPrimary
import com.example.brownianmotionlab.ui.theme.LabTextSecondary

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
            Text(
                text = label,
                style = MaterialTheme.typography.bodyMedium,
                color = LabTextSecondary
            )
            Text(
                text = displayValue,
                style = MaterialTheme.typography.labelSmall,
                color = LabPrimaryCyan
            )
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
