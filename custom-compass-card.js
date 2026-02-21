import { LitElement, html, css } from 'https://unpkg.com/lit@2.0.0/index.js?module';

// ─── Card Version ─────────────────────────────────────────────────────────────
const CARD_VERSION = '2.2.18';

// ─── Default Configuration ────────────────────────────────────────────────────
const DEFAULT_CONFIG = {
  compass_entity: 'sensor.wind_bearing',
  compass_adjustment: 0,
  background_color: '#101010',
  circle_width: 16,
  circle_color: '#383838',
  arrow_width: 3,
  arrow_height: 16,
  arrow_color: '#E0E0E0',
  arrow_outward: true,
  arrow_inward: false,
  field_1_show: true,
  field_1_template: '${compass_direction}',
  field_1_unit: '',
  field_1_fontsize: 1.6,
  field_1_fontcolor: '#29B6CF',
  field_1_unit_fontsize: 1.0,
  field_1_unit_fontcolor: '#196D7C',
  field_2_show: true,
  field_2_template: "{{ states('sensor.ws_wind_speed') | round(1) }}",
  field_2_unit: 'km/h',
  field_2_fontsize: 2.1,
  field_2_fontcolor: '#E8E8E8',
  field_2_unit_fontsize: 1.2,
  field_2_unit_fontcolor: '#8C8C8C',
  field_3_show: true,
  field_3_template: "{{ states('sensor.ws_wind_direction') | round(0) }}",
  field_3_unit: '°',
  field_3_fontsize: 1.4,
  field_3_fontcolor: '#808080',
  field_3_unit_fontsize: 1.4,
  field_3_unit_fontcolor: '#606060',
};

