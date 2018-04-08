import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import createHistory from 'history/createBrowserHistory'


function renderToElement(elementId, options) {
	const history = createHistory();
  ReactDOM.render(<App properties={options} history={history} />, document.getElementById(elementId));
}

export default renderToElement;

window.Dashboard = {
  render: renderToElement
};
registerServiceWorker();