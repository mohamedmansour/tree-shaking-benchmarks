import { customElement, html, FASTElement } from '@microsoft/fast-element-v2';
import { fluentButton, provideFluentDesignSystem } from '@fluentui/web-components-v2';

provideFluentDesignSystem()
  .register(
    fluentButton()
  )

@customElement({
  name: 'example-app',
  template: html`
  <div>
    <fluent-button>Fluent Button</fluent-button>
  </div>`
})
export class ExampleApp extends FASTElement {}

