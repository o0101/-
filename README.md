# -

Hyphen - A custom element base class for great developer ergonomics. 

## What great developer ergonomics?

- `<custom-elements>`
- ``` `${template} literals` ``` 
- `<void-tags />`
- `inline=events`
- Minimal boilerplate 
- Small class size
  
It's important to remember that what constitutes great ergonomics, like great sports car seats, varies for individuals. While there may be some things we can all agree on, other things may be harder to. It's good to keep this diversity in mind when evaluating any project. 

------------

# Table of Contents

- [What Great Developer Ergonomics?](#what-great-developer-ergonomics)
- [Introduction and Code Example](#introduction-and-code-example)
  - [Non-technical Introduction](#non-technical-introduction)
  - [Developer Overview](#developer-overview)
  - [Example Code](#example-code)
- [Our Manifesto](#our-manifesto)
- [Why Use Hyphen and How to Use It?](#why-use-hyphen-and-how-to-use-it)
  - [How Can I Learn Even More](#how-can-i-learn-even-more)
- [Inspirations](#inspirations-aka-id-like-to-thank-the-academy)
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

# Introduction and Code Example

## Non-technical Introduction

Hyphen is a client-side JavaScript file that helps web developers easily make and manage custom parts of a website, like buttons or menus, without dealing with complicated code. 

It makes the usual tricky parts of web development simpler so that developers can build websites faster and with less hassle.

## Developer Overview

Hyphen simplifies the creation of custom Web Components, which are a standard for reusable user interface elements for web pages. 

It does this by providing developers with a base class that streamlines the integration of state management and templating, thus addressing common challenges such as verbose syntax and complex lifecycle handling typically associated with native custom elements.

Hyphen is also very short, making it easy to build on as a custom element base for your applications.

## Example Code

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

# Our manifesto

We want to build something that works for you. Or, rather, *some* of you; but not *all* of you. 

We are very comfortable with that tradeoff, and you should be too. 

However, if you care enough to be passionate, then please use or contribute if you like Hyphen, or please use or make something else if you don't. 

Either way, please be respectful and considerate to anyone you're dealing with.

# Why use Hyphen and how to use Hyphen? 

The aim is to minify the keystrokes required to use custom elements, while providing other great ergonomics, too. 

You template with state properties directly, no `state.` prefix required. 

You use JavaScript template literal syntax, not another DSL.

For events you use inline event handler syntax, with some syntactic sugar to let you use instance method names directly in the attribute.

Finally, we support void custom elements in templated values, and automatically expand these to their correct final form with end tags.

## How can I learn even more

Study the examples in [index.html](index.html) to fully learn the current system. Ask questions in [issues](issues) if you need more help!

# Inspirations aka *I'd like to thank the Academy...*

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

# Bonus Section Just for Creatives

## I'd like to contribute! What can I do?

Please consider adding some more examples to index.html. Examples are essential for learning about Hyphen, filling bugs and adding features.

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

----

# The Upside-Down aka Bonus Section Just for Meanies

## I'm preparing to comment about this and want to be mean, what's the bad news?

We use:

- regex to parse inline handlers and void tags
- `with` and `eval` for magic templating

Some people consider them dangerous and want to outlaw their use. We consider them powerful and useful. 

`with`, `eval` and regex are ways to simplify our code and deliver great ergonomics. 

### *Begun, the flame war has* 

Pick your side, we don't care. What we do care about tho, is good developer experience. 

Plus, it's kind of fun to flirt with danger now and then, don't you think? Where's your spice of life? 🌶️ 

##  I'm unsatisfied that the above is sufficiently negative, what other bad news can you give me?

This is in alpha. You probably don't want to use it for production unless you can handle the risk. You can help improve it's stability with constructive and respectful pull requests and issues. 

----

# Bonus Section for Acolytes and True Believers

## I have decided to pledge my life to your cause and throw everything I've got on your bandwagon. How can I best organize?

We're not a cult and not looking for recruits, sorry. If you're passionate enough to care, contribute! 

But this is a meritocracy of ideas, yet with clear goals. We may reject your ideas because they don't align with our aesthetics and ergonomics, but that doesn't mean your ideas are "bad". If your ideas are good and support our goals, we gladly include them!





