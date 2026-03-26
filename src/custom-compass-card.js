import { LitElement, html, svg, css } from 'https://unpkg.com/lit@2.0.0/index.js?module';

// ─── Card Version ─────────────────────────────────────────────────────────────
const CARD_VERSION = '3.2.82';

// ─── Default Configuration ────────────────────────────────────────────────────
const DEFAULT_CONFIG = {
  compass_entity:         'sun.sun',
  compass_attribute:      'azimuth',
  compass_adjustment:     0,
  background_color:       '#101010',
  border_color:           '#383838',
  border_width:           16,
  border_size:            0,
  needle_width:           4,
  needle_height:          16,
  needle_color_1:         '#FF0000',
  needle_color_1_pos:     0,
  needle_color_2:         '#FF0000',
  needle_color_2_pos:     100,
  needle_position:        0,
  needle_morph:           0,
  needle_curve:           0,
  needle_show:            true,
  needle_invert:          false,
  needle_rotate:          false,
  tick_large_show:        true,
  tick_large_length:      8,
  tick_large_width:       6,
  tick_large_color:       '#CCCCCC',
  tick_large_position:    0,
  tick_large_cardinals:   true,
  tick_medium_show:       true,
  tick_medium_length:     3,
  tick_medium_width:      1.5,
  tick_medium_color:      '#AAAAAA',
  tick_medium_position:   -4.5,
  tick_small_show:        true,
  tick_small_length:      0,
  tick_small_width:       2,
  tick_small_color:       '#888888',
  tick_small_position:    -6.5,
  field_1_show:           true,
  field_1_template:       '${compass_direction}',
  field_1_unit:           '',
  field_1_fontsize:       1.6,
  field_1_fontcolor:      '#29B6CF',
  field_1_unit_fontsize:  1.0,
  field_1_unit_fontcolor: '#196D7C',
  field_2_show:           true,
  field_2_template:       "{{ states('sensor.ws_wind_speed') | round(1) }}",
  field_2_unit:           'km/h',
  field_2_fontsize:       2.1,
  field_2_fontcolor:      '#E8E8E8',
  field_2_unit_fontsize:  1.2,
  field_2_unit_fontcolor: '#8C8C8C',
  field_3_show:           true,
  field_3_template:       "{{ state_attr('sun.sun', 'azimuth') | round(0) }}",
  field_3_unit:           '°',
  field_3_fontsize:       1.4,
  field_3_fontcolor:      '#808080',
  field_3_unit_fontsize:  1.4,
  field_3_unit_fontcolor: '#606060',
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

	  <h2 style="margin-top: 0; margin-bottom: 16px;">Compass configuration</h2>

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
        ${this._colorPicker('border_color', 'Border color')}
        <div class="text-field">
          <label>Border width</label>
          <ha-textfield
            type="number" step="1" min="0"
            .value=${String(c.border_width)}
            @input=${e => this._valueChanged('border_width', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Border size</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(c.border_size)}
            @input=${e => this._valueChanged('border_size', e)}
          ></ha-textfield>
        </div>
      </div>
	  
	  <h2>Needle configuration</h2>

      <!-- Needle toggles -->
      <div class="needle-toggles-grid">
        <ha-formfield>
          <label>Show needle</label>
          <ha-switch
            .checked=${c.needle_show}
            @change=${e => this._valueChanged('needle_show', e)}
          ></ha-switch>
        </ha-formfield>
        <ha-formfield>
          <label>Invert needle</label>
          <ha-switch
            .checked=${c.needle_invert}
            @change=${e => this._valueChanged('needle_invert', e)}
          ></ha-switch>
        </ha-formfield>
        <ha-formfield>
          <label>Rotate needle</label>
          <ha-switch
            .checked=${c.needle_rotate}
            @change=${e => this._valueChanged('needle_rotate', e)}
          ></ha-switch>
        </ha-formfield>
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

	  <h2>Tickmarks configuration</h2>

      <!-- Large ticks -->
      <div class="tickmark-toggles-grid">
        <label>Show large ticks</label>
        <ha-switch
          .checked=${c.tick_large_show}
          @change=${e => this._valueChanged('tick_large_show', e)}
        ></ha-switch>
        <label style="margin-left:16px;">Cardinal labels</label>
        <ha-switch
          .checked=${c.tick_large_cardinals}
          @change=${e => this._valueChanged('tick_large_cardinals', e)}
        ></ha-switch>
      </div>
      <div class="tickmark-styling-grid">
        <div class="text-field">
          <label>Length</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(c.tick_large_length)}
            @input=${e => this._valueChanged('tick_large_length', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(c.tick_large_width)}
            @input=${e => this._valueChanged('tick_large_width', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="0.5"
            .value=${String(c.tick_large_position)}
            @input=${e => this._valueChanged('tick_large_position', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('tick_large_color', 'Color')}
      </div>

      <!-- Medium ticks -->
      <div class="tickmark-toggles-grid">
        <label>Show medium ticks</label>
        <ha-switch
          .checked=${c.tick_medium_show}
          @change=${e => this._valueChanged('tick_medium_show', e)}
        ></ha-switch>
      </div>
      <div class="tickmark-styling-grid">
        <div class="text-field">
          <label>Length</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(c.tick_medium_length)}
            @input=${e => this._valueChanged('tick_medium_length', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(c.tick_medium_width)}
            @input=${e => this._valueChanged('tick_medium_width', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="0.5"
            .value=${String(c.tick_medium_position)}
            @input=${e => this._valueChanged('tick_medium_position', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('tick_medium_color', 'Color')}
      </div>

      <!-- Small ticks -->
      <div class="tickmark-toggles-grid">
        <label>Show small ticks</label>
        <ha-switch
          .checked=${c.tick_small_show}
          @change=${e => this._valueChanged('tick_small_show', e)}
        ></ha-switch>
      </div>
      <div class="tickmark-styling-grid">
        <div class="text-field">
          <label>Length</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(c.tick_small_length)}
            @input=${e => this._valueChanged('tick_small_length', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(c.tick_small_width)}
            @input=${e => this._valueChanged('tick_small_width', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="0.5"
            .value=${String(c.tick_small_position)}
            @input=${e => this._valueChanged('tick_small_position', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('tick_small_color', 'Color')}
      </div>

	  <h2 style="margin-bottom: 0px;">Custom fields configuration</h2>

      <!-- Field 1 -->
      <div class="field-toggles-grid">
        <label>Show Field 1</label>
        <ha-switch
          .checked=${c.field_1_show}
          @change=${e => this._valueChanged('field_1_show', e)}
        ></ha-switch>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Field 1 template</label>
          <ha-textfield
            .value=${c.field_1_template}
            @input=${e => this._valueChanged('field_1_template', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Font size (em)</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(c.field_1_fontsize)}
            @input=${e => this._valueChanged('field_1_fontsize', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('field_1_fontcolor', 'Font Color')}
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Field 1 unit</label>
          <ha-textfield
            .value=${c.field_1_unit}
            @input=${e => this._valueChanged('field_1_unit', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Unit size (em)</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(c.field_1_unit_fontsize)}
            @input=${e => this._valueChanged('field_1_unit_fontsize', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('field_1_unit_fontcolor', 'Unit Color')}
      </div>


      <!-- Field 2 -->
      <div class="field-toggles-grid">
        <label>Show Field 2</label>
        <ha-switch
          .checked=${c.field_2_show}
          @change=${e => this._valueChanged('field_2_show', e)}
        ></ha-switch>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Field 2 template</label>
          <ha-textfield
            .value=${c.field_2_template}
            @input=${e => this._valueChanged('field_2_template', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Font size (em)</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(c.field_2_fontsize)}
            @input=${e => this._valueChanged('field_2_fontsize', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('field_2_fontcolor', 'Font Color')}
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Field 2 unit</label>
          <ha-textfield
            .value=${c.field_2_unit}
            @input=${e => this._valueChanged('field_2_unit', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Unit size (em)</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(c.field_2_unit_fontsize)}
            @input=${e => this._valueChanged('field_2_unit_fontsize', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('field_2_unit_fontcolor', 'Unit Color')}
      </div>


      <!-- Field 3 -->
      <div class="field-toggles-grid">
        <label>Show Field 3</label>
        <ha-switch
          .checked=${c.field_3_show}
          @change=${e => this._valueChanged('field_3_show', e)}
        ></ha-switch>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Field 3 template</label>
          <ha-textfield
            .value=${c.field_3_template}
            @input=${e => this._valueChanged('field_3_template', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Font size (em)</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(c.field_3_fontsize)}
            @input=${e => this._valueChanged('field_3_fontsize', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('field_3_fontcolor', 'Font Color')}
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Field 3 unit</label>
          <ha-textfield
            .value=${c.field_3_unit}
            @input=${e => this._valueChanged('field_3_unit', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Unit size (em)</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(c.field_3_unit_fontsize)}
            @input=${e => this._valueChanged('field_3_unit_fontsize', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('field_3_unit_fontcolor', 'Unit Color')}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }

    h2 {
      margin-top: 32px;
      margin-bottom: 0px;
    }

    .compass-entity-grid {
      display: grid;
      grid-template-columns: 5fr 4fr 3fr;
      gap: 8px;
    }

    .compass-styling-grid {
      display: grid;
      grid-template-columns: 7fr 7fr 4fr 4fr;
      gap: 8px;
      margin-top: 24px;
      margin-bottom: 16px;
    }

    .needle-toggles-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      margin-top: 20px;
      margin-bottom: 15px;
    }
    .needle-toggles-grid label {
      font-size: 14px;
      margin-right: 12px;
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

    .tickmark-toggles-grid {
      display: flex;
      align-items: center;
      margin-top: 40px;
      margin-bottom: 15px;
    }
    .tickmark-toggles-grid label {
      font-size: 14px;
      margin-right: 12px;
      min-width: 120px;
    }

    .tickmark-styling-grid {
      display: grid;
      grid-template-columns: 2fr 2fr 2fr 3fr;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 8px;
      align-items: end;
    }

    .field-toggles-grid {
      display: flex;
      align-items: center;
      margin-top: 40px;
      margin-bottom: 15px;
    }
    .field-toggles-grid label {
      font-size: 14px;
      margin-right: 12px;
      min-width: 120px;
    }

    .field-styling-grid {
      display: grid;
      grid-template-columns: 4fr 2fr 3fr;
      gap: 8px;
      margin-top: 16px;
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
    hass:         { type: Object },
    config:       { type: Object },
    _degrees:     { type: Number },
    _field1Value: { type: String },
    _field2Value: { type: String },
    _field3Value: { type: String },
    _error:       { type: Boolean },
  };

  constructor() {
    super();
    this._degrees        = 0;
    this._prevDegrees    = null;
    this._templatesDirty = false;
    this._field1Value    = '';
    this._field2Value    = '';
    this._field3Value    = '';
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
        const adj        = parseFloat(this.config.compass_adjustment) || 0;
        const newDegrees = ((raw + adj) % 360 + 360) % 360;
        if (newDegrees !== this._prevDegrees) {
          this._degrees        = newDegrees;
          this._prevDegrees    = newDegrees;
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
    for (const i of [1, 2, 3]) {
      if (!this.config[`field_${i}_show`]) {
        this[`_field${i}Value`] = '';
        continue;
      }
      if (this._error) {
        this[`_field${i}Value`] = 'Error';
        continue;
      }
      const tmpl = this.config[`field_${i}_template`];
      if (tmpl) {
        this[`_field${i}Value`] = await this._evaluateTemplate(tmpl, this._degrees);
      }
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

    const initBorder = parseFloat(this.config.border_width);
    const borderSize = parseFloat(this.config.border_size);
    this.style.setProperty('--cc-circle-border-width', `${initBorder * scale}px`);
    this.style.setProperty('--cc-circle-color',        this.config.border_color);
    this.style.setProperty('--cc-bg-color',            this.config.background_color);
    this.style.setProperty('--cc-border-size',         `${borderSize}px`);

    const initW   = parseFloat(this.config.needle_width);
    const initH   = parseFloat(this.config.needle_height);
    const initPos = parseFloat(this.config.needle_position);

    this.style.setProperty('--cc-needle-width',    `${initW   * scale}px`);
    this.style.setProperty('--cc-needle-height',   `${initH   * scale}px`);
    this.style.setProperty('--cc-needle-position', `${initPos * scale}px`);

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
    const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    return dirs[Math.floor((degrees + 11.25) / 22.5) % 16];
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

  _renderTicks() {
    const c   = this.config;
    const cx  = 50, cy = 50, r = 50;

    const cardinals  = ['N', 'E', 'S', 'W'];
    const cardinalIdx = [0, 4, 8, 12];

    const ticks = Array.from({ length: 16 }, (_, i) => {
      const size     = i % 4 === 0 ? 'large' : i % 2 === 0 ? 'medium' : 'small';
      const show     = c[`tick_${size}_show`];
      const length   = parseFloat(c[`tick_${size}_length`]);
      const width    = parseFloat(c[`tick_${size}_width`]);
      const color    = c[`tick_${size}_color`];
      const position = parseFloat(c[`tick_${size}_position`]) || 0;
      const angle    = (i * 22.5) * Math.PI / 180;
      const sinA     = Math.sin(angle);
      const cosA     = Math.cos(angle);

      // Cardinal label for large ticks
      if (size === 'large' && show && c.tick_large_cardinals) {
        const cardinalIndex = cardinalIdx.indexOf(i);
        const letter = cardinals[cardinalIndex];
        // Anchor point at outer edge + position offset
        const tx = cx + (r + position) * sinA;
        const ty = cy - (r + position) * cosA;
        const offset = length * 0.85;
        const lx = tx - offset * sinA;
        const ly = ty + offset * cosA;
        return { show, type: 'text', x: lx, y: ly, letter, fontSize: length, width, color };
      }

      const x1 = cx + (r + position)          * sinA;
      const y1 = cy - (r + position)          * cosA;
      const x2 = cx + (r + position - length) * sinA;
      const y2 = cy - (r + position - length) * cosA;
      return { show, type: 'line', x1, y1, x2, y2, color, width };
    });

    return html`
      <div class="compass-ticks-wrapper">
        <svg class="compass-ticks" viewBox="0 0 100 100" preserveAspectRatio="none">
          ${ticks.map(t => {
            if (!t.show) return '';
            if (t.type === 'text') return svg`
              <text
                x="${t.x}" y="${t.y}"
                text-anchor="middle"
                dominant-baseline="central"
                font-size="${t.fontSize}"
                font-weight="${t.width * 100}"
                fill="${t.color}"
              >${t.letter}</text>
            `;
            return svg`
              <line x1="${t.x1}" y1="${t.y1}" x2="${t.x2}" y2="${t.y2}"
                    stroke="${t.color}" stroke-width="${t.width}" stroke-linecap="round"/>
            `;
          })}
        </svg>
      </div>
    `;
  }

  _fieldStyle(n) {
    const size  = parseFloat(this.config[`field_${n}_fontsize`]);
    const color = this.config[`field_${n}_fontcolor`];
    return `font-size:${size}em; color:${color};`;
  }

  _unitStyle(n) {
    const size      = parseFloat(this.config[`field_${n}_unit_fontsize`]);
    const color     = this.config[`field_${n}_unit_fontcolor`];
    const fieldSize = parseFloat(this.config[`field_${n}_fontsize`]);
    return `font-size:${size / fieldSize}em; color:${color};`;
  }

  render() {
    const c = this.config || {};

    // Wrapper rotation: base degrees + 180 if rotate toggle is active
    const wrapperRotation  = c.needle_rotate ? this._degrees + 180 : this._degrees;
    const wrapperTransform = `rotate(${wrapperRotation}deg)`;

    const renderField = (n, val) => {
      if (!c[`field_${n}_show`]) return html``;
      const unit = c[`field_${n}_unit`];
      return html`
        <div class="field field-${n}" style=${this._fieldStyle(n)}>
          ${val}${unit ? html`<span style=${this._unitStyle(n)}>${unit}</span>` : ''}
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
        <div class="compass-container">
          <div class="compass-circle">
            ${renderField(1, this._field1Value)}
            ${renderField(2, this._field2Value)}
            ${renderField(3, this._field3Value)}
          </div>
          ${this._renderTicks()}
          <div class="compass-needle-wrapper" style="transform:${wrapperTransform}">
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
    .field-1 { top: 23%; }
    .field-2 { top: 50%; }
    .field-3 { top: 79%; }
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
