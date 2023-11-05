# -

Hyphen - A custom element base class for great developer ergonomics. 

## What great developer ergonomics?

- Custom elements for scoped styles and organization
- Template literals for dynamic markup
- Void tags for brevity
- Inline events for clarity
- Minimal boilerplate for efficiency
- Small base class size for extensibility and maintainability

It's important to remember that what constitutes great ergonomics, like great sports car seats, varies for individuals. While there may be some things we can all agree on, other things may be harder to. It's good to keep this diversity in mind when evaluating any project. 

# Our manifesto

We want to build something that works for you. It will work for some of you, but not all of you. We're comfortable with that tradeoff, and you should be too. If you care enough to be passionate, then please use or contribute if you like it, or please use or make something else if you don't. Either way, please be respectful and considerate to anyone you're dealing with.

# Why and how? 

The aim is to minify the keystrokes required to use custom elements, while providing other great ergonomics, too. 

You template with state properties directly, no `state.` prefix required. You use JavaScript template literal syntax, not another DSL.

For events you use inline event handler syntax, with some syntactic sugar to let you use instance method names directly in the attribute.

Finally, we support void custom elements in templated values, and automatically expand these to their correct final form with end tags.

## I'm preparing to comment about this and want to be mean, what's the bad news?

We use:

- regex to parse inline handlers and void tags
- `with` and `eval` for magic templating

Some people consider them dangerous and want to outlaw their use. We consider them powerful and useful. 

Begun, the flame war has. Pick your side, we don't care. What we do care about tho, is good developer experience. 

##  I'm unsatisfied that the above is sufficiently negative, what other bad news can you give me?

This is in alpha. You probably don't want to use it for production unless you can handle the risk.



