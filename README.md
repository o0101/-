# -

Hyphen - A custom element base class for great developer ergonomics. 

**Our overarching goal:** using minimal library code and minimal application code, deliver the maximal useful surface area.

## What great developer ergonomics?

- `<custom-elements>`
- ``` `${template} literals` ``` 
- `<void-tags />`
- `inline=events`
- Minimal keystrokes 
- Small class size
  - 263 lines of code
  - 3003 **bytes** compressed
  
It's important to remember that what constitutes great ergonomics, like great sports car seats, varies for individuals. While there may be some things we can all agree on, other things may be harder to. It's good to keep this diversity in mind when evaluating any project. 

------------

## Table of Contents

- [What Great Developer Ergonomics?](#what-great-developer-ergonomics)
- [Introduction and Code Example](#introduction-and-code-example)
  - [Non-technical Introduction](#non-technical-introduction)
  - [Developer Overview](#developer-overview)
  - [Example Code](#example-code)
- [Our Manifesto](#our-manifesto)
- [Why Use Hyphen and How to Use It?](#why-use-hyphen-and-how-to-use-it)
  - [How Can I Learn Even More](#how-can-i-learn-even-more)
- [Inspirations](#inspirations-aka-id-like-to-thank-the-academy)
- [Hot Tips](#hot-tips)
- [Documentation](#documentation)
  - [Getting Started with Hyphen](#getting-started-with-hyphen)
  - [API Overview](#api-overview)
  - [Advanced Usage](#advanced-usage)
  - [Examples](#examples)
  - [Contribution](#contribution)
- [Bonus Section Just for Creatives](#bonus-section-just-for-creatives)
  - [I'd Like to Contribute! What Can I Do?](#id-like-to-contribute-what-can-i-do)
  - [Setting Up the Dev Environment](#setting-up-the-dev-environment)
  - [General Contribution Guidelines](#general-contribution-guidelines)
- [The Upside-Down aka Bonus Section Just for Meanies](#the-upside-down-aka-bonus-section-just-for-meanies)
  - [I'm Preparing to Comment About This and Want to Be Mean, What's the Bad News?](#im-preparing-to-comment-about-this-and-want-to-be-mean-whats-the-bad-news)
  - [I'm Unsatisfied That the Above Is Sufficiently Negative, What Other Bad News Can You Give Me?](#im-unsatisfied-that-the-above-is-sufficiently-negative-what-other-bad-news-can-you-give-me)
- [Bonus Section for Acolytes and True Believers](#bonus-section-for-acolytes-and-true-believers)
  - [I Have Decided to Pledge My Life to Your Cause and Throw Everything I've Got on Your Bandwagon. How Can I Best Organize?](#i-have-decided-to-pledge-my-life-to-your-cause-and-throw-everything-ive-got-on-your-bandwagon-how-can-i-best-organize)

--------------

## Introduction and Code Example

### Non-technical Introduction

Hyphen is a client-side JavaScript file that helps web developers easily make and manage custom parts of a website, like buttons or menus, without dealing with complicated code. 

It makes the usual tricky parts of web development simpler so that developers can build websites faster and with less hassle.

### Developer Overview

Hyphen simplifies the creation of custom Web Components, which are a standard for reusable user interface elements for web pages. 

It does this by providing developers with a base class that streamlines the integration of state management and templating, thus addressing common challenges such as verbose syntax and complex lifecycle handling typically associated with native custom elements.

Hyphen is also very short, making it easy to build on as a custom element base for your applications.

### Example Code

In this example, we create a `MyGreeting` element that uses Hyphen's base class to manage its state and respond to user interactions. 

This element displays a greeting message that changes when the button is clicked, demonstrating the dynamic capabilities of Hyphen with minimal coding required.

```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Hyphen Example</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="-.js"></script>
  </head>
  <body>
    <!-- Define your custom element with minimal boilerplate -->
    <script>
      class MyGreeting extends $ {
        // Specify observed attributes for automatic property sync
        static get attrs() {
          return ['name'];
        }

        // Define initial state if needed
        constructor() {
          super({ greeting: 'Hello' });
        }

        // Respond to user interaction
        changeGreeting() {
          this.state = { greeting: this.state.greeting == 'Hi' ? 'Hello' : 'Hi' };
        }

        // Declare the template using state directly
        template() {
          return `
            <span>${greeting}, ${host.name}!</span>
            <button onclick="changeGreeting">Change Greeting</button>
          `;
        }
      }

      // Register the custom element with the browser
      customElements.define('my-greeting', MyGreeting);
    </script>

    <!-- Use the custom element in HTML, set attributes as properties, separate to internal state -->
    <my-greeting name="Cris"></my-greeting>

    <script>
      // The element is already rendered once it's connected to the DOM
      const greetingElement = document.querySelector('my-greeting');

      // Attributes can be updated programmatically if necessary
      setTimeout(() => greetingElement.name = 'Awesome Developer', 5000);
    </script>
  </body>
  </html>
```

With Hyphen, you get a streamlined workflow for your custom elements where the usual complexities are handled for you. 

## Our manifesto

We want to build something that works for you. Or, rather, *some* of you; but not *all* of you. 

We are very comfortable with that tradeoff, and you should be too. 

However, if you care enough to be passionate, then please use or contribute if you like Hyphen, or please use or make something else if you don't. 

Either way, please be respectful and considerate to anyone you're dealing with.

## Why use Hyphen and how to use Hyphen? 

The aim is to minify the keystrokes required to use custom elements, while providing other great ergonomics, too. 

You template with state properties directly, no `state.` prefix required. 

You use JavaScript template literal syntax, not another DSL.

For events you use inline event handler syntax, with some syntactic sugar to let you use instance method names directly in the attribute.

Finally, we support void custom elements in templated values, and automatically expand these to their correct final form with end tags.

## How can I learn even more

Study the examples in [index.html](index.html) to fully learn the current system. Ask questions in [issues](issues) if you need more help!

## Inspirations aka *I'd like to thank the Academy...*

Hyphen is inspired by:

- React
- HTMX
- LitHTML
- Svelte
- Angular
- Brutal.js
- Good.html
- VanillaView
- Decades of coding experience and knowing what we want

## Hot Tips

Dive into these essential tidbits to make the most of Hyphen's features:

#### State Merging

Hyphen uses a merging strategy for state updates:

```javascript
this.state = { newProperty: 'newValue' };
```

When you update `this.state`, Hyphen combines your changes with the existing state. This merge behavior ensures that only the properties you specify are updated, while all others remain untouched.

#### Asynchronous Properties

Properties and attributes are linked, but they update asynchronously to prevent infinite loops:

```javascript
el.setAttribute('my-attr', 'value'); // el.myAttr will update on the next tick
el.myAttr = 'new value';            // the attribute updates immediately
```

Treat these updates as asynchronous to avoid timing issues. Setting the attribute schedules the property update for the next tick, whereas updating the property reflects immediately on the attribute.

#### Distinguishing State from Properties

State is internal and should be managed differently from attributes or properties:

```javascript
// To update the state and trigger a re-render
this.state = { myKey: 'myNewValue' };
```

Modifying `this.state` directly won't cause a re-render. To update, you must set `this.state` to a new object, which is typically done with `this.state = { ...myStateUpdates }`.

#### Content Security Policy (CSP)

Hyphen relies on `eval` and inline event handlers, which require certain CSP exceptions:

```html
<!-- Add this to your HTML header to allow inline scripts and eval -->
<meta http-equiv="Content-Security-Policy" content="script-src 'unsafe-inline' 'unsafe-eval';">
```

We understand these requirements might not fit all security policies, but they are currently essential for Hyphen's operation.

These tips are geared to help you swiftly navigate the intricacies of Hyphen and craft impressive custom elements with both finesse and ease.

## Documentation

Welcome to the Hyphen documentation! This section will guide you through the essentials of utilizing the Hyphen base class to create dynamic, state-managed custom elements for your web applications.

### Getting Started with Hyphen

Hyphen is designed to be intuitive and easy to use, helping developers create custom elements with ease. Let's dive into how you can start integrating Hyphen into your projects.

#### Installation

First, ensure you have the `-.js` file included in your project.

```html
<script src="path_to_your_assets/-.js"></script>
```

#### Creating a New Custom Element

To create a new custom element with Hyphen, extend the base class `$` and define your element as shown below:

```javascript
class YourCustomElement extends $ {
  // Optional: Define observed attributes for property synchronization
  static get attrs() {
    return ['your', 'observed', 'attributes'];
  }

  // Optional: Define a unique name for your element (must be lowercase, and contain a hyphen '-')
  static get elName() {
    return 'your-custom-element';
  }

  // Optional: Define initial state
  constructor(initialState) {
    super(initialState);
  }

  // Define your element's HTML template as a string
  template() {
    return `
      <div>Your custom element's template goes here</div>
    `;
  }
}

// Don't forget to register your element
YourCustomElement.link();
```

### API Overview

#### `link()`

Registers the custom element with the browser. It automatically uses the `elName` defined in your class or defaults to the class name transformed to lowercase with `-el` appended.

```javascript
YourCustomElement.link();
```

#### `new()`

Creates and returns a new instance of the custom element. This is a shortcut to avoid calling `document.createElement()` directly.

```javascript
const instance = YourCustomElement.new();
```

#### `template()`

Override this method to define the inner HTML template for your custom element. It should return a string literal.

```javascript
template() {
  return `<div>Template content. State property: ${myContent}. Attribute property: ${host.myAttr}</div>`;
}
```

Properties of `this.state` are used unprefixed in the template. State properties used in the template but undefined will raise an error.

Attributes (and their corresponding properties) are prefixed with `host.` in the template. 

#### `render()`

This method processes the template and updates the shadow DOM with the new content. It's automatically called when the element is connected to the DOM or when its state changes.

#### State Management

The state of your custom element can be managed via the `state` getter and setter.

```javascript
// To set state
this.state = { key: 'value' };

// To access state
console.log(this.state.key);
```

### Advanced Usage

#### Attributes and Properties

Attributes defined in `attrs()` will be observed and synchronized with the corresponding properties.

```javascript
// Define observed attributes
static get attrs() {
  return ['data-example'];
}

// Access an attribute as a property
console.log(this.dataExample);
```

#### Dynamic Template Processing

Hyphen supports inline event handlers and dynamically expands void custom elements within templates.

```javascript

handleClick(clickEvent) {
  console.log('Somebody clicked something', clickEvent);
}

template() {
  return `
    <my-button onclick="handleClick">Click me!</my-button>
    <input-el /> <!-- will expand to <input-el></input-el> -->
  `;
}
```

Inline event handlers are defined on your custom element class, and referenced with a shorthand syntax that can omit everything except the name. `onclick=handleClick` is preprocessed to `this.getRootNode().host.handleClick(event);`

`onclick=handleClick(event)` is also valid, as is wrapping the attributes value in `'` or `"` quotes.

### Examples

Refer to the provided [example snippets](examples/) or the [index.html](index.html) to see Hyphen in action. Analyzing and experimenting with these examples will solidify your understanding of how to leverage Hyphen effectively in your projects.

### Contribution

Passionate about Hyphen? Contributions are welcome! Whether it's adding examples, reporting bugs, or proposing features—your input helps Hyphen grow.

#### Development Setup

1. Fork and clone the repository.
2. Navigate to the cloned directory and install dependencies:

   ```bash
   npm install
   ```

3. To run tests:

   ```bash
   npm test
   ```

### Conclusion

Hyphen empowers developers to create custom elements effortlessly, focusing on what matters most: bringing your creative visions to life. Happy coding!

---

## Bonus Section Just for Creatives

## I'd like to contribute! What can I do?

Please consider adding some more examples to [`index.html`](index.html) or [`examples/`](examples). Examples are essential for learning about Hyphen, filling bugs and adding features.

Another way to contribute is to browse current issues. 

### Setting up the dev environment

1. Clone the repo.
2. Run npm i
3. Run npm test

*Note:* npm test may fail if you don't have localhost certificates. You could make these with letsencrypt, but you can easily just run `server -p 8080` to run a dev server on 8080.

### General Contribution Guidelines

In general, empathize with others and remember this is a meritocracy of ideas, yet with clear goals. 

We may reject your ideas because they don't align with our aesthetics and ergonomics, but that doesn't mean your ideas are "bad". 

If your ideas are good and support our goals, we gladly include them!
