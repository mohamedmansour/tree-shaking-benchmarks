import {LitElement, html} from 'lit'
import {customElement} from 'lit/decorators.js'

@customElement('example-app')
export class ExampleApp extends LitElement {
  render() {
    return html`
    <div>
      <button>Lit Button</button>
    </div>`
  }
}