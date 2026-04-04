import{LitElement,html,svg,css}from"https://unpkg.com/lit@2.0.0/index.js?module";import{live}from"https://unpkg.com/lit@2.0.0/directives/live.js?module";const CARD_VERSION="3.8.225",_needleDegreesCache=new Map,DEFAULT_MARKER={show:!0,degrees:"0",height:5,width:4,position:0,color:"#FF0000",flip:!1},DEFAULT_NEEDLE={name:"",show:!0,template:"{{ state_attr('sun.sun', 'azimuth') | float(0) }}",invert:!1,rotate:!1,color_1:"#FF0000",color_1_pos:50,color_2:"#EEEEEE",color_2_pos:50,height:100,width:10,position:-10,morph:50,curve:0,image_show:!1,image_url:"/local/community/custom-compass-card/moon.png",image_scale:100,image_x:0,image_y:0,image_rotate:0},DEFAULT_CONFIG={background_color:"#101010",bezel_color:"#383838",bezel_width:16,bezel_size:0,background_image_show:!0,background_image_url:"/local/community/custom-compass-card/black.png",background_image_scale:100,background_image_x:0,background_image_y:0,background_image_rotate:0,needles:[{...DEFAULT_NEEDLE}],compass_rotate:!1,markers:[],cardinals_show:!0,cardinal_north:"N",cardinal_east:"E",cardinal_south:"S",cardinal_west:"W",cardinals_fontsize:10,cardinals_fontweight:400,cardinals_position:1.5,cardinals_fontcolor:"#EEEEEE",major_ticks_show:!1,major_ticks_divisions:4,major_ticks_length:6,major_ticks_width:2,major_ticks_position:-3.5,major_ticks_color:"#CCCCCC",minor_ticks_show:!0,minor_ticks_divisions:8,minor_ticks_length:3,minor_ticks_width:1.5,minor_ticks_position:-4.5,minor_ticks_color:"#AAAAAA",micro_ticks_show:!0,micro_ticks_divisions:16,micro_ticks_length:0,micro_ticks_width:2,micro_ticks_position:-6.5,micro_ticks_color:"#888888",header_show:!1,header_text:"header",header_fontsize:2,header_fontweight:400,header_position:0,header_fontcolor:"#FFFFFF",footer_show:!1,footer_text:"footer",footer_fontsize:2,footer_fontweight:400,footer_position:0,footer_fontcolor:"#FFFFFF",field_1_show:!0,field_1_template:"${compass_direction}",field_1_fontsize:1.5,field_1_fontweight:400,field_1_position:23,field_1_fontcolor:"#29B6CF",field_1_unit:"",field_1_unit_fontsize:1,field_1_unit_fontweight:400,field_1_unit_fontcolor:"#196D7C",field_2_show:!1,field_2_template:"{{ states('sensor.ws_wind_speed') | round(1) }}",field_2_unit:"km/h",field_2_fontsize:2,field_2_fontweight:400,field_2_position:50,field_2_fontcolor:"#E8E8E8",field_2_unit_fontsize:1.2,field_2_unit_fontweight:400,field_2_unit_fontcolor:"#8C8C8C",field_3_show:!0,field_3_template:"{{ state_attr('sun.sun', 'azimuth') | round(0) }}",field_3_unit:"°",field_3_fontsize:1.4,field_3_fontweight:400,field_3_position:79,field_3_fontcolor:"#808080",field_3_unit_fontsize:1.4,field_3_unit_fontweight:400,field_3_unit_fontcolor:"#606060",rotation_animation_time:.5};class CcTextfield extends LitElement{static properties={value:{type:String},type:{type:String},step:{type:String},min:{type:String},max:{type:String},placeholder:{type:String}};static styles=css`
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
  `;render(){return html`
      <input
        .value=${live(this.value??"")}
        type=${this.type||"text"}
        step=${this.step||""}
        min=${this.min||""}
        max=${this.max||""}
        @input=${this._onInput}
      />
    `}_onInput(e){this.value=e.target.value,this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}}customElements.define("cc-textfield",CcTextfield);class CustomCompassCardEditor extends LitElement{static properties={hass:{type:Object},_config:{type:Object}};setConfig(e){this._config={...DEFAULT_CONFIG,...e}}_parseNumber(e){const t=String(e).replace(",",".");if("-"===t||"-0"===t||t.endsWith("."))return null;if(t.includes(".")&&t.endsWith("0"))return null;if(""===t)return;const i=parseFloat(t);return isNaN(i)?null:i}_valueChanged(e,t){if(!this._config||!this.hass)return;let i;if(i=void 0!==t.detail?.value?t.detail.value:"HA-SWITCH"===t.target.tagName?t.target.checked:t.target.value,"number"===t.target.type){const e=this._parseNumber(i);if(null==e)return;i=e}this._config={...this._config,[e]:i},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_colorPicker(e,t,i){const l=/^#[0-9a-fA-F]{6}$/.test(t)?t:"#ffffff";return html`
      <div class="color-field">
        <label>${e}</label>
        <div class="color-row">
          <input
            type="color"
            .value=${l}
            @input=${i}
          />
          <cc-textfield
            .value=${t}
            placeholder="#RRGGBB or #RRGGBBAA"
            @input=${i}
          ></cc-textfield>
        </div>
      </div>
    `}_addNeedle(){const e=[...this._config.needles||[],{...DEFAULT_NEEDLE}];this._config={...this._config,needles:e},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_removeNeedle(e){const t=this._config.needles.filter((t,i)=>i!==e);this._config={...this._config,needles:t},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_needleChanged(e,t,i){let l;if("HA-SWITCH"===i.target.tagName)l=i.target.checked;else if(l=i.target.value,"number"===i.target.type){const e=this._parseNumber(l);if(null==e)return;l=e}const s=this._config.needles.map((i,s)=>s===e?{...i,[t]:l}:i);this._config={...this._config,needles:s},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_addMarker(){const e=[...this._config.markers||[],{...DEFAULT_MARKER}];this._config={...this._config,markers:e},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_removeMarker(e){const t=this._config.markers.filter((t,i)=>i!==e);this._config={...this._config,markers:t},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_markerChanged(e,t,i){let l;if("HA-SWITCH"===i.target.tagName)l=i.target.checked;else if(l=i.target.value,"number"===i.target.type){const e=this._parseNumber(l);if(null==e)return;l=e}const s=this._config.markers.map((i,s)=>s===e?{...i,[t]:l}:i);this._config={...this._config,markers:s},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}render(){if(!this.hass||!this._config)return html``;const e=this._config;return html`

      <ha-expansion-panel header="Compass configuration" outlined>

      <!-- Compass styling -->
      <div class="compass-styling-grid">
        ${this._colorPicker("Background",this._config.background_color||"#ffffff",e=>this._valueChanged("background_color",e))}
        ${this._colorPicker("Bezel color",this._config.bezel_color||"#ffffff",e=>this._valueChanged("bezel_color",e))}
        <div class="text-field">
          <label>Bezel width</label>
          <cc-textfield
            type="number" step="1" min="0"
            .value=${String(e.bezel_width)}
            @input=${e=>this._valueChanged("bezel_width",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Bezel size</label>
          <cc-textfield
            type="number" step="1"
            .value=${String(e.bezel_size)}
            @input=${e=>this._valueChanged("bezel_size",e)}
          ></cc-textfield>
        </div>
      </div>

      <!-- Background image -->
      <div class="background-toggles-grid">
        <div class="toggle-field">
          <label>Background image</label>
          <ha-switch
            .checked=${e.background_image_show}
            @change=${e=>this._valueChanged("background_image_show",e)}
          ></ha-switch>
        </div>
      </div>
      <div class="background-image-template-grid">
        <div class="text-field">
          <label>URL (jinja template allowed)</label>
          <cc-textfield
            .value=${String(e.background_image_url)}
            @input=${e=>this._valueChanged("background_image_url",e)}
          ></cc-textfield>
        </div>
      </div>
      <div class="background-image-styling-grid">
        <div class="text-field">
          <label>X pos</label>
          <cc-textfield
            type="number" step="0.5"
            .value=${String(e.background_image_x)}
            @input=${e=>this._valueChanged("background_image_x",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Y pos</label>
          <cc-textfield
            type="number" step="0.5"
            .value=${String(e.background_image_y)}
            @input=${e=>this._valueChanged("background_image_y",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Scale (%)</label>
          <cc-textfield
            type="number" step="1" min="1"
            .value=${String(e.background_image_scale)}
            @input=${e=>this._valueChanged("background_image_scale",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Rotate</label>
          <cc-textfield
            type="number" step="1"
            .value=${String(e.background_image_rotate)}
            @input=${e=>this._valueChanged("background_image_rotate",e)}
          ></cc-textfield>
        </div>
      </div>

      <!-- Rotate compass -->
      <div class="rotate-compass-toggle-grid">
        <div class="toggle-field">
          <label>Rotate compass</label>
          <ha-switch
            .checked=${e.compass_rotate}
            @change=${e=>this._valueChanged("compass_rotate",e)}
          ></ha-switch>
          <span class="toggle-hint">(rotates compass so needle 1 always points north)</span>
        </div>
      </div>

      </ha-expansion-panel>

      <ha-expansion-panel header="Needle configuration" outlined>

      ${(e.needles||[]).map((e,t)=>html`
        <ha-expansion-panel header="${e.name||"Needle "+(t+1)}" outlined>

          <!-- Name -->
          <div class="needle-name-grid">
            <div class="text-field">
              <label>Name (optional)</label>
              <cc-textfield
                .value=${String(e.name||"")}
                @input=${e=>this._needleChanged(t,"name",e)}
              ></cc-textfield>
            </div>
          </div>

          <!-- Toggles -->
          <div class="needle-toggles-grid">
            <div class="toggle-field">
              <label>Show</label>
              <ha-switch
                .checked=${e.show}
                @change=${e=>this._needleChanged(t,"show",e)}
              ></ha-switch>
            </div>
            <div class="toggle-field">
              <label>Invert</label>
              <ha-switch
                .checked=${e.invert}
                @change=${e=>this._needleChanged(t,"invert",e)}
              ></ha-switch>
            </div>
            <div class="toggle-field">
              <label>Rotate 180°</label>
              <ha-switch
                .checked=${e.rotate}
                @change=${e=>this._needleChanged(t,"rotate",e)}
              ></ha-switch>
            </div>
          </div>

          <!-- Bearing template -->
          <div class="needle-template-grid">
            <div class="text-field">
              <label>Bearing (jinja template)</label>
              <cc-textfield
                .value=${String(e.template)}
                @input=${e=>this._needleChanged(t,"template",e)}
              ></cc-textfield>
            </div>
          </div>

          <!-- Colors -->
          <div class="needle-color-grid">
            ${this._colorPicker("Color 1",e.color_1||"#FF0000",e=>this._needleChanged(t,"color_1",e))}
            <div class="text-field">
              <label>Pos (%)</label>
              <cc-textfield
                type="number" step="1" min="0" max="100"
                .value=${String(e.color_1_pos)}
                @input=${e=>this._needleChanged(t,"color_1_pos",e)}
              ></cc-textfield>
            </div>
            ${this._colorPicker("Color 2",e.color_2||"#EEEEEE",e=>this._needleChanged(t,"color_2",e))}
            <div class="text-field">
              <label>Pos (%)</label>
              <cc-textfield
                type="number" step="1" min="0" max="100"
                .value=${String(e.color_2_pos)}
                @input=${e=>this._needleChanged(t,"color_2_pos",e)}
              ></cc-textfield>
            </div>
          </div>

          <!-- Dimensions -->
          <div class="needle-dimensions-grid">
            <div class="text-field">
              <label>Position</label>
              <cc-textfield
                type="number" step="1"
                .value=${String(e.position)}
                @input=${e=>this._needleChanged(t,"position",e)}
              ></cc-textfield>
            </div>
            <div class="text-field">
              <label>Height</label>
              <cc-textfield
                type="number" step="1" min="4"
                .value=${String(e.height)}
                @input=${e=>this._needleChanged(t,"height",e)}
              ></cc-textfield>
            </div>
            <div class="text-field">
              <label>Width</label>
              <cc-textfield
                type="number" step="1" min="1"
                .value=${String(e.width)}
                @input=${e=>this._needleChanged(t,"width",e)}
              ></cc-textfield>
            </div>
            <div class="text-field">
              <label>Morph</label>
              <cc-textfield
                type="number" step="1"
                .value=${String(e.morph)}
                @input=${e=>this._needleChanged(t,"morph",e)}
              ></cc-textfield>
            </div>
            <div class="text-field">
              <label>Curve</label>
              <cc-textfield
                type="number" step="1"
                .value=${String(e.curve)}
                @input=${e=>this._needleChanged(t,"curve",e)}
              ></cc-textfield>
            </div>
          </div>

          <!-- Needle image -->
          <div class="needle-image-toggles-grid">
            <div class="toggle-field">
              <label>Needle image</label>
              <ha-switch
                .checked=${e.image_show}
                @change=${e=>this._needleChanged(t,"image_show",e)}
              ></ha-switch>
            </div>
          </div>
          <div class="needle-image-template-grid">
            <div class="text-field">
              <label>URL (jinja template allowed)</label>
              <cc-textfield
                .value=${String(e.image_url)}
                @input=${e=>this._needleChanged(t,"image_url",e)}
              ></cc-textfield>
            </div>
          </div>
          <div class="needle-image-styling-grid">
            <div class="text-field">
              <label>X pos</label>
              <cc-textfield
                type="number" step="0.5"
                .value=${String(e.image_x)}
                @input=${e=>this._needleChanged(t,"image_x",e)}
              ></cc-textfield>
            </div>
            <div class="text-field">
              <label>Y pos</label>
              <cc-textfield
                type="number" step="0.5"
                .value=${String(e.image_y)}
                @input=${e=>this._needleChanged(t,"image_y",e)}
              ></cc-textfield>
            </div>
            <div class="text-field">
              <label>Scale (%)</label>
              <cc-textfield
                type="number" step="1" min="1"
                .value=${String(e.image_scale)}
                @input=${e=>this._needleChanged(t,"image_scale",e)}
              ></cc-textfield>
            </div>
            <div class="text-field">
              <label>Rotate</label>
              <cc-textfield
                type="number" step="1"
                .value=${String(e.image_rotate)}
                @input=${e=>this._needleChanged(t,"image_rotate",e)}
              ></cc-textfield>
            </div>
          </div>

          <!-- Remove button -->
          <div class="marker-remove-grid">
            <button class="marker-remove-btn" @click=${()=>this._removeNeedle(t)}>Remove needle</button>
          </div>

        </ha-expansion-panel>
      `)}

      <div class="marker-add-grid">
        <button class="marker-add-btn" @click=${this._addNeedle}>+ Add needle</button>
      </div>

      </ha-expansion-panel>

      <ha-expansion-panel header="Markers configuration" outlined>

      ${(e.markers||[]).map((e,t)=>html`
        <ha-expansion-panel header="Marker ${t+1}" outlined>
          <div class="marker-toggles-grid">
            <div class="toggle-field">
              <label>Show</label>
              <ha-switch
                .checked=${e.show}
                @change=${e=>this._markerChanged(t,"show",e)}
              ></ha-switch>
            </div>
            <div class="toggle-field">
              <label>Flip</label>
              <ha-switch
                .checked=${e.flip}
                @change=${e=>this._markerChanged(t,"flip",e)}
              ></ha-switch>
            </div>
          </div>
          <div class="marker-template-grid">
            <div class="text-field">
              <label>Degrees (jinja template allowed)</label>
              <cc-textfield
                .value=${String(e.degrees)}
                @input=${e=>this._markerChanged(t,"degrees",e)}
              ></cc-textfield>
            </div>
          </div>
          <div class="marker-styling-grid">
            <div class="text-field">
              <label>Position</label>
              <cc-textfield
                type="number" step="0.5"
                .value=${String(e.position)}
                @input=${e=>this._markerChanged(t,"position",e)}
              ></cc-textfield>
            </div>
            <div class="text-field">
              <label>Height</label>
              <cc-textfield
                type="number" step="0.1" min="0"
                .value=${String(e.height)}
                @input=${e=>this._markerChanged(t,"height",e)}
              ></cc-textfield>
            </div>
            <div class="text-field">
              <label>Width</label>
              <cc-textfield
                type="number" step="0.1" min="0"
                .value=${String(e.width)}
                @input=${e=>this._markerChanged(t,"width",e)}
              ></cc-textfield>
            </div>
            ${this._colorPicker("Color",e.color||"#FF0000",e=>this._markerChanged(t,"color",e))}
          </div>
          <div class="marker-remove-grid">
            <button class="marker-remove-btn" @click=${()=>this._removeMarker(t)}>Remove marker</button>
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
            .checked=${e.cardinals_show}
            @change=${e=>this._valueChanged("cardinals_show",e)}
          ></ha-switch>
        </div>
      </div>
      
      <div class="cardinal-labels-grid">
        <div class="text-field">
          <label>North</label>
          <cc-textfield
            .value=${e.cardinal_north}
            @input=${e=>this._valueChanged("cardinal_north",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>East</label>
          <cc-textfield
            .value=${e.cardinal_east}
            @input=${e=>this._valueChanged("cardinal_east",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>South</label>
          <cc-textfield
            .value=${e.cardinal_south}
            @input=${e=>this._valueChanged("cardinal_south",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>West</label>
          <cc-textfield
            .value=${e.cardinal_west}
            @input=${e=>this._valueChanged("cardinal_west",e)}
          ></cc-textfield>
        </div>
      </div>
      
      <div class="cardinals-styling-grid">
        <div class="text-field">
          <label>Position</label>
          <cc-textfield
            type="number" step="0.5"
            .value=${String(e.cardinals_position)}
            @input=${e=>this._valueChanged("cardinals_position",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font size</label>
          <cc-textfield
            type="number" step="0.5" min="0"
            .value=${String(e.cardinals_fontsize)}
            @input=${e=>this._valueChanged("cardinals_fontsize",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <cc-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(e.cardinals_fontweight)}
            @input=${e=>this._valueChanged("cardinals_fontweight",e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker("Color",this._config.cardinals_fontcolor||"#ffffff",e=>this._valueChanged("cardinals_fontcolor",e))}
      </div>

      <!-- Primary ticks -->
      <div class="tick-toggles-grid">
        <div class="toggle-field">
          <label>Primary ticks</label>
          <ha-switch
            .checked=${e.major_ticks_show}
            @change=${e=>this._valueChanged("major_ticks_show",e)}
          ></ha-switch>
        </div>
      </div>
      <div class="tick-styling-grid">
        <div class="text-field">
          <label>Position</label>
          <cc-textfield
            type="number" step="0.5"
            .value=${String(e.major_ticks_position)}
            @input=${e=>this._valueChanged("major_ticks_position",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Length</label>
          <cc-textfield
            type="number" step="0.1" min="0"
            .value=${String(e.major_ticks_length)}
            @input=${e=>this._valueChanged("major_ticks_length",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <cc-textfield
            type="number" step="0.1" min="0"
            .value=${String(e.major_ticks_width)}
            @input=${e=>this._valueChanged("major_ticks_width",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Divisions</label>
          <cc-textfield
            type="number" step="1" min="1"
            .value=${String(e.major_ticks_divisions)}
            @input=${e=>this._valueChanged("major_ticks_divisions",e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker("Color",this._config.major_ticks_color||"#ffffff",e=>this._valueChanged("major_ticks_color",e))}
      </div>

      <!-- Medium ticks -->
      <div class="tick-toggles-grid">
        <div class="toggle-field">
          <label>Secondary ticks</label>
          <ha-switch
            .checked=${e.minor_ticks_show}
            @change=${e=>this._valueChanged("minor_ticks_show",e)}
          ></ha-switch>
        </div>
      </div>
      <div class="tick-styling-grid">
        <div class="text-field">
          <label>Position</label>
          <cc-textfield
            type="number" step="0.5"
            .value=${String(e.minor_ticks_position)}
            @input=${e=>this._valueChanged("minor_ticks_position",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Length</label>
          <cc-textfield
            type="number" step="0.1" min="0"
            .value=${String(e.minor_ticks_length)}
            @input=${e=>this._valueChanged("minor_ticks_length",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <cc-textfield
            type="number" step="0.1" min="0"
            .value=${String(e.minor_ticks_width)}
            @input=${e=>this._valueChanged("minor_ticks_width",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Divisions</label>
          <cc-textfield
            type="number" step="1" min="1"
            .value=${String(e.minor_ticks_divisions)}
            @input=${e=>this._valueChanged("minor_ticks_divisions",e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker("Color",this._config.minor_ticks_color||"#ffffff",e=>this._valueChanged("minor_ticks_color",e))}
      </div>

      <!-- Micro ticks -->
      <div class="tick-toggles-grid">
        <div class="toggle-field">
          <label>Tertiary ticks</label>
          <ha-switch
            .checked=${e.micro_ticks_show}
            @change=${e=>this._valueChanged("micro_ticks_show",e)}
          ></ha-switch>
        </div>
      </div>
      <div class="tick-styling-grid">
        <div class="text-field">
          <label>Position</label>
          <cc-textfield
            type="number" step="0.5"
            .value=${String(e.micro_ticks_position)}
            @input=${e=>this._valueChanged("micro_ticks_position",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Length</label>
          <cc-textfield
            type="number" step="0.1" min="0"
            .value=${String(e.micro_ticks_length)}
            @input=${e=>this._valueChanged("micro_ticks_length",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <cc-textfield
            type="number" step="0.1" min="0"
            .value=${String(e.micro_ticks_width)}
            @input=${e=>this._valueChanged("micro_ticks_width",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Divisions</label>
          <cc-textfield
            type="number" step="1" min="1"
            .value=${String(e.micro_ticks_divisions)}
            @input=${e=>this._valueChanged("micro_ticks_divisions",e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker("Color",this._config.micro_ticks_color||"#ffffff",e=>this._valueChanged("micro_ticks_color",e))}
      </div>

      </ha-expansion-panel>

      <ha-expansion-panel header="Header &amp; Footer configuration" outlined>

      <!-- Header -->
      <div class="field-toggles-grid">
        <div class="toggle-field">
          <label>Show header</label>
          <ha-switch
            .checked=${e.header_show}
            @change=${e=>this._valueChanged("header_show",e)}
          ></ha-switch>
        </div>
      </div>
      <div class="field-template-grid">
        <div class="text-field">
          <label>Header (jinja template allowed)</label>
          <cc-textfield
            .value=${e.header_text}
            @input=${e=>this._valueChanged("header_text",e)}
          ></cc-textfield>
        </div>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Position</label>
          <cc-textfield
            type="number" step="1"
            .value=${String(e.header_position)}
            @input=${e=>this._valueChanged("header_position",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font size</label>
          <cc-textfield
            type="number" step="0.1"
            .value=${String(e.header_fontsize)}
            @input=${e=>this._valueChanged("header_fontsize",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <cc-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(e.header_fontweight)}
            @input=${e=>this._valueChanged("header_fontweight",e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker("Color",this._config.header_fontcolor||"#ffffff",e=>this._valueChanged("header_fontcolor",e))}
      </div>

      <!-- Footer -->
      <div class="field-toggles-grid">
        <div class="toggle-field">
          <label>Show footer</label>
          <ha-switch
            .checked=${e.footer_show}
            @change=${e=>this._valueChanged("footer_show",e)}
          ></ha-switch>
        </div>
      </div>
      <div class="field-template-grid">
        <div class="text-field">
          <label>Footer (jinja template allowed)</label>
          <cc-textfield
            .value=${e.footer_text}
            @input=${e=>this._valueChanged("footer_text",e)}
          ></cc-textfield>
        </div>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Position</label>
          <cc-textfield
            type="number" step="1"
            .value=${String(e.footer_position)}
            @input=${e=>this._valueChanged("footer_position",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font size</label>
          <cc-textfield
            type="number" step="0.1"
            .value=${String(e.footer_fontsize)}
            @input=${e=>this._valueChanged("footer_fontsize",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <cc-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(e.footer_fontweight)}
            @input=${e=>this._valueChanged("footer_fontweight",e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker("Color",this._config.footer_fontcolor||"#ffffff",e=>this._valueChanged("footer_fontcolor",e))}
      </div>

      </ha-expansion-panel>

      <ha-expansion-panel header="Custom fields configuration" outlined>

      <!-- Field 1 -->
      <div class="field-toggles-grid">
        <div class="toggle-field">
          <label>Show Field 1</label>
          <ha-switch
            .checked=${e.field_1_show}
            @change=${e=>this._valueChanged("field_1_show",e)}
          ></ha-switch>
        </div>
      </div>
      <div class="field-template-grid">
        <div class="text-field">
          <label>Text (jinja template allowed)</label>
          <cc-textfield
            .value=${e.field_1_template}
            @input=${e=>this._valueChanged("field_1_template",e)}
          ></cc-textfield>
        </div>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Position (%)</label>
          <cc-textfield
            type="number" step="1"
            .value=${String(e.field_1_position)}
            @input=${e=>this._valueChanged("field_1_position",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font size</label>
          <cc-textfield
            type="number" step="0.1"
            .value=${String(e.field_1_fontsize)}
            @input=${e=>this._valueChanged("field_1_fontsize",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <cc-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(e.field_1_fontweight)}
            @input=${e=>this._valueChanged("field_1_fontweight",e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker("Color",this._config.field_1_fontcolor||"#ffffff",e=>this._valueChanged("field_1_fontcolor",e))}
      </div>
      <div class="field-unit-grid">
        <div class="text-field">
          <label>Unit</label>
          <cc-textfield
            .value=${e.field_1_unit}
            @input=${e=>this._valueChanged("field_1_unit",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font size</label>
          <cc-textfield
            type="number" step="0.1"
            .value=${String(e.field_1_unit_fontsize)}
            @input=${e=>this._valueChanged("field_1_unit_fontsize",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <cc-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(e.field_1_unit_fontweight)}
            @input=${e=>this._valueChanged("field_1_unit_fontweight",e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker("Color",this._config.field_1_unit_fontcolor||"#ffffff",e=>this._valueChanged("field_1_unit_fontcolor",e))}
      </div>


      <!-- Field 2 -->
      <div class="field-toggles-grid">
        <div class="toggle-field">
          <label>Show Field 2</label>
          <ha-switch
            .checked=${e.field_2_show}
            @change=${e=>this._valueChanged("field_2_show",e)}
          ></ha-switch>
        </div>
      </div>
      <div class="field-template-grid">
        <div class="text-field">
          <label>Text (jinja template allowed)</label>
          <cc-textfield
            .value=${e.field_2_template}
            @input=${e=>this._valueChanged("field_2_template",e)}
          ></cc-textfield>
        </div>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Position (%)</label>
          <cc-textfield
            type="number" step="1"
            .value=${String(e.field_2_position)}
            @input=${e=>this._valueChanged("field_2_position",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font size</label>
          <cc-textfield
            type="number" step="0.1"
            .value=${String(e.field_2_fontsize)}
            @input=${e=>this._valueChanged("field_2_fontsize",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <cc-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(e.field_2_fontweight)}
            @input=${e=>this._valueChanged("field_2_fontweight",e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker("Color",this._config.field_2_fontcolor||"#ffffff",e=>this._valueChanged("field_2_fontcolor",e))}
      </div>
      <div class="field-unit-grid">
        <div class="text-field">
          <label>Unit</label>
          <cc-textfield
            .value=${e.field_2_unit}
            @input=${e=>this._valueChanged("field_2_unit",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font size</label>
          <cc-textfield
            type="number" step="0.1"
            .value=${String(e.field_2_unit_fontsize)}
            @input=${e=>this._valueChanged("field_2_unit_fontsize",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <cc-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(e.field_2_unit_fontweight)}
            @input=${e=>this._valueChanged("field_2_unit_fontweight",e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker("Color",this._config.field_2_unit_fontcolor||"#ffffff",e=>this._valueChanged("field_2_unit_fontcolor",e))}
      </div>


      <!-- Field 3 -->
      <div class="field-toggles-grid">
        <div class="toggle-field">
          <label>Show Field 3</label>
          <ha-switch
            .checked=${e.field_3_show}
            @change=${e=>this._valueChanged("field_3_show",e)}
          ></ha-switch>
        </div>
      </div>
      <div class="field-template-grid">
        <div class="text-field">
          <label>Text (jinja template allowed)</label>
          <cc-textfield
            .value=${e.field_3_template}
            @input=${e=>this._valueChanged("field_3_template",e)}
          ></cc-textfield>
        </div>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Position (%)</label>
          <cc-textfield
            type="number" step="1"
            .value=${String(e.field_3_position)}
            @input=${e=>this._valueChanged("field_3_position",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font size</label>
          <cc-textfield
            type="number" step="0.1"
            .value=${String(e.field_3_fontsize)}
            @input=${e=>this._valueChanged("field_3_fontsize",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <cc-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(e.field_3_fontweight)}
            @input=${e=>this._valueChanged("field_3_fontweight",e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker("Color",this._config.field_3_fontcolor||"#ffffff",e=>this._valueChanged("field_3_fontcolor",e))}
      </div>
      <div class="field-unit-grid">
        <div class="text-field">
          <label>Unit</label>
          <cc-textfield
            .value=${e.field_3_unit}
            @input=${e=>this._valueChanged("field_3_unit",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font size</label>
          <cc-textfield
            type="number" step="0.1"
            .value=${String(e.field_3_unit_fontsize)}
            @input=${e=>this._valueChanged("field_3_unit_fontsize",e)}
          ></cc-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <cc-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(e.field_3_unit_fontweight)}
            @input=${e=>this._valueChanged("field_3_unit_fontweight",e)}
          ></cc-textfield>
        </div>
        ${this._colorPicker("Color",this._config.field_3_unit_fontcolor||"#ffffff",e=>this._valueChanged("field_3_unit_fontcolor",e))}
      </div>

      </ha-expansion-panel>
    `}static styles=css`
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

  `}customElements.define("custom-compass-card-editor",CustomCompassCardEditor);class CustomCompassCard extends LitElement{static properties={hass:{type:Object},config:{type:Object},_needleDegrees:{type:Array},_field1Value:{type:String},_field2Value:{type:String},_field3Value:{type:String},_headerValue:{type:String},_footerValue:{type:String},_markerDegrees:{type:Array},_backgroundImageUrl:{type:String},_needleImageUrls:{type:Array},_error:{type:Boolean}};constructor(){super(),this._needleDegrees=[],this._needlePrevDegrees=[],this._templateUnsubs=[],this._subscriptionsActive=!1,this._scale=1,this._field1Value="",this._field2Value="",this._field3Value="",this._headerValue="",this._footerValue="",this._markerDegrees=[],this._backgroundImageUrl="",this._needleImageUrls=[],this._error=!1}setConfig(e){this.config={...DEFAULT_CONFIG,...e}}connectedCallback(){super.connectedCallback(),this.hass&&this.config&&!this._subscriptionsActive&&this._setupSubscriptions()}disconnectedCallback(){super.disconnectedCallback(),this._teardownSubscriptions()}willUpdate(e){if(super.willUpdate(e),this.config&&0===this._needleDegrees.length){const e=this._cacheKey(),t=_needleDegreesCache.get(e);t&&(this._needleDegrees=[...t.degrees],this._needlePrevDegrees=[...t.prevDegrees])}}_cacheKey(){return(this.config.needles||[]).map(e=>e.template).join("|")}updated(e){super.updated(e),this._scaleElements(),this.hass&&this.config&&(this._subscriptionsActive&&!e.has("config")||this._setupSubscriptions())}_setupSubscriptions(){if(this._teardownSubscriptions(),!this.hass?.connection||!this.config)return;this._subscriptionsActive=!0;const e=(e,t)=>{const i=String(e);if(!i.includes("{{"))return void t(i);const l=this.hass.connection.subscribeMessage(e=>t(e.result),{type:"render_template",template:i});this._templateUnsubs.push(l)};this._needleDegrees=[],this._needlePrevDegrees=[],(this.config.needles||[]).forEach((t,i)=>{e(t.template,e=>{const t=parseFloat(e);if(isNaN(t)){const e=[...this._needleDegrees];e[i]=0,this._needleDegrees=e,this._needlePrevDegrees[i]=null,0===i&&(this._error=!0)}else{const e=(t%360+360)%360,l=this._needlePrevDegrees[i]??null,s=this._needleDegrees[i]??0;if(e!==l){let t=e-(s%360+360)%360;t>180&&(t-=360),t<-180&&(t+=360);const l=[...this._needleDegrees];l[i]=s+t,this._needleDegrees=l,this._needlePrevDegrees[i]=e,_needleDegreesCache.set(this._cacheKey(),{degrees:[...l],prevDegrees:[...this._needlePrevDegrees]})}0===i&&(this._error=!1)}0===i&&this._updateCompassDirectionFields()})});for(const t of this._fieldDefs){if(!t.show){this[`_field${t.index}Value`]="";continue}const i=t.index;e(String(t.template),e=>{this[`_field${i}Value`]=String(e).replace("${compass_direction}",this.getCompassDirection(this._needleDegrees[0]??0))})}this.config.header_show&&this.config.header_text?e(this.config.header_text,e=>{this._headerValue=e}):this._headerValue="",this.config.footer_show&&this.config.footer_text?e(this.config.footer_text,e=>{this._footerValue=e}):this._footerValue="",this._markerDegrees=[],(this.config.markers||[]).forEach((t,i)=>{e(t.degrees,e=>{const t=[...this._markerDegrees];t[i]=(parseFloat(e)%360+360)%360,this._markerDegrees=t})}),this.config.background_image_show?e(this.config.background_image_url,e=>{this._backgroundImageUrl=e}):this._backgroundImageUrl="",this._needleImageUrls=[],(this.config.needles||[]).forEach((t,i)=>{if(t.image_show)e(t.image_url,e=>{const t=[...this._needleImageUrls];t[i]=e,this._needleImageUrls=t});else{const e=[...this._needleImageUrls];e[i]="",this._needleImageUrls=e}})}_updateCompassDirectionFields(){const e=this.getCompassDirection(this._needleDegrees[0]??0);for(const t of this._fieldDefs){if(!t.show)continue;const i=String(t.template);i.includes("${compass_direction}")&&(i.includes("{{")||(this[`_field${t.index}Value`]=i.replace("${compass_direction}",e)))}}get _fieldDefs(){return[{index:1,show:this.config.field_1_show,template:this.config.field_1_template},{index:2,show:this.config.field_2_show,template:this.config.field_2_template},{index:3,show:this.config.field_3_show,template:this.config.field_3_template}]}_teardownSubscriptions(){const e=this._templateUnsubs;this._templateUnsubs=[],this._subscriptionsActive=!1;for(const t of e)Promise.resolve(t).then(e=>e()).catch(()=>{})}_scaleElements(){const e=this.shadowRoot.querySelector(".compass-circle");if(!e)return;const t=e.offsetWidth;this._scale=t/120,this.style.setProperty("--cc-font-size",.08*t+"px");const i=parseFloat(this.config.bezel_width),l=parseFloat(this.config.bezel_size);this.style.setProperty("--cc-circle-border-width",i*this._scale+"px"),this.style.setProperty("--cc-circle-color",this.config.bezel_color),this.style.setProperty("--cc-bg-color",this.config.background_color);const s=this.offsetWidth/120;this.style.setProperty("--cc-border-size",l*s+"px"),this.style.setProperty("--cc-animation-duration",`${this.config.rotation_animation_time}s`);const a=this.shadowRoot.querySelector(".compass-ticks-wrapper");a&&this.style.setProperty("--cc-circle-size",`${a.offsetWidth}px`)}getCompassDirection(e){const t=(e%360+360)%360,i=this.config.cardinal_north,l=this.config.cardinal_east,s=this.config.cardinal_south,a=this.config.cardinal_west;return[i,i+i+l,i+l,l+i+l,l,l+s+l,s+l,s+s+l,s,s+s+a,s+a,a+s+a,a,a+i+a,i+a,i+i+a][Math.floor((t+11.25)/22.5)%16]}_buildNeedlePath(e,t,i,l){let s=[{x:50,y:0},{x:0,y:50},{x:50,y:50+e},{x:100,y:50}];const a=Math.abs(e)/50,o=Math.sign(e)*Math.min(1,Math.abs(e)/50)*(Math.PI/2);let n=[{in:{x:1,y:0},out:{x:-1,y:0},lengthMultiplier:1},{in:{x:0,y:-1},out:{x:Math.cos(o),y:Math.sin(o)},lengthMultiplier:1},{in:{x:-1,y:0},out:{x:1,y:0},lengthMultiplier:a},{in:{x:-Math.cos(o),y:Math.sin(o)},out:{x:0,y:-1},lengthMultiplier:1}];i&&(s.forEach(e=>{e.y=-e.y}),n.forEach(e=>{e.in.y=-e.in.y,e.out.y=-e.out.y}));const r=s.map((e,i)=>{const l=t*n[i].lengthMultiplier;return{in:{x:e.x+n[i].in.x*l,y:e.y+n[i].in.y*l},out:{x:e.x+n[i].out.x*l,y:e.y+n[i].out.y*l}}}),d=[...s];r.forEach(e=>d.push(e.in,e.out));const c=-Math.min(...d.map(e=>e.y))+l;s.forEach(e=>{e.y+=c}),r.forEach(e=>{e.in.y+=c,e.out.y+=c});let h=`M ${s[0].x},${s[0].y}`;for(let e=0;e<s.length;e++){const t=(e+1)%s.length;h+=` C ${r[e].out.x},${r[e].out.y} ${r[t].in.x},${r[t].in.y} ${s[t].x},${s[t].y}`}h+=" Z";const f=[...s];r.forEach(e=>f.push(e.in,e.out));const g=f.map(e=>e.x),_=f.map(e=>e.y);return{path:h.trim().replace(/\s+/g," "),bounds:{minX:Math.min(...g),maxX:Math.max(...g),minY:Math.min(..._),maxY:Math.max(..._)}}}_renderTicks(){const e=this.config,t=50,i=[e.cardinal_north,e.cardinal_east,e.cardinal_south,e.cardinal_west],l=[{key:"major",show:e.major_ticks_show,divisions:parseInt(e.major_ticks_divisions)||4,length:e.major_ticks_length,width:e.major_ticks_width,color:e.major_ticks_color,position:e.major_ticks_position||0},{key:"minor",show:e.minor_ticks_show,divisions:parseInt(e.minor_ticks_divisions)||8,length:e.minor_ticks_length,width:e.minor_ticks_width,color:e.minor_ticks_color,position:e.minor_ticks_position||0},{key:"micro",show:e.micro_ticks_show,divisions:parseInt(e.micro_ticks_divisions)||16,length:e.micro_ticks_length,width:e.micro_ticks_width,color:e.micro_ticks_color,position:e.micro_ticks_position||0}],s=e=>Math.round(10*e)/10,a=new Set,o=[];l.forEach(l=>{const n=360/l.divisions;for(let r=0;r<l.divisions;r++){const d=s(r*n);if(a.has(d))continue;if(a.add(d),"major"===l.key&&e.cardinals_show){const l=[0,90,180,270].indexOf(d);if(-1!==l){const s=d*Math.PI/180,a=Math.sin(s),n=Math.cos(s),r=50+(t+(e.cardinals_position||0))*a,c=50-(t+(e.cardinals_position||0))*n,h=.85*e.cardinals_fontsize,f=r-h*a,g=c+h*n;o.push({type:"text",x:f,y:g,letter:i[l],fontSize:e.cardinals_fontsize,fontWeight:e.cardinals_fontweight,color:e.cardinals_fontcolor})}}if(!l.show)continue;const c=d*Math.PI/180,h=Math.sin(c),f=Math.cos(c),g=parseFloat(l.length),_=parseFloat(l.width),p=parseFloat(l.position),m=50+(t+p)*h,u=50-(t+p)*f,v=50+(t+p-g)*h,x=50-(t+p-g)*f;o.push({type:"line",x1:m,y1:u,x2:v,y2:x,color:l.color,width:_})}});const n=(e.markers||[]).map((e,t)=>({show:e.show,degrees:this._markerDegrees[t]??0,height:parseFloat(e.height),width:parseFloat(e.width),position:parseFloat(e.position),color:e.color,flip:e.flip})).map(e=>{if(!e.show)return null;const i=e.degrees*Math.PI/180,l=Math.sin(i),s=Math.cos(i),a=t+e.position,o=a+e.height,n=50+(e.flip?o:a)*l,r=50-(e.flip?o:a)*s,d=50+(e.flip?a:o)*l,c=50-(e.flip?a:o)*s,h=e.width/2,f=d+h*s,g=c+h*l,_=d-h*s,p=c-h*l;return{color:e.color,path:`M ${n},${r} L ${f},${g} L ${_},${p} Z`}}).filter(Boolean);return html`
      <div class="compass-ticks-wrapper">
        <svg class="compass-ticks" viewBox="0 0 100 100" preserveAspectRatio="none">
          ${o.map(e=>"text"===e.type?svg`
              <text
                x="${e.x}" y="${e.y}"
                text-anchor="middle"
                dominant-baseline="central"
                font-size="${e.fontSize}"
                font-weight="${e.fontWeight}"
                fill="${e.color}"
              >${e.letter}</text>
            `:svg`
              <line x1="${e.x1}" y1="${e.y1}" x2="${e.x2}" y2="${e.y2}"
                    stroke="${e.color}" stroke-width="${e.width}" stroke-linecap="round"/>
            `)}
          ${n.map(e=>svg`
            <path d="${e.path}" fill="${e.color}" />
          `)}
        </svg>
      </div>
    `}_fieldStyle(e){return`font-size:${e.fontsize}em; font-weight:${e.fontweight}; color:${e.fontcolor}; top:${e.position}%;`}_unitStyle(e){return`font-size:${e.unit_fontsize/e.fontsize}em; font-weight:${e.unit_fontweight}; color:${e.unit_fontcolor};`}render(){const e=this.config||{},t=e.needles||[],i=this._scale||1,l=this._needleDegrees[0]??0,s=e.compass_rotate?-l:0,a=[{index:1,show:e.field_1_show,unit:e.field_1_unit,fontsize:parseFloat(e.field_1_fontsize),fontweight:e.field_1_fontweight,position:e.field_1_position,fontcolor:e.field_1_fontcolor,unit_fontsize:parseFloat(e.field_1_unit_fontsize),unit_fontweight:e.field_1_unit_fontweight,unit_fontcolor:e.field_1_unit_fontcolor},{index:2,show:e.field_2_show,unit:e.field_2_unit,fontsize:parseFloat(e.field_2_fontsize),fontweight:e.field_2_fontweight,position:e.field_2_position,fontcolor:e.field_2_fontcolor,unit_fontsize:parseFloat(e.field_2_unit_fontsize),unit_fontweight:e.field_2_unit_fontweight,unit_fontcolor:e.field_2_unit_fontcolor},{index:3,show:e.field_3_show,unit:e.field_3_unit,fontsize:parseFloat(e.field_3_fontsize),fontweight:e.field_3_fontweight,position:e.field_3_position,fontcolor:e.field_3_fontcolor,unit_fontsize:parseFloat(e.field_3_unit_fontsize),unit_fontweight:e.field_3_unit_fontweight,unit_fontcolor:e.field_3_unit_fontcolor}],o=(e,t)=>e.show?html`
        <div class="field field-${e.index}" style=${this._fieldStyle(e)}>
          ${t}${e.unit?html`<span style=${this._unitStyle(e)}>${e.unit}</span>`:""}
        </div>
      `:html``,n=(e,t)=>{if(!e.show)return html``;const l=this._needleDegrees[t]??0,s=e.rotate?l+180:l,a=this._buildNeedlePath(parseFloat(e.morph),parseFloat(e.curve),e.invert,parseFloat(e.position)),{minX:o,minY:n,maxX:r,maxY:d}=a.bounds,c=`${o} ${n} ${r-o} ${d-n}`,h=parseFloat(e.width)*i,f=parseFloat(e.height)*i,g=parseFloat(e.position)*i,_=`needleGradient-${t}`,p=`needleClip-${t}`,m=this._needleImageUrls[t]||"",u=e.invert?e.color_2:e.color_1,v=e.invert?100-parseFloat(e.color_2_pos):parseFloat(e.color_1_pos),x=e.invert?e.color_1:e.color_2,b=e.invert?100-parseFloat(e.color_1_pos):parseFloat(e.color_2_pos);return html`
        <div class="compass-needle-wrapper" style="transform:rotate(${s}deg)">
          <svg class="compass-needle"
               style="width:${h}px; height:${f}px; top:calc(0px - ${g}px);"
               viewBox="${c}"
               preserveAspectRatio="none">
            <defs>
              <linearGradient id="${_}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"        stop-color="${u}" />
                <stop offset="${v}%" stop-color="${u}" />
                <stop offset="${b}%" stop-color="${x}" />
                <stop offset="100%"      stop-color="${x}" />
              </linearGradient>
              ${e.image_show&&m?svg`
                <clipPath id="${p}">
                  <path d="${a.path}" />
                </clipPath>
              `:""}
            </defs>
            ${e.image_show&&m?svg`
              <image
                href="${m}"
                x="${o}" y="${n}"
                width="${r-o}" height="${d-n}"
                preserveAspectRatio="xMidYMid slice"
                clip-path="url(#${p})"
                transform="translate(${(r+o)/2}, ${(d+n)/2}) rotate(${e.image_rotate}) scale(${e.image_scale/100}) translate(${e.image_x}, ${e.image_y}) translate(${-(r+o)/2}, ${-(d+n)/2})"
              />
            `:svg`
              <path d="${a.path}" fill="url(#${_})" />
            `}
          </svg>
        </div>
      `};return html`
      <ha-card>
        ${e.header_show?html`
          <div class="card-header-text" style="font-size:${e.header_fontsize}em; font-weight:${e.header_fontweight}; color:${e.header_fontcolor}; transform:translateY(calc(10px + ${e.header_position}px));">
            ${this._headerValue}
          </div>
        `:""}
        <div class="compass-container">
          <div class="compass-circle">
            ${e.background_image_show&&this._backgroundImageUrl?html`
              <img class="compass-bg-image"
                src="${this._backgroundImageUrl}"
                style="transform: translate(-50%, -50%) translate(${e.background_image_x}%, ${e.background_image_y}%) rotate(${e.background_image_rotate}deg) scale(${e.background_image_scale/100});"
              />
            `:""}
            ${o(a[0],this._field1Value)}
            ${o(a[1],this._field2Value)}
            ${o(a[2],this._field3Value)}
          </div>
          <div class="compass-rotate-wrapper" style="transform:rotate(${s}deg)">
            ${this._renderTicks()}
            ${[...t].reverse().map((e,i)=>n(e,t.length-1-i))}
          </div>
        </div>
        ${e.footer_show?html`
          <div class="card-footer-text" style="font-size:${e.footer_fontsize}em; font-weight:${e.footer_fontweight}; color:${e.footer_fontcolor}; transform:translateY(calc(-10px + ${e.footer_position}px));">
            ${this._footerValue}
          </div>
        `:""}
      </ha-card>
    `}static styles=css`
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
  `;static getCardSize(){return 4}static getConfigElement(){return document.createElement("custom-compass-card-editor")}static getStubConfig(){return{...DEFAULT_CONFIG}}}customElements.define("custom-compass-card",CustomCompassCard),console.info("%c CUSTOM-COMPASS-CARD %c v3.8.225 ","background-color: #29b6cf; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 3px 0 0 3px;","background-color: #1e1e1e; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 0 3px 3px 0;"),window.customCards=window.customCards||[],window.customCards.push({type:"custom-compass-card",name:"Custom Compass Card",description:"A fully configurable compass card with dynamic fields.",preview:!0,config:CustomCompassCard.getStubConfig()});