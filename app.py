from flask import Flask,request,flash,render_template,redirect,url_for,session,jsonify
from database import conectar
from datetime import datetime

from collections import defaultdict

from email.message import EmailMessage
import smtplib

from werkzeug.security import generate_password_hash, check_password_hash

import os
import base64
import json


app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "clave_por_defecto_para_dev")

UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

def seed_db_if_empty():
    conn, cursor = conectar()
    
    # Comprobar si ya hay usuarios cargados
    cursor.execute("SELECT COUNT(*) as total FROM usuarios")
    total = cursor.fetchone()["total"]
    
    if total == 0:
        # Ejecuta tu script de seed
        import seed_db
    
    conn.close()

# Llamar a la función antes de correr la app
seed_db_if_empty()


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS




barrios_buenos_aires = [
    "Agronomía", "Almagro", "Balvanera", "Barracas", "Belgrano", "Boedo",
    "Caballito", "Constitución", "Flores",
    "Floresta", "La Boca", "La Paternal", "Liniers","Monserrat", "Núñez", "Palermo", "Parque Avellaneda",
    "Parque Chacabuco", "Parque Chas", "Parque Patricios", "Puerto Madero",
    "Recoleta", "Retiro", "Saavedra", "San Cristóbal", "San Nicolás", "San Telmo",
    "Vélez Sársfield", "Versalles", "Villa Crespo", "Villa del Parque", "Villa Devoto",
    "Villa General Mitre", "Villa Real", "Villa Riachuelo", "Villa Santa Rita",
    "Villa Soldati", "Villa Urquiza"
]

def recorrer_propiedades():
    conn,cursor=conectar()
    cursor.execute('SELECT * FROM propiedades')
    propiedades=cursor.fetchall()
    conn.close()
    return propiedades



def construir_filtros(tipo_propiedad, barrio, tipo_operacion, min_dorm, max_dorm, min_amb, max_amb, min_precio, max_precio,moneda):
    where = "WHERE 1=1"
    params = []

    if tipo_propiedad:
        where += f" AND tipo_propiedad IN ({','.join(['?']*len(tipo_propiedad))})"
        params.extend(tipo_propiedad)

    if tipo_operacion:
        where += f" AND tipo_venta IN ({','.join(['?']*len(tipo_operacion))})"
        params.extend(tipo_operacion)

    if barrio:
        where += " AND barrio = ?"
        params.append(barrio)

    if min_dorm:
        where += " AND dormitorios >= ?"
        params.append(int(min_dorm))
    if max_dorm:
        where += " AND dormitorios <= ?"
        params.append(int(max_dorm))

    if min_amb:
        where += " AND ambientes >= ?"
        params.append(int(min_amb))
    if max_amb:
        where += " AND ambientes <= ?"
        params.append(int(max_amb))

    if moneda:
        where += " AND moneda_precio = ?"
        params.append(moneda)
        
    if min_precio:
        where += " AND precio >= ?"
        params.append(int(min_precio))
    if max_precio:
        where += " AND precio <= ?"
        params.append(int(max_precio))

    return where, params

def pasar_numero_con_coma(nro):
    try:
        nro_int = int(float(nro))
        return "{:,}".format(nro_int).replace(",", ".")
    except:
        return nro
    
def sacar_punto(nro):
    nro_normal=""
    for i in range(len(nro)):
        if nro[i]!=".":
            nro_normal+=nro[i]
    return int(nro_normal)

def sacar_cero(nro):
    if len(nro)==5:
        if nro[-2:]!="00":
            nro=float(nro)
        else:
            nro=int(float(nro))
    else:
        if nro[-1]!="0":
            nro=float(nro)
        else:
            nro=int(float(nro))
    return nro

def verificar_coma(string):
    if len(string)==3:
        if string[2]=='0':
            string=string[0]
    elif len(string)==4:
        if string[3]=='0':
            string=string[0]+string[1]
    elif len(string)==5:
        if string[4]=='0':
            string=string[0]+string[1]+string[2]
    elif len(string)==6:
        if string[5]=='0':
            string=string[0]+string[1]+string[2]+string[3]
    return string
                

