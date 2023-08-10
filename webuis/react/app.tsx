import React from 'react'
import ReactDOM from 'react-dom'

function ExampleApp() {
    return <div>
        <button>React Button</button>
    </div>
  }

const container = document.querySelector('example-app')
ReactDOM.render(<ExampleApp />, container)
