import { MakerZIP } from '@electron-forge/maker-zip'
import { VitePlugin } from '@electron-forge/plugin-vite'
import type { ForgeConfig } from '@electron-forge/shared-types'

import ForgeExternalsPlugin from './forge-externals-plugin'

const config: ForgeConfig = {
  makers: [new MakerZIP({}, ['darwin'])],
  packagerConfig: {
    appBundleId: 'com.browserosaurus',
    appCategoryType: 'public.app-category.developer-tools',
    asar: false,
    extendInfo: 'plist/Info.plist',
    icon: 'src/shared/static/icon/icon.icns',
    osxNotarize: process.env.CI
      ? undefined
      : {
          keychain: '~/Library/Keychains/login.keychain-db',
          keychainProfile: 'AC_PASSWORD',
          tool: 'notarytool',
        },
    osxSign: process.env.CI
      ? undefined
      : {
          optionsForFile: () => ({
            'entitlements': 'plist/entitlements.mac.plist',
            'hardened-runtime': true,
          }),
        },
    protocols: [
      {
        name: 'HTTP link',
        schemes: ['http', 'https'],
      },
      {
        name: 'File',
        schemes: ['file'],
      },
    ],
  },
  plugins: [
    new VitePlugin({
      build: [
        {
          config: 'vite.main.config.ts',
          entry: 'src/main/main.ts',
        },
        {
          config: 'vite.preload.config.ts',
          entry: 'src/renderers/shared/preload.ts',
        },
      ],
      renderer: [
        {
          config: 'vite.renderer.config.ts',
          name: 'picker_window',
        },
        {
          config: 'vite.renderer.config.ts',
          name: 'prefs_window',
        },
      ],
      // mainConfig,
      // renderer: {
      //   config: rendererConfig,
      //   entryPoints: [
      //     {
      //       html: './src/renderers/picker/index.html',
      //       js: './src/renderers/picker/index.tsx',
      //       name: 'picker_window',
      //       preload: {
      //         js: './src/renderers/shared/preload.ts',
      //       },
      //     },
      //     {
      //       html: './src/renderers/prefs/index.html',
      //       js: './src/renderers/prefs/index.tsx',
      //       name: 'prefs_window',
      //       preload: {
      //         js: './src/renderers/shared/preload.ts',
      //       },
      //     },
      //   ],
      // },
    }),
    new ForgeExternalsPlugin({
      externals: ['file-icon'],
    }),
  ],
}

export default config