@app.route('/')
def home():
    propiedades = recorrer_propiedades()
    propiedades_formateadas = []

    for item in propiedades:
        item = list(item)  # convertimos de Row a lista para poder modificar
        item[22] = pasar_numero_con_coma(str(int(float(item[22]))))
        item[23] = pasar_numero_con_coma(str(int(float(item[23]))))
        item[16] = verificar_coma(str(item[16]))
        propiedades_formateadas.append(item)
        
    
    if "usuario" in session:
        usuario = session["usuario"]
        id_usuario = usuario["id"]
        apellido = usuario["apellido"]
        nombre = usuario["nombre"]
        email = usuario["email"]

        # Conexión con row_factory para acceder por nombre
        conn,cursor=conectar()

        cursor.execute("SELECT DNI, telefono, password FROM usuarios WHERE id = ?", (id_usuario,))
        datos = cursor.fetchone()
        
        if datos is None:
            session.pop("usuario", None)
            return redirect(url_for("home"))  

        usuario_incompleto = False

        if datos and (datos["DNI"] is None or datos["telefono"] is None or datos["password"] is None):
            usuario_incompleto = True

        session["usuario"]["incompleto"] = usuario_incompleto

        return render_template("home.html", nombre=nombre, apellido=apellido, email=email, id_usuario=id_usuario, usuario_incompleto=usuario_incompleto,lista_propiedades=propiedades_formateadas)
    
    # Usuario no logueado
    return render_template("home.html",lista_propiedades=propiedades_formateadas)

@app.route("/buscar")
def buscar():
    letra = request.args.get("query", "").lower()
    resultados = [barrio for barrio in barrios_buenos_aires if barrio.lower().startswith(letra)]
    return jsonify(resultados)


@app.route('/registrarse',methods=['GET','POST'])
def registrarse():
    if request.method=='POST':
        nombre=request.form['nombre']
        apellido=request.form['apellido']
        email=request.form['email']
        password=request.form['password']
        dni=request.form['dni']
        telefono=request.form['telefono']
        
        conn,cursor=conectar()
        
        cursor.execute('SELECT * FROM usuarios WHERE email=?',(email,))
        usuario=cursor.fetchone()
        
        if usuario:
            flash('Hay un usuario ya registrado con ese email')
            return redirect(url_for('registrarse'))

        password_hash = generate_password_hash(password)  # 👈 Hashear contraseña
        
        cursor.execute('INSERT INTO usuarios(nombre,apellido,email,password,DNI,telefono) VALUES(?,?,?,?,?,?)',
                       (nombre,apellido,email,password_hash,dni,telefono))
        conn.commit()
        conn.close()
        return redirect(url_for('iniciar_sesion'))
        
    return render_template('register.html')

       

@app.route("/iniciar-sesion", methods=["GET", "POST"])
def iniciar_sesion():
    if request.method == 'POST':
        token = request.form.get("credential")
        email = request.form.get("email")
        password = request.form.get("password")

        if token:
            try:
                payload = token.split(".")[1]
                padding = '=' * (4 - len(payload) % 4)
                decoded = base64.urlsafe_b64decode(payload + padding)
                data = json.loads(decoded)
                nombre = data.get("given_name")
                apellido = data.get("family_name")
                email = data.get("email")
                foto = data.get("picture")

                conn, cursor = conectar()
                cursor.execute('SELECT * FROM usuarios WHERE email = ?', (email,))
                usuario = cursor.fetchone()

                if usuario:
                    id_usuario = usuario["id"]
                else:
                    cursor.execute('INSERT INTO usuarios (nombre, apellido, email) VALUES (?,?, ?)',(nombre, apellido, email,))
                    conn.commit()
                    id_usuario = cursor.lastrowid
                
                session["usuario"] = {
                    "id": id_usuario,
                    "nombre": nombre,
                    "apellido": apellido,
                    "email": email,
                    "foto": foto
                }

                return redirect(url_for('home'))

            except Exception as e:
                flash("Error al procesar el token.")
                print("Error:", e)
                return redirect(url_for("iniciar_sesion"))

        elif email and password:
            conn,cursor=conectar()
            cursor.execute('SELECT * FROM usuarios WHERE email=?',(email,))
            usuario=cursor.fetchone()
            
            if usuario and check_password_hash(usuario["password"], password):  # 👈 Verificar hash
                
                session["usuario"] = {
                    "id": usuario["id"],
                    "nombre": usuario["nombre"],
                    "apellido": usuario["apellido"],
                    "email": usuario["email"],
                    "foto": None  
                }

                return redirect(url_for('home'))
            else:
                flash("Credenciales incorrectas.")
                return redirect(url_for("iniciar_sesion"))

    return render_template("login.html")

