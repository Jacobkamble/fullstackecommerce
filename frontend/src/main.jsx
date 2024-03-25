import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from "./redux/store.js"
// import dotenv from 'dotenv';


// Load environment variables from .env file
// dotenv.config();
// dotenv.config({ path: "/config.env" });

console.log(<App />, "sjsj")

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
