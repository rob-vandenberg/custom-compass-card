import { LitElement, html, svg, css } from 'https://unpkg.com/lit@2.0.0/index.js?module';

// ─── Card Version ─────────────────────────────────────────────────────────────
const CARD_VERSION = '3.4.108';
// ─── Card Version History ─────────────────────────────────────────────────────
// v3.4.108: Rename tickmark→tick throughout; add marker_1 and marker_2 (fixed bearing triangle markers on tick layer)
// v3.4.107: Rename tickmark→tick throughout; add marker_1 and marker_2 (fixed bearing triangle markers on tick layer)
// v3.3.106: Rename needle_animation_duration to rotation_animation_time
// v3.3.105: Smooth needle animation via CSS transition; shortest-arc rotation to avoid wrap-around sweep; needle_animation_duration default config key
// v3.3.104: Consistent toggle-field pattern across all editor sections; field-styling-grid for template-type fields
// v3.3.103: Move "Rotate compass" toggle to compass configuration block above Needle section
// v3.3.102: Add compass_rotate mode: dial rotates, needle stays fixed pointing north; replace ha-formfield in needle toggles with label+ha-switch pattern
// v3.2.101: Header/footer use calc(±10px + position) for translateY; padding reduced to 10px
// v3.2.100: Adjust header/footer natural position via padding; set default fontsize to 2.0
// v3.2.99: Add template support to header/footer; reorder DEFAULT_CONFIG; rename dirs to directions
// v3.2.98: Add optional header and footer text above/below compass circle
// v3.2.97: Fix getCompassDirection: build all 16 directions from the 4 configured cardinals
// v3.2.96: Fix Bezel labels in editor; fix getCompassDirection to use configured cardinals
// v3.2.95: Update defaults: needle shape/color, tick marks visible, field_2 hidden
// v3.2.94: Add Template label to field template inputs; consolidate unit fields onto one row
// v3.2.93: Add fontweight and position to custom fields; remove hardcoded field top positions
// v3.2.92: Update default values for tick marks and cardinals
// v3.2.91: Cardinals get own fontsize/fontweight/position/fontcolor; rename cardinal_labels_show to cardinals_show
// v3.2.90: Add cardinal_color; rename major_ticks_cardinals to cardinal_labels_show; use cardinal_color in rendering
// v3.2.89: Fix cardinal labels filtered out by show flag: return show:true from cardinal branch
// v3.2.88: Fix cardinal labels not rendering: remove dependency on major_ticks_show flag
// v3.2.87: Add configurable cardinal labels (N/E/S/W); mutual exclusion between Cardinal labels and Primary ticks toggles in UI editor
// v3.2.86: Replace all string-based config key lookups with explicit fieldDefs lookup objects in _updateTemplates, _fieldStyle, _unitStyle and renderField
// v3.2.85: Add cardinals flag to tickDefs; replace hardcoded string comparison with def.cardinals boolean
// v3.2.84: Replace string-based config key lookup with explicit tickDefs lookup object
// v3.2.83: Fix tick mark rendering: correct config key pattern from tick_major_ to major_ticks_ after variable rename

// ─── Default Configuration ────────────────────────────────────────────────────
const DEFAULT_CONFIG = {
  compass_entity:           'sun.sun',
  compass_attribute:        'azimuth',
  compass_adjustment:       0,
  background_color:         '#101010',
  bezel_color:              '#383838',
  bezel_width:              16,
  bezel_size:               0,
  needle_show:              true,
  needle_invert:            false,
  needle_rotate:            false,
  compass_rotate:           false,
  needle_color_1:           '#FF0000',
  needle_color_1_pos:       50,
  needle_color_2:           '#EEEEEE',
  needle_color_2_pos:       50,
  needle_height:            100,
  needle_width:             10,
  needle_position:          -10,
  needle_morph:             50,
  needle_curve:             0,
  marker_1_show:            false,
  marker_1_degrees:         45,
  marker_1_length:          5,
  marker_1_width:           4,
  marker_1_position:        0,
  marker_1_color:           '#FF0000',
  marker_2_show:            false,
  marker_2_degrees:         315,
  marker_2_length:          5,
  marker_2_width:           4,
  marker_2_position:        0,
  marker_2_color:           '#2196F3',
  cardinals_show:           false,
  cardinal_north:           'N',
  cardinal_east:            'E',
  cardinal_south:           'S',
  cardinal_west:            'W',
  cardinals_fontsize:       10,
  cardinals_fontweight:     400,
  cardinals_position:       1.5,
  cardinals_fontcolor:      '#EEEEEE',
  major_ticks_show:         true,
  major_ticks_length:       6,
  major_ticks_width:        2,
  major_ticks_position:     -3.5,
  major_ticks_color:        '#CCCCCC',
  minor_ticks_show:         true,
  minor_ticks_length:       3,
  minor_ticks_width:        1.5,
  minor_ticks_position:     -4.5,
  minor_ticks_color:        '#AAAAAA',
  micro_ticks_show:         true,
  micro_ticks_length:       0,
  micro_ticks_width:        2,
  micro_ticks_position:     -6.5,
  micro_ticks_color:        '#888888',
  header_show:              false,
  header_text:              'header',
  header_fontsize:          2.0,
  header_fontweight:        400,
  header_position:          0,
  header_fontcolor:         '#FFFFFF',
  footer_show:              false,
  footer_text:              'footer',
  footer_fontsize:          2.0,
  footer_fontweight:        400,
  footer_position:          0,
  footer_fontcolor:         '#FFFFFF',
  field_1_show:             true,
  field_1_template:         '${compass_direction}',
  field_1_fontsize:         1.5,
  field_1_fontweight:       400,
  field_1_position:         23,
  field_1_fontcolor:        '#29B6CF',
  field_1_unit:             '',
  field_1_unit_fontsize:    1.0,
  field_1_unit_fontweight:  400,
  field_1_unit_fontcolor:   '#196D7C',
  field_2_show:             false,
  field_2_template:         "{{ states('sensor.ws_wind_speed') | round(1) }}",
  field_2_unit:             'km/h',
  field_2_fontsize:         2.0,
  field_2_fontweight:       400,
  field_2_position:         50,
  field_2_fontcolor:        '#E8E8E8',
  field_2_unit_fontsize:    1.2,
  field_2_unit_fontweight:  400,
  field_2_unit_fontcolor:   '#8C8C8C',
  field_3_show:             true,
  field_3_template:         "{{ state_attr('sun.sun', 'azimuth') | round(0) }}",
  field_3_unit:             '°',
  field_3_fontsize:         1.4,
  field_3_fontweight:       400,
  field_3_position:         79,
  field_3_fontcolor:        '#808080',
  field_3_unit_fontsize:    1.4,
  field_3_unit_fontweight:  400,
  field_3_unit_fontcolor:   '#606060',
  rotation_animation_time:  0.3,  
};