@app.route('/ayuda', methods=["POST"])
def ayuda():
    if "usuario" not in session:
        return render_template('login.html')
    else:
        usuario = session["usuario"]
        id_usuario = usuario["id"]
        nombre=request.form['nombre-cont']
        apellido=request.form['apellido-cont']
        email_emisor=usuario["email"]
        mensaje=request.form['text-cont']
        
        try:
            msg = EmailMessage()
            msg['Subject'] = f'Consulta de {nombre} {apellido}'
            msg['From'] = email_emisor
            msg['To'] = "tucasaonlineinmobiliaria@gmail.com"  
            
            cuerpo = f"""
            Nombre: {nombre}
            Apellido: {apellido}
            Email: {email_emisor}

            Mensaje:
            {mensaje}
            """

            msg.set_content(cuerpo)

            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
                smtp.login(EMAIL_USER, EMAIL_PASS)
                smtp.send_message(msg)

            flash("Email enviado correctamente.", "success")
        except Exception as e:
            print("Error al enviar:", e)
            flash("Error al enviar el email.", "error")

        return redirect(url_for('home'))
    

@app.route('/contactar_anunciante', methods=["POST"])
def contactar_anunciante():
    if "usuario" not in session:
        return render_template('login.html')
    else:
        usuario = session["usuario"]
        id_usuario = usuario["id"]
        nombre=request.form['nombre_usuario']
        telefono=request.form['telefono_usuario']
        email_emisor=usuario["email"]
        email_receptor=request.form['email_propietario']
        mensaje=request.form['mensaje']
        id_propiedad=request.args.get('id')
        
        try:
            msg = EmailMessage()
            msg['Subject'] = f'Consulta de {nombre}'
            msg['From'] = email_emisor
            msg['To'] = email_receptor  
            
            cuerpo = f"""
            Nombre: {nombre}
            Email: {email_emisor}
            Telefono: {telefono}

            Mensaje:
            {mensaje}
            """

            msg.set_content(cuerpo)

            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
                smtp.login(EMAIL_USER, EMAIL_PASS)
                smtp.send_message(msg)

            flash("Email enviado correctamente.", "success")
        except Exception as e:
            print("Error al enviar:", e)
            flash("Error al enviar el email.", "error")

        return redirect(url_for('propiedad',id=id_propiedad))    

@app.route("/completar-datos", methods=["GET", "POST"])
def completar_datos():
    if request.method == "POST":
        password = request.form["password"]
        dni = request.form["dni"]
        telefono = request.form["telefono"]

        password_hash = generate_password_hash(password)

        conn, cursor = conectar()
        cursor.execute("UPDATE usuarios SET password = ?, DNI = ?, telefono = ? WHERE id = ?",(password_hash, dni, telefono, session["usuario"]["id"]))
        conn.commit()
        
        session["usuario"]["DNI"] = dni
        session["usuario"]["telefono"] = telefono

        return redirect(url_for("home"))

    return render_template("completar_datos.html")

