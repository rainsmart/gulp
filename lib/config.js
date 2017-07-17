window.apiUrl = 'http://172.30.50.69:8081';
requirejs.config({
	baseUrl : "",
    paths : {
        "jquery": "../../lib/jquery-3.1.1.min",
        "underscore" : '../../lib/underscore.min'
    },
    shim: {
        "underscore" : {
            exports : "_"
        }
    }
});