import {SplitY, SplitX, SplitItem} from 'solidjs-resizable-splitter-component'

export function App(props) {
	return (
		<div style="height: 100%">
			<SplitY>
				<SplitX>
					<SplitItem>Y1 X1</SplitItem>
					<SplitY>
						{/* you can mix <SplitItem> with other elements, for example <div> */}
						<SplitItem>Y1 X2 Y1</SplitItem>
						<div>Y1 X2 Y2</div>
						<div>Y1 X2 Y3</div>
					</SplitY>
				</SplitX>
				<div>Y2</div>
			</SplitY>

			<style>{
				/*css*/ `
					.content {
						width: 100%;
						height: 100%;
						background: pink;
					}
				`
			}</style>
		</div>
	)
}