@app.route('/publicar',methods=['GET','POST'])
def publicar():
    usuario = session["usuario"]
    id_usuario = usuario["id"]
    apellido = usuario["apellido"]
    nombre = usuario["nombre"]
    email = usuario["email"]
    if request.method=='POST':
        print("Se recibió un POST")
        tipo_venta=request.form['tipo']
        tipo_propiedad=request.form['select-tipo']
        
        direccion=request.form['direccion']
        provincia=request.form['provincia']
        barrio=request.form['barrio']
        latitud=request.form['latitud']
        longitud=request.form['longitud']
        ubicacion=f"{latitud},{longitud}"
        
        ambientes=request.form['ambientes']
        dormitorios=request.form['dormitorios']
        banios=request.form['banios']
        toilettes=request.form['toilettes']
        toilettes= toilettes if toilettes!='0' else None
        cocheras=request.form['cocheras']  
        cocheras= cocheras if cocheras!='0' else None
        
        sup_cubierta=request.form['sup-cubierta']
        sup_cubierta=sacar_cero(sup_cubierta)
        sup_total=request.form['sup-total']
        sup_total=sacar_cero(sup_total)  
        
        antiguedad=request.form['antiguedad']
        if antiguedad=='Antigüedad':
            anios_antiguedad=request.form['anios-antiguedad']
            if int(anios_antiguedad)>1:
                antiguedad=f'{anios_antiguedad} años'
            else:
                antiguedad=f'{anios_antiguedad} año'
        
        moneda=request.form['moneda']
        precio_propiedad=request.form['precio-propiedad']
        expensa=request.form['expensa-propiedad']
        expensa= expensa if len(expensa)!=0 else None     
        
        titulo=request.form['titulo']
        descripcion=request.form['descripcion']
        
        
        fotos_secundarias = request.files.getlist('fotos')
        fotos_secundarias_nombres = []
        for foto in fotos_secundarias:
            if foto and allowed_file(foto.filename):
                foto_nombre = foto.filename
                foto.save(os.path.join(app.config['UPLOAD_FOLDER'], foto_nombre))
                fotos_secundarias_nombres.append(foto_nombre)    
        # Convertir la lista de fotos secundarias en una cadena separada por comas
        fotos_secundarias_str = ','.join(fotos_secundarias_nombres)
        
        foto_principal_nombre = fotos_secundarias_nombres[0]
        
        caracteristicas_generales = request.form.getlist('caracteristicas_generales')
        caracteristicas_generales = ','.join(caracteristicas_generales) if caracteristicas_generales else None

        caracteristicas = request.form.getlist('caracteristicas')
        caracteristicas = ','.join(caracteristicas) if caracteristicas else None

        comodidad_ambientes = request.form.getlist('comodidad-ambientes')
        comodidad_ambientes = ','.join(comodidad_ambientes) if comodidad_ambientes else None

        servicios = request.form.getlist('servicios')
        servicios = ','.join(servicios) if servicios else None

        
        adicionales_plantas=request.form['plantas']
        adicionales_plantas=adicionales_plantas if adicionales_plantas!="" else None
        
        adicionales_cober_cochera=request.form['cobertura-cochera']
        adicionales_cober_cochera=adicionales_cober_cochera if adicionales_cober_cochera!="" else None
        
        luminosidad=request.form['luminosidad']
        luminosidad=luminosidad if luminosidad!="" else None
        
        orientacion=request.form['orientacion']
        orientacion=orientacion if orientacion!="" else None
        
        f_terreno=request.form['f-terreno']
        f_terreno=sacar_cero(f_terreno)
        f_terreno=f_terreno if f_terreno!=0 else None
        
        l_terreno=request.form['l-terreno']
        l_terreno=sacar_cero(l_terreno)
        l_terreno=l_terreno if l_terreno!=0 else None
        
        sup_semicubierta=request.form['sup-semicubierta']
        sup_semicubierta=sacar_cero(sup_semicubierta)
        sup_semicubierta=sup_semicubierta if sup_semicubierta!=0 else None
        
        conn,cursor=conectar()
        cursor.execute(''' INSERT INTO propiedades(id_agente, titulo, descripcion, tipo_venta, tipo_propiedad, direccion, provincia, barrio, ubicacion, ambientes, dormitorios, banios, toilettes, cocheras, sup_cubierta, sup_total, sup_semicubierta, f_terreno, l_terreno, antiguedad, moneda_precio, precio, expensas, imagen_principal, imagenes_secundarias, caracteristicas_generales, caracteristicas, comodidad_ambientes, servicios,  plantas, cobertura_cochera, luminosidad, orientacion ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)''',
    (id_usuario, titulo, descripcion, tipo_venta, tipo_propiedad, direccion, provincia, 
     barrio, ubicacion, ambientes, dormitorios, banios, toilettes, cocheras, sup_cubierta, 
     sup_total, sup_semicubierta, f_terreno, l_terreno, antiguedad, moneda, precio_propiedad, 
     expensa, foto_principal_nombre, fotos_secundarias_str, caracteristicas_generales, 
     caracteristicas, comodidad_ambientes, servicios, adicionales_plantas, adicionales_cober_cochera, 
     luminosidad, orientacion))
        conn.commit()
        conn.close
        return redirect(url_for('home'))
    return render_template("publicar.html",nombre=nombre,apellido=apellido,email=email,id_usuario=id_usuario)

