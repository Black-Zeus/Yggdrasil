import React from 'react'
import TechCategory from './TechCategory';

const Technologies = () => {
    const techStack = {
        frontend: [
            {
                name: 'React',
                icon: '/assets/technologies/react.svg',
                description: 'Librería para interfaces de usuario'
            },
            {
                name: 'TailwindCSS',
                icon: '/assets/technologies/tailwind_css.svg',
                description: 'Framework de estilos utilitarios'
            },
            {
                name: 'Vite.js',
                icon: '/assets/technologies/vite_js.svg',
                description: 'Empaquetador moderno para proyectos frontend'
            }
        ],
        backend: [
            {
                name: 'Python',
                icon: '/assets/technologies/python.svg',
                description: 'Lenguaje de programación principal del backend'
            },
            {
                name: 'FastAPI',
                icon: '/assets/technologies/fast_api.svg',
                description: 'Framework web rápido basado en Python'
            }
        ],
        storage: [
            {
                name: 'MySQL',
                icon: '/assets/technologies/mysql.svg',
                description: 'Base de datos relacional para almacenamiento principal'
            },
            {
                name: 'Redis',
                icon: '/assets/technologies/redis.svg',
                description: 'Sistema de caché en memoria'
            },
            {
                name: 'MinIO',
                icon: '/assets/technologies/minio.svg',
                description: 'Almacenamiento de objetos compatible con S3'
            },
            {
                name: 'RabbitMQ',
                icon: '/assets/technologies/rabbitmq.svg',
                description: 'Broker de mensajería para comunicación asincrónica'
            }
        ],
        infrastructure: [
            {
                name: 'Docker',
                icon: '/assets/technologies/docker.svg',
                description: 'Contenedores para aislar entornos'
            },
            {
                name: 'Docker Compose',
                icon: '/assets/technologies/docker_compose.svg',
                description: 'Orquestador para contenedores Docker'
            },
            {
                name: 'Nginx',
                icon: '/assets/technologies/nginx.svg',
                description: 'Proxy inverso y servidor web'
            },
            {
                name: 'GitHub',
                icon: '/assets/technologies/github.svg',
                description: 'Plataforma de control de versiones y colaboración'
            }
        ]
    };

    return (
        <section className="bg-white rounded-xl shadow-sm p-8 mb-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-6">
                Tecnologías Utilizadas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TechCategory title="Frontend" technologies={techStack.frontend} />
                <TechCategory title="Backend" technologies={techStack.backend} />
                <TechCategory title="Almacenamiento" technologies={techStack.storage} />
                <TechCategory title="Infraestructura" technologies={techStack.infrastructure} />
            </div>
        </section>
    );
};

export default Technologies;