const inject = require('@rollup/plugin-inject')
const stdLibBrowser = require('node-stdlib-browser')
const esbuildPlugin = require('node-stdlib-browser/helpers/esbuild/plugin')
const {
  handleCircularDependancyWarning
} = require('node-stdlib-browser/helpers/rollup/plugin')

const plugin = () => ({
  name: 'vite-plugin-node-stdlib-browser',
  config: () => ({
    resolve: {
      alias: stdLibBrowser
    },
    optimizeDeps: {
      include: ['buffer', 'process'],
      esbuildOptions: {
        inject: [require.resolve('node-stdlib-browser/helpers/esbuild/shim')],
        define: {
          global: 'global',
          process: 'process',
          Buffer: 'Buffer'
        },
        plugins: [esbuildPlugin(stdLibBrowser)]
      }
    },
    plugins: [
      {
        ...inject({
          global: [
            require.resolve('node-stdlib-browser/helpers/esbuild/shim'),
            'global'
          ],
          process: [
            require.resolve('node-stdlib-browser/helpers/esbuild/shim'),
            'process'
          ],
          Buffer: [
            require.resolve('node-stdlib-browser/helpers/esbuild/shim'),
            'Buffer'
          ]
        }),
        enforce: 'post'
      }
    ],
    build: {
      rollupOptions: {
        onwarn: (warning, rollupWarn) => {
          handleCircularDependancyWarning(warning, rollupWarn)
        }
      }
    }
  })
})

module.exports = plugin
