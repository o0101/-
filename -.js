{
  const $state = Symbol(`[[state]]`);
  const $linked = Symbol(`[[linked]]`);

  class Store {
    constructor(initialState) {
      this[$state] = initialState || {};
      this.subscribers = [];
    }

    get state() {
      return this.getState();
    }

    set state(newState) {
      this.setState(newState);
    }

    addSubscriber(subscriber) {
      this.subscribers.push(subscriber);
    }

    notifySubscribers() {
      this.subscribers.forEach(subscriber => {
        if (typeof subscriber.update === 'function') {
          subscriber.update();
        }
      });
    }

    sync() {
      this.notifySubscribers();
    }

    setState(newState) {
      this[$state] = { ...this.state, ...newState };
      this.notifySubscribers();
    }

    getState() {
      return this[$state];
    }
  }

  class $ extends HTMLElement {
    #isFirstRender = true;
    #cssImportsContent = '';
    #cssImportTimeout = 5000;
    #untilCSSFinalized = 0;

    static {
      this.link();
    }

    static get observedAttributes() {
      return ['state', ...(this.attrs ? this.attrs : [])];
    }

    // override in your element if needed
    static get attrs() {
      return [];
    }

    // deprecated in favor of tag, but retained for backwards compatibility for now
    static get elName() {
      return this.tag;
    }
    // override in your element if needed (remember it must be lowercase)
    static get tag() {
      return convertCaseAndName(this.name);
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
      if ( globalThis?._$store instanceof Store ) {
        globalThis._$store.addSubscriber(this);
      }
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

    change(eventName, details = {}) {
      this.dispatchEvent(new InputEvent('change', {
        data: JSON.stringify({
          ...details,
          eventName
        }), 
        composed: true,
        bubbles: true,
      }));
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

    // override if you need to set custom behavior
    beforeUpdate() {
      
    }

    update() {
      this.beforeUpdate();
      this.state = this.state;
    }

    async render() {
      let resolve;
      const pr = new Promise(res => resolve = res);
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
          requestAnimationFrame(() => {
            this.style.visibility = 'visible';
            resolve();
          });
          this.#isFirstRender = false;
        } else {
          resolve();
        }
      });

      return pr;
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
      const handlerRegex = /\s(on\w+)=['"]?(?!const host = this\.getRootNode\(\)\.host; host\\.)([^\s('";>/]+)(?:\([^)]*\))?;?['"]?/g;
      const voidElementRegex = /<([\w-]+)\s*([^>]*)\/>/g;

      templateString = templateString.replace(handlerRegex, (match, event, handlerName) => {
        //console.log({event, handlerName});
        if (typeof this[handlerName] === 'function') {
          if ( event == 'onchange' ) { // change is a special custom event for us with inline event handler capabilities
            return ` ${event}="const host = this.getRootNode().host; host.${handlerName}({...(event.data?JSON.parse(event.data):{}),_package:event,target:event.target}) && (host.state = host.state);"`;
          } else {
            return ` ${event}="const host = this.getRootNode().host; host.${handlerName}(event) && (host.state = host.state);"`;
          }
        } else {
          console.error(`Handler function '${handlerName}' not found in element`, this);
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
            if (value == null || value === false || value == 'false') {
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
    const host = this;
    this.state.host = host;

    with (this.state) {
      if ( type == 'function' ) {
        return eval(`((function ${funcGetter().toString().replace(/^\s*function\s+/,'')}).bind(host)())`);
      } else if ( type == 'string' ) {
        return eval(`((function () { return \`${result}\`; }).bind(host)())`);
      }
    }
  }

  Object.defineProperty(globalThis, '$', {
    get() {
      return $;
    }
  });
  Object.defineProperty(globalThis, 'Store', {
    get() {
      return Store;
    }
  });

  $.querySelector = querySelector;

  // helpers
    function convertCaseAndName(inputString) {
      // Check if the string is all uppercase
      let hyphenCount = 0;

      let result = '';
      for (let i = 0; i < inputString.length; i++) {
        const char = inputString[i];
        const nextChar = inputString[i + 1];
        // If it's an uppercase character
        if (char === char.toUpperCase() && char !== char.toLowerCase()) {
          // If it's not the first character and the next character is lowercase, add a hyphen
          if (i > 0 && nextChar && nextChar === nextChar.toLowerCase()) {
            result += '-';
            hyphenCount++;
          }
          result += char.toLowerCase();
        } else {
          result += char;
        }
      }
      return hyphenCount ? result : result + '-el';
    }

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

