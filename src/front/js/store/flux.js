const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: localStorage.getItem("jwt-token") || null,
            books: [],
            loading: false,
            favorites: JSON.parse(localStorage.getItem("favorites")) || [], // Cargar favoritos desde LocalStorage
        },
        actions: {
            crear_usuario: async (email, password) => {
                try {
                    const res = await fetch(`${process.env.BACKEND_URL}/api/Registro`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });
                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.msg || "Error al registrar usuario");
                    }
                    const data = await res.json();
                    console.log(data.msg);
                    return data;
                } catch (error) {
                    console.error("Error al registrar usuario:", error);
                    return { error: error.message };
                }
            },
            iniciarSesion: async (email, password) => {
                try {
                    const res = await fetch(`${process.env.BACKEND_URL}/api/Login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.msg || "Error en la solicitud de login");
                    }

                    const data = await res.json();
                    localStorage.setItem("jwt-token", data.access_token);
                    setStore({ token: data.access_token });
                    console.log("Usuario autenticado:", data);

                    return { success: true, token: data.access_token };
                } catch (error) {
                    console.error("Error en la solicitud de login:", error);
                    return { success: false, error: error.message };
                }
            },
            traerLibrosRomance: async () => {
                try {
                    const res = await fetch("https://www.googleapis.com/books/v1/volumes?q=subject:romance&maxResults=40&key=AIzaSyDWeHrvToJGuNVbZjPWHcP6C_QDdGNBlbg", {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": '55948_25703fc2113e4aece39188c265f17591'
                        }
                    });

                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.msg || "Error al obtener los libros");
                    }

                    const data = await res.json();

                    // Filtrar libros que tienen portada (imageLinks.thumbnail)
                    const librosConPortada = data.items.filter(item =>
                        item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail
                    );

                    setStore({ books: librosConPortada });
                    return librosConPortada;
                } catch (error) {
                    console.error("Error al obtener los libros de romance:", error);
                    return { error: error.message };
                }
            },
            traerLibrosAccion: async () => {
                try {
                    const res = await fetch("https://www.googleapis.com/books/v1/volumes?q=subject:accion&maxResults=40&key=AIzaSyDWeHrvToJGuNVbZjPWHcP6C_QDdGNBlbg", {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": '55948_25703fc2113e4aece39188c265f17591'
                        }
                    });

                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.msg || "Error al obtener los libros");
                    }

                    const data = await res.json();

                    // Filtrar libros que tienen portada (imageLinks.thumbnail)
                    const librosConPortada = data.items.filter(item =>
                        item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail
                    );

                    setStore({ books: librosConPortada });
                    return librosConPortada;
                } catch (error) {
                    console.error("Error al obtener los libros de acción:", error);
                    return { error: error.message };
                }
            },
            traerLibrosFantasia: async () => {
                try {
                    const res = await fetch("https://www.googleapis.com/books/v1/volumes?q=subject:fantasy&maxResults=40&key=AIzaSyDWeHrvToJGuNVbZjPWHcP6C_QDdGNBlbg", {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.error.message || "Error al obtener los libros");
                    }

                    const data = await res.json();

                    // Filtrar libros que tienen portada (imageLinks.thumbnail)
                    const librosConPortada = data.items.filter(item =>
                        item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail
                    );

                    setStore({ books: librosConPortada });
                    return librosConPortada;
                } catch (error) {
                    console.error("Error al obtener los libros de fantasía:", error.message);
                    return { error: error.message };
                }
            },
            traerLibrosThriller: async () => {
                try {
                    const res = await fetch("https://www.googleapis.com/books/v1/volumes?q=subject:thriller&maxResults=40&key=AIzaSyDWeHrvToJGuNVbZjPWHcP6C_QDdGNBlbg", {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": '55948_25703fc2113e4aece39188c265f17591'
                        }
                    });

                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.msg || "Error al obtener los libros");
                    }

                    const data = await res.json();

                    // Filtrar libros que tienen portada (imageLinks.thumbnail)
                    const librosConPortada = data.items.filter(item =>
                        item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail
                    );

                    setStore({ books: librosConPortada });
                    return librosConPortada;
                } catch (error) {
                    console.error("Error al obtener los libros de thriller:", error.message);
                    return { error: error.message };
                }
            },
            traerTodosLosLibros: async () => {
                setStore({ loading: true }); // Activar el estado de carga

                try {
                    const [librosAccion, librosRomance, librosFantasia, librosThriller] = await Promise.all([
                        getActions().traerLibrosAccion(),
                        getActions().traerLibrosRomance(),
                        getActions().traerLibrosFantasia(),
                        getActions().traerLibrosThriller(),
                    ]);

                    const todosLosLibros = [...librosAccion, ...librosRomance, ...librosFantasia, ...librosThriller];

                    const librosMezclados = todosLosLibros.sort(() => Math.random() - 0.5);

                    setStore({ books: librosMezclados, loading: false }); // Cargar los libros y desactivar el estado de carga
                } catch (error) {
                    console.error("Error al obtener todos los libros:", error);
                    setStore({ loading: false }); // Desactivar el estado de carga incluso si falla
                }
            },
            cerrarSesion: () => {
                localStorage.removeItem("jwt-token");
                setStore({ token: null });
                console.log("Usuario deslogueado");
            },
            addFavoritos: (book) => {
                const store = getStore();

                // Comprobar si el libro ya está en favoritos
                if (!store.favorites.some((fav) => fav.id === book.id)) {
                    // Modificar directamente el array de favoritos
                    store.favorites.push(book);

                    // Actualizar el store
                    setStore({ favorites: store.favorites });

                    // Guardar los favoritos en LocalStorage
                    localStorage.setItem("favorites", JSON.stringify(store.favorites));

                    console.log("Libro agregado a favoritos:", book.volumeInfo.title);
                } else {
                    console.log("El libro ya está en tus favoritos");
                }
            },
            removeFavoritos: (book) => {
                const store = getStore();

                // Buscar el índice del libro en favoritos
                const favoriteIndex = store.favorites.findIndex((fav) => fav.id === book.id);

                if (favoriteIndex !== -1) {
                    // Eliminar el libro del array de favoritos (modificando directamente)
                    store.favorites.splice(favoriteIndex, 1);

                    // Actualizar el store
                    setStore({ favorites: store.favorites });

                    // Guardar los favoritos actualizados en LocalStorage
                    localStorage.setItem("favorites", JSON.stringify(store.favorites));

                    console.log("Libro eliminado de favoritos:", book.volumeInfo.title);
                } else {
                    console.log("El libro ya está eliminado o no está en la lista de favoritos");
                }
            },
            recuperarContraseña: async (email) => {
                try {
                    const res = await fetch(`${process.env.BACKEND_URL}/api/reset-password`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email }),
                    });
                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.msg || "Error al solicitar el restablecimiento de contraseña");
                    }
                    const data = await res.json();
                    console.log("Email de restablecimiento enviado:", data.msg);
                    return { success: true };
                } catch (error) {
                    console.error("Error al solicitar el restablecimiento de contraseña:", error);
                    return { success: false, error: error.message };
                }
            },
            cambiarcontraseña:  async (id, newPassword) => {
                try {
                    const res = await fetch(`${process.env.BACKEND_URL}/api/reset-password/${id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ new_password: newPassword }),
                    });
                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.msg || "Error al restablecer la contraseña");
                    }
                    const data = await res.json();
                    console.log("Contraseña restablecida con éxito:", data.msg);
                    return { success: true, message: data.msg };
                } catch (error) {
                    console.error("Error al restablecer la contraseña:", error);
                    return { success: false, error: error.message };
                }
            },
        }
    };
};

export default getState;