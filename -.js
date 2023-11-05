{
  const $state = Symbol(`[[state]]`);

  class $ extends HTMLElement {
    static get observedAttributes() {
      return ['state'];
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
    }

    connectedCallback() {
      this.render();
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
      }
    }

    set state(newState) {
      this[$state] = newState;
      this.render();
    }

    get state() {
      return this[$state];
    }

    // override
    template() {
      return `<!-- ${__} element -->`;
    }

    render() {
      this.shadow.innerHTML = this.preprocessTemplate(this.getTemplate());
    }

    preprocessTemplate(templateString) {
      const handlerRegex = /\s(on\w+)=['"]?(?!this\.getRootNode\(\)\.host\.)([^\s('";>/]+)(?:\([^)]*\))?;?['"]?/g;
      const voidElementRegex = /<(\w+)([^>]*)\/>/g;

      // First preprocess event handlers
      templateString = templateString.replace(handlerRegex, (match, event, handlerName) => {
        // Check if the handler name is a function on the current element
        if (typeof this[handlerName] === 'function') {
          // Construct the replacement with a bound method call and proper quotes
          const quote = "'";
          return ` ${event}=${quote}this.getRootNode().host.${handlerName}(event)${quote}`;
        } else {
          // If the function doesn't exist, throw an error or handle accordingly
          console.error(`Handler function '${handlerName}' not found in element`);
          return match; // or throw new Error(...) if you prefer
        }
      });

      // Then expand void elements
      return templateString.replace(voidElementRegex, '<$1$2></$1>');
    }
  }

  $.prototype.getTemplate = function() {
    this.state['__'] = this.constructor.name;
    this.state.host = this;
    with (this.state) {
      return eval(`(function ${this.template.toString()}())`);
    }
  }

  // If needed, modify global name here too
  Object.defineProperty(globalThis, '$', {
    get() {
      return $;
    }
  });

  // Change the tag name to match the class name or something appropriate
  globalThis.customElements.define('custom-el', $);
}

