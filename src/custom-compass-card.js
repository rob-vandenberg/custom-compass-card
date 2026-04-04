import { LitElement, html, svg, css } from 'https://unpkg.com/lit@2.0.0/index.js?module';
import { live } from 'https://unpkg.com/lit@2.0.0/directives/live.js?module';

// ─── Card Version ─────────────────────────────────────────────────────────────
const CARD_VERSION = '3.8.225';
// ─── Card Version History ─────────────────────────────────────────────────────
// v3.8.225: Refactor _colorPicker to accept value+callback — all color fields now use single method, no duplication
// v3.8.224: Suppress console warnings when typing hex colors — only pass valid 6-digit hex to color input
// v3.8.223: Scale bezel_size using host element offsetWidth — truly unaffected by internal layout
// v3.8.222: Scale bezel_size using compass-container width — no feedback loop, correct proportional scaling
// v3.8.221: Revert _scaleElements to 3.8.214 state — remove bezel_size scaling which caused feedback loop
// v3.8.220: Fix _scaleElements early return — only require compass-circle, handle compass-container separately
// v3.8.219: Revert compass-circle DOM check — it fires on every recreation not just first render
// v3.8.218: Skip needle render on first render (compass-circle not yet in DOM) — eliminates oversized needle flash
// v3.8.217: Fix scale calculation — use compass-circle for _scale, compass-container for border-size only
// v3.8.216: Fix infinite resize loop — use compass-container for scale calculation, not compass-circle
// v3.8.215: Fix bezel_size scaling — now multiplied by _scale factor like bezel_width
// v3.8.214: Fix needle reset to 0 on config changes — willUpdate() seeds _needleDegrees from module-level cache before render
// v3.8.213: Rename marker length property to height — matches editor label change
// v3.8.212: Add name property to needles — shown as panel header, editable field at top of needle panel
// v3.8.211: Reorder editor CSS to match HTML order; fix cc-textfield input vertical alignment
// v3.8.210: Revert cc-textfield to native input; add live() to fix minus/decimal display; add min-width:0 to color-field
// v3.8.209: Add min-width:0 to .text-field grid item
// v3.8.208: Fix cc-textfield wa-input layout — hide label/hint parts, constrain width with min-width:0; fix handler null check
// v3.8.207: Replace native <input> in cc-textfield with wa-input, mirroring ha-input
// v3.8.206: Fix numeric input — replicate ha-form-float logic for minus and decimal handling
// v3.8.205: Remove mutual exclusivity between cardinal labels and primary ticks — both can be enabled simultaneously
// v3.8.204: Cardinal labels and primary ticks can now both render at same position
// v3.8.203: Fix cardinals-styling-grid — missing Font size text-field wrapper was dropped in previous edit
// v3.8.202: Separate cardinals-styling-grid CSS from tick-styling-grid; update tick-styling-grid to 5fr 5fr 5fr 5fr 9fr
// v3.8.201: Fix cardinal labels — render independently of major_ticks_show
// v3.8.151: Reverse needle render order so needle 1 renders on top
// v3.8.150: Increase toggle-field gap to 8px for better label-to-switch spacing
// v3.8.149: Remove min-width from toggle-field label — fixes toggle spacing in needle panel
// v3.8.148: Move Rotate compass toggle from Needle panel to Compass configuration panel
// v3.8.147: Multiple needles — needles[] array replaces single needle_* flat keys; full per-needle config; compass_rotate wraps all needles
// v3.8.146: Restyle add/remove marker buttons to match mwc-button appearance
// v3.7.145: Replace marker_1/2 flat keys with markers[] array; add flip option; unlimited markers; dynamic editor
// v3.7.144: Version bump to force HACS cache refresh — clears corrupt hacs.json cached from v3.7.143 initial release
// v3.7.143: Replace ha-textfield with own cc-textfield component — future-proof against HA 2026.5 removal; fixes width issue in 2026.4
// v3.7.142: Fix TypeError in field callback — convert HA result to String before calling replace()
// v3.7.141: Remove unnecessary _fieldRawValues; simplify ${compass_direction} handling
// v3.7.140: Fix ${compass_direction} in mixed templates: send template to HA untouched, replace token in callback and on bearing change
// v3.7.139: Rename compass_template to needle_template; move to needle block in DEFAULT_CONFIG
// v3.7.138: DRY fixes: _fieldDefs getter replaces duplicate arrays; markers handled in a loop
// v3.7.137: Move {{ check into sub() helper — single place, applies to all templates automatically
// v3.7.136: Apply {{ check before every sub() call — never call HA with a plain string; applies to all 10 templates
// v3.7.135: Correct ${compass_direction}: replace first then decide subscription based on whether Jinja2 remains
// v3.7.134: Fix ${compass_direction} handling: resolved client-side via getCompassDirection(), no HA subscription
// v3.7.133: Replace REST template polling with WebSocket subscribeMessage; HA tracks entity dependencies and pushes updates automatically
// v3.7.132: Move bearing template field from Compass panel to Needle panel; rename CSS class to needle-template-grid
// v3.7.131: Replace compass entity/attribute/adjustment with needle_template (Jinja2); remove willUpdate entity watch

// ─── Needle Degrees Cache ─────────────────────────────────────────────────────
// Survives element recreation by HA's editor. Keyed by needle templates.
// Allows willUpdate() to seed _needleDegrees synchronously before first render.
const _needleDegreesCache = new Map();

// ─── Default Marker ───────────────────────────────────────────────────────────
const DEFAULT_MARKER = {
  show:     true,
  degrees:  '0',
  height:   5,
  width:    4,
  position: 0,
  color:    '#FF0000',
  flip:     false,
};

// ─── Default Needle ───────────────────────────────────────────────────────────
const DEFAULT_NEEDLE = {
  name:         '',
  show:         true,
  template:     "{{ state_attr('sun.sun', 'azimuth') | float(0) }}",
  invert:       false,
  rotate:       false,
  color_1:      '#FF0000',
  color_1_pos:  50,
  color_2:      '#EEEEEE',
  color_2_pos:  50,
  height:       100,
  width:        10,
  position:     -10,
  morph:        50,
  curve:        0,
  image_show:   false,
  image_url:    '/local/community/custom-compass-card/moon.png',
  image_scale:  100,
  image_x:      0,
  image_y:      0,
  image_rotate: 0,
};

