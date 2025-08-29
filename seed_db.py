import random
from database import conectar

conn, cursor = conectar()


# Eliminar datos previos para evitar duplicados
cursor.execute("DELETE FROM propiedades")
cursor.execute("DELETE FROM usuarios")

# Crear 5 usuarios
usuarios = [
    ("Juan", "Pérez", "juan@example.com", "pass1", 12345678, 1111111111),
    ("Ana", "García", "ana@example.com", "pass2", 23456789, 2222222222),
    ("Luis", "Martínez", "luis@example.com", "pass3", 34567890, 3333333333),
    ("Sofía", "López", "sofia@example.com", "pass4", 45678901, 4444444444),
    ("Gaston", "Fernández", "elgasty@gmail.com", "123", 56789012, 5555555555),
]
for u in usuarios:
    cursor.execute(
        "INSERT INTO usuarios (nombre, apellido, email, password, DNI, telefono) VALUES (?, ?, ?, ?, ?, ?)",
        u
    )

# Obtener los IDs de los usuarios recién creados
cursor.execute("SELECT id FROM usuarios ORDER BY id DESC LIMIT 5")
ids_usuarios = [row["id"] for row in cursor.fetchall()]

# Crear 15 propiedades
for i in range(15):
    cursor.execute(
        '''INSERT INTO propiedades (
            id_agente, titulo, descripcion, tipo_venta, tipo_propiedad, direccion, provincia, barrio, ubicacion,
            ambientes, dormitorios, banios, toilettes, cocheras, sup_cubierta, sup_total, sup_semicubierta,
            f_terreno, l_terreno, antiguedad, moneda_precio, precio, expensas, imagen_principal, imagenes_secundarias,
            caracteristicas_generales, caracteristicas, comodidad_ambientes, servicios, plantas, cobertura_cochera,
            luminosidad, orientacion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        (
            random.choice(ids_usuarios),
            "Departamento de 3 Ambientes con Cochera en Venta en Palermo Chico",
            "Departamento de 3 ambientes con balcón y cochera fija- Ubicado en el 7° piso.",
            "Venta",
            "Casa",
            "Humberto Primo 2000",
            "Buenos Aires",
            "Palermo",
            "-34.62176894062619,-58.39377788220882",
            random.randint(2, 6),
            random.randint(1, 4),
            random.randint(1, 3),
            random.randint(0, 2),
            random.randint(0, 2),
            100.0 + i,
            120.0 + i,
            10.0 + i,
            8.0 + i,
            20.0 + i,
            "5 años",
            "USD",
            f"{100000 + i * 1000}",
            "65000",
            "cocina.jpg",
            "cocina.jpg,balcon.jpg,casa.jpg,entrada.jpg,living.jpg",
            "Pileta,Garage",
            "Aire acondicionado",
            "Living grande",
            "Gas,Agua",
            "2",
            "Cubierta",
            "Alta",
            "Norte"
        )
    )

conn.commit()
conn.close()
print("Usuarios y propiedades insertados correctamente.")
