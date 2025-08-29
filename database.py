import sqlite3

def crear_tabla():

    conexion = sqlite3.connect("inmobiliaria.db")
    cursor = conexion.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        DNI INTEGER ,
        telefono INTEGER ,
        fecha_registro DATE DEFAULT CURRENT_DATE
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS propiedades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_agente INTEGER,

        titulo TEXT NOT NULL,
        descripcion TEXT,

        tipo_venta TEXT NOT NULL,
        tipo_propiedad TEXT NOT NULL,

        direccion TEXT NOT NULL,
        provincia TEXT NOT NULL,
        barrio TEXT,
        ubicacion TEXT NOT NULL,

        ambientes INTEGER,
        dormitorios INTEGER,
        banios INTEGER,
        toilettes INTEGER,
        cocheras INTEGER,

        sup_cubierta REAL,
        sup_total REAL,
        sup_semicubierta REAL,
        f_terreno REAL,
        l_terreno REAL,

        antiguedad TEXT,
        moneda_precio TEXT NOT NULL,
        precio REAL NOT NULL,
        expensas TEXT,

        imagen_principal TEXT,
        imagenes_secundarias TEXT,

        caracteristicas_generales TEXT,
        caracteristicas TEXT,
        comodidad_ambientes TEXT,
        servicios TEXT,

        plantas TEXT,
        cobertura_cochera TEXT,
        luminosidad TEXT,
        orientacion TEXT,

        estado TEXT DEFAULT 'disponible',
        fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY(id_agente) REFERENCES usuarios(id)
    );
    """)



    cursor.execute("""
    CREATE TABLE IF NOT EXISTS favoritos (
        id_usuario INTEGER,
        id_propiedad INTEGER,
        PRIMARY KEY(id_usuario, id_propiedad),
        FOREIGN KEY(id_usuario) REFERENCES usuarios(id),
        FOREIGN KEY(id_propiedad) REFERENCES propiedades(id)
    );
    """)
    conexion.commit()
    conexion.close()

def conectar():
    conn=sqlite3.connect('inmobiliaria.db')
    conn.row_factory=sqlite3.Row
    cursor=conn.cursor()
    return conn,cursor

crear_tabla()