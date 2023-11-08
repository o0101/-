{
  const $state = Symbol(`[[state]]`);
  const $linked = Symbol(`[[linked]]`);

  class $ extends HTMLElement {
    #isFirstRender = true;
    #cssImportsContent = '';
    #cssImportTimeout = 5000;
    #untilCSSFinalized = 0;

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

    // override in your element if needed
    get cssImports() {
      return []; // a list of URLs to CSS styles that need to be fetch from the network for your component
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

      this.#preCacheCSSImports();
      this.#initProperties();
    }

    connectedCallback() {
      this.#syncAttributesToProps();
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

    get cssImportTimeout() {
      return this.#cssImportTimeout; 
    }

    set cssImportTimeout(val) {
      const number = Number.parseInt(val);
      this.#cssImportTimeout = Number.isInteger(number) ? number : 5000;
    }

    async render() {
      await this.#untilCSSFinalized;

      const styleContent = this.#checkForRenderBlockingCSS();

      const newContent = `
        <style>
          ${styleContent}
        </style>
        ${this.#preprocessTemplate(this.getTemplate(() => this.template))}
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
        if ( this[propName] != newValue ) {
          setTimeout(() => { // we need to make the property update async otherwise the setter triggers an infinite loop
            this[propName] = newValue;
            this.render();
           }, 0); 
        }
      }
    }

    #preprocessTemplate(templateString) {
      const handlerRegex = /\s(on\w+)=['"]?(?!this\.getRootNode\(\)\.host\.)([^\s('";>/]+)(?:\([^)]*\))?;?['"]?/g;
      const voidElementRegex = /<([\w-]+)\s*([^>]*)\/>/g;

      templateString = templateString.replace(handlerRegex, (match, event, handlerName) => {
        if (typeof this[handlerName] === 'function') {
          return ` ${event}="this.getRootNode().host.${handlerName}(event)"`;
        } else {
          console.error(`Handler function '${handlerName}' not found in element`);
          return match; 
        }
      });

      return templateString.replace(voidElementRegex, (match, tagName, tagBody) => `<${tagName} ${tagBody}></${tagName}>`);
    }

    #initProperties() {
      this.constructor.observedAttributes.forEach(attr => {
        if ( attr == 'state' ) return;

        Object.defineProperty(this, attributeToProperty(attr), {
          get() {     // we don't care about types right now so everything becomes a string
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

    #syncAttributesToProps() {
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

    async #preCacheCSSImports() {
      const cssImports = this.cssImports;
      const timeout = this.cssImportTimeout;
      let notifyFinalized;

      this.#untilCSSFinalized = new Promise(res => notifyFinalized = res);

      if (cssImports.length > 0) {
        const fetchWithTimeout = (url) => {
          return new Promise((resolve, reject) => {
            // Set the timeout
            const timer = setTimeout(() => {
              reject(new Error(`Request for ${url} timed out`));
            }, timeout);

            // Start the fetch request
            fetch(url).then(response => {
              clearTimeout(timer); // Clear the timeout if the fetch completes in time
              resolve(response);
            }, reject); // Forward fetch errors/rejections
          });
        };

        const responses = await Promise.allSettled(cssImports.map(fetchWithTimeout));
        const contentPromisesOrEmpty = responses.map((result, index) => {
          if (result.status === 'fulfilled') {
            return result.value.text();  // this is also a promise
          } else {
            console.error(`Error loading CSS import from ${cssImports[index]}:`, result.reason);
            return '';  // Ignore failed requests
          }
        });

        this.#cssImportsContent = (await Promise.all(contentPromisesOrEmpty)).join('\n');
        notifyFinalized();
      } else {
        notifyFinalized();
      }
    }

    // Method to check for render-blocking CSS calls
    #checkForRenderBlockingCSS() {
      const styleContent = `
        ${this.getTemplate(() => this.#cssImportsContent)}
        ${this.getTemplate(() => this.styles)}
      `;
      const regex = /@import\s+url|@font-face/g;
      let match;
      while ((match = regex.exec(styleContent)) !== null) {
        console.warn(`Warning: render-blocking network call in CSS for element ${this.constructor.elName}: ${match[0]}. 
        If you need to import CSS files add them to the cssImports array override on your component's Hyphen class.`);
      }
      return styleContent;
    }
  }

  $.prototype.getTemplate = function(funcGetter) {
    if ( typeof funcGetter != 'function' ) throw new TypeError(
      `Provide a function that returns either raw template text (from say a network request or file read) or reference to a function that returns a template string`
    );

    const result = funcGetter();
    const type = typeof result;

    this.state['__'] = this.constructor.name;
    this.state.host = this;

    with (this.state) {
      if ( type == 'function' ) {
        return eval(`(function ${funcGetter().toString().replace(/^\s*function\s+/,'')}())`);
      } else if ( type == 'string' ) {
        return eval(`(function () { return \`${result}\`; }())`);
      }
    }
  }

  Object.defineProperty(globalThis, '$', {
    get() {
      return $;
    }
  });

  $.querySelector = querySelector;

  globalThis.customElements.define('hyph-en', $);

  // helpers
    // find selector anywhere in the document except in any custom element descendents of startElement
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

