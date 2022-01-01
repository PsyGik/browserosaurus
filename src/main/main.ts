import type { AnyAction } from '@reduxjs/toolkit'
import electron, { app } from 'electron'

import { Channel } from '../shared/state/channels'
import { readiedApp } from './state/actions'
import { dispatch } from './state/store'
import { urlOpener } from './state/thunk.url-opener'

// Attempt to fix this bug: https://github.com/electron/electron/issues/20944
app.commandLine.appendArgument('--enable-features=Metal')

app.on('ready', () => dispatch(readiedApp()))

// App doesn't always close on ctrl-c in console, this fixes that
app.on('before-quit', () => app.exit())

app.on('open-url', (event, url) => {
  event.preventDefault()
  // FIX casting when I know how to correctly type this dispatch to allow thunks
  dispatch(urlOpener(url) as unknown as AnyAction)
})

/**
 * Enter actions from renderer into main's store's queue
 */
electron.ipcMain.on(Channel.PREFS, (_, action: AnyAction) => dispatch(action))
electron.ipcMain.on(Channel.PICKER, (_, action: AnyAction) => dispatch(action))
