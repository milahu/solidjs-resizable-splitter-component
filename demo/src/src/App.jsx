import {SplitY, SplitX} from 'solidjs-resizable-splitter-component'

export function App(props) {
	return (
		<div style="height: 100%">
			<SplitY>
				<SplitX>
					<div class="content">Y1 X1</div>
					<SplitY>
						<div class="content">Y1 X2 Y1</div>
						<div class="content">Y1 X2 Y2</div>
						<div class="content">Y1 X2 Y3</div>
					</SplitY>
				</SplitX>
				<div class="content">Y2</div>
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
