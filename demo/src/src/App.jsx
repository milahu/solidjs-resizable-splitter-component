import {SplitY, SplitX} from 'solidjs-resizable-splitter-component'

export function App(props) {
	return (
		<div style="height: 100%">
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
