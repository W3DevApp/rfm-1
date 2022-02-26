import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import { Notes } from "./components/Notes"


function App() {
  return (
    <Router>
      <Navbar />
      <div className="container p-4">
        <Switch>
          <Route path="/" component={Notes} />
        </Switch>
      </div>
    </Router>
  )
}

export default App
