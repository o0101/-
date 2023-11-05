# -

Hyphen - A custom element base class for great developer ergonomics. 

## What great developer ergonomics?

- `<custom-elements>`
- ``` `${template}<literals` ``` 
- `<void-tags />`
- `inline=events`
- Minimal boilerplate 
- Small class size
  
It's important to remember that what constitutes great ergonomics, like great sports car seats, varies for individuals. While there may be some things we can all agree on, other things may be harder to. It's good to keep this diversity in mind when evaluating any project. 

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

Study the examples in [docs/index.html](index.html) to fully learn the current system. Ask questions in [issues](issues) if you need more help!

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
- Years of coding experience and knowing what we want

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

This is in alpha. You probably don't want to use it for production unless you can handle the risk. You can help imporve it's stability with constructive and respectful pull requests and issues. 

----

# Bonus Section for Acolytes and True Believers

## I have decided to pledge my life to your cause and throw everything I've got on your bandwagon. How can I best organize?

We're not a cult and not looking for recruits, sorry. If you're passionate enough to care, contribute! 

But this is a meritocracy of ideas, yet with clear goals. We may reject your ideas because they don't align with our aesthetics and ergonomics, but that doesn't mean your ideas are "bad". If your ideas are good and support our goals, we gladly include them!





