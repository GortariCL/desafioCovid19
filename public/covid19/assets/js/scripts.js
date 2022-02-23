$(document).ready(function () {
    //***** HITO-1 *****//
    //2. Consumir la API http://localhost:3000/api/total con JavaScript o jQuery.
    $.ajax({
        url: 'http://localhost:3000/api/total',
        success: (resp) => {
            //console.log(resp.data);
            let data = resp.data;
            let casosConfirmados = [];
            let casosActivos = [];
            let casosFallecidos = [];
            let casosRecuperados = [];

            let filas = "";

            //3. Desplegar la información de la API en un gráfico de barra que debe mostrar sólo los
            //países con más de 10000 casos activos.

            let confirmados = data.filter(e => {
                return e.confirmed > 10000;
            });

            $.each(confirmados, (i, e) => {
                let activos =
                {
                    label: e.location,
                    y: e.active,
                    color: "#fa6485"
                }
                casosActivos.push(activos);

                let confirmados =
                {
                    label: e.location,
                    y: e.confirmed,
                    color: "#fdcc58"
                }
                casosConfirmados.push(confirmados);

                let fallecidos =
                {
                    label: e.location,
                    y: e.deaths,
                    color: "#cbcccf"
                }
                casosFallecidos.push(fallecidos);

                let recuperados =
                {
                    label: e.location,
                    y: e.recovered,
                    color: "#4ac0be"
                }
                casosRecuperados.push(recuperados);
            });

            //4. Desplegar toda la información de la API en una tabla.
            $.each(data, (i, e) => {
                filas += `<tr>
                <td class="fw-bold "> ${e.location}</td>
                <td class="fw-bold"> ${e.active}</td>
                <td class="fw-bold"> ${e.confirmed}</td>
                <td class="fw-bold"> ${e.deaths}</td>
                <td class="fw-bold"> ${e.recovered}</td>
                <td><a id="modal-${i}" class="text-decoration-none" href="#" data-bs-toggle="modal" 
                data-bs-target="#exampleModal">Ver detalles</a></td>
                </tr>`
            });
            $(`#jwt-tabla-post tbody`).append(filas);

            //Integración CanvasJS - Grafico de barras
            var chart = new CanvasJS.Chart("chartContainer", {
                animationEnabled: true,
                toolTip: {
                    shared: true
                },
                legend: {
                    cursor: "pointer",
                    verticalAlign: "top",
                    itemclick: toggleDataSeries,
                },
                data: [{
                    type: "column",
                    name: "Casos Activos",
                    legendText: "Casos Activos",
                    showInLegend: true,
                    legendMarkerColor: "#fa6485",
                    dataPoints: casosActivos
                },
                {
                    type: "column",
                    name: "Casos Confirmados",
                    legendText: "Casos Confirmados",
                    showInLegend: true,
                    legendMarkerColor: "#fdcc58",
                    dataPoints: casosConfirmados
                },
                {
                    type: "column",
                    name: "Casos Fallecidos",
                    legendText: "Casos Fallecidos",
                    showInLegend: true,
                    legendMarkerColor: "#cbcccf",
                    dataPoints: casosFallecidos
                },
                {
                    type: "column",
                    name: "Casos Recuperados",
                    legendText: "Casos Recuperados",
                    showInLegend: true,
                    legendMarkerColor: "#4ac0be",
                    dataPoints: casosRecuperados
                },
                ]
            });
            chart.render();

            function toggleDataSeries(e) {
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                }
                else {
                    e.dataSeries.visible = true;
                }
                chart.render();
            }

            // 5. Cada fila de la tabla debe incluir un link que diga "ver detalle", al hacer click levante
            // un modal y muestre los casos activos, muertos, recuperados y confirmados en un
            // gráfico, para obtener esta información debes llamar a la API
            // http://localhost:3000/api/countries/{country} al momento de levantar el modal.

            $.each(data, (i, e) => {
                $(`#modal-${i}`).on('click', () => {
                    //console.log(`#modal-${i}`)
                    $.ajax({
                        url: `http://localhost:3000/api/countries/${e.location}`,
                        //success: (resp) => {
                        success: () => {
                            // let data = resp.data;
                            // console.log(data);

                            let detallePie = [
                                {
                                    y: e.active,
                                    label: "Casos Activos",
                                    color: "#fa6485"
                                },
                                {
                                    y: e.confirmed,
                                    label: "Casos Confirmados",
                                    color: "#fdcc58"
                                },
                                {
                                    y: e.deaths,
                                    label: "Casos Fallecidos",
                                    color: "#cbcccf"
                                },
                                {
                                    y: e.recovered,
                                    label: "Casos Recuperados",
                                    color: "#4ac0be"
                                },
                            ];
                            //CANVAS JS PIE
                            var chart = new CanvasJS.Chart("chartContainer2", {
                                animationEnabled: true,
                                legend: {
                                    cursor: "pointer",
                                    verticalAlign: "top",
                                    itemclick: toggleDataSeries,
                                },
                                title: {
                                    text: e.location
                                },
                                data: [{
                                    type: "pie",
                                    startAngle: 240,
                                    indexLabel: "{label} {y}",
                                    dataPoints: detallePie
                                }]
                            });
                            chart.render();
                        },
                    });
                });
            });
        },
        error: function (err) {
            console.log(`Error: ${err}`);
        }
    });



    //***** HITO-2 *****//

    //Validación de formulario de ingreso
    document.getElementById('submitForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errUser = document.getElementById('errUser');
        const errPass = document.getElementById('errPass');

        if (email == "" && password == "") {
            errUser.innerHTML = 'Debe llenar el campo Correo';
            errPass.innerHTML = 'Debe llenar el campo Contraseña';
        } else if (email == "") {
            errUser.innerHTML = 'Debe llenar el campo Correo';
            errPass.innerHTML = '';
        } else if (password == "") {
            errPass.innerHTML = 'Debe llenar el campo Contraseña';
            errUser.innerHTML = '';
        } else {
            errUser.innerHTML = '';
            errPass.innerHTML = '';
            countryData(email, password);
        }
    });

    //Llamar a la API para obtener el JWT y ejecutar las funciones.
    const countryData = async (emailIng, passIng) => {
        try {
            const resp = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                body: JSON.stringify({
                    email: emailIng,
                    password: passIng
                })
            })
            const { token } = await resp.json();
            localStorage.setItem('jwt-token', token);

            if (token) {
                toggleNav();
                document.getElementById('submit-btn').innerHTML = 'Cerrar';
                document.getElementById('submit-btn').setAttribute('data-bs-dismiss', 'modal');
                document.getElementById('submit-btn').setAttribute('class', 'btn btn-outline-success d-block m-auto mt-4');
                document.getElementById('submit-btn').setAttribute('type', 'button');
                errPass.innerHTML = 'Ingreso exitoso';
                errPass.setAttribute('class', 'text-success w-75 m-auto');
                document.getElementById('username').setAttribute('disabled', '');
                document.getElementById('password').setAttribute('disabled', '');

            } else {
                errPass.innerHTML = 'Usuario no existe o no se puede obtener la información'
                console.log('token no creado');
            }
        } catch (err) {
            
            console.log(`Error: ${err}`);
        }
    }

    //Obtener datos desde la API
    const getConfirmed = async (jwt) => {
        try {
            const resp = await fetch('http://localhost:3000/api/confirmed', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
            const { data } = await resp.json();
            return data;

        } catch (err) {
            console.log(`Error: ${err}`);
        };
    };

    //Obtener datos desde la API
    const getDeaths = async (jwt) => {
        try {
            const resp = await fetch('http://localhost:3000/api/deaths', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
            const { data } = await resp.json();
            return data;

        } catch (err) {
            console.log(`Error: ${err}`);
        };
    };

    //Obtener datos desde la API
    const getRecovered = async (jwt) => {
        try {
            const resp = await fetch('http://localhost:3000/api/recovered', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
            const { data } = await resp.json();
            return data;

        } catch (err) {
            console.log(`Error: ${err}`);
        }
    }

    //Toggle NavBar
    const toggleNav = () => {
        $('.toggle-btn').toggle();
    }

    //Persistencia del token al actualizar
    (async () => {
        const token = localStorage.getItem('jwt-token');
        if (token) {
            toggleNav();
        }
    })();

    //Funcion que muestra el gráfico situación Chile
    const graficoSituacionChile = async () => {
        const jwt = localStorage.getItem('jwt-token');
        const arrConfirmados = await getConfirmed(jwt);
        const arrFallecidos = await getDeaths(jwt);
        const arrRecuperados = await getRecovered(jwt);

        const confirmados = arrConfirmados.map((e) => {
            return {label: e.date, y: e.total};
        });

        const fallecidos = arrFallecidos.map((e) => {
            return {label: e.date, y: e.total};
        });

        const recuperados = arrRecuperados.map((e) => {
            return {label: e.date, y: e.total};
        });
        
        //Integración CanvasJS - Grafico de lineas
        CanvasJS.addColorSet("charContainer3",
          [//colorSet Array
          "#fdcc58 ",
          "#cbcccf",
          "#4ac0be "
          ]);

        var chart = new CanvasJS.Chart("chartContainer3", {
            animationEnabled: true,
            legend: {
                cursor: "pointer",
                verticalAlign: "top",
                itemclick: toggleDataSeries
            },
            colorSet: "charContainer3",
            toolTip: {
                shared: true
            },
            data: [{
                type: "line",
                name: "Casos Activos",
                legendText: "Casos Activos",
                showInLegend: true,
                dataPoints: confirmados
            },
            {
                type: "line",
                name: "Casos Fallecidos",
                legendText: "Casos Fallecidos",
                showInLegend: true,
                dataPoints: fallecidos
            },
            {
                type: "line",
                name: "Casos Recuperados",
                legendText: "Casos Recuperados",
                showInLegend: true,
                dataPoints: recuperados
            },
            ]
        });
        chart.render();
        function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            }
            else {
                e.dataSeries.visible = true;
            }
            chart.render();
        }
    }

    //Eventos Botones
    //Btn Home
    document.getElementById('home-btn').addEventListener('click', () => {
        document.getElementById('situacion-mundial').setAttribute('style','display: block');
        document.getElementById('situacion-chile').setAttribute('style','display: none');
    });

    //Btn Iniciar Sesión 
    document.getElementById('iniciar-sesion').addEventListener('click', () => {
        document.getElementById('username').value = "";
        document.getElementById('password').value = "";
        document.getElementById('errUser').innerHTML = "";
        document.getElementById('errPass').innerHTML = "";
    });

    //Btn Situación Chile
    document.getElementById('situacionChile-btn').addEventListener('click', () => {
        document.getElementById('situacion-mundial').setAttribute('style','display: none');
        document.getElementById('situacion-chile').setAttribute('style','display: block');
        graficoSituacionChile();
    });

    //Btn al cerrar sesión
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('jwt-token')
        document.getElementById('situacion-mundial').setAttribute('style','display: block');
        document.getElementById('situacion-chile').setAttribute('style','display: none');
        toggleNav();
        document.getElementById('submit-btn').innerHTML = 'Ingresar';
        document.getElementById('username').removeAttribute('disabled', '');
        document.getElementById('password').removeAttribute('disabled', '');
        document.getElementById('submit-btn').setAttribute('data-bs-dismiss', '');
        document.getElementById('submit-btn').setAttribute('class', 'btn btn-outline-light d-block m-auto mt-4 toogle-btn');
        document.getElementById('submit-btn').setAttribute('type', 'submit');
        errPass.setAttribute('class', 'text-danger w-75 m-auto');
        errUser.setAttribute('class', 'text-danger w-75 m-auto');
    });
});