// ─── Visual Editor ────────────────────────────────────────────────────────────
class CustomCompassCardEditor extends LitElement {
  static properties = {
    hass: { type: Object },
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
      <div class="entity-header">
        <span>Direction entity</span>
      </div>

      <div class="entity-fields">
        <ha-entity-picker
          .hass=${this.hass}
          .value=${c.compass_entity ?? ''}
          .includeDomains=${['sensor']}
          allow-custom-entity
          @value-changed=${e => this._valueChanged('compass_entity', e)}
        ></ha-entity-picker>
        <ha-textfield
          label="Bearing Adjustment (°)"
          type="number"
          step="1"
          .value=${String(c.compass_adjustment ?? 0)}
          @input=${e => this._valueChanged('compass_adjustment', e)}
        ></ha-textfield>
      </div>


      <div class="compass-header">
        <span>Compass style</span>
      </div>

      <div class="styling-grid">
        ${this._colorPicker('background_color', 'Background Color')}
        ${this._colorPicker('circle_color', 'Border Color')}
        <div class="number-field">
          <label>Border Width (px)</label>
          <ha-textfield
            type="number"
            step="1"
            min="0"
            .value=${String(c.circle_width ?? 15)}
            @input=${e => this._valueChanged('circle_width', e)}
          ></ha-textfield>
        </div>
      </div>
      

      <div class="arrow-header">
        <span>Arrow style</span>
      </div>

      <div class="styling-grid">
        ${this._colorPicker('arrow_color', 'Arrow Color')}
        <div class="number-field">
          <label>Arrow Height (px)</label>
          <ha-textfield
            type="number"
            step="1"
            min="4"
            .value=${String(c.arrow_height ?? 15)}
            @input=${e => this._valueChanged('arrow_height', e)}
          ></ha-textfield>
        </div>
        <div class="number-field">
          <label>Arrow Width (px)</label>
          <ha-textfield
            type="number"
            step="1"
            min="1"
            .value=${String(c.arrow_width ?? 3)}
            @input=${e => this._valueChanged('arrow_width', e)}
          ></ha-textfield>
        </div>
      </div>

      <div class="arrow-toggles">
        <ha-formfield>
          <label>Show outward arrow</label>
          <ha-switch
            .checked=${c.arrow_outward}
            @change=${e => this._valueChanged('arrow_outward', e)}
          ></ha-switch>
        </ha-formfield>
        <ha-formfield>
          <label>Show inward arrow</label>
          <ha-switch
            .checked=${c.arrow_inward}
            @change=${e => this._valueChanged('arrow_inward', e)}
          ></ha-switch>
        </ha-formfield>
      </div>


      <!-- Field 1 -->
      
      <div class="field-toggle">
        <label>Show Field 1</label>
        <ha-switch
          .checked=${c.field_1_show}
          @change=${e => this._valueChanged('field_1_show', e)}
        ></ha-switch>
      </div>

      <div class="field-grid">
        <ha-textfield
          label="Template"
          .value=${c.field_1_template ?? ''}
          @input=${e => this._valueChanged('field_1_template', e)}
        ></ha-textfield>
        <ha-textfield
          label="Font Size (em)"
          type="number"
          step="0.1"
          .value=${String(c.field_1_fontsize ?? 1.4)}
          @input=${e => this._valueChanged('field_1_fontsize', e)}
        ></ha-textfield>
        ${this._colorPicker('field_1_fontcolor', 'Font Color')}
      </div>

      <div class="field-grid">
        <ha-textfield
          label="Unit"
          .value=${c.field_1_unit ?? ''}
          @input=${e => this._valueChanged('field_1_unit', e)}
        ></ha-textfield>
        <ha-textfield
          label="Unit Size (em)"
          type="number"
          step="0.1"
          .value=${String(c.field_1_unit_fontsize ?? 0.84)}
          @input=${e => this._valueChanged('field_1_unit_fontsize', e)}
        ></ha-textfield>
        ${this._colorPicker('field_1_unit_fontcolor', 'Unit Color')}
      </div>


      <!-- Field 2 -->
      
      <div class="field-toggle">
        <label>Show Field 2</label>
        <ha-switch
          .checked=${c.field_2_show}
          @change=${e => this._valueChanged('field_2_show', e)}
        ></ha-switch>
      </div>
      
      <div class="field-grid">
        <ha-textfield
          label="Template"
          .value=${c.field_2_template ?? ''}
          @input=${e => this._valueChanged('field_2_template', e)}
        ></ha-textfield>
        <ha-textfield
          label="Font Size (em)"
          type="number"
          step="0.1"
          .value=${String(c.field_2_fontsize ?? 1.4)}
          @input=${e => this._valueChanged('field_2_fontsize', e)}
        ></ha-textfield>
        ${this._colorPicker('field_2_fontcolor', 'Font Color')}
      </div>
      
      <div class="field-grid">
        <ha-textfield
          label="Unit"
          .value=${c.field_2_unit ?? ''}
          @input=${e => this._valueChanged('field_2_unit', e)}
        ></ha-textfield>
        <ha-textfield
          label="Unit Size (em)"
          type="number"
          step="0.1"
          .value=${String(c.field_2_unit_fontsize ?? 0.84)}
          @input=${e => this._valueChanged('field_2_unit_fontsize', e)}
        ></ha-textfield>
        ${this._colorPicker('field_2_unit_fontcolor', 'Unit Color')}
      </div>


      <!-- Field 3 -->
      
      <div class="field-toggle">
        <label>Show Field 3</label>
        <ha-switch
          .checked=${c.field_3_show}
          @change=${e => this._valueChanged('field_3_show', e)}
        ></ha-switch>
      </div>
      
      <div class="field-grid">
        <ha-textfield
          label="Template"
          .value=${c.field_3_template ?? ''}
          @input=${e => this._valueChanged('field_3_template', e)}
        ></ha-textfield>
        <ha-textfield
          label="Font Size (em)"
          type="number"
          step="0.1"
          .value=${String(c.field_3_fontsize ?? 1.4)}
          @input=${e => this._valueChanged('field_3_fontsize', e)}
        ></ha-textfield>
        ${this._colorPicker('field_3_fontcolor', 'Font Color')}
      </div>
      
      <div class="field-grid">
        <ha-textfield
          label="Unit"
          .value=${c.field_3_unit ?? ''}
          @input=${e => this._valueChanged('field_3_unit', e)}
        ></ha-textfield>
        <ha-textfield
          label="Unit Size (em)"
          type="number"
          step="0.1"
          .value=${String(c.field_3_unit_fontsize ?? 0.84)}
          @input=${e => this._valueChanged('field_3_unit_fontsize', e)}
        ></ha-textfield>
        ${this._colorPicker('field_3_unit_fontcolor', 'Unit Color')}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }
    
