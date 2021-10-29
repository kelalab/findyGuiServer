import React, { Children } from 'react'
import { Grommet, Header, Heading,  Button, Box } from 'grommet'
import { Previous } from 'grommet-icons'
import MainView from './Views/MainView'
import { RouterContext } from './RouterContext'


const Router = ({ children }) => {
  const [path, setPath] = React.useState("/")

  React.useEffect(() => {
    const onPopState = () => setPath(document.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const push = nextPath => {
    if (nextPath !== path) {
      window.history.pushState(undefined, undefined, nextPath)
      setPath(nextPath)
      window.scrollTo(0, 0)
    }
  }

  const back = () => {
    window.history.back();
    console.log(window.history.state);
    //setPath(window.history.)
  }

  return (
    <RouterContext.Provider value={{ path, push, back }}>
      {children}
    </RouterContext.Provider>
  )
}

const Routes = ({ children }) => {
  const { path: contextPath } = React.useContext(RouterContext)
  let found
  Children.forEach(children, child => {
    if (!found && contextPath === child.props.path) found = child
  })
  return found
}

const Route = ({ Component, path }) => {
  const { path: contextPath } = React.useContext(RouterContext)
  return contextPath === path ? <Component/> : null
}

const theme = {
  "global": {
    "colors": {
      "background": {
        "light": "#ffffff",
        "dark": "#000000"
      }
    },
    "font": {
      "family": "-apple-system,\n         BlinkMacSystemFont, \n         \"Segoe UI\", \n         Roboto, \n         Oxygen, \n         Ubuntu, \n         Cantarell, \n         \"Fira Sans\", \n         \"Droid Sans\",  \n         \"Helvetica Neue\", \n         Arial, sans-serif,  \n         \"Apple Color Emoji\", \n         \"Segoe UI Emoji\", \n         \"Segoe UI Symbol\""
    }
  },
  "button": {
    "extend": [
      null
    ]
  }
}


const Yhteydet = () => {
  const { push } = React.useContext(RouterContext);

  return (
    <Header align="center" direction="row" flex={false} justify="center" gap="large" background={{"color":"brand"}}>
      <Button icon={<Previous />} onClick={() => push("/")} />
      <Heading level="1">Yhteydet</Heading>
      <Box>

      </Box>
    </Header>
  )
}

const App = () => {
return (
  <Grommet full theme={theme}>
    <Router>
      <Routes>
        <Route path="/" Component={MainView} />
        <Route path="/yhteydet" Component={Yhteydet} />
      </Routes>
    </Router>
  </Grommet>
)};

export default App;