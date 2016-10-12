'use babel';

import FindGemView from './find-gem-view';
import { CompositeDisposable } from 'atom';

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
      'find-gem:toggle': () => this.toggle()
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
      let reversed = selection.split('').reverse().join('')
      editor.insertText(reversed)
    }
  }

};