    .entity-header {
      display: grid;
      grid-template-columns: 1fr;
      margin-top: 0px;
      margin-left: 5px;
      margin-bottom: 3px;
      gap: 8px;
    }

    .compass-header {
      display: grid;
      grid-template-columns: 1fr;
      margin-top: 25px;
      margin-left: 5px;
      margin-bottom: 3px;
      gap: 8px;
    }

    .arrow-header {
      display: grid;
      grid-template-columns: 1fr;
      margin-top: 20px;
      margin-left: 5px;
      margin-bottom: 3px;
      gap: 8px;
    }

    .entity-fields {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 8px;
    }

    .styling-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      margin-bottom: 16px;
    }

    .number-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .number-field label {
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
      border: 1px solid var(--input-outlined-idle-border-color, #444);
      border-radius: 4px;
      padding: 4px 8px;
    }
    .color-row input[type="color"] {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 4px;
      background: transparent;
      cursor: pointer;
      padding: 0;
      flex-shrink: 0;
    }
    .color-row ha-textfield {
      flex: 1;
      --mdc-text-field-fill-color: transparent;
      --mdc-text-field-outlined-idle-border-color: transparent;
      --mdc-text-field-outlined-hover-border-color: transparent;
    }

    .arrow-toggles {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 20px;
      margin-bottom: 15px;
    }
    .arrow-toggles label {
      font-size: 14px;
      margin-left: 4px;
      margin-right: 8px;
    }

    .field-toggle {
      display: block;
      margin-top: 40px;
      margin-bottom: 15px;
    }
    .field-toggle label {
      font-size: 14px;
      margin-left: 4px;
      margin-right: 8px;
    }

    .field-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 8px;
      margin-bottom: 16px;
    }

    ha-entity-picker,
    ha-textfield {
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
    this._degrees     = 0;
    this._field1Value = '';
    this._field2Value = '';
    this._field3Value = '';
    this._error       = false;
  }

  setConfig(config) {
    if (!config.compass_entity) {
      throw new Error('You must define a compass_entity.');
    }
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async willUpdate(changedProperties) {
    if (!changedProperties.has('hass') || !this.config?.compass_entity) return;

    const stateObj = this.hass.states[this.config.compass_entity];
    if (stateObj) {
      const raw = parseFloat(stateObj.state);
      if (!isNaN(raw)) {
        const adj = parseFloat(this.config.compass_adjustment) || 0;
        this._degrees = ((raw + adj) % 360 + 360) % 360;
        this._error   = false;
      } else {
        console.warn(`CustomCompassCard: "${this.config.compass_entity}" state is not a number.`);
        this._degrees = 0;
        this._error   = true;
      }
    } else {
      console.warn(`CustomCompassCard: Entity "${this.config.compass_entity}" not found.`);
      this._degrees = 0;
      this._error   = true;
    }

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
  }

  _scaleElements() {
    const circle = this.shadowRoot.querySelector('.compass-circle');
    if (!circle) return;

    const BASE_DESIGN_WIDTH = 120;
    const actualWidth  = circle.offsetWidth;
    const scale        = actualWidth / BASE_DESIGN_WIDTH;

    this.style.setProperty('--cc-font-size', `${actualWidth * 0.08}px`);

    const initBorder = parseFloat(this.config.circle_width) || 15;
    this.style.setProperty('--cc-circle-border-width', `${initBorder * scale}px`);
    this.style.setProperty('--cc-circle-color', this.config.circle_color || 'var(--divider-color)');
    this.style.setProperty('--cc-bg-color', this.config.background_color || 'var(--primary-background-color)');

    // Set arrow CSS variables for both types
    const initW = parseFloat(this.config.arrow_width)  || 3;
    const initH = parseFloat(this.config.arrow_height) || 17;
    const color = this.config.arrow_color || 'var(--primary-text-color)';

    const scaledW   = initW   * scale;
    const scaledH   = initH   * scale;
    const scaledTop = -initBorder * scale;

    // Shared properties for both arrows
    this.style.setProperty('--cc-arrow-border-left',   `${scaledW}px solid transparent`);
    this.style.setProperty('--cc-arrow-border-right',  `${scaledW}px solid transparent`);
    this.style.setProperty('--cc-arrow-top',           `${scaledTop}px`);
    this.style.setProperty('--cc-arrow-bottom',        `${scaledTop}px`);
    
    // Outward arrow (tip at outer edge, uses border-top)
    this.style.setProperty('--cc-arrow-outward-border', `${scaledH}px solid ${color}`);
    
    // Inward arrow (base at outer edge, uses border-top)
    this.style.setProperty('--cc-arrow-inward-border', `${scaledH}px solid ${color}`);
  }

  async _evaluateTemplate(template, degrees) {
    try {
      const processed = template.replace('${compass_direction}', this.getCompassDirection(degrees));
      const response  = await this.hass.callApi('POST', 'template', { template: processed });
      return response;
    } catch (e) {
      console.error('CustomCompassCard: Error evaluating template:', template, e);
      return 'Error';
    }
  }

  getCompassDirection(degrees) {
    const dirs  = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    return dirs[Math.floor((degrees + 11.25) / 22.5) % 16];
  }

  _fieldStyle(n) {
    const size  = parseFloat(this.config[`field_${n}_fontsize`]) || 1.4;
    const color = this.config[`field_${n}_fontcolor`] || '#e8e8e8';
    return `font-size:${size}em; color:${color};`;
  }

  _unitStyle(n) {
    const size  = parseFloat(this.config[`field_${n}_unit_fontsize`]) || 0.84;
    const color = this.config[`field_${n}_unit_fontcolor`] || '#5f5f5f';
    const fieldSize = parseFloat(this.config[`field_${n}_fontsize`]) || 1.4;
    const relSize   = size / fieldSize;
    return `font-size:${relSize}em; color:${color};`;
  }

  render() {
    const c   = this.config || {};
    const rot = `rotate(${this._degrees}deg)`;

    const renderField = (n, val) => {
      if (!c[`field_${n}_show`]) return html``;
      const unit = c[`field_${n}_unit`];
      return html`
        <div class="field field-${n}" style=${this._fieldStyle(n)}>
          ${val}${unit ? html`<span style=${this._unitStyle(n)}>${unit}</span>` : ''}
        </div>
      `;
    };

    return html`
      <ha-card>
        <div class="compass-container">
          <div class="compass-circle">
            <div class="compass-arrow-wrapper" style="transform:${rot}">
              ${c.arrow_inward ? html`<div class="compass-arrow-inward"></div>` : ''}
              ${c.arrow_outward ? html`<div class="compass-arrow-outward"></div>` : ''}
            </div>
            ${renderField(1, this._field1Value)}
            ${renderField(2, this._field2Value)}
            ${renderField(3, this._field3Value)}
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
      width: 84%;
      padding-bottom: 84%;
      height: 0;
      display: block;
      margin: 8% auto;
      overflow: hidden;
    }
    .compass-circle {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      border-radius: 50%;
      background-color: var(--cc-bg-color, #111111);
      border: var(--cc-circle-border-width, 15px) solid var(--cc-circle-color, #333333);
      box-sizing: border-box;
      z-index: 0;
      font-size: var(--cc-font-size, 1em);
    }
    .compass-arrow-wrapper {
      position: absolute;
      width: 100%; height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;
    }
    .compass-arrow-outward {
      position: absolute;
      width: 0; height: 0;
      border-left:   var(--cc-arrow-border-left,   3px solid transparent);
      border-right:  var(--cc-arrow-border-right,  3px solid transparent);
      border-top:    var(--cc-arrow-outward-border, 27px solid #e0e0e0);
      transform-origin: 50% 100%;
      bottom: var(--cc-arrow-bottom, -18px);
      z-index: 1;
    }
    .compass-arrow-inward {
      position: absolute;
      width: 0; height: 0;
      border-left:   var(--cc-arrow-border-left,   3px solid transparent);
      border-right:  var(--cc-arrow-border-right,  3px solid transparent);
      border-top:    var(--cc-arrow-inward-border,  27px solid #e0e0e0);
      transform-origin: 50% 0%;
      top: var(--cc-arrow-top, -18px);
      z-index: 1;
    }
    .field {
      position: absolute;
      left: 0;
      width: 100%;
      text-align: center;
      z-index: 10;
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
  type: 'custom-compass-card',
  name: 'Custom Compass Card',
  description: 'A fully configurable compass card with dynamic fields.',
  preview: true,
  documentationURL: '',
  config: CustomCompassCard.getStubConfig(),
});
