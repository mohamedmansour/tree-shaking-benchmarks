import { customElement, html, FASTElement } from '@microsoft/fast-element-v1';

@customElement({
  name: 'example-app',
  template: html`
  <div>
    <button>Fluent Button</button>
  </div>`
})
export class ExampleApp extends FASTElement {}

