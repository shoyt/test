const electron    = require('electron')
const ipcRenderer = electron.ipcRenderer
document.addEventListener(
                        'DOMContentLoaded'  ,
                        function () {ipcRenderer.send('main-window-loaded')}
                        )
ipcRenderer.on(
                'results-sent'  ,
                function(event, results) {                     
                var people  = document.getElementById('people')
                var html    = '';
                for (var i = 0; i < results.length; i++) {
                    html += '<span class="person">' + results[i].firstName + ' ' + results[i].lastName + '</span>'
                }
                people.innerHTML = html
                }
            )    
