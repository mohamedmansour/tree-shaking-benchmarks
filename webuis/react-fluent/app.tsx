import React from 'react'
import { createRoot } from 'react-dom/client'
import { FluentProvider, teamsLightTheme, Button } from '@fluentui/react-components';

function ExampleApp() {
  return <FluentProvider theme={teamsLightTheme}>
    <Button appearance="primary">I am a button.</Button>
  </FluentProvider>
}


const container = document.querySelector('example-app')
const root = createRoot(container!)
root.render(<ExampleApp />)