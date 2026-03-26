import{LitElement,html,svg,css}from"https://unpkg.com/lit@2.0.0/index.js?module";const CARD_VERSION="3.2.82",DEFAULT_CONFIG={compass_entity:"sun.sun",compass_attribute:"azimuth",compass_adjustment:0,background_color:"#101010",circle_width:16,circle_color:"#383838",border_size:0,needle_width:3,needle_height:16,needle_color_1:"#E0E0E0",needle_color_1_pos:0,needle_color_2:"#E0E0E0",needle_color_2_pos:100,needle_position:0,needle_morph:0,needle_curve:0,needle_show:!0,needle_invert:!1,needle_rotate:!1,field_1_show:!0,field_1_template:"${compass_direction}",field_1_unit:"",field_1_fontsize:1.6,field_1_fontcolor:"#29B6CF",field_1_unit_fontsize:1,field_1_unit_fontcolor:"#196D7C",field_2_show:!0,field_2_template:"{{ states('sensor.ws_wind_speed') | round(1) }}",field_2_unit:"km/h",field_2_fontsize:2.1,field_2_fontcolor:"#E8E8E8",field_2_unit_fontsize:1.2,field_2_unit_fontcolor:"#8C8C8C",field_3_show:!0,field_3_template:"{{ state_attr('sun.sun', 'azimuth') | round(0) }}",field_3_unit:"°",field_3_fontsize:1.4,field_3_fontcolor:"#808080",field_3_unit_fontsize:1.4,field_3_unit_fontcolor:"#606060",tick_large_show:!0,tick_large_length:8,tick_large_width:4,tick_large_color:"#FFFFFF",tick_large_position:0,tick_large_cardinals:!1,tick_medium_show:!0,tick_medium_length:6,tick_medium_width:1.5,tick_medium_color:"#CCCCCC",tick_medium_position:0,tick_small_show:!0,tick_small_length:4,tick_small_width:1,tick_small_color:"#AAAAAA",tick_small_position:0};class CustomCompassCardEditor extends LitElement{static properties={hass:{type:Object},_config:{type:Object}};setConfig(e){this._config={...DEFAULT_CONFIG,...e},this.loadCardHelpers()}async loadCardHelpers(){if(!window.customElements.get("ha-entity-picker")){const e=await window.loadCardHelpers(),t=await e.createCardElement({type:"entities",entities:[]});await t.constructor.getConfigElement()}}_valueChanged(e,t){if(!this._config||!this.hass)return;let i;i=void 0!==t.detail?.value?t.detail.value:"HA-SWITCH"===t.target.tagName?t.target.checked:t.target.value,"number"===t.target.type&&(i=parseFloat(i),isNaN(i))||(this._config={...this._config,[e]:i},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0})))}_colorPicker(e,t){const i=this._config[e]||"#ffffff";return html`
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

	  <h2 style="margin-top: 0; margin-bottom: 16px;">Compass configuration</h2>

      <!-- Entity -->
      <div class="compass-entity-fields">
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
        ${this._colorPicker("circle_color","Border color")}
        <div class="text-field">
          <label>Border width</label>
          <ha-textfield
            type="number" step="1" min="0"
            .value=${String(e.circle_width)}
            @input=${e=>this._valueChanged("circle_width",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Border size</label>
          <ha-textfield
            type="number" step="1"
            .value=${String(e.border_size)}
            @input=${e=>this._valueChanged("border_size",e)}
          ></ha-textfield>
        </div>
      </div>
	  
	  <h2>Needle configuration</h2>

      <!-- Needle toggles -->
      <div class="needle-toggles">
        <ha-formfield>
          <label>Show needle</label>
          <ha-switch
            .checked=${e.needle_show}
            @change=${e=>this._valueChanged("needle_show",e)}
          ></ha-switch>
        </ha-formfield>
        <ha-formfield>
          <label>Invert needle</label>
          <ha-switch
            .checked=${e.needle_invert}
            @change=${e=>this._valueChanged("needle_invert",e)}
          ></ha-switch>
        </ha-formfield>
        <ha-formfield>
          <label>Rotate needle</label>
          <ha-switch
            .checked=${e.needle_rotate}
            @change=${e=>this._valueChanged("needle_rotate",e)}
          ></ha-switch>
        </ha-formfield>
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
      <div class="needle-dims-grid">
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

	  <h2>Tickmarks configuration</h2>

      <!-- Large ticks -->
      <div class="field-toggle">
        <label>Show large ticks</label>
        <ha-switch
          .checked=${e.tick_large_show}
          @change=${e=>this._valueChanged("tick_large_show",e)}
        ></ha-switch>
        <label style="margin-left:16px;">Cardinal labels</label>
        <ha-switch
          .checked=${e.tick_large_cardinals}
          @change=${e=>this._valueChanged("tick_large_cardinals",e)}
        ></ha-switch>
      </div>
      <div class="tick-grid">
        <div class="text-field">
          <label>Length</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(e.tick_large_length)}
            @input=${e=>this._valueChanged("tick_large_length",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(e.tick_large_width)}
            @input=${e=>this._valueChanged("tick_large_width",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="0.5"
            .value=${String(e.tick_large_position)}
            @input=${e=>this._valueChanged("tick_large_position",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("tick_large_color","Color")}
      </div>

      <!-- Medium ticks -->
      <div class="field-toggle">
        <label>Show medium ticks</label>
        <ha-switch
          .checked=${e.tick_medium_show}
          @change=${e=>this._valueChanged("tick_medium_show",e)}
        ></ha-switch>
      </div>
      <div class="tick-grid">
        <div class="text-field">
          <label>Length</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(e.tick_medium_length)}
            @input=${e=>this._valueChanged("tick_medium_length",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(e.tick_medium_width)}
            @input=${e=>this._valueChanged("tick_medium_width",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="0.5"
            .value=${String(e.tick_medium_position)}
            @input=${e=>this._valueChanged("tick_medium_position",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("tick_medium_color","Color")}
      </div>

      <!-- Small ticks -->
      <div class="field-toggle">
        <label>Show small ticks</label>
        <ha-switch
          .checked=${e.tick_small_show}
          @change=${e=>this._valueChanged("tick_small_show",e)}
        ></ha-switch>
      </div>
      <div class="tick-grid">
        <div class="text-field">
          <label>Length</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(e.tick_small_length)}
            @input=${e=>this._valueChanged("tick_small_length",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Width</label>
          <ha-textfield
            type="number" step="0.1" min="0"
            .value=${String(e.tick_small_width)}
            @input=${e=>this._valueChanged("tick_small_width",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Position</label>
          <ha-textfield
            type="number" step="0.5"
            .value=${String(e.tick_small_position)}
            @input=${e=>this._valueChanged("tick_small_position",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("tick_small_color","Color")}
      </div>

	  <h2 style="margin-bottom: 0px;">Custom fields configuration</h2>

      <!-- Field 1 -->
      <div class="field-toggle">
        <label>Show Field 1</label>
        <ha-switch
          .checked=${e.field_1_show}
          @change=${e=>this._valueChanged("field_1_show",e)}
        ></ha-switch>
      </div>
      <div class="field-grid">
        <div class="text-field">
          <label>Field 1 template</label>
          <ha-textfield
            .value=${e.field_1_template}
            @input=${e=>this._valueChanged("field_1_template",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Font size (em)</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(e.field_1_fontsize)}
            @input=${e=>this._valueChanged("field_1_fontsize",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("field_1_fontcolor","Font Color")}
      </div>
      <div class="field-grid">
        <div class="text-field">
          <label>Field 1 unit</label>
          <ha-textfield
            .value=${e.field_1_unit}
            @input=${e=>this._valueChanged("field_1_unit",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Unit size (em)</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(e.field_1_unit_fontsize)}
            @input=${e=>this._valueChanged("field_1_unit_fontsize",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("field_1_unit_fontcolor","Unit Color")}
      </div>


      <!-- Field 2 -->
      <div class="field-toggle">
        <label>Show Field 2</label>
        <ha-switch
          .checked=${e.field_2_show}
          @change=${e=>this._valueChanged("field_2_show",e)}
        ></ha-switch>
      </div>
      <div class="field-grid">
        <div class="text-field">
          <label>Field 2 template</label>
          <ha-textfield
            .value=${e.field_2_template}
            @input=${e=>this._valueChanged("field_2_template",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Font size (em)</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(e.field_2_fontsize)}
            @input=${e=>this._valueChanged("field_2_fontsize",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("field_2_fontcolor","Font Color")}
      </div>
      <div class="field-grid">
        <div class="text-field">
          <label>Field 2 unit</label>
          <ha-textfield
            .value=${e.field_2_unit}
            @input=${e=>this._valueChanged("field_2_unit",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Unit size (em)</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(e.field_2_unit_fontsize)}
            @input=${e=>this._valueChanged("field_2_unit_fontsize",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("field_2_unit_fontcolor","Unit Color")}
      </div>


      <!-- Field 3 -->
      <div class="field-toggle">
        <label>Show Field 3</label>
        <ha-switch
          .checked=${e.field_3_show}
          @change=${e=>this._valueChanged("field_3_show",e)}
        ></ha-switch>
      </div>
      <div class="field-grid">
        <div class="text-field">
          <label>Field 3 template</label>
          <ha-textfield
            .value=${e.field_3_template}
            @input=${e=>this._valueChanged("field_3_template",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Font size (em)</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(e.field_3_fontsize)}
            @input=${e=>this._valueChanged("field_3_fontsize",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("field_3_fontcolor","Font Color")}
      </div>
      <div class="field-grid">
        <div class="text-field">
          <label>Field 3 unit</label>
          <ha-textfield
            .value=${e.field_3_unit}
            @input=${e=>this._valueChanged("field_3_unit",e)}
          ></ha-textfield>
        </div>
        <div class="text-field">
          <label>Unit size (em)</label>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(e.field_3_unit_fontsize)}
            @input=${e=>this._valueChanged("field_3_unit_fontsize",e)}
          ></ha-textfield>
        </div>
        ${this._colorPicker("field_3_unit_fontcolor","Unit Color")}
      </div>
    `}static styles=css`
    :host {
      display: block;
      padding: 16px;
    }

    h2 {
      margin-top: 32px;
      margin-bottom: 0px;
    }

    .compass-entity-fields {
      display: grid;
      grid-template-columns: 5fr 4fr 3fr;
      gap: 8px;
    }

    .compass-styling-grid {
      display: grid;
      grid-template-columns: 5fr 5fr 3fr 3fr;
      gap: 8px;
      margin-top: 24px;
      margin-bottom: 16px;
    }

    .needle-color-grid {
      display: grid;
      grid-template-columns: 4fr 2fr 4fr 2fr;
      gap: 8px;
      margin-top: 24px;
      margin-bottom: 8px;
    }

    .needle-dims-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      gap: 8px;
      margin-top: 8px;
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

    .text-field-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      align-self: center;
      gap: 8px;
    }
    .text-field-row label {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      min-width: 82px;
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

    .needle-toggles {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      margin-top: 20px;
      margin-bottom: 15px;
    }
    .needle-toggles label {
      font-size: 14px;
      margin-right: 12px;
    }

    .field-toggle {
      display: flex;
      align-items: center;
      margin-top: 40px;
      margin-bottom: 15px;
    }
    .field-toggle label {
      font-size: 14px;
      margin-right: 12px;
      min-width: 120px;
    }

    .field-grid {
      display: grid;
      grid-template-columns: 4fr 2fr 3fr;
      gap: 8px;
      margin-top: 16px;
    }

    .tick-grid {
      display: grid;
      grid-template-columns: 2fr 2fr 2fr 3fr;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 8px;
      align-items: end;
    }

    ha-entity-picker,
    ha-textfield {
      display: block;
      width: 100%;
    }
  `}customElements.define("custom-compass-card-editor",CustomCompassCardEditor);class CustomCompassCard extends LitElement{static properties={hass:{type:Object},config:{type:Object},_degrees:{type:Number},_field1Value:{type:String},_field2Value:{type:String},_field3Value:{type:String},_error:{type:Boolean}};constructor(){super(),this._degrees=0,this._prevDegrees=null,this._templatesDirty=!1,this._field1Value="",this._field2Value="",this._field3Value="",this._error=!1}setConfig(e){if(!e.compass_entity)throw new Error("You must define a compass_entity.");this.config={...DEFAULT_CONFIG,...e}}willUpdate(e){if(!e.has("hass")||!this.config?.compass_entity)return;const t=this.hass.states[this.config.compass_entity];if(t){let e=t.state;const i=this.config.compass_attribute;if(i&&"string"==typeof i&&""!==i.trim()){const l=t.attributes[i.trim()];null===l||isNaN(parseFloat(l))||(e=l)}const l=parseFloat(e);if(isNaN(l))this._degrees=0,this._prevDegrees=null,this._templatesDirty=!0,this._error=!0;else{const e=((l+(parseFloat(this.config.compass_adjustment)||0))%360+360)%360;e!==this._prevDegrees&&(this._degrees=e,this._prevDegrees=e,this._templatesDirty=!0),this._error=!1}}else this._degrees=0,this._prevDegrees=null,this._templatesDirty=!0,this._error=!0}async _updateTemplates(){this._templatesDirty=!1;for(const e of[1,2,3]){if(!this.config[`field_${e}_show`]){this[`_field${e}Value`]="";continue}if(this._error){this[`_field${e}Value`]="Error";continue}const t=this.config[`field_${e}_template`];t&&(this[`_field${e}Value`]=await this._evaluateTemplate(t,this._degrees))}}updated(e){super.updated(e),this._scaleElements(),this._templatesDirty&&this._updateTemplates()}_scaleElements(){const e=this.shadowRoot.querySelector(".compass-circle");if(!e)return;const t=e.offsetWidth,i=t/120;this.style.setProperty("--cc-font-size",.08*t+"px");const l=parseFloat(this.config.circle_width),s=parseFloat(this.config.border_size);this.style.setProperty("--cc-circle-border-width",l*i+"px"),this.style.setProperty("--cc-circle-color",this.config.circle_color),this.style.setProperty("--cc-bg-color",this.config.background_color),this.style.setProperty("--cc-border-size",`${s}px`);const a=parseFloat(this.config.needle_width),o=parseFloat(this.config.needle_height),d=parseFloat(this.config.needle_position);this.style.setProperty("--cc-needle-width",a*i+"px"),this.style.setProperty("--cc-needle-height",o*i+"px"),this.style.setProperty("--cc-needle-position",d*i+"px");const r=this.shadowRoot.querySelector(".compass-ticks-wrapper");r&&this.style.setProperty("--cc-circle-size",`${r.offsetWidth}px`)}async _evaluateTemplate(e,t){try{const i=e.replace("${compass_direction}",this.getCompassDirection(t));if(!i.includes("{{"))return i;return await this.hass.callApi("POST","template",{template:i})}catch(t){return console.error("CustomCompassCard: Error evaluating template:",e,t),"Error"}}getCompassDirection(e){return["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"][Math.floor((e+11.25)/22.5)%16]}_buildNeedlePath(e,t,i,l){let s=[{x:50,y:0},{x:0,y:50},{x:50,y:50+e},{x:100,y:50}];const a=Math.abs(e)/50,o=Math.sign(e)*Math.min(1,Math.abs(e)/50)*(Math.PI/2);let d=[{in:{x:1,y:0},out:{x:-1,y:0},lengthMultiplier:1},{in:{x:0,y:-1},out:{x:Math.cos(o),y:Math.sin(o)},lengthMultiplier:1},{in:{x:-1,y:0},out:{x:1,y:0},lengthMultiplier:a},{in:{x:-Math.cos(o),y:Math.sin(o)},out:{x:0,y:-1},lengthMultiplier:1}];i&&(s.forEach(e=>{e.y=-e.y}),d.forEach(e=>{e.in.y=-e.in.y,e.out.y=-e.out.y}));const r=s.map((e,i)=>{const l=t*d[i].lengthMultiplier;return{in:{x:e.x+d[i].in.x*l,y:e.y+d[i].in.y*l},out:{x:e.x+d[i].out.x*l,y:e.y+d[i].out.y*l}}}),n=[...s];r.forEach(e=>n.push(e.in,e.out));const c=-Math.min(...n.map(e=>e.y))+l;s.forEach(e=>{e.y+=c}),r.forEach(e=>{e.in.y+=c,e.out.y+=c});let h=`M ${s[0].x},${s[0].y}`;for(let e=0;e<s.length;e++){const t=(e+1)%s.length;h+=` C ${r[e].out.x},${r[e].out.y} ${r[t].in.x},${r[t].in.y} ${s[t].x},${s[t].y}`}h+=" Z";const _=[...s];r.forEach(e=>_.push(e.in,e.out));const p=_.map(e=>e.x),f=_.map(e=>e.y);return{path:h.trim().replace(/\s+/g," "),bounds:{minX:Math.min(...p),maxX:Math.max(...p),minY:Math.min(...f),maxY:Math.max(...f)}}}_renderTicks(){const e=this.config,t=50,i=["N","E","S","W"],l=[0,4,8,12],s=Array.from({length:16},(s,a)=>{const o=a%4==0?"large":a%2==0?"medium":"small",d=e[`tick_${o}_show`],r=parseFloat(e[`tick_${o}_length`]),n=parseFloat(e[`tick_${o}_width`]),c=e[`tick_${o}_color`],h=parseFloat(e[`tick_${o}_position`])||0,_=22.5*a*Math.PI/180,p=Math.sin(_),f=Math.cos(_);if("large"===o&&d&&e.tick_large_cardinals){const e=l.indexOf(a),s=.85*r;return{show:d,type:"text",x:50+(t+h)*p-s*p,y:50-(t+h)*f+s*f,letter:i[e],fontSize:r,width:n,color:c}}return{show:d,type:"line",x1:50+(t+h)*p,y1:50-(t+h)*f,x2:50+(t+h-r)*p,y2:50-(t+h-r)*f,color:c,width:n}});return html`
      <div class="compass-ticks-wrapper">
        <svg class="compass-ticks" viewBox="0 0 100 100" preserveAspectRatio="none">
          ${s.map(e=>e.show?"text"===e.type?svg`
              <text
                x="${e.x}" y="${e.y}"
                text-anchor="middle"
                dominant-baseline="central"
                font-size="${e.fontSize}"
                font-weight="${100*e.width}"
                fill="${e.color}"
              >${e.letter}</text>
            `:svg`
              <line x1="${e.x1}" y1="${e.y1}" x2="${e.x2}" y2="${e.y2}"
                    stroke="${e.color}" stroke-width="${e.width}" stroke-linecap="round"/>
            `:"")}
        </svg>
      </div>
    `}_fieldStyle(e){return`font-size:${parseFloat(this.config[`field_${e}_fontsize`])}em; color:${this.config[`field_${e}_fontcolor`]};`}_unitStyle(e){const t=parseFloat(this.config[`field_${e}_unit_fontsize`]),i=this.config[`field_${e}_unit_fontcolor`];return`font-size:${t/parseFloat(this.config[`field_${e}_fontsize`])}em; color:${i};`}render(){const e=this.config||{},t=`rotate(${e.needle_rotate?this._degrees+180:this._degrees}deg)`,i=(t,i)=>{if(!e[`field_${t}_show`])return html``;const l=e[`field_${t}_unit`];return html`
        <div class="field field-${t}" style=${this._fieldStyle(t)}>
          ${i}${l?html`<span style=${this._unitStyle(t)}>${l}</span>`:""}
        </div>
      `},l=parseFloat(e.needle_morph),s=parseFloat(e.needle_curve),a=parseFloat(e.needle_position),o=this._buildNeedlePath(l,s,e.needle_invert,a),{minX:d,minY:r,maxX:n,maxY:c}=o.bounds,h=`${d} ${r} ${n-d} ${c-r}`,_=e.needle_invert?e.needle_color_2:e.needle_color_1,p=e.needle_invert?100-parseFloat(e.needle_color_2_pos):parseFloat(e.needle_color_1_pos),f=e.needle_invert?e.needle_color_1:e.needle_color_2,u=e.needle_invert?100-parseFloat(e.needle_color_1_pos):parseFloat(e.needle_color_2_pos);return html`
      <ha-card>
        <div class="compass-container">
          <div class="compass-circle">
            ${i(1,this._field1Value)}
            ${i(2,this._field2Value)}
            ${i(3,this._field3Value)}
          </div>
          ${this._renderTicks()}
          <div class="compass-needle-wrapper" style="transform:${t}">
            ${e.needle_show?html`
              <svg class="compass-needle"
                   viewBox="${h}"
                   preserveAspectRatio="none">
                <defs>
                  <linearGradient id="needleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"        stop-color="${_}" />
                    <stop offset="${p}%" stop-color="${_}" />
                    <stop offset="${u}%" stop-color="${f}" />
                    <stop offset="100%"      stop-color="${f}" />
                  </linearGradient>
                </defs>
                <path d="${o.path}" fill="url(#needleGradient)" />
              </svg>
            `:""}
          </div>
        </div>
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
  `;static getCardSize(){return 4}static getConfigElement(){return document.createElement("custom-compass-card-editor")}static getStubConfig(){return{...DEFAULT_CONFIG}}}customElements.define("custom-compass-card",CustomCompassCard),console.info("%c CUSTOM-COMPASS-CARD %c v3.2.82 ","background-color: #29b6cf; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 3px 0 0 3px;","background-color: #1e1e1e; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 0 3px 3px 0;"),window.customCards=window.customCards||[],window.customCards.push({type:"custom-compass-card",name:"Custom Compass Card",description:"A fully configurable compass card with dynamic fields.",preview:!0,config:CustomCompassCard.getStubConfig()});