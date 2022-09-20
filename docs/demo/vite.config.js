import {defineConfig} from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
	base: './', // relative paths in html
	plugins: [solidPlugin()],
	build: {
		target: 'esnext',
		minify: false, // smaller git diffs
		polyfillDynamicImport: false,
		// constant asset names https://github.com/vitejs/vite/issues/378
		rollupOptions: {
			output: {
				entryFileNames: `[name].js`,
				chunkFileNames: `[name].js`,
				assetFileNames: `[name].[ext]`,
			},
		},
	},
})
