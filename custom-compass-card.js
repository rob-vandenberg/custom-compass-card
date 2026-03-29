import{LitElement,html,svg,css}from"https://unpkg.com/lit@2.0.0/index.js?module";const CARD_VERSION="3.6.129",DEFAULT_CONFIG={compass_entity:"sun.sun",compass_attribute:"azimuth",compass_adjustment:0,background_color:"#101010",bezel_color:"#383838",bezel_width:16,bezel_size:0,background_image_show:!1,background_image_url:"/local/community/custom-compass-card/earth.png",background_image_scale:154,background_image_x:-8,background_image_y:16,background_image_rotate:0,needle_show:!0,needle_invert:!1,needle_rotate:!1,needle_color_1:"#FF0000",needle_color_1_pos:50,needle_color_2:"#EEEEEE",needle_color_2_pos:50,needle_height:100,needle_width:10,needle_position:-10,needle_morph:50,needle_curve:0,needle_image_show:!1,needle_image_url:"/local/community/custom-compass-card/moon.png",needle_image_scale:100,needle_image_x:0,needle_image_y:0,needle_image_rotate:0,compass_rotate:!1,marker_1_show:!1,marker_1_degrees:"45",marker_1_length:5,marker_1_width:4,marker_1_position:0,marker_1_color:"#FF0000",marker_2_show:!1,marker_2_degrees:"315",marker_2_length:5,marker_2_width:4,marker_2_position:0,marker_2_color:"#2196F3",cardinals_show:!0,cardinal_north:"N",cardinal_east:"E",cardinal_south:"S",cardinal_west:"W",cardinals_fontsize:10,cardinals_fontweight:400,cardinals_position:1.5,cardinals_fontcolor:"#EEEEEE",major_ticks_show:!1,major_ticks_length:6,major_ticks_width:2,major_ticks_position:-3.5,major_ticks_color:"#CCCCCC",minor_ticks_show:!0,minor_ticks_length:3,minor_ticks_width:1.5,minor_ticks_position:-4.5,minor_ticks_color:"#AAAAAA",micro_ticks_show:!0,micro_ticks_length:0,micro_ticks_width:2,micro_ticks_position:-6.5,micro_ticks_color:"#888888",header_show:!1,header_text:"header",header_fontsize:2,header_fontweight:400,header_position:0,header_fontcolor:"#FFFFFF",footer_show:!1,footer_text:"footer",footer_fontsize:2,footer_fontweight:400,footer_position:0,footer_fontcolor:"#FFFFFF",field_1_show:!0,field_1_template:"${compass_direction}",field_1_fontsize:1.5,field_1_fontweight:400,field_1_position:23,field_1_fontcolor:"#29B6CF",field_1_unit:"",field_1_unit_fontsize:1,field_1_unit_fontweight:400,field_1_unit_fontcolor:"#196D7C",field_2_show:!1,field_2_template:"{{ states('sensor.ws_wind_speed') | round(1) }}",field_2_unit:"km/h",field_2_fontsize:2,field_2_fontweight:400,field_2_position:50,field_2_fontcolor:"#E8E8E8",field_2_unit_fontsize:1.2,field_2_unit_fontweight:400,field_2_unit_fontcolor:"#8C8C8C",field_3_show:!0,field_3_template:"{{ state_attr('sun.sun', 'azimuth') | round(0) }}",field_3_unit:"°",field_3_fontsize:1.4,field_3_fontweight:400,field_3_position:79,field_3_fontcolor:"#808080",field_3_unit_fontsize:1.4,field_3_unit_fontweight:400,field_3_unit_fontcolor:"#606060",rotation_animation_time:.5};class CustomCompassCardEditor extends LitElement{static properties={hass:{type:Object},_config:{type:Object}};setConfig(e){this._config={...DEFAULT_CONFIG,...e},this.loadCardHelpers()}async loadCardHelpers(){if(!window.customElements.get("ha-entity-picker")){const e=await window.loadCardHelpers(),t=await e.createCardElement({type:"entities",entities:[]});await t.constructor.getConfigElement()}}_valueChanged(e,t){if(!this._config||!this.hass)return;let i;i=void 0!==t.detail?.value?t.detail.value:"HA-SWITCH"===t.target.tagName?t.target.checked:t.target.value,"number"===t.target.type&&(i=parseFloat(i),isNaN(i))||(this._config={...this._config,[e]:i},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0})))}_colorPicker(e,t){const i=this._config[e]||"#ffffff";return html`
      <div class="color-field">
        <label>${t}</label>
        <div class="color-row">
          <input
            type="color"
            .value=${i.length>=7?i.substring(0,7):i}
            @input=${t=>this._valueChanged(e,t)}
          />
          <ha-textfield
            .value=${i}
            placeholder="#RRGGBB or #RRGGBBAA"
            @input=${t=>this._valueChanged(e,t)}
          ></ha-textfield>
        </div>
      </div>
    `}render(){if(!this.hass||!this._config)return html``;const e=this._config;return html`

      <ha-expansion-panel header="Compass configuration" outlined>

      <!-- Entity -->
      <div class="compass-entity-grid">
        <div class="text-field">
          <label>Compass entity</label>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${e.compass_entity}
            .includeDomains=${["sensor"]}
            allow-custom-entity
            @value-changed=${e=>this._valueChanged("compass_entity",e)}
          ></ha-entity-picker>
        </div>
        <div class="text-field">
          <label>Attribute</label>
          <ha-textfield
            .value=${e.compass_attribute}
            @input=${e=>this._valueChanged("compass_attribute",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Adjustment</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(e.compass_adjustment)}
            @input=${e=>this._valueChanged("compass_adjustment",e)}
          ></ha-textfield>
        </div>
      </div>

      <!-- Compass styling -->
      <div class="compass-styling-grid">
        ${this._colorPicker("background_color","Background")}
        ${this._colorPicker("bezel_color","Bezel color")}
        <div class="text-field">
          <label>Bezel width</label>
          <ha-textfield
            type="number" step="1" min="0"
            .value=${String(e.bezel_width)}
            @input=${e=>this._valueChanged("bezel_width",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Bezel size</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(e.bezel_size)}
            @input=${e=>this._valueChanged("bezel_size",e)}
          ></ha-textfield>
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
          <ha-textfield
            .value=${String(e.background_image_url)}
            @input=${e=>this._valueChanged("background_image_url",e)}
          ></ha-textfield>
        </div>
      </div>
      <div class="background-image-styling-grid">
        <div class="text-field">
          <label>Scale (%)</label>
          <ha-textfield
            type="number" step="1" min="1"
            .value=${String(e.background_image_scale)}
            @input=${e=>this._valueChanged("background_image_scale",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>X pos</label>
          <ha-textfield
            type="number" step="0.5"
            .value=${String(e.background_image_x)}
            @input=${e=>this._valueChanged("background_image_x",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Y pos</label>
          <ha-textfield
            type="number" step="0.5"
            .value=${String(e.background_image_y)}
            @input=${e=>this._valueChanged("background_image_y",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Rotate</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(e.background_image_rotate)}
            @input=${e=>this._valueChanged("background_image_rotate",e)}
          ></ha-textfield>
        </div>
      </div>

      </ha-expansion-panel>

      <ha-expansion-panel header="Needle configuration" outlined>

      <!-- Needle toggles -->
      <div class="needle-toggles-grid">
        <div class="toggle-field">
          <label>Show needle</label>
          <ha-switch
            .checked=${e.needle_show}
            @change=${e=>this._valueChanged("needle_show",e)}
          ></ha-switch>
        </div>  
        <div class="toggle-field">
          <label>Invert needle</label>
          <ha-switch
            .checked=${e.needle_invert}
            @change=${e=>this._valueChanged("needle_invert",e)}
          ></ha-switch>
        </div>  
        <div class="toggle-field">
          <label>Rotate needle</label>
          <ha-switch
            .checked=${e.needle_rotate}
            @change=${e=>this._valueChanged("needle_rotate",e)}
          ></ha-switch>
        </div>  
      </div>

      <!-- Needle colors -->
      <div class="needle-color-grid">
        ${this._colorPicker("needle_color_1","Needle color 1")}
        <div class="text-field">
          <label>Pos (%)</label>
          <ha-textfield
            type="number" step="1" min="0" max="100"
            .value=${String(e.needle_color_1_pos)}
            @input=${e=>this._valueChanged("needle_color_1_pos",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("needle_color_2","Needle color 2")}
        <div class="text-field">
          <label>Pos (%)</label>
          <ha-textfield
            type="number" step="1" min="0" max="100"
            .value=${String(e.needle_color_2_pos)}
            @input=${e=>this._valueChanged("needle_color_2_pos",e)}
          ></ha-textfield>
        </div>
      </div>

      <!-- Needle dimensions -->
      <div class="needle-dimensions-grid">
        <div class="text-field">
          <label>Height</label>
          <ha-textfield
            type="number" step="1" min="4"
            .value=${String(e.needle_height)}
            @input=${e=>this._valueChanged("needle_height",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <ha-textfield
            type="number" step="1" min="1"
            .value=${String(e.needle_width)}
            @input=${e=>this._valueChanged("needle_width",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(e.needle_position)}
            @input=${e=>this._valueChanged("needle_position",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Morph</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(e.needle_morph)}
            @input=${e=>this._valueChanged("needle_morph",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Curve</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(e.needle_curve)}
            @input=${e=>this._valueChanged("needle_curve",e)}
          ></ha-textfield>
        </div>
      </div>

      <!-- Needle image -->
      <div class="needle-image-toggles-grid">
        <div class="toggle-field">
          <label>Needle image</label>
          <ha-switch
            .checked=${e.needle_image_show}
            @change=${e=>this._valueChanged("needle_image_show",e)}
          ></ha-switch>
        </div>
      </div>
      <div class="needle-image-template-grid">
        <div class="text-field">
          <label>URL (jinja template allowed)</label>
          <ha-textfield
            .value=${String(e.needle_image_url)}
            @input=${e=>this._valueChanged("needle_image_url",e)}
          ></ha-textfield>
        </div>
      </div>
      <div class="needle-image-styling-grid">
        <div class="text-field">
          <label>Scale (%)</label>
          <ha-textfield
            type="number" step="1" min="1"
            .value=${String(e.needle_image_scale)}
            @input=${e=>this._valueChanged("needle_image_scale",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>X pos</label>
          <ha-textfield
            type="number" step="0.5"
            .value=${String(e.needle_image_x)}
            @input=${e=>this._valueChanged("needle_image_x",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Y pos</label>
          <ha-textfield
            type="number" step="0.5"
            .value=${String(e.needle_image_y)}
            @input=${e=>this._valueChanged("needle_image_y",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Rotate</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(e.needle_image_rotate)}
            @input=${e=>this._valueChanged("needle_image_rotate",e)}
          ></ha-textfield>
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
          <span class="toggle-hint">(locks the needle and rotates the compass)</span>
        </div>
      </div>

      </ha-expansion-panel>

      <ha-expansion-panel header="Markers configuration" outlined>

      <!-- Marker 1 -->
      <div class="marker-toggles-grid">
        <div class="toggle-field">
          <label>Show marker 1</label>
          <ha-switch
            .checked=${e.marker_1_show}
            @change=${e=>this._valueChanged("marker_1_show",e)}
          ></ha-switch>
        </div>
      </div>
      <div class="marker-template-grid">
        <div class="text-field">
          <label>Degrees (jinja template allowed)</label>
          <ha-textfield
            .value=${String(e.marker_1_degrees)}
            @input=${e=>this._valueChanged("marker_1_degrees",e)}
          ></ha-textfield>
        </div>
      </div>
      <div class="marker-styling-grid">
        <div class="text-field">
          <label>Length</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(e.marker_1_length)}
            @input=${e=>this._valueChanged("marker_1_length",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(e.marker_1_width)}
            @input=${e=>this._valueChanged("marker_1_width",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="0.5"
            .value=${String(e.marker_1_position)}
            @input=${e=>this._valueChanged("marker_1_position",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("marker_1_color","Color")}
      </div>

      <!-- Marker 2 -->
      <div class="marker-toggles-grid">
        <div class="toggle-field">
          <label>Show marker 2</label>
          <ha-switch
            .checked=${e.marker_2_show}
            @change=${e=>this._valueChanged("marker_2_show",e)}
          ></ha-switch>
        </div>
      </div>
      <div class="marker-template-grid">
        <div class="text-field">
          <label>Degrees (jinja template allowed)</label>
          <ha-textfield
            .value=${String(e.marker_2_degrees)}
            @input=${e=>this._valueChanged("marker_2_degrees",e)}
          ></ha-textfield>
        </div>
      </div>
      <div class="marker-styling-grid">
        <div class="text-field">
          <label>Length</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(e.marker_2_length)}
            @input=${e=>this._valueChanged("marker_2_length",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(e.marker_2_width)}
            @input=${e=>this._valueChanged("marker_2_width",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="0.5"
            .value=${String(e.marker_2_position)}
            @input=${e=>this._valueChanged("marker_2_position",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("marker_2_color","Color")}
      </div>

      </ha-expansion-panel>

      <ha-expansion-panel header="Ticks configuration" outlined>

      <!-- Cardinal labels -->
      <div class="tick-toggles-grid">
        <div class="toggle-field">
          <label>Cardinal labels</label>
          <ha-switch
            .checked=${e.cardinals_show}
            @change=${e=>{this._valueChanged("cardinals_show",e),e.target.checked&&this._valueChanged("major_ticks_show",{target:{tagName:"HA-SWITCH",checked:!1}})}}
          ></ha-switch>
        </div>
      </div>
      <div class="cardinal-labels-grid">
        <div class="text-field">
          <label>North</label>
          <ha-textfield
            .value=${e.cardinal_north}
            @input=${e=>this._valueChanged("cardinal_north",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>East</label>
          <ha-textfield
            .value=${e.cardinal_east}
            @input=${e=>this._valueChanged("cardinal_east",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>South</label>
          <ha-textfield
            .value=${e.cardinal_south}
            @input=${e=>this._valueChanged("cardinal_south",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>West</label>
          <ha-textfield
            .value=${e.cardinal_west}
            @input=${e=>this._valueChanged("cardinal_west",e)}
          ></ha-textfield>
        </div>
      </div>
      <div class="tick-styling-grid">
        <div class="text-field">
          <label>Font size</label>
          <ha-textfield
            type="number" step="0.5" min="0"
            .value=${String(e.cardinals_fontsize)}
            @input=${e=>this._valueChanged("cardinals_fontsize",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <ha-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(e.cardinals_fontweight)}
            @input=${e=>this._valueChanged("cardinals_fontweight",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="0.5"
            .value=${String(e.cardinals_position)}
            @input=${e=>this._valueChanged("cardinals_position",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("cardinals_fontcolor","Color")}
      </div>

      <!-- Primary ticks -->
      <div class="tick-toggles-grid">
        <div class="toggle-field">
          <label>Primary ticks</label>
          <ha-switch
            .checked=${e.major_ticks_show}
            @change=${e=>{this._valueChanged("major_ticks_show",e),e.target.checked&&this._valueChanged("cardinals_show",{target:{tagName:"HA-SWITCH",checked:!1}})}}
          ></ha-switch>
        </div>
      </div>
      <div class="tick-styling-grid">
        <div class="text-field">
          <label>Length</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(e.major_ticks_length)}
            @input=${e=>this._valueChanged("major_ticks_length",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(e.major_ticks_width)}
            @input=${e=>this._valueChanged("major_ticks_width",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="0.5"
            .value=${String(e.major_ticks_position)}
            @input=${e=>this._valueChanged("major_ticks_position",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("major_ticks_color","Color")}
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
          <label>Length</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(e.minor_ticks_length)}
            @input=${e=>this._valueChanged("minor_ticks_length",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(e.minor_ticks_width)}
            @input=${e=>this._valueChanged("minor_ticks_width",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="0.5"
            .value=${String(e.minor_ticks_position)}
            @input=${e=>this._valueChanged("minor_ticks_position",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("minor_ticks_color","Color")}
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
          <label>Length</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(e.micro_ticks_length)}
            @input=${e=>this._valueChanged("micro_ticks_length",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(e.micro_ticks_width)}
            @input=${e=>this._valueChanged("micro_ticks_width",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="0.5"
            .value=${String(e.micro_ticks_position)}
            @input=${e=>this._valueChanged("micro_ticks_position",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("micro_ticks_color","Color")}
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
          <ha-textfield
            .value=${e.header_text}
            @input=${e=>this._valueChanged("header_text",e)}
          ></ha-textfield>
        </div>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Font size</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(e.header_fontsize)}
            @input=${e=>this._valueChanged("header_fontsize",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <ha-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(e.header_fontweight)}
            @input=${e=>this._valueChanged("header_fontweight",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(e.header_position)}
            @input=${e=>this._valueChanged("header_position",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("header_fontcolor","Color")}
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
          <ha-textfield
            .value=${e.footer_text}
            @input=${e=>this._valueChanged("footer_text",e)}
          ></ha-textfield>
        </div>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Font size</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(e.footer_fontsize)}
            @input=${e=>this._valueChanged("footer_fontsize",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <ha-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(e.footer_fontweight)}
            @input=${e=>this._valueChanged("footer_fontweight",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(e.footer_position)}
            @input=${e=>this._valueChanged("footer_position",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("footer_fontcolor","Color")}
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
          <ha-textfield
            .value=${e.field_1_template}
            @input=${e=>this._valueChanged("field_1_template",e)}
          ></ha-textfield>
        </div>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Font size</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(e.field_1_fontsize)}
            @input=${e=>this._valueChanged("field_1_fontsize",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <ha-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(e.field_1_fontweight)}
            @input=${e=>this._valueChanged("field_1_fontweight",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position (%)</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(e.field_1_position)}
            @input=${e=>this._valueChanged("field_1_position",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("field_1_fontcolor","Color")}
      </div>
      <div class="field-unit-grid">
        <div class="text-field">
          <label>Unit</label>
          <ha-textfield
            .value=${e.field_1_unit}
            @input=${e=>this._valueChanged("field_1_unit",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Size</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(e.field_1_unit_fontsize)}
            @input=${e=>this._valueChanged("field_1_unit_fontsize",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Weight</label>
          <ha-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(e.field_1_unit_fontweight)}
            @input=${e=>this._valueChanged("field_1_unit_fontweight",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("field_1_unit_fontcolor","Color")}
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
          <ha-textfield
            .value=${e.field_2_template}
            @input=${e=>this._valueChanged("field_2_template",e)}
          ></ha-textfield>
        </div>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Font size</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(e.field_2_fontsize)}
            @input=${e=>this._valueChanged("field_2_fontsize",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <ha-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(e.field_2_fontweight)}
            @input=${e=>this._valueChanged("field_2_fontweight",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position (%)</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(e.field_2_position)}
            @input=${e=>this._valueChanged("field_2_position",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("field_2_fontcolor","Color")}
      </div>
      <div class="field-unit-grid">
        <div class="text-field">
          <label>Unit</label>
          <ha-textfield
            .value=${e.field_2_unit}
            @input=${e=>this._valueChanged("field_2_unit",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Size</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(e.field_2_unit_fontsize)}
            @input=${e=>this._valueChanged("field_2_unit_fontsize",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Weight</label>
          <ha-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(e.field_2_unit_fontweight)}
            @input=${e=>this._valueChanged("field_2_unit_fontweight",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("field_2_unit_fontcolor","Color")}
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
          <ha-textfield
            .value=${e.field_3_template}
            @input=${e=>this._valueChanged("field_3_template",e)}
          ></ha-textfield>
        </div>
      </div>
      <div class="field-styling-grid">
        <div class="text-field">
          <label>Font size</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(e.field_3_fontsize)}
            @input=${e=>this._valueChanged("field_3_fontsize",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Font weight</label>
          <ha-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(e.field_3_fontweight)}
            @input=${e=>this._valueChanged("field_3_fontweight",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position (%)</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(e.field_3_position)}
            @input=${e=>this._valueChanged("field_3_position",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("field_3_fontcolor","Color")}
      </div>
      <div class="field-unit-grid">
        <div class="text-field">
          <label>Unit</label>
          <ha-textfield
            .value=${e.field_3_unit}
            @input=${e=>this._valueChanged("field_3_unit",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Size</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(e.field_3_unit_fontsize)}
            @input=${e=>this._valueChanged("field_3_unit_fontsize",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Weight</label>
          <ha-textfield
            type="number" step="100" min="100" max="900"
            .value=${String(e.field_3_unit_fontweight)}
            @input=${e=>this._valueChanged("field_3_unit_fontweight",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("field_3_unit_fontcolor","Color")}
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

    .compass-entity-grid {
      display: grid;
      grid-template-columns: 5fr 4fr 3fr;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 16px;
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

    .rotate-compass-toggle-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 28px;
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

    .marker-template-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 8px;
    }

    .marker-styling-grid {
      display: grid;
      grid-template-columns: 2fr 2fr 2fr 3fr;
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
      align-items: center;
    }
    .toggle-field label {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      min-width: 98px;
    }
    .toggle-hint {
      font-size: 11px;
      color: var(--disabled-text-color, #888);
      margin-left: 6px;
      font-style: italic;
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
  `}customElements.define("custom-compass-card-editor",CustomCompassCardEditor);class CustomCompassCard extends LitElement{static properties={hass:{type:Object},config:{type:Object},_degrees:{type:Number},_field1Value:{type:String},_field2Value:{type:String},_field3Value:{type:String},_headerValue:{type:String},_footerValue:{type:String},_marker1Degrees:{type:Number},_marker2Degrees:{type:Number},_backgroundImageUrl:{type:String},_needleImageUrl:{type:String},_error:{type:Boolean}};constructor(){super(),this._degrees=0,this._prevDegrees=null,this._templatesDirty=!1,this._field1Value="",this._field2Value="",this._field3Value="",this._headerValue="",this._footerValue="",this._marker1Degrees=0,this._marker2Degrees=0,this._backgroundImageUrl="",this._needleImageUrl="",this._error=!1}setConfig(e){if(!e.compass_entity)throw new Error("You must define a compass_entity.");this.config={...DEFAULT_CONFIG,...e}}willUpdate(e){if(!e.has("hass")||!this.config?.compass_entity)return;const t=this.hass.states[this.config.compass_entity];if(t){let e=t.state;const i=this.config.compass_attribute;if(i&&"string"==typeof i&&""!==i.trim()){const l=t.attributes[i.trim()];null===l||isNaN(parseFloat(l))||(e=l)}const l=parseFloat(e);if(isNaN(l))this._degrees=0,this._prevDegrees=null,this._templatesDirty=!0,this._error=!0;else{const e=((l+(parseFloat(this.config.compass_adjustment)||0))%360+360)%360;if(e!==this._prevDegrees){let t=e-(this._degrees%360+360)%360;t>180&&(t-=360),t<-180&&(t+=360),this._degrees=this._degrees+t,this._prevDegrees=e,this._templatesDirty=!0}this._error=!1}}else this._degrees=0,this._prevDegrees=null,this._templatesDirty=!0,this._error=!0}async _updateTemplates(){this._templatesDirty=!1;const e=[{index:1,show:this.config.field_1_show,template:this.config.field_1_template},{index:2,show:this.config.field_2_show,template:this.config.field_2_template},{index:3,show:this.config.field_3_show,template:this.config.field_3_template}];for(const t of e)t.show?this._error?this[`_field${t.index}Value`]="Error":t.template&&(this[`_field${t.index}Value`]=await this._evaluateTemplate(t.template,this._degrees)):this[`_field${t.index}Value`]="";this.config.header_show&&this.config.header_text?this._headerValue=await this._evaluateTemplate(this.config.header_text,this._degrees):this._headerValue="",this.config.footer_show&&this.config.footer_text?this._footerValue=await this._evaluateTemplate(this.config.footer_text,this._degrees):this._footerValue="";const t=await this._evaluateTemplate(String(this.config.marker_1_degrees),this._degrees);this._marker1Degrees=(parseFloat(t)%360+360)%360;const i=await this._evaluateTemplate(String(this.config.marker_2_degrees),this._degrees);this._marker2Degrees=(parseFloat(i)%360+360)%360,this.config.background_image_show?this._backgroundImageUrl=await this._evaluateTemplate(String(this.config.background_image_url),this._degrees):this._backgroundImageUrl="",this.config.needle_image_show?this._needleImageUrl=await this._evaluateTemplate(String(this.config.needle_image_url),this._degrees):this._needleImageUrl=""}updated(e){super.updated(e),this._scaleElements(),this._templatesDirty&&this._updateTemplates()}_scaleElements(){const e=this.shadowRoot.querySelector(".compass-circle");if(!e)return;const t=e.offsetWidth,i=t/120;this.style.setProperty("--cc-font-size",.08*t+"px");const l=parseFloat(this.config.bezel_width),a=parseFloat(this.config.bezel_size);this.style.setProperty("--cc-circle-border-width",l*i+"px"),this.style.setProperty("--cc-circle-color",this.config.bezel_color),this.style.setProperty("--cc-bg-color",this.config.background_color),this.style.setProperty("--cc-border-size",`${a}px`);const s=parseFloat(this.config.needle_width),o=parseFloat(this.config.needle_height),d=parseFloat(this.config.needle_position);this.style.setProperty("--cc-needle-width",s*i+"px"),this.style.setProperty("--cc-needle-height",o*i+"px"),this.style.setProperty("--cc-needle-position",d*i+"px"),this.style.setProperty("--cc-animation-duration",`${this.config.rotation_animation_time}s`);const n=this.shadowRoot.querySelector(".compass-ticks-wrapper");n&&this.style.setProperty("--cc-circle-size",`${n.offsetWidth}px`)}async _evaluateTemplate(e,t){try{const i=e.replace("${compass_direction}",this.getCompassDirection(t));if(!i.includes("{{"))return i;return await this.hass.callApi("POST","template",{template:i})}catch(t){return console.error("CustomCompassCard: Error evaluating template:",e,t),"Error"}}getCompassDirection(e){const t=(e%360+360)%360,i=this.config.cardinal_north,l=this.config.cardinal_east,a=this.config.cardinal_south,s=this.config.cardinal_west;return[i,i+i+l,i+l,l+i+l,l,l+a+l,a+l,a+a+l,a,a+a+s,a+s,s+a+s,s,s+i+s,i+s,i+i+s][Math.floor((t+11.25)/22.5)%16]}_buildNeedlePath(e,t,i,l){let a=[{x:50,y:0},{x:0,y:50},{x:50,y:50+e},{x:100,y:50}];const s=Math.abs(e)/50,o=Math.sign(e)*Math.min(1,Math.abs(e)/50)*(Math.PI/2);let d=[{in:{x:1,y:0},out:{x:-1,y:0},lengthMultiplier:1},{in:{x:0,y:-1},out:{x:Math.cos(o),y:Math.sin(o)},lengthMultiplier:1},{in:{x:-1,y:0},out:{x:1,y:0},lengthMultiplier:s},{in:{x:-Math.cos(o),y:Math.sin(o)},out:{x:0,y:-1},lengthMultiplier:1}];i&&(a.forEach(e=>{e.y=-e.y}),d.forEach(e=>{e.in.y=-e.in.y,e.out.y=-e.out.y}));const n=a.map((e,i)=>{const l=t*d[i].lengthMultiplier;return{in:{x:e.x+d[i].in.x*l,y:e.y+d[i].in.y*l},out:{x:e.x+d[i].out.x*l,y:e.y+d[i].out.y*l}}}),r=[...a];n.forEach(e=>r.push(e.in,e.out));const h=-Math.min(...r.map(e=>e.y))+l;a.forEach(e=>{e.y+=h}),n.forEach(e=>{e.in.y+=h,e.out.y+=h});let c=`M ${a[0].x},${a[0].y}`;for(let e=0;e<a.length;e++){const t=(e+1)%a.length;c+=` C ${n[e].out.x},${n[e].out.y} ${n[t].in.x},${n[t].in.y} ${a[t].x},${a[t].y}`}c+=" Z";const _=[...a];n.forEach(e=>_.push(e.in,e.out));const g=_.map(e=>e.x),p=_.map(e=>e.y);return{path:c.trim().replace(/\s+/g," "),bounds:{minX:Math.min(...g),maxX:Math.max(...g),minY:Math.min(...p),maxY:Math.max(...p)}}}_renderTicks(e="none"){const t=this.config,i=50,l=[t.cardinal_north,t.cardinal_east,t.cardinal_south,t.cardinal_west],a=[0,4,8,12],s={major:{show:t.major_ticks_show,length:t.major_ticks_length,width:t.major_ticks_width,color:t.major_ticks_color,position:t.major_ticks_position||0,cardinals:t.cardinals_show,cardinal_color:t.cardinals_fontcolor,cardinal_fontsize:t.cardinals_fontsize,cardinal_fontweight:t.cardinals_fontweight,cardinal_position:t.cardinals_position||0},minor:{show:t.minor_ticks_show,length:t.minor_ticks_length,width:t.minor_ticks_width,color:t.minor_ticks_color,position:t.minor_ticks_position||0,cardinals:!1},micro:{show:t.micro_ticks_show,length:t.micro_ticks_length,width:t.micro_ticks_width,color:t.micro_ticks_color,position:t.micro_ticks_position||0,cardinals:!1}},o=Array.from({length:16},(e,t)=>{const o=s[t%4==0?"major":t%2==0?"minor":"micro"],d=o.show,n=parseFloat(o.length),r=parseFloat(o.width),h=o.color,c=parseFloat(o.position),_=22.5*t*Math.PI/180,g=Math.sin(_),p=Math.cos(_);if(o.cardinals){const e=a.indexOf(t),s=l[e],d=50+(i+o.cardinal_position)*g,n=50-(i+o.cardinal_position)*p,r=.85*o.cardinal_fontsize;return{show:!0,type:"text",x:d-r*g,y:n+r*p,letter:s,fontSize:o.cardinal_fontsize,fontWeight:o.cardinal_fontweight,color:o.cardinal_color}}return{show:d,type:"line",x1:50+(i+c)*g,y1:50-(i+c)*p,x2:50+(i+c-n)*g,y2:50-(i+c-n)*p,color:h,width:r}}),d=[{show:t.marker_1_show,degrees:this._marker1Degrees,length:parseFloat(t.marker_1_length),width:parseFloat(t.marker_1_width),position:parseFloat(t.marker_1_position),color:t.marker_1_color},{show:t.marker_2_show,degrees:this._marker2Degrees,length:parseFloat(t.marker_2_length),width:parseFloat(t.marker_2_width),position:parseFloat(t.marker_2_position),color:t.marker_2_color}].map(e=>{if(!e.show)return null;const t=e.degrees*Math.PI/180,l=Math.sin(t),a=Math.cos(t),s=i+e.position,o=50+s*l,d=50-s*a,n=s+e.length,r=50+n*l,h=50-n*a,c=e.width/2,_=r+c*a,g=h+c*l,p=r-c*a,f=h-c*l;return{color:e.color,path:`M ${o},${d} L ${_},${g} L ${p},${f} Z`}}).filter(Boolean);return html`
      <div class="compass-ticks-wrapper" style="transform:${e}">
        <svg class="compass-ticks" viewBox="0 0 100 100" preserveAspectRatio="none">
          ${o.map(e=>e.show?"text"===e.type?svg`
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
            `:"")}
          ${d.map(e=>svg`
            <path d="${e.path}" fill="${e.color}" />
          `)}
        </svg>
      </div>
    `}_fieldStyle(e){return`font-size:${e.fontsize}em; font-weight:${e.fontweight}; color:${e.fontcolor}; top:${e.position}%;`}_unitStyle(e){return`font-size:${e.unit_fontsize/e.fontsize}em; font-weight:${e.unit_fontweight}; color:${e.unit_fontcolor};`}render(){const e=this.config||{};let t,i;e.compass_rotate?(i=`rotate(${-this._degrees}deg)`,t=`rotate(${e.needle_rotate?180:0}deg)`):(i="none",t=`rotate(${e.needle_rotate?this._degrees+180:this._degrees}deg)`);const l=[{index:1,show:e.field_1_show,unit:e.field_1_unit,fontsize:parseFloat(e.field_1_fontsize),fontweight:e.field_1_fontweight,position:e.field_1_position,fontcolor:e.field_1_fontcolor,unit_fontsize:parseFloat(e.field_1_unit_fontsize),unit_fontweight:e.field_1_unit_fontweight,unit_fontcolor:e.field_1_unit_fontcolor},{index:2,show:e.field_2_show,unit:e.field_2_unit,fontsize:parseFloat(e.field_2_fontsize),fontweight:e.field_2_fontweight,position:e.field_2_position,fontcolor:e.field_2_fontcolor,unit_fontsize:parseFloat(e.field_2_unit_fontsize),unit_fontweight:e.field_2_unit_fontweight,unit_fontcolor:e.field_2_unit_fontcolor},{index:3,show:e.field_3_show,unit:e.field_3_unit,fontsize:parseFloat(e.field_3_fontsize),fontweight:e.field_3_fontweight,position:e.field_3_position,fontcolor:e.field_3_fontcolor,unit_fontsize:parseFloat(e.field_3_unit_fontsize),unit_fontweight:e.field_3_unit_fontweight,unit_fontcolor:e.field_3_unit_fontcolor}],a=(e,t)=>e.show?html`
        <div class="field field-${e.index}" style=${this._fieldStyle(e)}>
          ${t}${e.unit?html`<span style=${this._unitStyle(e)}>${e.unit}</span>`:""}
        </div>
      `:html``,s=parseFloat(e.needle_morph),o=parseFloat(e.needle_curve),d=parseFloat(e.needle_position),n=this._buildNeedlePath(s,o,e.needle_invert,d),{minX:r,minY:h,maxX:c,maxY:_}=n.bounds,g=`${r} ${h} ${c-r} ${_-h}`,p=e.needle_invert?e.needle_color_2:e.needle_color_1,f=e.needle_invert?100-parseFloat(e.needle_color_2_pos):parseFloat(e.needle_color_1_pos),m=e.needle_invert?e.needle_color_1:e.needle_color_2,u=e.needle_invert?100-parseFloat(e.needle_color_1_pos):parseFloat(e.needle_color_2_pos);return html`
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
            ${a(l[0],this._field1Value)}
            ${a(l[1],this._field2Value)}
            ${a(l[2],this._field3Value)}
          </div>
          ${this._renderTicks(i)}
          <div class="compass-needle-wrapper" style="transform:${t}">
            ${e.needle_show?html`
              <svg class="compass-needle"
                   viewBox="${g}"
                   preserveAspectRatio="none">
                <defs>
                  <linearGradient id="needleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"        stop-color="${p}" />
                    <stop offset="${f}%" stop-color="${p}" />
                    <stop offset="${u}%" stop-color="${m}" />
                    <stop offset="100%"      stop-color="${m}" />
                  </linearGradient>
                  ${e.needle_image_show&&this._needleImageUrl?svg`
                    <clipPath id="needleClip">
                      <path d="${n.path}" />
                    </clipPath>
                  `:""}
                </defs>
                ${e.needle_image_show&&this._needleImageUrl?svg`
                  <image
                    href="${this._needleImageUrl}"
                    x="${r}" y="${h}"
                    width="${c-r}" height="${_-h}"
                    preserveAspectRatio="xMidYMid slice"
                    clip-path="url(#needleClip)"
                    transform="translate(${(c+r)/2}, ${(_+h)/2}) rotate(${e.needle_image_rotate}) scale(${e.needle_image_scale/100}) translate(${e.needle_image_x}, ${e.needle_image_y}) translate(${-(c+r)/2}, ${-(_+h)/2})"
                  />
                `:svg`
                  <path d="${n.path}" fill="url(#needleGradient)" />
                `}
              </svg>
            `:""}
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
  `;static getCardSize(){return 4}static getConfigElement(){return document.createElement("custom-compass-card-editor")}static getStubConfig(){return{...DEFAULT_CONFIG}}}customElements.define("custom-compass-card",CustomCompassCard),console.info("%c CUSTOM-COMPASS-CARD %c v3.6.129 ","background-color: #29b6cf; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 3px 0 0 3px;","background-color: #1e1e1e; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 0 3px 3px 0;"),window.customCards=window.customCards||[],window.customCards.push({type:"custom-compass-card",name:"Custom Compass Card",description:"A fully configurable compass card with dynamic fields.",preview:!0,config:CustomCompassCard.getStubConfig()});