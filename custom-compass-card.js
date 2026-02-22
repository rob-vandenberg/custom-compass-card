import { LitElement, html, css } from 'https://unpkg.com/lit@2.0.0/index.js?module';

// ─── Card Version ─────────────────────────────────────────────────────────────
const CARD_VERSION = '2.5.20';

// ─── Default Configuration ────────────────────────────────────────────────────
const DEFAULT_CONFIG = {
  compass_entity: 'sun.sun',
  compass_attribute: 'azimuth',
  compass_adjustment: 0,
  background_color: '#101010',
  circle_width: 16,
  circle_color: '#383838',
  border_size: 0,
  arrow_width: 3,
  arrow_height: 16,
  arrow_color: '#E0E0E0',
  arrow_position: 0,
  arrow_morph: 0,
  arrow_curve: 0,
  arrow_show: true,
  arrow_invert: false,
  arrow_rotate: false,
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
  field_3_template: "{{ state_attr('sun.sun', 'azimuth') | round(0) }}",
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
      <div class="entity-fields">
        <div class="text-field">
          <label>Compass entity</label>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${c.compass_entity ?? ''}
            .includeDomains=${['sensor']}
            allow-custom-entity
            @value-changed=${e => this._valueChanged('compass_entity', e)}
          ></ha-entity-picker>
        </div>
        
        <div class="text-field">
          <label>Attribute</label>
          <ha-textfield
            .value=${c.compass_attribute ?? ''}
            @input=${e => this._valueChanged('compass_attribute', e)}
          ></ha-textfield>
        </div>
        
        <div class="text-field">
          <label>Adjustment</label>
          <ha-textfield
            type="number"
            step="1"
            .value=${String(c.compass_adjustment ?? 0)}
            @input=${e => this._valueChanged('compass_adjustment', e)}
          ></ha-textfield>
        </div>
        
      </div>

      <div class="compass-styling-grid">
        ${this._colorPicker('background_color', 'Background')}
        ${this._colorPicker('circle_color', 'Border color')}
        <div class="text-field">
          <label>Border width</label>
          <ha-textfield
            type="number"
            step="1"
            min="0"
            .value=${String(c.circle_width ?? 15)}
            @input=${e => this._valueChanged('circle_width', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Border size</label>
          <ha-textfield
            type="number"
            step="1"
            .value=${String(c.border_size ?? 0)}
            @input=${e => this._valueChanged('border_size', e)}
          ></ha-textfield>
        </div>
      </div>
      
      <div class="arrow-styling-grid">
        ${this._colorPicker('arrow_color', 'Arrow color')}
        <div class="text-field">
          <label>Arrow height</label>
          <ha-textfield
            type="number"
            step="1"
            min="4"
            .value=${String(c.arrow_height ?? 15)}
            @input=${e => this._valueChanged('arrow_height', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Arrow width</label>
          <ha-textfield
            type="number"
            step="1"
            min="1"
            .value=${String(c.arrow_width ?? 3)}
            @input=${e => this._valueChanged('arrow_width', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Arrow position</label>
          <ha-textfield
            type="number"
            step="1"
            .value=${String(c.arrow_position ?? 0)}
            @input=${e => this._valueChanged('arrow_position', e)}
          ></ha-textfield>
        </div>
      </div>

      <div class="arrow-styling-grid">
        <div class="text-field">
          <label>Arrow morph</label>
          <ha-textfield
            type="number"
            step="1"
            .value=${String(c.arrow_morph ?? 0)}
            @input=${e => this._valueChanged('arrow_morph', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Arrow curve</label>
          <ha-textfield
            type="number"
            step="1"
            .value=${String(c.arrow_curve ?? 0)}
            @input=${e => this._valueChanged('arrow_curve', e)}
          ></ha-textfield>
        </div>
      </div>

      <div class="arrow-toggles">
        <ha-formfield>
          <label>Show arrow</label>
          <ha-switch
            .checked=${c.arrow_show}
            @change=${e => this._valueChanged('arrow_show', e)}
          ></ha-switch>
        </ha-formfield>
        <ha-formfield>
          <label>Invert arrow</label>
          <ha-switch
            .checked=${c.arrow_invert}
            @change=${e => this._valueChanged('arrow_invert', e)}
          ></ha-switch>
        </ha-formfield>
        <ha-formfield>
          <label>Rotate arrow</label>
          <ha-switch
            .checked=${c.arrow_rotate}
            @change=${e => this._valueChanged('arrow_rotate', e)}
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
        <div class="text-field">
          <label>Field 1 template</label>
          <ha-textfield
            .value=${c.field_1_template ?? ''}
            @input=${e => this._valueChanged('field_1_template', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Font size (em)</label>
          <ha-textfield
            type="number"
            step="0.1"
            .value=${String(c.field_1_fontsize ?? 1.4)}
            @input=${e => this._valueChanged('field_1_fontsize', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('field_1_fontcolor', 'Font Color')}
      </div>

      <div class="field-grid">
        <div class="text-field">
          <label>Field 1 unit</label>
          <ha-textfield
            .value=${c.field_1_unit ?? ''}
            @input=${e => this._valueChanged('field_1_unit', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Unit size (em)</label>
          <ha-textfield
            type="number"
            step="0.1"
            .value=${String(c.field_1_unit_fontsize ?? 0.84)}
            @input=${e => this._valueChanged('field_1_unit_fontsize', e)}
          ></ha-textfield>
        </div>
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
        <div class="text-field">
          <label>Field 2 template</label>
          <ha-textfield
            .value=${c.field_2_template ?? ''}
            @input=${e => this._valueChanged('field_2_template', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Font size (em)</label>
          <ha-textfield
            type="number"
            step="0.1"
            .value=${String(c.field_2_fontsize ?? 1.4)}
            @input=${e => this._valueChanged('field_2_fontsize', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('field_2_fontcolor', 'Font Color')}
      </div>
      
      <div class="field-grid">
        <div class="text-field">
          <label>Field 2 unit</label>
          <ha-textfield
            .value=${c.field_2_unit ?? ''}
            @input=${e => this._valueChanged('field_2_unit', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Unit size (em)</label>
          <ha-textfield
            type="number"
            step="0.1"
            .value=${String(c.field_2_unit_fontsize ?? 0.84)}
            @input=${e => this._valueChanged('field_2_unit_fontsize', e)}
          ></ha-textfield>
        </div>
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
        <div class="text-field">
          <label>Field 3 template</label>
          <ha-textfield
            .value=${c.field_3_template ?? ''}
            @input=${e => this._valueChanged('field_3_template', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Font size (em)</label>
          <ha-textfield
            type="number"
            step="0.1"
            .value=${String(c.field_3_fontsize ?? 1.4)}
            @input=${e => this._valueChanged('field_3_fontsize', e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker('field_3_fontcolor', 'Font Color')}
      </div>
      
      <div class="field-grid">
        <div class="text-field">
          <label>Field 3 unit</label>
          <ha-textfield
            .value=${c.field_3_unit ?? ''}
            @input=${e => this._valueChanged('field_3_unit', e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Unit size (em)</label>
          <ha-textfield
            type="number"
            step="0.1"
            .value=${String(c.field_3_unit_fontsize ?? 0.84)}
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
    
    .entity-fields {
      display: grid;
      grid-template-columns: 3fr 2fr 2fr;
      gap: 8px;
    }

    .compass-styling-grid {
      display: grid;
      grid-template-columns: 3fr 3fr 2fr 2fr;
      gap: 8px;
      margin-top: 24px;
      margin-bottom: 16px;
    }

    .arrow-styling-grid {
      display: grid;
      grid-template-columns: 3fr 2fr 2fr 2fr;
      gap: 8px;
      margin-top: 24px;
      margin-bottom: 16px;
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

    .arrow-toggles {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      margin-top: 20px;
      margin-bottom: 15px;
    }
    .arrow-toggles label {
      font-size: 14px;
      margin-right: 12px;
    }

    .field-toggle {
      display: block;
      margin-top: 40px;
      margin-bottom: 15px;
    }
    .field-toggle label {
      font-size: 14px;
      margin-right: 12px;
    }

    .field-grid {
      display: grid;
      grid-template-columns: 4fr 2fr 3fr;
      gap: 8px;
      margin-top: 16px;
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
      let valueToParse = stateObj.state; // Default to state
      const attr = this.config.compass_attribute;

      // Check if attribute is defined and not just whitespace
      if (attr && typeof attr === 'string' && attr.trim() !== '') {
        const attrValue = stateObj.attributes[attr.trim()];
        
        // Only use the attribute value if it is actually a number
        if (attrValue !== null && !isNaN(parseFloat(attrValue))) {
          valueToParse = attrValue;
        }
      }

      const raw = parseFloat(valueToParse);
      
      if (!isNaN(raw)) {
        const adj = parseFloat(this.config.compass_adjustment) || 0;
        this._degrees = ((raw + adj) % 360 + 360) % 360;
        this._error = false;
      } else {
        this._degrees = 0;
        this._error = true;
      }
    }

    // Update the three display fields
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
    const borderSize = parseFloat(this.config.border_size) || 0;
    this.style.setProperty('--cc-circle-border-width', `${initBorder * scale}px`);
    this.style.setProperty('--cc-circle-color', this.config.circle_color || 'var(--divider-color)');
    this.style.setProperty('--cc-bg-color', this.config.background_color || 'var(--primary-background-color)');
    this.style.setProperty('--cc-border-size', `${borderSize}px`);

    // Set arrow CSS variables
    const initW = parseFloat(this.config.arrow_width)  || 3;
    const initH = parseFloat(this.config.arrow_height) || 17;
    const initPos = parseFloat(this.config.arrow_position) || 0;
    const color = this.config.arrow_color || '#E0E0E0';

    const scaledW   = initW   * scale;
    const scaledH   = initH   * scale;
    const scaledPos = initPos * scale;

    this.style.setProperty('--cc-arrow-width',     `${scaledW}px`);
    this.style.setProperty('--cc-arrow-height',    `${scaledH}px`);
    this.style.setProperty('--cc-arrow-color',     color);
    this.style.setProperty('--cc-arrow-position',  `${scaledPos}px`);
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

  _buildArrowPath(morph, curve, width, height) {
    // Base coordinate system is 100×100 for a square
    // P1-P3 distance = 100, P2-P4 distance = 100
    const points = [
      { x: 50, y: 0 },               // P1: Top center
      { x: 0, y: 50 },               // P2: Middle left
      { x: 50, y: 50 + (morph / 2) }, // P3: Morphs from center
      { x: 100, y: 50 },             // P4: Middle right
    ];

    // Calculate P3's distance from P2-P4 line (for length scaling)
    // P2-P4 line is at y=50
    const p2Y = 50;
    const p3DistanceFromLine = Math.abs(points[2].y - p2Y);  // |50 + morph/2 - 50| = |morph/2|
    const p1DistanceFromLine = Math.abs(points[0].y - p2Y);  // |0 - 50| = 50
    const p3LengthMultiplier = p3DistanceFromLine / p1DistanceFromLine;

    // Calculate angle for P2 OUT and P4 IN based on morph
    // Positive morph: interpolates from 0° (east/west) to 90° (south), clamped at 90°
    // Negative morph: interpolates from 0° (east/west) to -90° (north), clamped at -90°
    const angleRatio = Math.sign(morph) * Math.min(1.0, Math.abs(morph) / 100);
    const angleRadians = angleRatio * (Math.PI / 2); // -90° to +90°

    // P2 OUT: rotates from east toward south (positive) or north (negative)
    const p2_out = {
      x: Math.cos(angleRadians),  // 1 → 0
      y: Math.sin(angleRadians)   // 0 → ±1
    };

    // P4 IN: mirror of P2
    const p4_in = {
      x: -Math.cos(angleRadians), // -1 → 0
      y: Math.sin(angleRadians)   // 0 → ±1
    };

    const controlDirections = [
      // P1 (top center): fixed horizontal helpers
      { 
        in: { x: 1, y: 0 }, 
        out: { x: -1, y: 0 }, 
        lengthMultiplier: 1.0 
      },
      
      // P2 (bottom-left): IN=fixed north, OUT=interpolated angle
      { 
        in: { x: 0, y: -1 }, 
        out: p2_out, 
        lengthMultiplier: 1.0 
      },
      
      // P3 (bottom-center): fixed horizontal, variable length
      { 
        in: { x: -1, y: 0 }, 
        out: { x: 1, y: 0 }, 
        lengthMultiplier: p3LengthMultiplier 
      },
      
      // P4 (bottom-right): IN=interpolated angle, OUT=fixed north
      { 
        in: p4_in, 
        out: { x: 0, y: -1 }, 
        lengthMultiplier: 1.0 
      }
    ];

    // Calculate actual control points
    const controls = points.map((p, i) => {
      const curveLength = curve * controlDirections[i].lengthMultiplier;
      return {
        in:  { 
          x: p.x + controlDirections[i].in.x * curveLength, 
          y: p.y + controlDirections[i].in.y * curveLength 
        },
        out: { 
          x: p.x + controlDirections[i].out.x * curveLength, 
          y: p.y + controlDirections[i].out.y * curveLength 
        }
      };
    });

    // Build path using CUBIC Bezier curves
    let path = `M ${points[0].x},${points[0].y}`;
    
    for (let i = 0; i < points.length; i++) {
      const nextIndex = (i + 1) % points.length;
      const cp1 = controls[i].out;
      const cp2 = controls[nextIndex].in;
      const nextPoint = points[nextIndex];
      
      path += ` C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${nextPoint.x},${nextPoint.y}`;
    }
    
    path += ' Z';
    
    // Calculate bounds
    const allPoints = [...points];
    controls.forEach(c => {
      allPoints.push(c.in, c.out);
    });
    
    const xs = allPoints.map(p => p.x);
    const ys = allPoints.map(p => p.y);
    const bounds = {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys)
    };
    
    return {
      path: path.trim().replace(/\s+/g, ' '),
      bounds: bounds
    };
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
    
    // Calculate wrapper rotation (arrow_rotate toggle)
    const baseRotation = this._degrees;
    const wrapperRotation = c.arrow_rotate ? baseRotation + 180 : baseRotation;
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

    // Generate SVG arrow path
    const arrowMorph = parseFloat(c.arrow_morph) || 0;
    const arrowCurve = parseFloat(c.arrow_curve) || 0;
    const arrowWidth = parseFloat(c.arrow_width) || 3;
    const arrowHeight = parseFloat(c.arrow_height) || 16;
    const pathData = this._buildArrowPath(arrowMorph, arrowCurve, arrowWidth, arrowHeight);
    const arrowPath = pathData.path;
    
    // ViewBox EXACTLY matches shape bounds - no padding needed (bounds include control points)
    const bounds = pathData.bounds;
    
    const viewBoxX = bounds.minX;
    const viewBoxY = bounds.minY;
    const viewBoxWidth = bounds.maxX - bounds.minX;
    const viewBoxHeight = bounds.maxY - bounds.minY;
    
    const arrowViewBox = `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`;

    return html`
      <ha-card>
        <div class="compass-container">
          <div class="compass-circle">
            ${renderField(1, this._field1Value)}
            ${renderField(2, this._field2Value)}
            ${renderField(3, this._field3Value)}
          </div>
          <div class="compass-arrow-wrapper" style="transform:${wrapperTransform}">
            ${c.arrow_show ? html`
              <svg class="compass-arrow ${c.arrow_invert ? 'inward' : 'outward'}" 
                   viewBox="${arrowViewBox}"
                   preserveAspectRatio="none">
                <path d="${arrowPath}" fill="var(--cc-arrow-color)" />
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
      top: calc(8% - var(--cc-border-size, 0px));
      left: calc(8% - var(--cc-border-size, 0px));
      right: calc(8% - var(--cc-border-size, 0px));
      bottom: calc(8% - var(--cc-border-size, 0px));
      border-radius: 50%;
      background-color: var(--cc-bg-color, #111111);
      border: var(--cc-circle-border-width, 15px) solid var(--cc-circle-color, #333333);
      box-sizing: border-box;
      font-size: var(--cc-font-size, 1em);
    }
    .compass-arrow-wrapper {
      position: absolute;
      top: calc(8% - var(--cc-border-size, 0px));
      left: calc(8% - var(--cc-border-size, 0px));
      right: calc(8% - var(--cc-border-size, 0px));
      bottom: calc(8% - var(--cc-border-size, 0px));
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2;
    }
    .compass-arrow {
      position: absolute;
      width: var(--cc-arrow-width, 6px);
      height: var(--cc-arrow-height, 32px);
      top: calc(0px - var(--cc-arrow-position, 0px));
    }
    .compass-arrow.inward {
      transform: scaleY(-1);
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
