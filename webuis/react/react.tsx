import React from 'react'
import { createRoot } from 'react-dom/client'

function ExampleApp() {
    return <div>
        <button>React Button</button>
    </div>
}

const container = document.querySelector('example-app')
const root = createRoot(container!)
root.render(<ExampleApp />)
