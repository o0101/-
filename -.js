{
  const $state = Symbol(`[[state]]`);
  const $linked = Symbol(`[[linked]]`);

  class $ extends HTMLElement {
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

      if (state) {
        this.state = state;
      } else if (this.hasAttribute('state')) {
        try {
          this.state = JSON.parse(this.getAttribute('state'));
        } catch (e) {
          this.state = this.getAttribute('state');
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

    // override for your element
    template() {
      return `<!-- ${__} element -->`;
    }

    render() {
      this.shadow.innerHTML = this.preprocessTemplate(this.getTemplate());
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

  $.prototype.getTemplate = function() {
    this.state['__'] = this.constructor.name;
    this.state.host = this;

    /*
    return new Function(
      ...Object.keys(this.state), `
      return (function ${this.template.toString()
        .replace(/^\s*function\s+/,'')
      }())
    `)(...Object.values(this.state));
    */

    with (this.state) {
      return eval(`(function ${this.template.toString().replace(/^\s*function\s+/,'')}())`);
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

