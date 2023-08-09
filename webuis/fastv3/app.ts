import { customElement, html, FASTElement } from '@microsoft/fast-element';
import { DesignToken } from '@microsoft/fast-foundation';
import { setTheme } from '@fluentui/web-components';
import { webLightTheme } from '@fluentui/tokens';
import '@fluentui/web-components/button'

@customElement({
  name: 'example-app',
  template: html`
  <div>
    <fluent-button>Fluent Button</fluent-button>
  </div>`,
})
export class ExampleApp extends FASTElement {}

DesignToken.registerDefaultStyleTarget();
setTheme(webLightTheme);

