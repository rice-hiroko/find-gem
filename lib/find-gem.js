'use babel';

import FindGemView from './find-gem-view';
import { CompositeDisposable } from 'atom';
import request from 'request'

export default {

  findGemView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.findGemView = new FindGemView(state.findGemViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.findGemView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'find-gem:find gem': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.findGemView.destroy();
  },

  serialize() {
    return {
      findGemViewState: this.findGemView.serialize()
    };
  },

  toggle() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      let url = "https://rubygems.org/api/v1/gems/" + selection + ".json"
      this.getGemDocUri(url).then((body) => {
        let str_body = JSON.stringify(body)
        let json_body = JSON.parse(JSON.parse(str_body))
        // editor.insertText(json_body.homepage_uri.toString())
        let homepage_uri = json_body.homepage_uri.toString()
      }).catch((error) => {
        atom.notifications.addWarning(error.reson)
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
            reason: 'Invalid gem name'
          })
        }
      })
    })
  },

};
