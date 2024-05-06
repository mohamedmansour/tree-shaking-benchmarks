import { customElement, html, FASTElement } from '@microsoft/fast-element'
import { setTheme } from '@fluentui/web-components/theme.js'
import { webLightTheme } from '@fluentui/tokens'
import '@fluentui/web-components/button.js'

@customElement({
  name: 'example-app',
  template: html`
  <div>
    <fluent-button>Fluent Button</fluent-button>
  </div>`
})
export class ExampleApp extends FASTElement {}

setTheme(webLightTheme)
