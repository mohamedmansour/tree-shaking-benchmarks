import { customElement, html, FASTElement } from '@microsoft/fast-element-v3';
import { DesignToken } from '@microsoft/fast-foundation-v3/design-token.js';
import { setTheme } from '@fluentui/web-components-v3';
import { webDarkTheme } from '@fluentui/tokens';
import '@fluentui/web-components-v3/button.js'

@customElement({
  name: 'example-app',
  template: html`
  <div>
    <fluent-button>Fluent Button</fluent-button>
  </div>`,
})
export class ExampleApp extends FASTElement {}

DesignToken.registerDefaultStyleTarget();
setTheme(webDarkTheme);