// ─── Visual Editor ────────────────────────────────────────────────────────────
class CustomCompassCardEditor extends LitElement {
  static properties = {
    hass:    { type: Object },
    _config: { type: Object },
  };

  setConfig(config) {
    this._config = { ...DEFAULT_CONFIG, ...config };
    this.loadCardHelpers();
  }

  async loadCardHelpers() {
    if (!window.customElements.get("ha-entity-picker")) {
      const helpers = await window.loadCardHelpers();
      const card = await helpers.createCardElement({ type: "entities", entities: [] });
      await card.constructor.getConfigElement();
    }
  }

  _valueChanged(key, ev) {
    if (!this._config || !this.hass) return;
    let value;
    if (ev.detail?.value !== undefined) {
      value = ev.detail.value;
    } else if (ev.target.tagName === 'HA-SWITCH') {
      value = ev.target.checked;
    } else {
      value = ev.target.value;
    }
    if (ev.target.type === 'number') {
      value = parseFloat(value);
      if (isNaN(value)) return;
    }
    this._config = { ...this._config, [key]: value };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    }));
  }

  _colorPicker(key, label) {
    const value = this._config[key] || '#ffffff';
    return html`
      <div class="color-field">
        <label>${label}</label>
        <div class="color-row">
          <input
            type="color"
            .value=${value.length >= 7 ? value.substring(0, 7) : value}
            @input=${e => this._valueChanged(key, e)}
          />
          <ha-textfield
            .value=${value}
            placeholder="#RRGGBB or #RRGGBBAA"
            @input=${e => this._valueChanged(key, e)}
          ></ha-textfield>
        </div>
      </div>
    `;
  }

  render() {
    if (!this.hass || !this._config) return html``;
    const c = this._config;

    return html`

	  <h2 style="margin-top: 0;">Compass configuration</h2>

      <!-- Entity -->
      <div class="compass-entity-grid">
        <div class="text-field">
          <label>Compass entity</label>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${c.compass_entity}
            .includeDomains=${['sensor']}
            allow-custom-entity
            @value-changed=${e => this._valueChanged('compass_entity', e)}
          ></ha-entity-picker>
        </div>
        <div class="text-field">
          <label>Attribute</label>
          <ha-textfield
            .value=${c.compass_attribute}
            @input=${e => this._valueChanged('compass_attribute', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Adjustment</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(c.compass_adjustment)}
            @input=${e => this._valueChanged('compass_adjustment', e)}
          ></ha-textfield>
        </div>
      </div>

      <!-- Compass styling -->
      <div class="compass-styling-grid">
        ${this._colorPicker('background_color', 'Background')}
        ${this._colorPicker('bezel_color', 'Bezel color')}
        <div class="text-field">
          <label>Bezel width</label>
          <ha-textfield
            type="number" step="1" min="0"
            .value=${String(c.bezel_width)}
            @input=${e => this._valueChanged('bezel_width', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Bezel size</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(c.bezel_size)}
            @input=${e => this._valueChanged('bezel_size', e)}
          ></ha-textfield>
        </div>
      </div>

      <!-- Compass toggles -->
      <div class="compass-toggles-grid">
        <div class="toggle-field">
          <label>Rotate compass</label>
          <ha-switch
            .checked=${c.compass_rotate}
            @change=${e => this._valueChanged('compass_rotate', e)}
          ></ha-switch>
        </div>
      </div>
	  
	  <h2>Needle configuration</h2>

      <!-- Needle toggles -->
      <div class="needle-toggles-grid">
        <div class="toggle-field">
          <label>Show needle</label>
          <ha-switch
            .checked=${c.needle_show}
            @change=${e => this._valueChanged('needle_show', e)}
          ></ha-switch>
        </div>  
        <div class="toggle-field">
          <label>Invert needle</label>
          <ha-switch
            .checked=${c.needle_invert}
            @change=${e => this._valueChanged('needle_invert', e)}
          ></ha-switch>
        </div>  
        <div class="toggle-field">
          <label>Rotate needle</label>
          <ha-switch
            .checked=${c.needle_rotate}
            @change=${e => this._valueChanged('needle_rotate', e)}
          ></ha-switch>
        </div>  
      </div>

      <!-- Needle colors -->
      <div class="needle-color-grid">
        ${this._colorPicker('needle_color_1', 'Needle color 1')}
        <div class="text-field">
          <label>Pos (%)</label>
          <ha-textfield
            type="number" step="1" min="0" max="100"
            .value=${String(c.needle_color_1_pos)}
            @input=${e => this._valueChanged('needle_color_1_pos', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('needle_color_2', 'Needle color 2')}
        <div class="text-field">
          <label>Pos (%)</label>
          <ha-textfield
            type="number" step="1" min="0" max="100"
            .value=${String(c.needle_color_2_pos)}
            @input=${e => this._valueChanged('needle_color_2_pos', e)}
          ></ha-textfield>
        </div>
      </div>

      <!-- Needle dimensions -->
      <div class="needle-dimensions-grid">
        <div class="text-field">
          <label>Height</label>
          <ha-textfield
            type="number" step="1" min="4"
            .value=${String(c.needle_height)}
            @input=${e => this._valueChanged('needle_height', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <ha-textfield
            type="number" step="1" min="1"
            .value=${String(c.needle_width)}
            @input=${e => this._valueChanged('needle_width', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(c.needle_position)}
            @input=${e => this._valueChanged('needle_position', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Morph</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(c.needle_morph)}
            @input=${e => this._valueChanged('needle_morph', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Curve</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(c.needle_curve)}
            @input=${e => this._valueChanged('needle_curve', e)}
          ></ha-textfield>
        </div>
      </div>

	  <h2>Markers configuration</h2>

      <!-- Marker 1 -->
      <div class="marker-toggles-grid">
        <div class="toggle-field">
          <label>Show marker 1</label>
          <ha-switch
            .checked=${c.marker_1_show}
            @change=${e => this._valueChanged('marker_1_show', e)}
          ></ha-switch>
        </div>
      </div>
      <div class="marker-styling-grid">
        <div class="text-field">
          <label>Degrees</label>
          <ha-textfield
            type="number" step="1" min="0" max="359"
            .value=${String(c.marker_1_degrees)}
            @input=${e => this._valueChanged('marker_1_degrees', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Length</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(c.marker_1_length)}
            @input=${e => this._valueChanged('marker_1_length', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(c.marker_1_width)}
            @input=${e => this._valueChanged('marker_1_width', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="0.5"
            .value=${String(c.marker_1_position)}
            @input=${e => this._valueChanged('marker_1_position', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('marker_1_color', 'Color')}
      </div>

      <!-- Marker 2 -->
      <div class="marker-toggles-grid">
        <div class="toggle-field">
          <label>Show marker 2</label>
          <ha-switch
            .checked=${c.marker_2_show}
            @change=${e => this._valueChanged('marker_2_show', e)}
          ></ha-switch>
        </div>
      </div>
      <div class="marker-styling-grid">
        <div class="text-field">
          <label>Degrees</label>
          <ha-textfield
            type="number" step="1" min="0" max="359"
            .value=${String(c.marker_2_degrees)}
            @input=${e => this._valueChanged('marker_2_degrees', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Length</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(c.marker_2_length)}
            @input=${e => this._valueChanged('marker_2_length', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(c.marker_2_width)}
            @input=${e => this._valueChanged('marker_2_width', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="0.5"
            .value=${String(c.marker_2_position)}
            @input=${e => this._valueChanged('marker_2_position', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('marker_2_color', 'Color')}
      </div>

	  <h2>Ticks configuration</h2>

      <!-- Cardinal labels -->
      <div class="tick-toggles-grid">
        <div class="toggle-field">
          <label>Cardinal labels</label>
          <ha-switch
            .checked=${c.cardinals_show}
            @change=${e => {
              this._valueChanged('cardinals_show', e);
              if (e.target.checked) this._valueChanged('major_ticks_show', { target: { tagName: 'HA-SWITCH', checked: false } });
            }}
          ></ha-switch>
        </div>
      </div>
      <div class="cardinal-labels-grid">
        <div class="text-field">
          <label>North</label>
          <ha-textfield
            .value=${c.cardinal_north}
            @input=${e => this._valueChanged('cardinal_north', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>East</label>
          <ha-textfield
            .value=${c.cardinal_east}
            @input=${e => this._valueChanged('cardinal_east', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>South</label>
          <ha-textfield
            .value=${c.cardinal_south}
            @input=${e => this._valueChanged('cardinal_south', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>West</label>
          <ha-textfield
            .value=${c.cardinal_west}
            @input=${e => this._valueChanged('cardinal_west', e)}
          ></ha-textfield>
        </div>
      </div>
      <div class="tick-styling-grid">
        <div class="text-field">
          <label>Font size</label>
          <ha-textfield
            type="number" step="0.5" min="0"
            .value=${String(c.cardinals_fontsize)}
            @input=${e => this._valueChanged('cardinals_fontsize', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <ha-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(c.cardinals_fontweight)}
            @input=${e => this._valueChanged('cardinals_fontweight', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="0.5"
            .value=${String(c.cardinals_position)}
            @input=${e => this._valueChanged('cardinals_position', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('cardinals_fontcolor', 'Color')}
      </div>

      <!-- Primary ticks -->
      <div class="tick-toggles-grid">
        <div class="toggle-field">
          <label>Primary ticks</label>
          <ha-switch
            .checked=${c.major_ticks_show}
            @change=${e => {
              this._valueChanged('major_ticks_show', e);
              if (e.target.checked) this._valueChanged('cardinals_show', { target: { tagName: 'HA-SWITCH', checked: false } });
            }}
          ></ha-switch>
        </div>
      </div>
      <div class="tick-styling-grid">
        <div class="text-field">
          <label>Length</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(c.major_ticks_length)}
            @input=${e => this._valueChanged('major_ticks_length', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(c.major_ticks_width)}
            @input=${e => this._valueChanged('major_ticks_width', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="0.5"
            .value=${String(c.major_ticks_position)}
            @input=${e => this._valueChanged('major_ticks_position', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('major_ticks_color', 'Color')}
      </div>

      <!-- Medium ticks -->
      <div class="tick-toggles-grid">
        <div class="toggle-field">
          <label>Secondary ticks</label>
          <ha-switch
            .checked=${c.minor_ticks_show}
            @change=${e => this._valueChanged('minor_ticks_show', e)}
          ></ha-switch>
        </div>
      </div>
      <div class="tick-styling-grid">
        <div class="text-field">
          <label>Length</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(c.minor_ticks_length)}
            @input=${e => this._valueChanged('minor_ticks_length', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(c.minor_ticks_width)}
            @input=${e => this._valueChanged('minor_ticks_width', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="0.5"
            .value=${String(c.minor_ticks_position)}
            @input=${e => this._valueChanged('minor_ticks_position', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('minor_ticks_color', 'Color')}
      </div>

      <!-- Micro ticks -->
      <div class="tick-toggles-grid">
        <div class="toggle-field">
          <label>Tertiary ticks</label>
          <ha-switch
            .checked=${c.micro_ticks_show}
            @change=${e => this._valueChanged('micro_ticks_show', e)}
          ></ha-switch>
        </div>
      </div>
      <div class="tick-styling-grid">
        <div class="text-field">
          <label>Length</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(c.micro_ticks_length)}
            @input=${e => this._valueChanged('micro_ticks_length', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(c.micro_ticks_width)}
            @input=${e => this._valueChanged('micro_ticks_width', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="0.5"
            .value=${String(c.micro_ticks_position)}
            @input=${e => this._valueChanged('micro_ticks_position', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('micro_ticks_color', 'Color')}
      </div>

	  <h2>Header &amp; Footer configuration</h2>

      <!-- Header -->
      <div class="field-toggles-grid">
        <div class="toggle-field">
          <label>Show header</label>
          <ha-switch
            .checked=${c.header_show}
            @change=${e => this._valueChanged('header_show', e)}
          ></ha-switch>
        </div>
      </div>
      <div class="field-template-grid">
        <div class="text-field">
          <label>Template</label>
          <ha-textfield
            .value=${c.header_text}
            @input=${e => this._valueChanged('header_text', e)}
          ></ha-textfield>
        </div>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Font size</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(c.header_fontsize)}
            @input=${e => this._valueChanged('header_fontsize', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <ha-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(c.header_fontweight)}
            @input=${e => this._valueChanged('header_fontweight', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(c.header_position)}
            @input=${e => this._valueChanged('header_position', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('header_fontcolor', 'Color')}
      </div>

      <!-- Footer -->
      <div class="field-toggles-grid">
        <div class="toggle-field">
          <label>Show footer</label>
          <ha-switch
            .checked=${c.footer_show}
            @change=${e => this._valueChanged('footer_show', e)}
          ></ha-switch>
        </div>
      </div>
      <div class="field-template-grid">
        <div class="text-field">
          <label>Template</label>
          <ha-textfield
            .value=${c.footer_text}
            @input=${e => this._valueChanged('footer_text', e)}
          ></ha-textfield>
        </div>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Font size</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(c.footer_fontsize)}
            @input=${e => this._valueChanged('footer_fontsize', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <ha-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(c.footer_fontweight)}
            @input=${e => this._valueChanged('footer_fontweight', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(c.footer_position)}
            @input=${e => this._valueChanged('footer_position', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('footer_fontcolor', 'Color')}
      </div>

	  <h2>Custom fields configuration</h2>

      <!-- Field 1 -->
      <div class="field-toggles-grid">
        <div class="toggle-field">
          <label>Show Field 1</label>
          <ha-switch
            .checked=${c.field_1_show}
            @change=${e => this._valueChanged('field_1_show', e)}
          ></ha-switch>
        </div>
      </div>
      <div class="field-template-grid">
        <div class="text-field">
          <label>Template</label>
          <ha-textfield
            .value=${c.field_1_template}
            @input=${e => this._valueChanged('field_1_template', e)}
          ></ha-textfield>
        </div>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Font size</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(c.field_1_fontsize)}
            @input=${e => this._valueChanged('field_1_fontsize', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <ha-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(c.field_1_fontweight)}
            @input=${e => this._valueChanged('field_1_fontweight', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position (%)</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(c.field_1_position)}
            @input=${e => this._valueChanged('field_1_position', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('field_1_fontcolor', 'Color')}
      </div>
      <div class="field-unit-grid">
        <div class="text-field">
          <label>Unit</label>
          <ha-textfield
            .value=${c.field_1_unit}
            @input=${e => this._valueChanged('field_1_unit', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Size</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(c.field_1_unit_fontsize)}
            @input=${e => this._valueChanged('field_1_unit_fontsize', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Weight</label>
          <ha-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(c.field_1_unit_fontweight)}
            @input=${e => this._valueChanged('field_1_unit_fontweight', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('field_1_unit_fontcolor', 'Color')}
      </div>


      <!-- Field 2 -->
      <div class="field-toggles-grid">
        <div class="toggle-field">
          <label>Show Field 2</label>
          <ha-switch
            .checked=${c.field_2_show}
            @change=${e => this._valueChanged('field_2_show', e)}
          ></ha-switch>
        </div>
      </div>
      <div class="field-template-grid">
        <div class="text-field">
          <label>Template</label>
          <ha-textfield
            .value=${c.field_2_template}
            @input=${e => this._valueChanged('field_2_template', e)}
          ></ha-textfield>
        </div>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Font size</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(c.field_2_fontsize)}
            @input=${e => this._valueChanged('field_2_fontsize', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <ha-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(c.field_2_fontweight)}
            @input=${e => this._valueChanged('field_2_fontweight', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position (%)</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(c.field_2_position)}
            @input=${e => this._valueChanged('field_2_position', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('field_2_fontcolor', 'Color')}
      </div>
      <div class="field-unit-grid">
        <div class="text-field">
          <label>Unit</label>
          <ha-textfield
            .value=${c.field_2_unit}
            @input=${e => this._valueChanged('field_2_unit', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Size</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(c.field_2_unit_fontsize)}
            @input=${e => this._valueChanged('field_2_unit_fontsize', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Weight</label>
          <ha-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(c.field_2_unit_fontweight)}
            @input=${e => this._valueChanged('field_2_unit_fontweight', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('field_2_unit_fontcolor', 'Color')}
      </div>


      <!-- Field 3 -->
      <div class="field-toggles-grid">
        <div class="toggle-field">
          <label>Show Field 3</label>
          <ha-switch
            .checked=${c.field_3_show}
            @change=${e => this._valueChanged('field_3_show', e)}
          ></ha-switch>
        </div>
      </div>
      <div class="field-template-grid">
        <div class="text-field">
          <label>Template</label>
          <ha-textfield
            .value=${c.field_3_template}
            @input=${e => this._valueChanged('field_3_template', e)}
          ></ha-textfield>
        </div>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Font size</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(c.field_3_fontsize)}
            @input=${e => this._valueChanged('field_3_fontsize', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <ha-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(c.field_3_fontweight)}
            @input=${e => this._valueChanged('field_3_fontweight', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position (%)</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(c.field_3_position)}
            @input=${e => this._valueChanged('field_3_position', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('field_3_fontcolor', 'Color')}
      </div>
      <div class="field-unit-grid">
        <div class="text-field">
          <label>Unit</label>
          <ha-textfield
            .value=${c.field_3_unit}
            @input=${e => this._valueChanged('field_3_unit', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Size</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(c.field_3_unit_fontsize)}
            @input=${e => this._valueChanged('field_3_unit_fontsize', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Weight</label>
          <ha-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(c.field_3_unit_fontweight)}
            @input=${e => this._valueChanged('field_3_unit_fontweight', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('field_3_unit_fontcolor', 'Color')}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }

    h2 {
      margin-top: 40px;
      margin-bottom: 0px;
    }

    .compass-entity-grid {
      display: grid;
      grid-template-columns: 5fr 4fr 3fr;
      gap: 8px;
      margin-top: 24px;
      margin-bottom: 16px;
    }

    .compass-styling-grid {
      display: grid;
      grid-template-columns: 7fr 7fr 4fr 4fr;
      gap: 8px;
      margin-top: 24px;
      margin-bottom: 16px;
    }

    .compass-toggles-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 28px;
      margin-bottom: 16px;
    }

    .needle-toggles-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      margin-top: 28px;
      margin-bottom: 16px;
    }

    .needle-color-grid {
      display: grid;
      grid-template-columns: 7fr 4fr 7fr 4fr;
      gap: 8px;
      margin-top: 24px;
      margin-bottom: 8px;
    }

    .needle-dimensions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 16px;
    }

    .tick-toggles-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 28px;
      margin-bottom: 16px;
    }

    .cardinal-labels-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 8px;
    }

    .tick-styling-grid {
      display: grid;
      grid-template-columns: 2fr 2fr 2fr 3fr;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 8px;
      align-items: end;
    }

    .field-toggles-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 28px;
      margin-bottom: 16px;
    }

    .field-template-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 8px;
    }

    .field-styling-grid {
      display: grid;
      grid-template-columns: 2fr 2fr 2fr 3fr;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 8px;
      align-items: end;
    }

    .field-unit-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 2fr;
      gap: 8px;
      margin-top: 8px;
      align-items: end;
    }

    .marker-toggles-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 28px;
      margin-bottom: 16px;
    }

    .marker-styling-grid {
      display: grid;
      grid-template-columns: 4fr 4fr 4fr 4fr 7fr;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 8px;
      align-items: end;
    }

    .text-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .text-field label {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }

    .toggle-field {
      display: flex;
      flex-direction: row;
      gap: 4px;
    }
    .toggle-field label {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      min-width: 98px;
    }

    .color-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .color-field label {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .color-row {
      display: flex;
      gap: 8px;
      align-items: center;
      background-color: var(--input-fill-color, #1e1e1e);
      border-radius: 4px 4px 0 0;
      padding-left: 8px;
    }
    .color-row input[type="color"] {
      width: 24px;
      height: 40px;
      border: none;
      border-radius: 4px 4px 0 0;
      background: transparent;
      cursor: pointer;
      flex-shrink: 0;
    }
    .color-row ha-textfield {
      flex: 1;
      --mdc-text-field-fill-color: transparent;
      --mdc-text-field-outlined-idle-border-color: transparent;
      --mdc-text-field-outlined-hover-border-color: transparent;
    }

    ha-textfield,
	ha-entity-picker {
      display: block;
      width: 100%;
    }
  `;
}