// ─── Default Configuration ────────────────────────────────────────────────────
const DEFAULT_CONFIG = {
  background_color:         '#101010',
  bezel_color:              '#383838',
  bezel_width:              16,
  bezel_size:               0,
  background_image_show:    true,
  background_image_url:     '/local/community/custom-compass-card/black.png',
  background_image_scale:   100,
  background_image_x:       0,
  background_image_y:       0,
  background_image_rotate:  0,
  needles:                  [{ ...DEFAULT_NEEDLE }],
  compass_rotate:           false,
  markers:                  [],
  cardinals_show:           true,
  cardinal_north:           'N',
  cardinal_east:            'E',
  cardinal_south:           'S',
  cardinal_west:            'W',
  cardinals_fontsize:       10,
  cardinals_fontweight:     400,
  cardinals_position:       1.5,
  cardinals_fontcolor:      '#EEEEEE',
  major_ticks_show:         false,
  major_ticks_divisions:    4,
  major_ticks_length:       6,
  major_ticks_width:        2,
  major_ticks_position:     -3.5,
  major_ticks_color:        '#CCCCCC',
  minor_ticks_show:         true,
  minor_ticks_divisions:    8,
  minor_ticks_length:       3,
  minor_ticks_width:        1.5,
  minor_ticks_position:     -4.5,
  minor_ticks_color:        '#AAAAAA',
  micro_ticks_show:         true,
  micro_ticks_divisions:    16,
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
  rotation_animation_time:  0.5,
};

