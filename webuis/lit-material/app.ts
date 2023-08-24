import {LitElement, html} from 'lit'
import {customElement} from 'lit/decorators.js'

import '@material/web/button/filled-button.js'

@customElement('example-app')
export class ExampleApp extends LitElement {
  render() {
    return html`
    <div>
        <md-filled-button>Material Button</md-filled-button>
    </div>`
  }
}