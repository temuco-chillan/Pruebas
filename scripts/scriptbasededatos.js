const mysql = require('mysql2');
const readline = require('readline');

const config = {
    host:'10.51.0.30',
    user:"MBadmin",
    password:"mbserver2025",
    database:"MABF"
}
const connect = mysql.createConnection(config);

connect.connect(function(err){
    if (err) {
        console.error("error de conexion con mysql: ", err)
        return;
    }
    console.log("conexion exitosa a la base de datos");
    mostrarMenu();
});

//query de select a productos
function selectTabla() {
    connect.query('select * from productos', (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
        } else {
            console.log('Resultados:', results); // Muestra los resultados
        }
        mostrarMenu();
    });
}

//query de update
function updateTabla() {
    //pasaremos primero el id, luego el nombre, y lo agregaremos a la consulta reemplazando el valor
    rl.question("Ingrese el ID del producto que desea actualizar: ", (id) => {
        rl.question("Ingrese el nuevo nombre del producto: ", (nombre) => {
            connect.query('update productos set nombre = ? where id = ?', [nombre, id], (err, results) => {
                if (err) {
                    console.error('Error al ejecutar la consulta:', err);
                } else {
                    console.log('Producto actualizado:', results); // Muestra los resultados
                }
                mostrarMenu();
            });
        });
    });
}

//conexion remota
function connection(){
    
}
//query de insert
function insertTabla() {
    //le apsaremos el nombre del nuevo producto y un stock reemplzanfo los ??  y ingresando los datos leidos
    rl.question("Ingrese el nombre del nuevo producto: ", (nombre) => {
        rl.question("Ingrese el stock del producto: ", (stock) => {
            connect.query('insert into productos(nombre, stock) values(?, ?)', [nombre, stock], (err, results) => {
                if (err) {
                    console.error('Error al ejecutar la consulta:', err);
                } else {
                    console.log('Producto insertado:', results); // Muestra los resultados
                }
                mostrarMenu();
            });
        });
    });
}
//query de delete
function deletequery(id){
    connect.query(`delete from productos where id=${id}`, (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
        } else {
            console.log('Resultados:', results); // Muestra los resultados
        }
        mostrarMenu();
    });
}

//query para crear la tienda producto
function crearTabla(){
    connect.query('create table productos(id int not null primary key auto_increment, nombre varchar(100) not null,stock int not null);', (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
        } else {
            console.log('Resultados:', results); // Muestra los resultados
        }
        mostrarMenu();
    });
}

// Interfaz de lectura por consola
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Menú interactivo
function mostrarMenu() {
    console.log("CRUD DE MATIAS NODE TABLA");
    console.log("1. Crear tabla productos");
    console.log("2. Ver productos");
    console.log("3. Insertar producto");
    console.log("4. Actualizar producto");
    console.log("5. Eliminar producto");
    console.log("6. Salir"); 

    //leeemos la respuesta y segun la condicion le daremos diferentes situaciones, es importante este switch
    //ya que agiliza la respuesta del codigo
    rl.question("Seleccione una opción: ", (respuesta) => {
        switch(respuesta) {
            case '1':
                crearTabla();
                break;
            case '2':
                selectTabla();
                break;
            case '3':
                insertTabla();
                break;
            case '4':
                updateTabla();
                break;
            case '5':
                rl.question("ingresa el ID del producto a eliminar: ", (id) => {
                    deletequery(id);
                });
                break;
            case '6':
                rl.close(); //cerramos readline
                connect.end(); // finalizo la conexion
                console.log("chao payaso"); //print de que lo finalize xd
                break;
            default:
                console.log("Opción no válida.");
                mostrarMenu();
        }
    });
}
