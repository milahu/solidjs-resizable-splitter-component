//import { SplitRoot, SplitY, SplitX, SplitItem } from 'solidjs-resizable-splitter-component'
import { SplitRoot, SplitY, SplitX, SplitItem } from '../../../src/splitter.jsx'

export function App(props) {
	return (
		<SplitRoot>
			<SplitX>
				<SplitItem size="20%">
					aaaaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaaaaa
					aaaaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaaaaa
					aaaaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaaaaa
				</SplitItem>
				<SplitY size="60%">
					<SplitItem>
						bbbbbbbbbbbbbb bbbbbbbbbbbbbb bbbbbbbbbbbbbb
						bbbbbbbbbbbbbb bbbbbbbbbbbbbb bbbbbbbbbbbbbb
						bbbbbbbbbbbbbb bbbbbbbbbbbbbb bbbbbbbbbbbbbb
					</SplitItem>
					<SplitItem>
						bbbbbbbbbbbbbb bbbbbbbbbbbbbb bbbbbbbbbbbbbb
						bbbbbbbbbbbbbb bbbbbbbbbbbbbb bbbbbbbbbbbbbb
						bbbbbbbbbbbbbb bbbbbbbbbbbbbb bbbbbbbbbbbbbb
					</SplitItem>
					<SplitX>
						<SplitItem>
							cccccccccccccc cccccccccccccc cccccccccccccc
							cccccccccccccc cccccccccccccc cccccccccccccc
							cccccccccccccc cccccccccccccc cccccccccccccc
						</SplitItem>
						<SplitItem>
							cccccccccccccc cccccccccccccc cccccccccccccc
							cccccccccccccc cccccccccccccc cccccccccccccc
							cccccccccccccc cccccccccccccc cccccccccccccc
						</SplitItem>
					</SplitX>
				</SplitY>
				<SplitItem>
					dddddddddddddd dddddddddddddd dddddddddddddd
					dddddddddddddd dddddddddddddd dddddddddddddd
					dddddddddddddd dddddddddddddd dddddddddddddd
				</SplitItem>
			</SplitX>
			<style>{
				/*css*/ `
					.content {
						width: 100%;
						height: 100%;
						background: pink;
					}
				`
			}</style>
		</SplitRoot>
	)
}
