# Custom Compass Card

[![GitHub Release](https://img.shields.io/github/v/release/rob-vandenberg/custom-compass-card)](https://github.com/rob-vandenberg/custom-compass-card/releases)
[![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A fully configurable compass card for Home Assistant. Supports a morphing needle with parametric shape control, configurable tick marks with cardinal labels, and up to three dynamic text fields.

---

## Screenshots

| Wind Compass | Sun Tracker | Moon Tracker | Cardinal Labels |
| :---: | :---: | :---: | :---: |
| ![Wind](screenshots/wind.png) | ![Sun](screenshots/sun.png) | ![Moon](screenshots/moon.png) | ![Cardinal](screenshots/cardinal.png) |

---

## Features

- Fully configurable compass circle with adjustable background, border color and width
- Parametric needle with morphing shape control — create triangles, arrows, kites, needles, and perfect circles
- Gradient needle color with configurable gradient stops
- Needle invert and rotate toggles
- Three tiers of configurable tick marks (large, medium, small) with independent color, length, width and position
- Cardinal labels (N, E, S, W) as an alternative to large tick marks
- Up to 3 configurable text fields with Jinja2 template support
- `${compass_direction}` token for automatic 16-point compass direction (N, NNE, NE, ...)
- Full color transparency support (`#RRGGBBAA`)
- Fully responsive — scales to any container size
- Visual UI editor with live preview

---

## Installation via HACS

1. Open HACS in your Home Assistant
2. Click the three dots menu in the top right
3. Select **Custom repositories**
4. Add URL: `https://github.com/rob-vandenberg/custom-compass-card`
5. Select type: **Dashboard**
6. Click **Add**
7. Search for **Custom Compass Card** and click **Download**
8. Reload when prompted

---

## Manual Installation

1. Download `custom-compass-card.js` from the [latest release](https://github.com/rob-vandenberg/custom-compass-card/releases)
2. Copy to `/config/www/custom-compass-card/`
3. Add to your Dashboard resources:
   ```yaml
   resources:
     - url: /local/custom-compass-card/custom-compass-card.js
       type: module
   ```
4. Reload Home Assistant

---

## Configuration

```yaml
type: custom:custom-compass-card
compass_entity: sensor.wind_bearing
```

The visual UI editor covers all settings. The sections below document every available option.

---

## Configuration Reference

### Compass

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `compass_entity` | string | `sun.sun` | Entity ID providing the compass bearing (0–360°) |
| `compass_attribute` | string | `azimuth` | Attribute to read from the entity. Leave empty to use the entity state directly |
| `compass_adjustment` | number | `0` | Offset in degrees added to the raw value before rendering |
| `background_color` | string | `#101010` | Compass circle background color. Supports `#RRGGBBAA` |
| `circle_color` | string | `#383838` | Border ring color. Supports `#RRGGBBAA` |
| `circle_width` | number | `16` | Border ring width (scales with card size) |
| `border_size` | number | `0` | Adjusts the outer boundary of the compass. Positive = larger, negative = smaller |

---

### Needle

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `needle_show` | boolean | `true` | Show or hide the needle |
| `needle_invert` | boolean | `false` | Swap tip and tail of the needle |
| `needle_rotate` | boolean | `false` | Rotate needle 180° (points in the opposite direction) |
| `needle_color_1` | string | `#E0E0E0` | Gradient color at position 1 |
| `needle_color_1_pos` | number | `0` | Position of color 1 in the gradient (0–100%) |
| `needle_color_2` | string | `#E0E0E0` | Gradient color at position 2 |
| `needle_color_2_pos` | number | `100` | Position of color 2 in the gradient (0–100%) |
| `needle_height` | number | `16` | Needle height (scales with card size) |
| `needle_width` | number | `3` | Needle width (scales with card size) |
| `needle_position` | number | `0` | Offset from center. Positive = outward, negative = inward |
| `needle_morph` | number | `0` | Controls needle tail shape. See **Needle Morphing** section |
| `needle_curve` | number | `0` | Controls edge curvature. See **Needle Morphing** section |

#### Needle Morphing

The needle shape is controlled by two parametric values that work together.

**`needle_morph`** moves the tail point of the needle:

| Value | Shape |
|-------|-------|
| `0` | Triangle — tail sits on the base line |
| negative | Arrow with notch — tail pulled inward |
| `50` | Classic needle — tip and tail are symmetric |
| `> 50` | Kite — tail extends outward past the base |

**`needle_curve`** adds Bezier curvature to all edges:

| Value | Effect |
|-------|--------|
| `0` | Straight edges |
| `10–20` | Softly rounded |
| `≈27.6` | Perfect circle (requires `morph=50`, `width=height`) |
| `50+` | Heavy bulge, crescent shapes |

**Shape examples:**

| morph | curve | Result |
|-------|-------|--------|
| 0 | 0 | Sharp triangle |
| 0 | 15 | Rounded triangle |
| -20 | 0 | Arrow with notch |
| -20 | 20 | Arrow with rounded notch |
| 50 | 0 | Diamond needle |
| 50 | 27.6 | Perfect circle |
| 80 | 10 | Kite |

**To create a perfect circle (e.g. sun/moon dot):**
```yaml
needle_width: 30
needle_height: 30
needle_morph: 50
needle_curve: 27.6
```

---

### Tick Marks

Tick marks are drawn around the outer edge of the border ring. There are three independent tiers:

- **Large** — 4 marks at 0°, 90°, 180°, 270°
- **Medium** — 4 marks at 45°, 135°, 225°, 315°
- **Small** — 8 marks at every remaining 22.5° position

Each tier has the following options (replace `large` with `medium` or `small`):

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tick_large_show` | boolean | `true` | Show or hide this tier |
| `tick_large_length` | number | `8` | Length of the tick mark line, or font size (em) when cardinals are enabled |
| `tick_large_width` | number | `4` | Stroke width of the line, or font weight ÷ 100 when cardinals are enabled |
| `tick_large_color` | string | `#FFFFFF` | Color of the tick mark |
| `tick_large_position` | number | `0` | Offset from the outer border edge. Positive = outward, negative = inward |

**Medium defaults:** length `6`, width `1.5`, color `#CCCCCC`
**Small defaults:** length `4`, width `1`, color `#AAAAAA`

#### Cardinal Labels

Large tick marks can optionally display the letters **N**, **E**, **S**, **W** instead of lines.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tick_large_cardinals` | boolean | `false` | Replace large tick lines with N/E/S/W letters |

When cardinals are enabled:
- `tick_large_length` controls the **font size** (in SVG units, roughly em)
- `tick_large_width` controls the **font weight** — the value is multiplied by 100, so `4` = weight 400 (normal), `7` = weight 700 (bold)
- `tick_large_position` still adjusts the letter position
- `tick_large_show` must be `true` for letters to appear

**Example — classic compass rose with cardinals:**
```yaml
tick_large_show: true
tick_large_cardinals: true
tick_large_length: 10
tick_large_width: 7
tick_large_color: '#FFBB00'
tick_large_position: 0
tick_medium_show: true
tick_medium_length: 5
tick_medium_width: 2
tick_medium_color: '#AAAAAA'
tick_small_show: true
tick_small_length: 3
tick_small_width: 1
tick_small_color: '#666666'
```

---

### Text Fields

Three text fields can be displayed inside the compass at fixed vertical positions (top, center, bottom). Each field renders a value followed by an optional unit.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `field_N_show` | boolean | `true` | Show or hide field N (1, 2, or 3) |
| `field_N_template` | string | — | Value to display. Supports `${compass_direction}` and Jinja2 |
| `field_N_unit` | string | `''` | Unit text appended to the value |
| `field_N_fontsize` | number | — | Font size in em |
| `field_N_fontcolor` | string | — | Font color. Supports `#RRGGBBAA` |
| `field_N_unit_fontsize` | number | — | Unit font size relative to field font size |
| `field_N_unit_fontcolor` | string | — | Unit font color |

#### Template Syntax

**Compass direction (16-point):**
```yaml
field_1_template: '${compass_direction}'
```
Returns N, NNE, NE, ENE, E, ESE, SE, SSE, S, SSW, SW, WSW, W, WNW, NW, or NNW.

**Entity state with rounding:**
```yaml
field_2_template: "{{ states('sensor.wind_speed') | round(1) }}"
```

**Entity attribute:**
```yaml
field_3_template: "{{ state_attr('sun.sun', 'azimuth') | round(0) }}"
```

---

## Full Example Configurations

### Wind Compass
```yaml
type: custom:custom-compass-card
compass_entity: sensor.wind_bearing
compass_attribute: ''
background_color: '#101010'
circle_color: '#383838'
circle_width: 16
needle_show: true
needle_color_1: '#E0E0E0'
needle_color_2: '#CC0000'
needle_color_2_pos: 60
needle_height: 20
needle_width: 4
needle_morph: 0
needle_curve: 0
tick_large_show: true
tick_large_cardinals: true
tick_large_length: 10
tick_large_width: 7
tick_large_color: '#FFBB00'
tick_medium_show: true
tick_medium_color: '#888888'
tick_small_show: true
tick_small_color: '#555555'
field_1_show: true
field_1_template: '${compass_direction}'
field_1_fontsize: 1.6
field_1_fontcolor: '#29B6CF'
field_2_show: true
field_2_template: "{{ states('sensor.wind_speed') | round(1) }}"
field_2_unit: 'km/h'
field_2_fontsize: 2.1
field_2_fontcolor: '#E8E8E8'
field_3_show: true
field_3_template: "{{ state_attr('sun.sun', 'azimuth') | round(0) }}"
field_3_unit: '°'
field_3_fontsize: 1.4
field_3_fontcolor: '#808080'
```

### Sun Tracker (circle dot on ring)
```yaml
type: custom:custom-compass-card
compass_entity: sun.sun
compass_attribute: azimuth
background_color: '#d58544'
circle_color: '#dfb477'
circle_width: 12
needle_show: true
needle_color_1: '#FF4500'
needle_color_2: '#FFD700'
needle_color_2_pos: 100
needle_height: 30
needle_width: 30
needle_morph: 50
needle_curve: 27.6
needle_position: -15
tick_large_show: false
tick_medium_show: false
tick_small_show: false
field_1_show: false
field_2_show: false
field_3_show: false
```

---

## Support

If you find this card useful, please ⭐ star the repository!

For bugs and feature requests, use the [GitHub Issues](https://github.com/rob-vandenberg/custom-compass-card/issues) page.

---

## License

MIT License — see LICENSE file for details.
