# solidjs-resizable-splitter-component

A component that allows splitting an area into multiple horizontal or vertical resizable panels.

## Demo

See a [live demo](https://milahu.github.io/solidjs-resizable-splitter-component/).

To run the demo locally,

```sh
npm install
npm run demo
```

## Install

Not currently published to NPM, install from git for now by adding the following to your `dependencies` in `package.json`:

```json
	"dependencies": {
		"solidjs-resizable-splitter-component": "github:milahu/solidjs-resizable-splitter-component"
	}
```

or run

```sh
npm install "solidjs-resizable-splitter-component@github:milahu/solidjs-resizable-splitter-component"
```

If you fork the repo, you can replace `milahu` with your own GitHub username to
install the lib from your fork.

Note that the source file is a `.jsx` file. If you import it in a Vite project,
that will be fine because Vite will know how to compile it, but otherwise you
may need to configure your tool (f.e. [Webpack](https://webpack.js.org/) with
[Babel](https://babeljs.io/)) to compile JSX files in
`node_modules/solidjs-resizable-splitter-component` because those files are not
plain JavaScript.

## Usage

Make a split and resizeable layout by importing the `SlitX` and `SplitY`
components from the lib and using them in your markup:

```jsx
import {SplitY, SplitX} from 'solidjs-resizable-splitter-component'

export function App(props) {
	return (
		<div style="width: 100%; height: 100%">
			<SplitY>
				<SplitX>
					<div>Y1 X1</div>
					<SplitY>
						<div>Y1 X2 Y1</div>
						<div>Y1 X2 Y2</div>
						<div>Y1 X2 Y3</div>
					</SplitY>
				</SplitX>
				<div>Y2</div>
			</SplitY>
		</div>
	)
}
```

## Related

* based on https://github.com/milahu/svelte-layout-resizable