// ─── cc-textfield ─────────────────────────────────────────────────────────────
// Own text field component — replaces ha-textfield removed in HA 2026.5.
// Exposes .value and .type so _valueChanged() works identically to before.
// Uses live() to preserve intermediate input states (e.g. '-', '1.') without
// Lit overwriting the displayed value on re-render.
class CcTextfield extends LitElement {
  static properties = {
    value:       { type: String },
    type:        { type: String },
    step:        { type: String },
    min:         { type: String },
    max:         { type: String },
    placeholder: { type: String },
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    input {
      display: block;
      width: 100%;
      box-sizing: border-box;
      height: 56px;
      padding: 0 12px;
      background: var(--input-fill-color, rgba(0,0,0,0.06));
      border: none;
      border-bottom: 1px solid var(--secondary-text-color, #888);
      border-radius: 4px 4px 0 0;
      color: var(--primary-text-color);
      font-size: 16px;
      font-family: inherit;
      outline: none;
      transition: border-bottom-color 0.2s;
    }
    input:focus {
      border-bottom: 2px solid var(--primary-color);
    }
  `;

  render() {
    return html`
      <input
        .value=${live(this.value ?? '')}
        type=${this.type || 'text'}
        step=${this.step || ''}
        min=${this.min || ''}
        max=${this.max || ''}
        @input=${this._onInput}
      />
    `;
  }

  _onInput(e) {
    this.value = e.target.value;
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  }
}
customElements.define('cc-textfield', CcTextfield);

// ─── Visual Editor ────────────────────────────────────────────────────────────
class CustomCompassCardEditor extends LitElement {
  static properties = {
    hass:    { type: Object },
    _config: { type: Object },
  };

  setConfig(config) {
    this._config = { ...DEFAULT_CONFIG, ...config };
  }

  // Mirrors ha-form-float._handleInput logic exactly.
  // Returns the parsed number, undefined if the value is incomplete/invalid,
  // or null to signal "return early, do not fire config-changed".
  _parseNumber(raw) {
    const v = String(raw).replace(',', '.');
    if (v === '-' || v === '-0' || v.endsWith('.')) return null;
    if (v.includes('.') && v.endsWith('0')) return null;
    if (v === '') return undefined;
    const n = parseFloat(v);
    return isNaN(n) ? null : n;
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
      const parsed = this._parseNumber(value);
      if (parsed == null) return;
      value = parsed;
    }
    this._config = { ...this._config, [key]: value };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    }));
  }

  _colorPicker(label, value, onChange) {
    const colorValue = /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#ffffff';
    return html`
      <div class="color-field">
        <label>${label}</label>
        <div class="color-row">
          <input
            type="color"
            .value=${colorValue}
            @input=${onChange}
          />
          <cc-textfield
            .value=${value}
            placeholder="#RRGGBB or #RRGGBBAA"
            @input=${onChange}
          ></cc-textfield>
        </div>
      </div>
    `;
  }

  _addNeedle() {
    const needles = [...(this._config.needles || []), { ...DEFAULT_NEEDLE }];
    this._config = { ...this._config, needles };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  _removeNeedle(i) {
    const needles = this._config.needles.filter((_, idx) => idx !== i);
    this._config = { ...this._config, needles };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  _needleChanged(i, key, ev) {
    let value;
    if (ev.target.tagName === 'HA-SWITCH') {
      value = ev.target.checked;
    } else {
      value = ev.target.value;
      if (ev.target.type === 'number') {
        const parsed = this._parseNumber(value);
        if (parsed == null) return;
        value = parsed;
      }
    }
    const needles = this._config.needles.map((n, idx) =>
      idx === i ? { ...n, [key]: value } : n
    );
    this._config = { ...this._config, needles };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  _addMarker() {
    const markers = [...(this._config.markers || []), { ...DEFAULT_MARKER }];
    this._config = { ...this._config, markers };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  _removeMarker(i) {
    const markers = this._config.markers.filter((_, idx) => idx !== i);
    this._config = { ...this._config, markers };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  _markerChanged(i, key, ev) {
    let value;
    if (ev.target.tagName === 'HA-SWITCH') {
      value = ev.target.checked;
    } else {
      value = ev.target.value;
      if (ev.target.type === 'number') {
        const parsed = this._parseNumber(value);
        if (parsed == null) return;
        value = parsed;
      }
    }
    const markers = this._config.markers.map((m, idx) =>
      idx === i ? { ...m, [key]: value } : m
    );
    this._config = { ...this._config, markers };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  render() {
    if (!this.hass || !this._config) return html``;
    const c = this._config;

    return html`

      <ha-expansion-panel header="Compass configuration" outlined>

      <!-- Compass styling -->
      <div class="compass-styling-grid">
        ${this._colorPicker('Background', this._config['background_color'] || '#ffffff', e => this._valueChanged('background_color', e))}
        ${this._colorPicker('Bezel color', this._config['bezel_color'] || '#ffffff', e => this._valueChanged('bezel_color', e))}
        <div class="text-field">
          <label>Bezel width</label>
          <cc-textfield
            type="number" step="1" min="0"
            .value=${String(c.bezel_width)}
            @input=${e => this._valueChanged('bezel_width', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Bezel size</label>
          <cc-textfield
            type="number" step="1"
            .value=${String(c.bezel_size)}
            @input=${e => this._valueChanged('bezel_size', e)}
          ></cc-textfield>
        </div>
      </div>

      <!-- Background image -->
      <div class="background-toggles-grid">
        <div class="toggle-field">
          <label>Background image</label>
          <ha-switch
            .checked=${c.background_image_show}
            @change=${e => this._valueChanged('background_image_show', e)}
          ></ha-switch>
        </div>
      </div>
      <div class="background-image-template-grid">
        <div class="text-field">
          <label>URL (jinja template allowed)</label>
          <cc-textfield
            .value=${String(c.background_image_url)}
            @input=${e => this._valueChanged('background_image_url', e)}
          ></cc-textfield>
        </div>
      </div>
      <div class="background-image-styling-grid">
        <div class="text-field">
          <label>X pos</label>
          <cc-textfield
            type="number" step="0.5"
            .value=${String(c.background_image_x)}
            @input=${e => this._valueChanged('background_image_x', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Y pos</label>
          <cc-textfield
            type="number" step="0.5"
            .value=${String(c.background_image_y)}
            @input=${e => this._valueChanged('background_image_y', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Scale (%)</label>
          <cc-textfield
            type="number" step="1" min="1"
            .value=${String(c.background_image_scale)}
            @input=${e => this._valueChanged('background_image_scale', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Rotate</label>
          <cc-textfield
            type="number" step="1"
            .value=${String(c.background_image_rotate)}
            @input=${e => this._valueChanged('background_image_rotate', e)}
          ></cc-textfield>
        </div>
      </div>

      <!-- Rotate compass -->
      <div class="rotate-compass-toggle-grid">
        <div class="toggle-field">
          <label>Rotate compass</label>
          <ha-switch
            .checked=${c.compass_rotate}
            @change=${e => this._valueChanged('compass_rotate', e)}
          ></ha-switch>
          <span class="toggle-hint">(rotates compass so needle 1 always points north)</span>
        </div>
      </div>

      </ha-expansion-panel>

      <ha-expansion-panel header="Needle configuration" outlined>

      ${(c.needles || []).map((n, i) => html`
        <ha-expansion-panel header="${n.name || 'Needle ' + (i + 1)}" outlined>

          <!-- Name -->
          <div class="needle-name-grid">
            <div class="text-field">
              <label>Name (optional)</label>
              <cc-textfield
                .value=${String(n.name || '')}
                @input=${e => this._needleChanged(i, 'name', e)}
              ></cc-textfield>
            </div>
          </div>

          <!-- Toggles -->
          <div class="needle-toggles-grid">
            <div class="toggle-field">
              <label>Show</label>
              <ha-switch
                .checked=${n.show}
                @change=${e => this._needleChanged(i, 'show', e)}
              ></ha-switch>
            </div>
            <div class="toggle-field">
              <label>Invert</label>
              <ha-switch
                .checked=${n.invert}
                @change=${e => this._needleChanged(i, 'invert', e)}
              ></ha-switch>
            </div>
            <div class="toggle-field">
              <label>Rotate 180°</label>
              <ha-switch
                .checked=${n.rotate}
                @change=${e => this._needleChanged(i, 'rotate', e)}
              ></ha-switch>
            </div>
          </div>

          <!-- Bearing template -->
          <div class="needle-template-grid">
            <div class="text-field">
              <label>Bearing (jinja template)</label>
              <cc-textfield
                .value=${String(n.template)}
                @input=${e => this._needleChanged(i, 'template', e)}
              ></cc-textfield>
            </div>
          </div>

          <!-- Colors -->
          <div class="needle-color-grid">
            ${this._colorPicker('Color 1', n.color_1 || '#FF0000', e => this._needleChanged(i, 'color_1', e))}
            <div class="text-field">
              <label>Pos (%)</label>
              <cc-textfield
                type="number" step="1" min="0" max="100"
                .value=${String(n.color_1_pos)}
                @input=${e => this._needleChanged(i, 'color_1_pos', e)}
              ></cc-textfield>
            </div>
            ${this._colorPicker('Color 2', n.color_2 || '#EEEEEE', e => this._needleChanged(i, 'color_2', e))}
            <div class="text-field">
              <label>Pos (%)</label>
              <cc-textfield
                type="number" step="1" min="0" max="100"
                .value=${String(n.color_2_pos)}
                @input=${e => this._needleChanged(i, 'color_2_pos', e)}
              ></cc-textfield>
            </div>
          </div>

          <!-- Dimensions -->
          <div class="needle-dimensions-grid">
            <div class="text-field">
              <label>Position</label>
              <cc-textfield
                type="number" step="1"
                .value=${String(n.position)}
                @input=${e => this._needleChanged(i, 'position', e)}
              ></cc-textfield>
            </div>
            <div class="text-field">
              <label>Height</label>
              <cc-textfield
                type="number" step="1" min="4"
                .value=${String(n.height)}
                @input=${e => this._needleChanged(i, 'height', e)}
              ></cc-textfield>
            </div>
            <div class="text-field">
              <label>Width</label>
              <cc-textfield
                type="number" step="1" min="1"
                .value=${String(n.width)}
                @input=${e => this._needleChanged(i, 'width', e)}
              ></cc-textfield>
            </div>
            <div class="text-field">
              <label>Morph</label>
              <cc-textfield
                type="number" step="1"
                .value=${String(n.morph)}
                @input=${e => this._needleChanged(i, 'morph', e)}
              ></cc-textfield>
            </div>
            <div class="text-field">
              <label>Curve</label>
              <cc-textfield
                type="number" step="1"
                .value=${String(n.curve)}
                @input=${e => this._needleChanged(i, 'curve', e)}
              ></cc-textfield>
            </div>
          </div>

          <!-- Needle image -->
          <div class="needle-image-toggles-grid">
            <div class="toggle-field">
              <label>Needle image</label>
              <ha-switch
                .checked=${n.image_show}
                @change=${e => this._needleChanged(i, 'image_show', e)}
              ></ha-switch>
            </div>
          </div>
          <div class="needle-image-template-grid">
            <div class="text-field">
              <label>URL (jinja template allowed)</label>
              <cc-textfield
                .value=${String(n.image_url)}
                @input=${e => this._needleChanged(i, 'image_url', e)}
              ></cc-textfield>
            </div>
          </div>
          <div class="needle-image-styling-grid">
            <div class="text-field">
              <label>X pos</label>
              <cc-textfield
                type="number" step="0.5"
                .value=${String(n.image_x)}
                @input=${e => this._needleChanged(i, 'image_x', e)}
              ></cc-textfield>
            </div>
            <div class="text-field">
              <label>Y pos</label>
              <cc-textfield
                type="number" step="0.5"
                .value=${String(n.image_y)}
                @input=${e => this._needleChanged(i, 'image_y', e)}
              ></cc-textfield>
            </div>
            <div class="text-field">
              <label>Scale (%)</label>
              <cc-textfield
                type="number" step="1" min="1"
                .value=${String(n.image_scale)}
                @input=${e => this._needleChanged(i, 'image_scale', e)}
              ></cc-textfield>
            </div>
            <div class="text-field">
              <label>Rotate</label>
              <cc-textfield
                type="number" step="1"
                .value=${String(n.image_rotate)}
                @input=${e => this._needleChanged(i, 'image_rotate', e)}
              ></cc-textfield>
            </div>
          </div>

          <!-- Remove button -->
          <div class="marker-remove-grid">
            <button class="marker-remove-btn" @click=${() => this._removeNeedle(i)}>Remove needle</button>
          </div>

        </ha-expansion-panel>
      `)}

      <div class="marker-add-grid">
        <button class="marker-add-btn" @click=${this._addNeedle}>+ Add needle</button>
      </div>

      </ha-expansion-panel>

      <ha-expansion-panel header="Markers configuration" outlined>

      ${(c.markers || []).map((m, i) => html`
        <ha-expansion-panel header="Marker ${i + 1}" outlined>
          <div class="marker-toggles-grid">
            <div class="toggle-field">
              <label>Show</label>
              <ha-switch
                .checked=${m.show}
                @change=${e => this._markerChanged(i, 'show', e)}
              ></ha-switch>
            </div>
            <div class="toggle-field">
              <label>Flip</label>
              <ha-switch
                .checked=${m.flip}
                @change=${e => this._markerChanged(i, 'flip', e)}
              ></ha-switch>
            </div>
          </div>
          <div class="marker-template-grid">
            <div class="text-field">
              <label>Degrees (jinja template allowed)</label>
              <cc-textfield
                .value=${String(m.degrees)}
                @input=${e => this._markerChanged(i, 'degrees', e)}
              ></cc-textfield>
            </div>
          </div>
          <div class="marker-styling-grid">
            <div class="text-field">
              <label>Position</label>
              <cc-textfield
                type="number" step="0.5"
                .value=${String(m.position)}
                @input=${e => this._markerChanged(i, 'position', e)}
              ></cc-textfield>
            </div>
            <div class="text-field">
              <label>Height</label>
              <cc-textfield
                type="number" step="0.1" min="0"
                .value=${String(m.height)}
                @input=${e => this._markerChanged(i, 'height', e)}
              ></cc-textfield>
            </div>
            <div class="text-field">
              <label>Width</label>
              <cc-textfield
                type="number" step="0.1" min="0"
                .value=${String(m.width)}
                @input=${e => this._markerChanged(i, 'width', e)}
              ></cc-textfield>
            </div>
            ${this._colorPicker('Color', m.color || '#FF0000', e => this._markerChanged(i, 'color', e))}
          </div>
          <div class="marker-remove-grid">
            <button class="marker-remove-btn" @click=${() => this._removeMarker(i)}>Remove marker</button>
          </div>
        </ha-expansion-panel>
      `)}

      <div class="marker-add-grid">
        <button class="marker-add-btn" @click=${this._addMarker}>+ Add marker</button>
      </div>

      </ha-expansion-panel>

      <ha-expansion-panel header="Ticks configuration" outlined>

      <!-- Cardinal labels -->
      <div class="tick-toggles-grid">
        <div class="toggle-field">
          <label>Cardinal labels</label>
          <ha-switch
            .checked=${c.cardinals_show}
            @change=${e => this._valueChanged('cardinals_show', e)}
          ></ha-switch>
        </div>
      </div>
      
      <div class="cardinal-labels-grid">
        <div class="text-field">
          <label>North</label>
          <cc-textfield
            .value=${c.cardinal_north}
            @input=${e => this._valueChanged('cardinal_north', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>East</label>
          <cc-textfield
            .value=${c.cardinal_east}
            @input=${e => this._valueChanged('cardinal_east', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>South</label>
          <cc-textfield
            .value=${c.cardinal_south}
            @input=${e => this._valueChanged('cardinal_south', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>West</label>
          <cc-textfield
            .value=${c.cardinal_west}
            @input=${e => this._valueChanged('cardinal_west', e)}
          ></cc-textfield>
        </div>
      </div>
      
      <div class="cardinals-styling-grid">
        <div class="text-field">
          <label>Position</label>
          <cc-textfield
            type="number" step="0.5"
            .value=${String(c.cardinals_position)}
            @input=${e => this._valueChanged('cardinals_position', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font size</label>
          <cc-textfield
            type="number" step="0.5" min="0"
            .value=${String(c.cardinals_fontsize)}
            @input=${e => this._valueChanged('cardinals_fontsize', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <cc-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(c.cardinals_fontweight)}
            @input=${e => this._valueChanged('cardinals_fontweight', e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker('Color', this._config['cardinals_fontcolor'] || '#ffffff', e => this._valueChanged('cardinals_fontcolor', e))}
      </div>

      <!-- Primary ticks -->
      <div class="tick-toggles-grid">
        <div class="toggle-field">
          <label>Primary ticks</label>
          <ha-switch
            .checked=${c.major_ticks_show}
            @change=${e => this._valueChanged('major_ticks_show', e)}
          ></ha-switch>
        </div>
      </div>
      <div class="tick-styling-grid">
        <div class="text-field">
          <label>Position</label>
          <cc-textfield
            type="number" step="0.5"
            .value=${String(c.major_ticks_position)}
            @input=${e => this._valueChanged('major_ticks_position', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Length</label>
          <cc-textfield
            type="number" step="0.1" min="0"
            .value=${String(c.major_ticks_length)}
            @input=${e => this._valueChanged('major_ticks_length', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <cc-textfield
            type="number" step="0.1" min="0"
            .value=${String(c.major_ticks_width)}
            @input=${e => this._valueChanged('major_ticks_width', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Divisions</label>
          <cc-textfield
            type="number" step="1" min="1"
            .value=${String(c.major_ticks_divisions)}
            @input=${e => this._valueChanged('major_ticks_divisions', e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker('Color', this._config['major_ticks_color'] || '#ffffff', e => this._valueChanged('major_ticks_color', e))}
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
          <label>Position</label>
          <cc-textfield
            type="number" step="0.5"
            .value=${String(c.minor_ticks_position)}
            @input=${e => this._valueChanged('minor_ticks_position', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Length</label>
          <cc-textfield
            type="number" step="0.1" min="0"
            .value=${String(c.minor_ticks_length)}
            @input=${e => this._valueChanged('minor_ticks_length', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <cc-textfield
            type="number" step="0.1" min="0"
            .value=${String(c.minor_ticks_width)}
            @input=${e => this._valueChanged('minor_ticks_width', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Divisions</label>
          <cc-textfield
            type="number" step="1" min="1"
            .value=${String(c.minor_ticks_divisions)}
            @input=${e => this._valueChanged('minor_ticks_divisions', e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker('Color', this._config['minor_ticks_color'] || '#ffffff', e => this._valueChanged('minor_ticks_color', e))}
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
          <label>Position</label>
          <cc-textfield
            type="number" step="0.5"
            .value=${String(c.micro_ticks_position)}
            @input=${e => this._valueChanged('micro_ticks_position', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Length</label>
          <cc-textfield
            type="number" step="0.1" min="0"
            .value=${String(c.micro_ticks_length)}
            @input=${e => this._valueChanged('micro_ticks_length', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <cc-textfield
            type="number" step="0.1" min="0"
            .value=${String(c.micro_ticks_width)}
            @input=${e => this._valueChanged('micro_ticks_width', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Divisions</label>
          <cc-textfield
            type="number" step="1" min="1"
            .value=${String(c.micro_ticks_divisions)}
            @input=${e => this._valueChanged('micro_ticks_divisions', e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker('Color', this._config['micro_ticks_color'] || '#ffffff', e => this._valueChanged('micro_ticks_color', e))}
      </div>

      </ha-expansion-panel>

      <ha-expansion-panel header="Header &amp; Footer configuration" outlined>

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
          <label>Header (jinja template allowed)</label>
          <cc-textfield
            .value=${c.header_text}
            @input=${e => this._valueChanged('header_text', e)}
          ></cc-textfield>
        </div>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Position</label>
          <cc-textfield
            type="number" step="1"
            .value=${String(c.header_position)}
            @input=${e => this._valueChanged('header_position', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font size</label>
          <cc-textfield
            type="number" step="0.1"
            .value=${String(c.header_fontsize)}
            @input=${e => this._valueChanged('header_fontsize', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <cc-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(c.header_fontweight)}
            @input=${e => this._valueChanged('header_fontweight', e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker('Color', this._config['header_fontcolor'] || '#ffffff', e => this._valueChanged('header_fontcolor', e))}
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
          <label>Footer (jinja template allowed)</label>
          <cc-textfield
            .value=${c.footer_text}
            @input=${e => this._valueChanged('footer_text', e)}
          ></cc-textfield>
        </div>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Position</label>
          <cc-textfield
            type="number" step="1"
            .value=${String(c.footer_position)}
            @input=${e => this._valueChanged('footer_position', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font size</label>
          <cc-textfield
            type="number" step="0.1"
            .value=${String(c.footer_fontsize)}
            @input=${e => this._valueChanged('footer_fontsize', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <cc-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(c.footer_fontweight)}
            @input=${e => this._valueChanged('footer_fontweight', e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker('Color', this._config['footer_fontcolor'] || '#ffffff', e => this._valueChanged('footer_fontcolor', e))}
      </div>

      </ha-expansion-panel>

      <ha-expansion-panel header="Custom fields configuration" outlined>

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
          <label>Text (jinja template allowed)</label>
          <cc-textfield
            .value=${c.field_1_template}
            @input=${e => this._valueChanged('field_1_template', e)}
          ></cc-textfield>
        </div>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Position (%)</label>
          <cc-textfield
            type="number" step="1"
            .value=${String(c.field_1_position)}
            @input=${e => this._valueChanged('field_1_position', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font size</label>
          <cc-textfield
            type="number" step="0.1"
            .value=${String(c.field_1_fontsize)}
            @input=${e => this._valueChanged('field_1_fontsize', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <cc-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(c.field_1_fontweight)}
            @input=${e => this._valueChanged('field_1_fontweight', e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker('Color', this._config['field_1_fontcolor'] || '#ffffff', e => this._valueChanged('field_1_fontcolor', e))}
      </div>
      <div class="field-unit-grid">
        <div class="text-field">
          <label>Unit</label>
          <cc-textfield
            .value=${c.field_1_unit}
            @input=${e => this._valueChanged('field_1_unit', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font size</label>
          <cc-textfield
            type="number" step="0.1"
            .value=${String(c.field_1_unit_fontsize)}
            @input=${e => this._valueChanged('field_1_unit_fontsize', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <cc-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(c.field_1_unit_fontweight)}
            @input=${e => this._valueChanged('field_1_unit_fontweight', e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker('Color', this._config['field_1_unit_fontcolor'] || '#ffffff', e => this._valueChanged('field_1_unit_fontcolor', e))}
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
          <label>Text (jinja template allowed)</label>
          <cc-textfield
            .value=${c.field_2_template}
            @input=${e => this._valueChanged('field_2_template', e)}
          ></cc-textfield>
        </div>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Position (%)</label>
          <cc-textfield
            type="number" step="1"
            .value=${String(c.field_2_position)}
            @input=${e => this._valueChanged('field_2_position', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font size</label>
          <cc-textfield
            type="number" step="0.1"
            .value=${String(c.field_2_fontsize)}
            @input=${e => this._valueChanged('field_2_fontsize', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <cc-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(c.field_2_fontweight)}
            @input=${e => this._valueChanged('field_2_fontweight', e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker('Color', this._config['field_2_fontcolor'] || '#ffffff', e => this._valueChanged('field_2_fontcolor', e))}
      </div>
      <div class="field-unit-grid">
        <div class="text-field">
          <label>Unit</label>
          <cc-textfield
            .value=${c.field_2_unit}
            @input=${e => this._valueChanged('field_2_unit', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font size</label>
          <cc-textfield
            type="number" step="0.1"
            .value=${String(c.field_2_unit_fontsize)}
            @input=${e => this._valueChanged('field_2_unit_fontsize', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <cc-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(c.field_2_unit_fontweight)}
            @input=${e => this._valueChanged('field_2_unit_fontweight', e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker('Color', this._config['field_2_unit_fontcolor'] || '#ffffff', e => this._valueChanged('field_2_unit_fontcolor', e))}
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
          <label>Text (jinja template allowed)</label>
          <cc-textfield
            .value=${c.field_3_template}
            @input=${e => this._valueChanged('field_3_template', e)}
          ></cc-textfield>
        </div>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Position (%)</label>
          <cc-textfield
            type="number" step="1"
            .value=${String(c.field_3_position)}
            @input=${e => this._valueChanged('field_3_position', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font size</label>
          <cc-textfield
            type="number" step="0.1"
            .value=${String(c.field_3_fontsize)}
            @input=${e => this._valueChanged('field_3_fontsize', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <cc-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(c.field_3_fontweight)}
            @input=${e => this._valueChanged('field_3_fontweight', e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker('Color', this._config['field_3_fontcolor'] || '#ffffff', e => this._valueChanged('field_3_fontcolor', e))}
      </div>
      <div class="field-unit-grid">
        <div class="text-field">
          <label>Unit</label>
          <cc-textfield
            .value=${c.field_3_unit}
            @input=${e => this._valueChanged('field_3_unit', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font size</label>
          <cc-textfield
            type="number" step="0.1"
            .value=${String(c.field_3_unit_fontsize)}
            @input=${e => this._valueChanged('field_3_unit_fontsize', e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <cc-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(c.field_3_unit_fontweight)}
            @input=${e => this._valueChanged('field_3_unit_fontweight', e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker('Color', this._config['field_3_unit_fontcolor'] || '#ffffff', e => this._valueChanged('field_3_unit_fontcolor', e))}
      </div>

      </ha-expansion-panel>
    `;
  }

  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }

    ha-expansion-panel {
      margin-top: 8px;
    }

    ha-expansion-panel > *:first-child {
      margin-top: 16px;
    }

    ha-expansion-panel + ha-expansion-panel > *:first-child {
      margin-top: 24px;
    }

    .color-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
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
    .color-row cc-textfield {
      flex: 1;
      --input-fill-color: transparent;
    }

    .text-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }
    .text-field label {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }

    .toggle-field {
      display: flex;
      flex-direction: row;
      gap: 12px;
      align-items: center;
    }
    .toggle-field label {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .toggle-hint {
      font-size: 11px;
      color: var(--disabled-text-color, #888);
      margin-left: 6px;
      font-style: italic;
    }

    cc-textfield {
      display: block;
      width: 100%;
    }

    .compass-styling-grid {
      display: grid;
      grid-template-columns: 7fr 7fr 4fr 4fr;
      gap: 8px;
      margin-top: 24px;
      margin-bottom: 16px;
    }

    .background-toggles-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 32px;
      margin-bottom: 16px;
    }

    .background-image-template-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 8px;
    }

    .background-image-styling-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 8px;
      align-items: end;
    }

    .rotate-compass-toggle-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 28px;
      margin-bottom: 16px;
    }

    .needle-name-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 16px;
      margin-bottom: 8px;
    }

    .needle-toggles-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      margin-top: 28px;
      margin-bottom: 16px;
    }

    .needle-template-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 8px;
    }

    .needle-color-grid {
      display: grid;
      grid-template-columns: 7fr 3fr 7fr 3fr;
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

    .needle-image-toggles-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 28px;
      margin-bottom: 16px;
    }

    .needle-image-template-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 8px;
    }

    .needle-image-styling-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 8px;
      align-items: end;
    }

    .marker-remove-grid {
      display: flex;
      justify-content: flex-end;
      margin-top: 8px;
      margin-bottom: 4px;
    }

    .marker-remove-btn {
      background: none;
      border: none;
      color: var(--error-color, #db4437);
      font-size: 0.875rem;
      font-weight: 500;
      font-family: inherit;
      letter-spacing: 0.0892857em;
      text-transform: uppercase;
      height: 36px;
      padding: 0 8px;
      cursor: pointer;
      border-radius: 4px;
    }

    .marker-remove-btn:hover {
      background: rgba(219, 68, 55, 0.08);
    }

    .marker-add-grid {
      display: flex;
      justify-content: center;
      margin-top: 12px;
      margin-bottom: 4px;
    }

    .marker-add-btn {
      background: none;
      border: none;
      color: var(--primary-color);
      font-size: 0.875rem;
      font-weight: 500;
      font-family: inherit;
      letter-spacing: 0.0892857em;
      text-transform: uppercase;
      height: 36px;
      padding: 0 8px;
      cursor: pointer;
      border-radius: 4px;
    }

    .marker-add-btn:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
    }

    .marker-toggles-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 16px;
      margin-bottom: 16px;
    }

    .marker-template-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 8px;
    }

    .marker-styling-grid {
      display: grid;
      grid-template-columns: 3fr 3fr 3fr 5fr;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 8px;
      align-items: end;
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

    .cardinals-styling-grid {
      display: grid;
      grid-template-columns: 2fr 2fr 2fr 3fr;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 8px;
      align-items: end;
    }

    .tick-styling-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 2fr;
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
      grid-template-columns: 2fr 2fr 2fr 3fr;
      gap: 8px;
      margin-top: 8px;
      align-items: end;
    }

  `;
}

customElements.define('custom-compass-card-editor', CustomCompassCardEditor);

// ─── Main Card ────────────────────────────────────────────────────────────────
class CustomCompassCard extends LitElement {
  static properties = {
    hass:          { type: Object },
    config:        { type: Object },
    _needleDegrees:         { type: Array },
    _field1Value:  { type: String },
    _field2Value:  { type: String },
    _field3Value:  { type: String },
    _headerValue:  { type: String },
    _footerValue:  { type: String },
    _markerDegrees:         { type: Array },
    _backgroundImageUrl:    { type: String },
    _needleImageUrls:       { type: Array },
    _error:                 { type: Boolean },
  };

  constructor() {
    super();
    this._needleDegrees       = [];
    this._needlePrevDegrees   = [];   // non-reactive, for shortest-arc tracking
    this._templateUnsubs      = [];
    this._subscriptionsActive = false;
    this._scale               = 1;
    this._field1Value         = '';
    this._field2Value         = '';
    this._field3Value         = '';
    this._headerValue         = '';
    this._footerValue         = '';
    this._markerDegrees       = [];
    this._backgroundImageUrl  = '';
    this._needleImageUrls     = [];
    this._error               = false;
  }

  setConfig(config) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.hass && this.config && !this._subscriptionsActive) {
      this._setupSubscriptions();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._teardownSubscriptions();
  }

  willUpdate(changedProperties) {
    super.willUpdate(changedProperties);
    if (!this.config) return;
    // Seed needle degrees from cache before first render after element recreation.
    // This runs synchronously before Lit renders, so needle never appears at 0.
    if (this._needleDegrees.length === 0) {
      const key = this._cacheKey();
      const cached = _needleDegreesCache.get(key);
      if (cached) {
        this._needleDegrees     = [...cached.degrees];
        this._needlePrevDegrees = [...cached.prevDegrees];
      }
    }
  }

  _cacheKey() {
    return (this.config.needles || []).map(n => n.template).join('|');
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    this._scaleElements();
    if (this.hass && this.config) {
      if (!this._subscriptionsActive || changedProperties.has('config')) {
        this._setupSubscriptions();
      }
    }
  }

  _setupSubscriptions() {
    this._teardownSubscriptions();
    if (!this.hass?.connection || !this.config) return;
    this._subscriptionsActive = true;

    const sub = (template, callback) => {
      const tmpl = String(template);
      if (!tmpl.includes('{{')) {
        // Plain string — use directly, no HA subscription needed
        callback(tmpl);
        return;
      }
      const unsub = this.hass.connection.subscribeMessage(
        (msg) => callback(msg.result),
        { type: 'render_template', template: tmpl }
      );
      this._templateUnsubs.push(unsub);
    };

    // Needle bearings — one subscription per needle
    this._needleDegrees     = [];
    this._needlePrevDegrees = [];
    (this.config.needles || []).forEach((needle, i) => {
      sub(needle.template, (result) => {
        const raw = parseFloat(result);
        if (!isNaN(raw)) {
          const targetNormalized = ((raw % 360) + 360) % 360;
          const prev    = this._needlePrevDegrees[i] ?? null;
          const current = this._needleDegrees[i]     ?? 0;
          if (targetNormalized !== prev) {
            const currentMod = ((current % 360) + 360) % 360;
            let delta = targetNormalized - currentMod;
            if (delta > 180)  delta -= 360;
            if (delta < -180) delta += 360;
            const newDegrees = [...this._needleDegrees];
            newDegrees[i] = current + delta;
            this._needleDegrees = newDegrees;
            this._needlePrevDegrees[i] = targetNormalized;
            // Keep cache current so willUpdate can restore on recreation
            _needleDegreesCache.set(this._cacheKey(), {
              degrees:     [...newDegrees],
              prevDegrees: [...this._needlePrevDegrees],
            });
          }
          if (i === 0) this._error = false;
        } else {
          const newDegrees = [...this._needleDegrees];
          newDegrees[i] = 0;
          this._needleDegrees = newDegrees;
          this._needlePrevDegrees[i] = null;
          if (i === 0) this._error = true;
        }
        if (i === 0) this._updateCompassDirectionFields();
      });
    });

    // Custom fields
    for (const def of this._fieldDefs) {
      if (!def.show) { this[`_field${def.index}Value`] = ''; continue; }
      const idx = def.index;
      // Template sent to HA untouched — ${compass_direction} is literal text to HA,
      // only the {{ }} parts are evaluated. Replacement happens in the callback.
      sub(String(def.template), (result) => {
        this[`_field${idx}Value`] = String(result).replace('${compass_direction}', this.getCompassDirection(this._needleDegrees[0] ?? 0));
      });
    }

    // Header and footer
    if (this.config.header_show && this.config.header_text) {
      sub(this.config.header_text, (result) => { this._headerValue = result; });
    } else { this._headerValue = ''; }

    if (this.config.footer_show && this.config.footer_text) {
      sub(this.config.footer_text, (result) => { this._footerValue = result; });
    } else { this._footerValue = ''; }

    // Marker degrees
    this._markerDegrees = [];
    (this.config.markers || []).forEach((m, i) => {
      sub(m.degrees, (result) => {
        const newDegrees = [...this._markerDegrees];
        newDegrees[i] = ((parseFloat(result) % 360) + 360) % 360;
        this._markerDegrees = newDegrees;
      });
    });

    // Background image URL
    if (this.config.background_image_show) {
      sub(this.config.background_image_url, (result) => { this._backgroundImageUrl = result; });
    } else { this._backgroundImageUrl = ''; }

    // Needle image URLs — one subscription per needle
    this._needleImageUrls = [];
    (this.config.needles || []).forEach((needle, i) => {
      if (needle.image_show) {
        sub(needle.image_url, (result) => {
          const newUrls = [...this._needleImageUrls];
          newUrls[i] = result;
          this._needleImageUrls = newUrls;
        });
      } else {
        const newUrls = [...this._needleImageUrls];
        newUrls[i] = '';
        this._needleImageUrls = newUrls;
      }
    });
  }

  // Called from the bearing callback whenever _degrees changes.
  // Handles fields whose template is a plain string containing ${compass_direction}.
  // Mixed templates (${compass_direction} + Jinja2) are handled by their HA callback.
  _updateCompassDirectionFields() {
    const direction = this.getCompassDirection(this._needleDegrees[0] ?? 0);
    for (const def of this._fieldDefs) {
      if (!def.show) continue;
      const tmpl = String(def.template);
      if (!tmpl.includes('${compass_direction}')) continue;
      if (tmpl.includes('{{')) continue;
      this[`_field${def.index}Value`] = tmpl.replace('${compass_direction}', direction);
    }
  }

  get _fieldDefs() {
    return [
      { index: 1, show: this.config.field_1_show, template: this.config.field_1_template },
      { index: 2, show: this.config.field_2_show, template: this.config.field_2_template },
      { index: 3, show: this.config.field_3_show, template: this.config.field_3_template },
    ];
  }

  _teardownSubscriptions() {
    const unsubs = this._templateUnsubs;
    this._templateUnsubs      = [];
    this._subscriptionsActive = false;
    for (const unsub of unsubs) {
      Promise.resolve(unsub).then(fn => fn()).catch(() => {});
    }
  }

  _scaleElements() {
    const circle = this.shadowRoot.querySelector('.compass-circle');
    if (!circle) return;

    const BASE_DESIGN_WIDTH = 120;
    const actualWidth = circle.offsetWidth;
    this._scale = actualWidth / BASE_DESIGN_WIDTH;

    this.style.setProperty('--cc-font-size', `${actualWidth * 0.08}px`);

    const initBorder = parseFloat(this.config.bezel_width);
    const borderSize = parseFloat(this.config.bezel_size);
    this.style.setProperty('--cc-circle-border-width', `${initBorder * this._scale}px`);
    this.style.setProperty('--cc-circle-color',        this.config.bezel_color);
    this.style.setProperty('--cc-bg-color',            this.config.background_color);
    const borderScale = this.offsetWidth / BASE_DESIGN_WIDTH;
    this.style.setProperty('--cc-border-size',         `${borderSize * borderScale}px`);

    this.style.setProperty('--cc-animation-duration', `${this.config.rotation_animation_time}s`);

    const wrapper = this.shadowRoot.querySelector('.compass-ticks-wrapper');
    if (wrapper) {
      this.style.setProperty('--cc-circle-size', `${wrapper.offsetWidth}px`);
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

  _renderTicks() {
    const c   = this.config;
    const cx  = 50, cy = 50, r = 50;

    const cardinals   = [c.cardinal_north, c.cardinal_east, c.cardinal_south, c.cardinal_west];

    // Build tick positions for each tier using configurable divisions
    const tierDefs = [
      { key: 'major', show: c.major_ticks_show, divisions: parseInt(c.major_ticks_divisions) || 4,  length: c.major_ticks_length, width: c.major_ticks_width, color: c.major_ticks_color, position: c.major_ticks_position || 0 },
      { key: 'minor', show: c.minor_ticks_show, divisions: parseInt(c.minor_ticks_divisions) || 8,  length: c.minor_ticks_length, width: c.minor_ticks_width, color: c.minor_ticks_color, position: c.minor_ticks_position || 0 },
      { key: 'micro', show: c.micro_ticks_show, divisions: parseInt(c.micro_ticks_divisions) || 16, length: c.micro_ticks_length, width: c.micro_ticks_width, color: c.micro_ticks_color, position: c.micro_ticks_position || 0 },
    ];

    // Collect all occupied angles from higher-priority tiers (rounded to 0.1 deg)
    const round1 = (v) => Math.round(v * 10) / 10;
    const occupied = new Set();

    const ticks = [];

    tierDefs.forEach((tier) => {
      const step = 360 / tier.divisions;
      for (let i = 0; i < tier.divisions; i++) {
        const angleDeg = round1(i * step);
        if (occupied.has(angleDeg)) continue;
        occupied.add(angleDeg);

        // Cardinal labels on major tier at 0/90/180/270 — independent of major_ticks_show
        if (tier.key === 'major' && c.cardinals_show) {
          const cardinalAngles = [0, 90, 180, 270];
          const cardinalIdx = cardinalAngles.indexOf(angleDeg);
          if (cardinalIdx !== -1) {
            const angleRad = angleDeg * Math.PI / 180;
            const sinA     = Math.sin(angleRad);
            const cosA     = Math.cos(angleRad);
            const tx       = cx + (r + (c.cardinals_position || 0)) * sinA;
            const ty       = cy - (r + (c.cardinals_position || 0)) * cosA;
            const offset   = c.cardinals_fontsize * 0.85;
            const lx       = tx - offset * sinA;
            const ly       = ty + offset * cosA;
            ticks.push({ type: 'text', x: lx, y: ly, letter: cardinals[cardinalIdx], fontSize: c.cardinals_fontsize, fontWeight: c.cardinals_fontweight, color: c.cardinals_fontcolor });
          }
        }

        if (!tier.show) continue;

        const angleRad = angleDeg * Math.PI / 180;
        const sinA     = Math.sin(angleRad);
        const cosA     = Math.cos(angleRad);
        const length   = parseFloat(tier.length);
        const width    = parseFloat(tier.width);
        const position = parseFloat(tier.position);

        const x1 = cx + (r + position)          * sinA;
        const y1 = cy - (r + position)          * cosA;
        const x2 = cx + (r + position - length) * sinA;
        const y2 = cy - (r + position - length) * cosA;
        ticks.push({ type: 'line', x1, y1, x2, y2, color: tier.color, width });
      }
    });

    // Build marker triangles
    const markerDefs = (c.markers || []).map((m, i) => ({
      show:     m.show,
      degrees:  this._markerDegrees[i] ?? 0,
      height:   parseFloat(m.height),
      width:    parseFloat(m.width),
      position: parseFloat(m.position),
      color:    m.color,
      flip:     m.flip,
    }));

    const markers = markerDefs.map(m => {
      if (!m.show) return null;
      const angle  = m.degrees * Math.PI / 180;
      const sinA   = Math.sin(angle);
      const cosA   = Math.cos(angle);
      const tipR   = r + m.position;
      const baseR  = tipR + m.height;
      const tipCx  = cx + (m.flip ? baseR : tipR)  * sinA;
      const tipCy  = cy - (m.flip ? baseR : tipR)  * cosA;
      const baseCx = cx + (m.flip ? tipR  : baseR) * sinA;
      const baseCy = cy - (m.flip ? tipR  : baseR) * cosA;
      const half   = m.width / 2;
      const b1x    = baseCx + half * cosA;
      const b1y    = baseCy + half * sinA;
      const b2x    = baseCx - half * cosA;
      const b2y    = baseCy - half * sinA;
      return { color: m.color, path: `M ${tipCx},${tipCy} L ${b1x},${b1y} L ${b2x},${b2y} Z` };
    }).filter(Boolean);

    return html`
      <div class="compass-ticks-wrapper">
        <svg class="compass-ticks" viewBox="0 0 100 100" preserveAspectRatio="none">
          ${ticks.map(t => {
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
    const c       = this.config || {};
    const needles = c.needles || [];
    const scale   = this._scale || 1;

    // compass_rotate: compute the rotation that puts needle 1 at north
    const needle0Degrees  = this._needleDegrees[0] ?? 0;
    const compassRotation = c.compass_rotate ? -needle0Degrees : 0;

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

    // Build and render each needle
    const renderNeedle = (needle, i) => {
      if (!needle.show) return html``;
      const degrees   = this._needleDegrees[i] ?? 0;
      const rotation  = needle.rotate ? degrees + 180 : degrees;
      const pathData  = this._buildNeedlePath(parseFloat(needle.morph), parseFloat(needle.curve), needle.invert, parseFloat(needle.position));
      const { minX, minY, maxX, maxY } = pathData.bounds;
      const viewBox   = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
      const w         = parseFloat(needle.width)    * scale;
      const h         = parseFloat(needle.height)   * scale;
      const pos       = parseFloat(needle.position) * scale;
      const gradId    = `needleGradient-${i}`;
      const clipId    = `needleClip-${i}`;
      const imageUrl  = this._needleImageUrls[i] || '';
      const g1        = needle.invert ? needle.color_2     : needle.color_1;
      const g1pos     = needle.invert ? 100 - parseFloat(needle.color_2_pos) : parseFloat(needle.color_1_pos);
      const g2        = needle.invert ? needle.color_1     : needle.color_2;
      const g2pos     = needle.invert ? 100 - parseFloat(needle.color_1_pos) : parseFloat(needle.color_2_pos);

      return html`
        <div class="compass-needle-wrapper" style="transform:rotate(${rotation}deg)">
          <svg class="compass-needle"
               style="width:${w}px; height:${h}px; top:calc(0px - ${pos}px);"
               viewBox="${viewBox}"
               preserveAspectRatio="none">
            <defs>
              <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"        stop-color="${g1}" />
                <stop offset="${g1pos}%" stop-color="${g1}" />
                <stop offset="${g2pos}%" stop-color="${g2}" />
                <stop offset="100%"      stop-color="${g2}" />
              </linearGradient>
              ${needle.image_show && imageUrl ? svg`
                <clipPath id="${clipId}">
                  <path d="${pathData.path}" />
                </clipPath>
              ` : ''}
            </defs>
            ${needle.image_show && imageUrl ? svg`
              <image
                href="${imageUrl}"
                x="${minX}" y="${minY}"
                width="${maxX - minX}" height="${maxY - minY}"
                preserveAspectRatio="xMidYMid slice"
                clip-path="url(#${clipId})"
                transform="translate(${(maxX + minX) / 2}, ${(maxY + minY) / 2}) rotate(${needle.image_rotate}) scale(${needle.image_scale / 100}) translate(${needle.image_x}, ${needle.image_y}) translate(${-(maxX + minX) / 2}, ${-(maxY + minY) / 2})"
              />
            ` : svg`
              <path d="${pathData.path}" fill="url(#${gradId})" />
            `}
          </svg>
        </div>
      `;
    };

    return html`
      <ha-card>
        ${c.header_show ? html`
          <div class="card-header-text" style="font-size:${c.header_fontsize}em; font-weight:${c.header_fontweight}; color:${c.header_fontcolor}; transform:translateY(calc(10px + ${c.header_position}px));">
            ${this._headerValue}
          </div>
        ` : ''}
        <div class="compass-container">
          <div class="compass-circle">
            ${c.background_image_show && this._backgroundImageUrl ? html`
              <img class="compass-bg-image"
                src="${this._backgroundImageUrl}"
                style="transform: translate(-50%, -50%) translate(${c.background_image_x}%, ${c.background_image_y}%) rotate(${c.background_image_rotate}deg) scale(${c.background_image_scale / 100});"
              />
            ` : ''}
            ${renderField(fieldDefs[0], this._field1Value)}
            ${renderField(fieldDefs[1], this._field2Value)}
            ${renderField(fieldDefs[2], this._field3Value)}
          </div>
          <div class="compass-rotate-wrapper" style="transform:rotate(${compassRotation}deg)">
            ${this._renderTicks()}
            ${[...needles].reverse().map((n, ri) => renderNeedle(n, needles.length - 1 - ri))}
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
      overflow: hidden;
    }
    .compass-bg-image {
      position: absolute;
      top: 50%;
      left: 50%;
      height: 100%;
      width: auto;
      max-width: none;
      transform-origin: center center;
      pointer-events: none;
      z-index: 0;
    }
    .compass-rotate-wrapper {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      transition: transform var(--cc-animation-duration, 0.3s) ease-out;
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
      transition: transform var(--cc-animation-duration, 0.3s) ease-out;
    }
    .compass-needle {
      position: absolute;
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
