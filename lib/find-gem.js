'use babel';

import FindGemView from './find-gem-view';
import { CompositeDisposable } from 'atom';
import request from 'request';
import shell from 'shell';
import {exec} from 'child_process';

export default {
  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'find-gem:find gem': () => this.find()
    }));
  },

  find() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      let url = "https://rubygems.org/api/v1/gems/" + selection + ".json"
      this.getGemDocUri(url).then((body) => {
        let res = JSON.parse(JSON.parse(JSON.stringify(body)))
        let uri = res.source_code_uri
        if (uri == null) {
          uri = res.homepage_uri.toString()
        }
        this.openPath(uri)
      }).catch((error) => {
        atom.notifications.addWarning(error.reason)
      })
    }
  },

  getGemDocUri(uri) {
    return new Promise((resolve, reject) => {
      request(uri, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          resolve(body)
        } else {
          reject({
            reason: 'oops no such gem'
          })
        }
      })
    })
  },

  openPath(path) {
    process_arc = process.platform
    switch (process_arc) {
      case 'darwin':
        exec('open "'+path+'"')
        break;
      case 'linux':
        exec('xdg-open "'+path+'"')
        break;
      case 'win32':
        Shell.openExternal('file:///'+path)
        break;
    }
  },

};