customElements.define('custom-compass-card-editor', CustomCompassCardEditor);

// ─── Main Card ────────────────────────────────────────────────────────────────
class CustomCompassCard extends LitElement {
  static properties = {
    hass:          { type: Object },
    config:        { type: Object },
    _degrees:      { type: Number },
    _field1Value:  { type: String },
    _field2Value:  { type: String },
    _field3Value:  { type: String },
    _headerValue:  { type: String },
    _footerValue:  { type: String },
    _error:        { type: Boolean },
  };

  constructor() {
    super();
    this._degrees        = 0;
    this._prevDegrees    = null;
    this._templatesDirty = false;
    this._field1Value    = '';
    this._field2Value    = '';
    this._field3Value    = '';
    this._headerValue    = '';
    this._footerValue    = '';
    this._error          = false;
  }

  setConfig(config) {
    if (!config.compass_entity) {
      throw new Error('You must define a compass_entity.');
    }
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  willUpdate(changedProperties) {
    if (!changedProperties.has('hass') || !this.config?.compass_entity) return;

    const stateObj = this.hass.states[this.config.compass_entity];
    if (stateObj) {
      let valueToParse = stateObj.state;
      const attr = this.config.compass_attribute;

      if (attr && typeof attr === 'string' && attr.trim() !== '') {
        const attrValue = stateObj.attributes[attr.trim()];
        if (attrValue !== null && !isNaN(parseFloat(attrValue))) {
          valueToParse = attrValue;
        }
      }

      const raw = parseFloat(valueToParse);

      if (!isNaN(raw)) {
        const adj            = parseFloat(this.config.compass_adjustment) || 0;
        const targetNormalized = ((raw + adj) % 360 + 360) % 360;
        if (targetNormalized !== this._prevDegrees) {
          // Shortest-arc: compute delta clamped to [-180, 180] so the CSS
          // transition always animates the short way around the dial.
          const currentMod = ((this._degrees % 360) + 360) % 360;
          let delta = targetNormalized - currentMod;
          if (delta > 180) delta -= 360;
          if (delta < -180) delta += 360;
          this._degrees        = this._degrees + delta;
          this._prevDegrees    = targetNormalized;
          this._templatesDirty = true;
        }
        this._error = false;
      } else {
        this._degrees        = 0;
        this._prevDegrees    = null;
        this._templatesDirty = true;
        this._error          = true;
      }
    } else {
      this._degrees        = 0;
      this._prevDegrees    = null;
      this._templatesDirty = true;
      this._error          = true;
    }
  }

  async _updateTemplates() {
    this._templatesDirty = false;
    const fieldDefs = [
      { index: 1, show: this.config.field_1_show, template: this.config.field_1_template },
      { index: 2, show: this.config.field_2_show, template: this.config.field_2_template },
      { index: 3, show: this.config.field_3_show, template: this.config.field_3_template },
    ];
    for (const def of fieldDefs) {
      if (!def.show) {
        this[`_field${def.index}Value`] = '';
        continue;
      }
      if (this._error) {
        this[`_field${def.index}Value`] = 'Error';
        continue;
      }
      if (def.template) {
        this[`_field${def.index}Value`] = await this._evaluateTemplate(def.template, this._degrees);
      }
    }
    if (this.config.header_show && this.config.header_text) {
      this._headerValue = await this._evaluateTemplate(this.config.header_text, this._degrees);
    } else {
      this._headerValue = '';
    }
    if (this.config.footer_show && this.config.footer_text) {
      this._footerValue = await this._evaluateTemplate(this.config.footer_text, this._degrees);
    } else {
      this._footerValue = '';
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    this._scaleElements();
    if (this._templatesDirty) {
      this._updateTemplates();
    }
  }

  _scaleElements() {
    const circle = this.shadowRoot.querySelector('.compass-circle');
    if (!circle) return;

    const BASE_DESIGN_WIDTH = 120;
    const actualWidth = circle.offsetWidth;
    const scale       = actualWidth / BASE_DESIGN_WIDTH;

    this.style.setProperty('--cc-font-size', `${actualWidth * 0.08}px`);

    const initBorder = parseFloat(this.config.bezel_width);
    const borderSize = parseFloat(this.config.bezel_size);
    this.style.setProperty('--cc-circle-border-width', `${initBorder * scale}px`);
    this.style.setProperty('--cc-circle-color',        this.config.bezel_color);
    this.style.setProperty('--cc-bg-color',            this.config.background_color);
    this.style.setProperty('--cc-border-size',         `${borderSize}px`);

    const initW   = parseFloat(this.config.needle_width);
    const initH   = parseFloat(this.config.needle_height);
    const initPos = parseFloat(this.config.needle_position);

    this.style.setProperty('--cc-needle-width',    `${initW   * scale}px`);
    this.style.setProperty('--cc-needle-height',   `${initH   * scale}px`);
    this.style.setProperty('--cc-needle-position', `${initPos * scale}px`);

    this.style.setProperty('--cc-animation-duration', `${this.config.rotation_animation_time}s`);

    const wrapper = this.shadowRoot.querySelector('.compass-ticks-wrapper');
    if (wrapper) {
      this.style.setProperty('--cc-circle-size', `${wrapper.offsetWidth}px`);
    }
  }

  async _evaluateTemplate(template, degrees) {
    try {
      const processed = template.replace('${compass_direction}', this.getCompassDirection(degrees));
      if (!processed.includes('{{')) return processed;
      const response = await this.hass.callApi('POST', 'template', { template: processed });
      return response;
    } catch (e) {
      console.error('CustomCompassCard: Error evaluating template:', template, e);
      return 'Error';
    }
  }

  getCompassDirection(degrees) {
    const normalized = ((degrees % 360) + 360) % 360;
    const N = this.config.cardinal_north;
    const E = this.config.cardinal_east;
    const S = this.config.cardinal_south;
    const W = this.config.cardinal_west;
    const directions = [
      N, N+N+E, N+E, E+N+E,
      E, E+S+E, S+E, S+S+E,
      S, S+S+W, S+W, W+S+W,
      W, W+N+W, N+W, N+N+W,
    ];
    return directions[Math.floor((normalized + 11.25) / 22.5) % 16];
  }

  _buildNeedlePath(morph, curve, invert, position) {
    // Coordinate space: P2/P4 span x=0 to x=100 (CSS width controls pixel size).
    // P1 tip at y=0, P2/P4 base corners at y=50, P3 tail at y=50+morph.
    // morph=0 → triangle (P3 coincides with base line)
    // morph=50 → needle (P3 at y=100, symmetric with P1)
    let points = [
      { x: 50, y: 0         },  // P1: tip
      { x: 0,  y: 50        },  // P2: base left
      { x: 50, y: 50 + morph }, // P3: tail
      { x: 100,y: 50        },  // P4: base right
    ];

    // P3 control length scales with its distance from the P2-P4 line
    const p3LengthMultiplier = Math.abs(morph) / 50;

    // Control directions rotate smoothly with morph for natural curves
    const angleRatio   = Math.sign(morph) * Math.min(1.0, Math.abs(morph) / 50);
    const angleRadians = angleRatio * (Math.PI / 2);
    const p2_out = { x:  Math.cos(angleRadians), y: Math.sin(angleRadians) };
    const p4_in  = { x: -Math.cos(angleRadians), y: Math.sin(angleRadians) };

    let controlDirections = [
      { in: { x:  1, y:  0 }, out: { x: -1, y:  0 }, lengthMultiplier: 1.0               }, // P1
      { in: { x:  0, y: -1 }, out: p2_out,             lengthMultiplier: 1.0               }, // P2
      { in: { x: -1, y:  0 }, out: { x:  1, y:  0 }, lengthMultiplier: p3LengthMultiplier }, // P3
      { in: p4_in,             out: { x:  0, y: -1 }, lengthMultiplier: 1.0               }, // P4
    ];

    // Step 1: If invert, negate Y of all points and control directions
    if (invert) {
      points.forEach(p => { p.y = -p.y; });
      controlDirections.forEach(d => {
        d.in.y  = -d.in.y;
        d.out.y = -d.out.y;
      });
    }

    // Step 2: Compute control points from (possibly inverted) base points
    const controls = points.map((p, i) => {
      const len = curve * controlDirections[i].lengthMultiplier;
      return {
        in:  { x: p.x + controlDirections[i].in.x  * len, y: p.y + controlDirections[i].in.y  * len },
        out: { x: p.x + controlDirections[i].out.x * len, y: p.y + controlDirections[i].out.y * len },
      };
    });

    // Step 3: Find minY across all points AND control points
    const allForBounds = [...points];
    controls.forEach(c => allForBounds.push(c.in, c.out));
    const minY = Math.min(...allForBounds.map(p => p.y));

    // Step 4: Shift all Y values: align topmost point to y=0, then apply position offset
    const shift = -minY + position;
    points.forEach(p => { p.y += shift; });
    controls.forEach(c => { c.in.y += shift; c.out.y += shift; });

    // Step 5: Build SVG path string using cubic Bezier curves
    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length; i++) {
      const next = (i + 1) % points.length;
      path += ` C ${controls[i].out.x},${controls[i].out.y} ${controls[next].in.x},${controls[next].in.y} ${points[next].x},${points[next].y}`;
    }
    path += ' Z';

    // Step 6: Calculate viewBox bounds from final shifted coordinates
    const finalPoints = [...points];
    controls.forEach(c => finalPoints.push(c.in, c.out));
    const xs = finalPoints.map(p => p.x);
    const ys = finalPoints.map(p => p.y);

    return {
      path: path.trim().replace(/\s+/g, ' '),
      bounds: {
        minX: Math.min(...xs), maxX: Math.max(...xs),
        minY: Math.min(...ys), maxY: Math.max(...ys),
      },
    };
  }

  _renderTicks(ticksTransform = 'none') {
    const c   = this.config;
    const cx  = 50, cy = 50, r = 50;

    const cardinals   = [c.cardinal_north, c.cardinal_east, c.cardinal_south, c.cardinal_west];
    const cardinalIdx = [0, 4, 8, 12];

    const tickDefs = {
      major: { show: c.major_ticks_show, length: c.major_ticks_length, width: c.major_ticks_width, color: c.major_ticks_color, position: c.major_ticks_position || 0, cardinals: c.cardinals_show, cardinal_color: c.cardinals_fontcolor, cardinal_fontsize: c.cardinals_fontsize, cardinal_fontweight: c.cardinals_fontweight, cardinal_position: c.cardinals_position || 0 },
      minor: { show: c.minor_ticks_show, length: c.minor_ticks_length, width: c.minor_ticks_width, color: c.minor_ticks_color, position: c.minor_ticks_position || 0, cardinals: false },
      micro: { show: c.micro_ticks_show, length: c.micro_ticks_length, width: c.micro_ticks_width, color: c.micro_ticks_color, position: c.micro_ticks_position || 0, cardinals: false },
    };

    const ticks = Array.from({ length: 16 }, (_, i) => {
      const size     = i % 4 === 0 ? 'major' : i % 2 === 0 ? 'minor' : 'micro';
      const def      = tickDefs[size];
      const show     = def.show;
      const length   = parseFloat(def.length);
      const width    = parseFloat(def.width);
      const color    = def.color;
      const position = parseFloat(def.position);
      const angle    = (i * 22.5) * Math.PI / 180;
      const sinA     = Math.sin(angle);
      const cosA     = Math.cos(angle);

      // Cardinal label for major ticks
      if (def.cardinals) {
        const cardinalIndex = cardinalIdx.indexOf(i);
        const letter = cardinals[cardinalIndex];
        const tx = cx + (r + def.cardinal_position) * sinA;
        const ty = cy - (r + def.cardinal_position) * cosA;
        const offset = def.cardinal_fontsize * 0.85;
        const lx = tx - offset * sinA;
        const ly = ty + offset * cosA;
        return { show: true, type: 'text', x: lx, y: ly, letter, fontSize: def.cardinal_fontsize, fontWeight: def.cardinal_fontweight, color: def.cardinal_color };
      }

      const x1 = cx + (r + position)          * sinA;
      const y1 = cy - (r + position)          * cosA;
      const x2 = cx + (r + position - length) * sinA;
      const y2 = cy - (r + position - length) * cosA;
      return { show, type: 'line', x1, y1, x2, y2, color, width };
    });

    // Build marker triangles — inverted triangle pointing inward at a fixed bearing
    const markerDefs = [
      { show: c.marker_1_show, degrees: parseFloat(c.marker_1_degrees), length: parseFloat(c.marker_1_length), width: parseFloat(c.marker_1_width), position: parseFloat(c.marker_1_position), color: c.marker_1_color },
      { show: c.marker_2_show, degrees: parseFloat(c.marker_2_degrees), length: parseFloat(c.marker_2_length), width: parseFloat(c.marker_2_width), position: parseFloat(c.marker_2_position), color: c.marker_2_color },
    ];

    const markers = markerDefs.map(m => {
      if (!m.show) return null;
      const angle  = m.degrees * Math.PI / 180;
      const sinA   = Math.sin(angle);
      const cosA   = Math.cos(angle);
      // Tip: on the bezel edge + position offset
      const tipR   = r + m.position;
      const tx     = cx + tipR * sinA;
      const ty     = cy - tipR * cosA;
      // Base: outward from tip by length
      const baseR  = tipR + m.length;
      const baseCx = cx + baseR * sinA;
      const baseCy = cy - baseR * cosA;
      // Base corners: perpendicular to radial direction, ±width/2
      const half   = m.width / 2;
      const b1x    = baseCx + half * cosA;
      const b1y    = baseCy + half * sinA;
      const b2x    = baseCx - half * cosA;
      const b2y    = baseCy - half * sinA;
      return { color: m.color, path: `M ${tx},${ty} L ${b1x},${b1y} L ${b2x},${b2y} Z` };
    }).filter(Boolean);

    return html`
      <div class="compass-ticks-wrapper" style="transform:${ticksTransform}">
        <svg class="compass-ticks" viewBox="0 0 100 100" preserveAspectRatio="none">
          ${ticks.map(t => {
            if (!t.show) return '';
            if (t.type === 'text') return svg`
              <text
                x="${t.x}" y="${t.y}"
                text-anchor="middle"
                dominant-baseline="central"
                font-size="${t.fontSize}"
                font-weight="${t.fontWeight}"
                fill="${t.color}"
              >${t.letter}</text>
            `;
            return svg`
              <line x1="${t.x1}" y1="${t.y1}" x2="${t.x2}" y2="${t.y2}"
                    stroke="${t.color}" stroke-width="${t.width}" stroke-linecap="round"/>
            `;
          })}
          ${markers.map(m => svg`
            <path d="${m.path}" fill="${m.color}" />
          `)}
        </svg>
      </div>
    `;
  }

  _fieldStyle(def) {
    return `font-size:${def.fontsize}em; font-weight:${def.fontweight}; color:${def.fontcolor}; top:${def.position}%;`;
  }

  _unitStyle(def) {
    return `font-size:${def.unit_fontsize / def.fontsize}em; font-weight:${def.unit_fontweight}; color:${def.unit_fontcolor};`;
  }

  render() {
    const c = this.config || {};

    // Rotation: in compass_rotate mode the dial spins and the needle stays north;
    // in normal mode the needle rotates and the dial stays fixed.
    let needleTransform, ticksTransform;
    if (c.compass_rotate) {
      ticksTransform  = `rotate(${-this._degrees}deg)`;
      needleTransform = `rotate(${c.needle_rotate ? 180 : 0}deg)`;
    } else {
      ticksTransform  = 'none';
      needleTransform = `rotate(${c.needle_rotate ? this._degrees + 180 : this._degrees}deg)`;
    }

    const fieldDefs = [
      { index: 1, show: c.field_1_show, unit: c.field_1_unit, fontsize: parseFloat(c.field_1_fontsize), fontweight: c.field_1_fontweight, position: c.field_1_position, fontcolor: c.field_1_fontcolor, unit_fontsize: parseFloat(c.field_1_unit_fontsize), unit_fontweight: c.field_1_unit_fontweight, unit_fontcolor: c.field_1_unit_fontcolor },
      { index: 2, show: c.field_2_show, unit: c.field_2_unit, fontsize: parseFloat(c.field_2_fontsize), fontweight: c.field_2_fontweight, position: c.field_2_position, fontcolor: c.field_2_fontcolor, unit_fontsize: parseFloat(c.field_2_unit_fontsize), unit_fontweight: c.field_2_unit_fontweight, unit_fontcolor: c.field_2_unit_fontcolor },
      { index: 3, show: c.field_3_show, unit: c.field_3_unit, fontsize: parseFloat(c.field_3_fontsize), fontweight: c.field_3_fontweight, position: c.field_3_position, fontcolor: c.field_3_fontcolor, unit_fontsize: parseFloat(c.field_3_unit_fontsize), unit_fontweight: c.field_3_unit_fontweight, unit_fontcolor: c.field_3_unit_fontcolor },
    ];

    const renderField = (def, val) => {
      if (!def.show) return html``;
      return html`
        <div class="field field-${def.index}" style=${this._fieldStyle(def)}>
          ${val}${def.unit ? html`<span style=${this._unitStyle(def)}>${def.unit}</span>` : ''}
        </div>
      `;
    };

    // Build needle path (invert and position handled inside)
    const morph    = parseFloat(c.needle_morph);
    const curve    = parseFloat(c.needle_curve);
    const position = parseFloat(c.needle_position);
    const pathData = this._buildNeedlePath(morph, curve, c.needle_invert, position);

    const { minX, minY, maxX, maxY } = pathData.bounds;
    const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;

    // Gradient stops — swap colors when needle is inverted so gradient follows the shape
    const g1    = c.needle_invert ? c.needle_color_2     : c.needle_color_1;
    const g1pos = c.needle_invert ? 100 - parseFloat(c.needle_color_2_pos) : parseFloat(c.needle_color_1_pos);
    const g2    = c.needle_invert ? c.needle_color_1     : c.needle_color_2;
    const g2pos = c.needle_invert ? 100 - parseFloat(c.needle_color_1_pos) : parseFloat(c.needle_color_2_pos);

    return html`
      <ha-card>
        ${c.header_show ? html`
          <div class="card-header-text" style="font-size:${c.header_fontsize}em; font-weight:${c.header_fontweight}; color:${c.header_fontcolor}; transform:translateY(calc(10px + ${c.header_position}px));">
            ${this._headerValue}
          </div>
        ` : ''}
        <div class="compass-container">
          <div class="compass-circle">
            ${renderField(fieldDefs[0], this._field1Value)}
            ${renderField(fieldDefs[1], this._field2Value)}
            ${renderField(fieldDefs[2], this._field3Value)}
          </div>
          ${this._renderTicks(ticksTransform)}
          <div class="compass-needle-wrapper" style="transform:${needleTransform}">
            ${c.needle_show ? html`
              <svg class="compass-needle"
                   viewBox="${viewBox}"
                   preserveAspectRatio="none">
                <defs>
                  <linearGradient id="needleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"        stop-color="${g1}" />
                    <stop offset="${g1pos}%" stop-color="${g1}" />
                    <stop offset="${g2pos}%" stop-color="${g2}" />
                    <stop offset="100%"      stop-color="${g2}" />
                  </linearGradient>
                </defs>
                <path d="${pathData.path}" fill="url(#needleGradient)" />
              </svg>
            ` : ''}
          </div>
        </div>
        ${c.footer_show ? html`
          <div class="card-footer-text" style="font-size:${c.footer_fontsize}em; font-weight:${c.footer_fontweight}; color:${c.footer_fontcolor}; transform:translateY(calc(-10px + ${c.footer_position}px));">
            ${this._footerValue}
          </div>
        ` : ''}
      </ha-card>
    `;
  }

  static styles = css`
    ha-card {
      padding: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
    }
    .card-header-text {
      width: 100%;
      text-align: center;
      padding: 10px 8px 0 8px;
      box-sizing: border-box;
      line-height: 1.3;
    }
    .card-footer-text {
      width: 100%;
      text-align: center;
      padding: 0 8px 10px 8px;
      box-sizing: border-box;
      line-height: 1.3;
    }
    .compass-container {
      position: relative;
      width: 100%;
      padding: 8%;
      padding-bottom: 92%;
      height: 0;
      display: block;
      margin: 0 auto;
      overflow: hidden;
      box-sizing: border-box;
    }
    .compass-circle {
      position: absolute;
      top:    calc(8% - var(--cc-border-size, 0px));
      left:   calc(8% - var(--cc-border-size, 0px));
      right:  calc(8% - var(--cc-border-size, 0px));
      bottom: calc(8% - var(--cc-border-size, 0px));
      border-radius: 50%;
      background-color: var(--cc-bg-color, #111111);
      border: var(--cc-circle-border-width, 15px) solid var(--cc-circle-color, #333333);
      box-sizing: border-box;
      font-size: var(--cc-font-size, 1em);
    }
    .compass-ticks-wrapper {
      position: absolute;
      top:    calc(8% - var(--cc-border-size, 0px));
      left:   calc(8% - var(--cc-border-size, 0px));
      right:  calc(8% - var(--cc-border-size, 0px));
      bottom: calc(8% - var(--cc-border-size, 0px));
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;
      pointer-events: none;
      transition: transform var(--cc-animation-duration, 0.3s) ease-out;
    }
    .compass-ticks {
      position: absolute;
      width:  var(--cc-circle-size, 100px);
      height: var(--cc-circle-size, 100px);
      overflow: visible;
    }
    .compass-needle-wrapper {
      position: absolute;
      top:    calc(8% - var(--cc-border-size, 0px));
      left:   calc(8% - var(--cc-border-size, 0px));
      right:  calc(8% - var(--cc-border-size, 0px));
      bottom: calc(8% - var(--cc-border-size, 0px));
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2;
      transition: transform var(--cc-animation-duration, 0.3s) ease-out;
    }
    .compass-needle {
      position: absolute;
      width:  var(--cc-needle-width,  6px);
      height: var(--cc-needle-height, 32px);
      top:    calc(0px - var(--cc-needle-position, 0px));
    }
    .field {
      position: absolute;
      left: 0;
      width: 100%;
      text-align: center;
      z-index: 100;
      line-height: 1.15;
      display: flex;
      justify-content: center;
      align-items: baseline;
      gap: 0.1em;
      transform: translateY(-50%);
      white-space: nowrap;
    }
  `;

  static getCardSize() {
    return 4;
  }

  static getConfigElement() {
    return document.createElement('custom-compass-card-editor');
  }

  static getStubConfig() {
    return { ...DEFAULT_CONFIG };
  }
}

customElements.define('custom-compass-card', CustomCompassCard);

// Log version info
console.info(
  `%c CUSTOM-COMPASS-CARD %c v${CARD_VERSION} `,
  'background-color: #29b6cf; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 3px 0 0 3px;',
  'background-color: #1e1e1e; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 0 3px 3px 0;'
);

window.customCards = window.customCards || [];
window.customCards.push({
  type:        'custom-compass-card',
  name:        'Custom Compass Card',
  description: 'A fully configurable compass card with dynamic fields.',
  preview:     true,
  config:      CustomCompassCard.getStubConfig(),
});
