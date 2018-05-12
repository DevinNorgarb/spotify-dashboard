import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import createHistory from 'history/createBrowserHistory'
import { Provider } from 'react-redux';
import configureStore from './configureStore'

function renderToElement(elementId, data) {
	const history = createHistory();
	const store = configureStore();
	
  ReactDOM.render(
  	<Provider store={store} key="provider">
  		<App data={data} history={history} template={elementId}/>
  	</Provider>, document.getElementById(elementId)
  );
}

export default renderToElement;

window.Dashboard = {
  render: renderToElement
};
registerServiceWorker();