@app.route('/publicaciones',methods=['GET'])
def publicaciones():
    if "usuario" in session:
        usuario = session["usuario"]
        id_usuario = usuario["id"]
        apellido = usuario["apellido"]
        nombre = usuario["nombre"]
        email = usuario["email"]
    
    tipo_propiedad=request.args.getlist('tipo_propiedad[]')
    barrio=request.args.get('barrio')
    if barrio:
        barrio=barrio.title()
    tipo_operacion=request.args.getlist('tipo_operacion[]')
    for i in range(len(tipo_operacion)):
        if tipo_operacion[i]=='Alquilar':
            tipo_operacion[i]='Alquiler'
        elif tipo_operacion[i]=='Comprar':
            tipo_operacion[i]='Venta'
            
        
    min_dorm=request.args.get('min-dorm')
    max_dorm=request.args.get('max-dorm')
    min_amb=request.args.get('min-amb')
    max_amb=request.args.get('max-amb')
    moneda=request.args.get('moneda')
    min_precio=request.args.get('min-precio')
    max_precio=request.args.get('max-precio')
    
    
    where,params=construir_filtros(tipo_propiedad, barrio, tipo_operacion, min_dorm, max_dorm, min_amb, max_amb, min_precio, max_precio,moneda)

    pagina = int(request.args.get('pagina', 1))
    por_pagina = 10
    offset = (pagina - 1) * por_pagina

    conn, cursor = conectar()
    
    # Consulta con filtros y paginación
    query = f"SELECT * FROM propiedades {where} LIMIT ? OFFSET ?"
    cursor.execute(query, params + [por_pagina, offset])
    propiedades = cursor.fetchall()
    
    # Consulta para contar total
    query_total = f"SELECT COUNT(*) FROM propiedades {where}"
    cursor.execute(query_total, params)
    total_propiedades = cursor.fetchone()[0]
    total_paginas = (total_propiedades + por_pagina - 1) // por_pagina
    if propiedades:
        if 'usuario' in session:
            return render_template('publicaciones.html', propiedades=propiedades, total_paginas=total_paginas, pagina=pagina, nombre=nombre, apellido=apellido, email=email, id_usuario=id_usuario,min_amb=min_amb,max_amb=max_amb,min_dorm=min_dorm,max_dorm=max_dorm,barrio=barrio,tipo_propiedad=tipo_propiedad,tipo_operacion=tipo_operacion,min_precio=min_precio,max_precio=max_precio,moneda=moneda)
    conn.close()
    return render_template('publicaciones.html', propiedades=propiedades, total_paginas=total_paginas, pagina=pagina,min_amb=min_amb,max_amb=max_amb,min_dorm=min_dorm,max_dorm=max_dorm,barrio=barrio,tipo_propiedad=tipo_propiedad,tipo_operacion=tipo_operacion,min_precio=min_precio,max_precio=max_precio,moneda=moneda)

