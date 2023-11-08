{
  const $state = Symbol(`[[state]]`);
  const $linked = Symbol(`[[linked]]`);

  class $ extends HTMLElement {
    /* this prevents an initial FOUC in most cases when component is first rendered */
    #isFirstRender = true;

    static get observedAttributes() {
      return ['state', ...(this.attrs ? this.attrs : [])];
    }

    // override in your element if needed
    static get attrs() {
      return [];
    }

    // override in your element if needed (remember it must be lowercase)
    static get elName() {
      return `${this.name.toLocaleLowerCase()}-el`;
    }

    static link() {
      if ( ! this[$linked] ) {
        this[$linked] = true;
        customElements.define(this.elName, this);
      }
    }

    static new() {
      if ( ! this[$linked] ) this.link();
      return document.createElement(this.elName);
    }

    constructor(state) {
      super(state);
      this.shadow = this.attachShadow({ mode: 'open' });

      // set state without render
      if (state) {
        this[$state] = state;
      } else if (this.hasAttribute('state')) {
        try {
          this[$state] = JSON.parse(this.getAttribute('state'));
        } catch (e) {
          this[$state] = this.getAttribute('state');
        }
      } else {
        this[$state] = Object.create(null);
      }

      this.initProperties();
    }

    syncAttributesToProps() {
      for (const attribute of this.attributes) {
        if ( attribute.name == 'state' ) {
          try { 
            this.state = JSON.parse(attribute.value);
          } catch(e) {
            this.state = attribute.value;
          }
        } else {
          const propName = attributeToProperty(attribute.name);
          this[propName] = attribute.value;
        }
      }
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'state') {
        let val;
        try {
          val = JSON.parse(newValue);
        } catch (e) {
          val = newValue;
        }
        this.state = val;
      } else {
        const propName = attributeToProperty(name);
        // we need to make the property update async 
        // otherwise the setter triggers an infinite loop
        if ( this[propName] != newValue ) {
          setTimeout(() => {
            this[propName] = newValue;
            this.render();
           }, 0);
        }
      }
    }

    initProperties() {
      this.constructor.observedAttributes.forEach(attr => {
        if ( attr == 'state' ) return;

        Object.defineProperty(this, attributeToProperty(attr), {
          get() {
            // we don't care about types right now so everything becomes a string
            return this.getAttribute(attr);
          },
          set(value) {
            if (value == null) {
              this.removeAttribute(attr);
            } else {
              this.setAttribute(attr, value);
            }
            this.render();
          }
        });
      });
    }

    connectedCallback() {
      this.syncAttributesToProps();
      this.render();
    }

    set state(newState) {
      if ( this[$state] == undefined ) {
        this[$state] = newState;
      } else {
        this[$state] = Object.assign(this[$state], newState);
      }
      this.render();
    }

    get state() {
      return this[$state];
    }

    // override for your element if needed
    styles() {
      return `/* css styles for :host ${__} element and its shadow tree */`;
    }

    // override for your element if needed
    template() {
      return `<!-- ${__} element's shadow tree HTML -->`;
    }

    render() {
      // Set up the temporary element's shadow DOM
      const newContent = `
        <style>
          ${this.getTemplate(() => this.styles)} 
        </style>
        ${this.preprocessTemplate(this.getTemplate(() => this.template))}
      `;

      if ( this.#isFirstRender ) {
        this.style.visibility = 'hidden';
      }

      requestAnimationFrame(() => {
        this.shadow.innerHTML = newContent;

        if ( this.#isFirstRender ) {
          requestAnimationFrame(() => this.style.visibility = 'visible');
          this.#isFirstRender = false;
        }
      });
    }

    preprocessTemplate(templateString) {
      const handlerRegex = /\s(on\w+)=['"]?(?!this\.getRootNode\(\)\.host\.)([^\s('";>/]+)(?:\([^)]*\))?;?['"]?/g;
      const voidElementRegex = /<([\w-]+)\s*([^>]*)\/>/g;

      templateString = templateString.replace(handlerRegex, (match, event, handlerName) => {
        if (typeof this[handlerName] === 'function') {
          const quote = "'";
          return ` ${event}=${quote}this.getRootNode().host.${handlerName}(event)${quote}`;
        } else {
          console.error(`Handler function '${handlerName}' not found in element`);
          return match; 
        }
      });

      return templateString.replace(voidElementRegex, (match, tagName, tagBody) => {
        return `<${tagName} ${tagBody}></${tagName}>`;
      });
    }
  }

  $.prototype.getTemplate = function(funcRef) {
    if ( typeof funcRef != 'function' ) throw new TypeError(
      `Provide a function that returns a reference to a function that returns a template string`
    );

    this.state['__'] = this.constructor.name;
    this.state.host = this;

    with (this.state) {
      return eval(`(function ${funcRef().toString().replace(/^\s*function\s+/,'')}())`);
    }
  }

  Object.defineProperty(globalThis, '$', {
    get() {
      return $;
    }
  });

  globalThis.customElements.define('hyph-en', $);

  // helpers
    function querySelector(startElement, selector) {
      let currentNode = startElement.getRootNode();
      let result = null;

      while (currentNode) {
        result = currentNode.querySelector(selector);

        if (result) break;

        if (currentNode instanceof ShadowRoot) {
          currentNode = currentNode.host.getRootNode();
        } else if (currentNode == document) {
          break;
        } else {
          console.warn(`Weird currentNode`, currentNode);
          break;
        }
      }

      return result;
    }

    function attributeToProperty(attributeName) {
      return attributeName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    }

    function propertyToAttribute(propertyName) {
      return propertyName.replace(/([A-Z])/g, '-$1').toLowerCase();
    }
}

