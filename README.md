# graffiti (prealpha MVP)
HTML/CSS engine for node.js and deno.

Currently, it is just my hobby/research project and it's **not yet intended for
any use**.

[Discord](https://discord.gg/zQwyzFb)
| [Quickstart repo](https://github.com/cztomsik/hello-graffiti/)

---

<div style="display: flex; align-items: center">
<div style="max-height: 400px; overflow-y: scroll">

```javascript
const Counter = () => {
  const [count, setCount] = React.useState(0)
  const dec = () => setCount(count - 1)
  const inc = () => setCount(count + 1)

  return (
    <div style={styles.counter}>
      <span>{count}</span>

      <div style={{ ...styles.bar, width: count * 5 }} />

      <div style={styles.buttons}>
        <button onClick={dec}>--</button>
        <button onClick={inc}>++</button>
      </div>
    </div>
  )
}

const styles = {
  counter: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between'
  },

  bar: {
    backgroundColor: '#ff0000',
    height: 20
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
}
```
</div>
<img src="https://github.com/cztomsik/graffiti/raw/936b6e4bb5a51e138910a9315ecb91332012afb0/docs/images/counter.gif" />
</div>
<br>

---

## Current scope
I have reduced the scope to something which I can finish myself in a reasonable
time (before end of 2022) and which is also useful to me. I also have some ideas
for the future (and lots of deleted code in a git history) but those will have
to wait.

- single-window, single-thread, single-script (global `document`), nodejs-only
  (N-API)
- subset of DOM needed by major JS frameworks (`preact`-only for now)
- subset of CSS and CSSOM for CSS-in-JS (`goober`-only for now)
- block/flexbox layout (no floats)
- no index.html, no runtime behavior (no `<script>`, no `<link>`, ...)
- no HMR, no live-reload (but `nodemon` works)
- publish to npm (until then, you can `npm i github:cztomsik/graffiti`)
- and even then, [it will be just a
  toy](https://www.cmyr.net/blog/gui-framework-ingredients.html)

## Goals & philosophy
- simplicity > number of features
- support "reasonable subset" of DOM/CSS so we don't need to learn anything new
- fit nicely into the existing node.js ecosystem (lib is better than framework)
- it has to be fun (for me, sorry)

## Hacking
To work on the project, you will need recent Zig (`0.11.0-dev.2317+46b2f1f70`)
and system-installed GLFW3.3 with headers (`brew install pkg-config glfw`).

```
git clone ...
cd ...
git submodule init
git submodule update
npm i
zig build
node examples/hello.js
```

## License
The project is licensed under the MIT license.

## Contributing
If you are interested in contributing, please join the Discord channel to
discuss your ideas before submitting a pull request. Unexpected merge requests
are likely to be rejected.

Thank you for your interest :)