@app.route('/propiedad',methods=['GET'])
def propiedad():
    if "usuario" in session:
        usuario = session["usuario"]
        id_usuario = usuario["id"]
        apellido = usuario["apellido"]
        nombre = usuario["nombre"]
        email = usuario["email"]
        
    id_propiedad=int(request.args.get('id'))
    
    conn,cursor=conectar()
    cursor.execute('SELECT * FROM propiedades WHERE id=?',(id_propiedad,))
    propiedad=cursor.fetchone()
    if propiedad:
        id_propietario=propiedad[1]
        cursor.execute('SELECT * FROM usuarios where id=?',(id_propietario,))
        propietario=cursor.fetchone()
        titulo=propiedad[2]
        descripcion=propiedad[3]
        tipo_venta=propiedad[4]
        tipo_propiedad=propiedad[5]
        direccion=propiedad[6]
        provincia=propiedad[7]
        barrio=propiedad[8]
        ubicacion=propiedad[9]
        ambientes=propiedad[10]
        dormitorios=propiedad[11]
        banios=propiedad[12]
        toilettes=propiedad[13]
        cocheras=propiedad[14]
        sup_cubierta=str(propiedad[15])
        sup_cubierta=verificar_coma(sup_cubierta)
        sup_total=str(propiedad[16])
        sup_total=verificar_coma(sup_total)
        if propiedad[17] is not None:
            sup_semicubierta = verificar_coma(str(propiedad[17]))
        else:
            sup_semicubierta = None
        if propiedad[18] is not None:
            f_terreno = verificar_coma(str(propiedad[18]))
        else:
            f_terreno = None
        if propiedad[19] is not None:
            l_terreno = verificar_coma(str(propiedad[19]))
        else:
            l_terreno = None
        antiguedad=propiedad[20]
        moneda_precio=propiedad[21]
        precio=str(propiedad[22])
        precio=pasar_numero_con_coma(precio)
        expensas=str(propiedad[23])
        expensas=pasar_numero_con_coma(expensas)
        imagen_principal=propiedad[24]
        imagenes_secundarias=propiedad[25].split(",")
        contador_imagenes=len(imagenes_secundarias)
        if propiedad[26]:
            caract_generales=propiedad[26].split(",")
        else:
            caract_generales=None
        if propiedad[27]:
            caracteristicas=propiedad[27].split(",")
        else:
            caracteristicas=None
        if propiedad[28]:
            comodidad_amb=propiedad[28].split(",")
        else: 
            comodidad_amb=None
        if propiedad[29]:
            servicios=propiedad[29].split(",")
        else:
            servicios=None
        plantas=propiedad[30]
        cobertura_cochera=propiedad[31]
        luminosidad=propiedad[32]
        orientacion=propiedad[33]
        estado=propiedad[34]
        fecha_publicacion=propiedad[35]
    conn.close()
    if "usuario" in session:     
        return render_template("propiedad.html",nombre=nombre,apellido=apellido,id_usuario=id_usuario,email=email,contador_imagenes=contador_imagenes, titulo=titulo, descripcion=descripcion, tipo_venta=tipo_venta, tipo_propiedad=tipo_propiedad, direccion=direccion, provincia=provincia, barrio=barrio, ubicacion=ubicacion, ambientes=ambientes, dormitorios=dormitorios, banios=banios, toilettes=toilettes, cocheras=cocheras, sup_cubierta=sup_cubierta, sup_total=sup_total, sup_semicubierta=sup_semicubierta, f_terreno=f_terreno, l_terreno=l_terreno, antiguedad=antiguedad, moneda_precio=moneda_precio, precio=precio, expensas=expensas, imagen_principal=imagen_principal, imagenes_secundarias=imagenes_secundarias, caract_generales=caract_generales, caracteristicas=caracteristicas, comodidad_amb=comodidad_amb, servicios=servicios, plantas=plantas, cobertura_cochera=cobertura_cochera, luminosidad=luminosidad, orientacion=orientacion, estado=estado, fecha_publicacion=fecha_publicacion,id_propiedad=id_propiedad,datos_propietario=propietario)
    else:
        return render_template("propiedad.html",contador_imagenes=contador_imagenes, titulo=titulo, descripcion=descripcion, tipo_venta=tipo_venta, tipo_propiedad=tipo_propiedad, direccion=direccion, provincia=provincia, barrio=barrio, ubicacion=ubicacion, ambientes=ambientes, dormitorios=dormitorios, banios=banios, toilettes=toilettes, cocheras=cocheras, sup_cubierta=sup_cubierta, sup_total=sup_total, sup_semicubierta=sup_semicubierta, f_terreno=f_terreno, l_terreno=l_terreno, antiguedad=antiguedad, moneda_precio=moneda_precio, precio=precio, expensas=expensas, imagen_principal=imagen_principal, imagenes_secundarias=imagenes_secundarias, caract_generales=caract_generales, caracteristicas=caracteristicas, comodidad_amb=comodidad_amb, servicios=servicios, plantas=plantas, cobertura_cochera=cobertura_cochera, luminosidad=luminosidad, orientacion=orientacion, estado=estado, fecha_publicacion=fecha_publicacion,id_propiedad=id_propiedad,datos_propietario=propietario)
    
@app.route('/cerrar-sesion')
def cerrar_sesion():
    session.clear()  # Elimina todos los datos de sesión
    return redirect(url_for('home'))

        
if __name__ == '__main__':
    app.run(debug=True, port=9999)

    
