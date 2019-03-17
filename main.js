
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './src/store';


// const customMiddleWare = store => next => action => {
//   //   console.log("Middleware triggered:", action);
//   next(action);
// }

// const createStoreWithMiddleware = applyMiddleware(ReduxThunk, customMiddleWare)(createStore);

ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('container'));