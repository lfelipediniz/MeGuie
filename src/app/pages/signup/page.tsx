"use client";

import React from "react";
import LoadingOverlay from "@/src/app/components/LoadingOverlay";
import { useRouter } from 'next/navigation';

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const inputClassName = "p-2 pl-11 border rounded-full border-gray-500 text-gray-600 bg-background-primary placeholder-gray-700 w-full";
const errorInputClassName = "p-2 pl-11 border rounded-full border-red-500 text-gray-600 bg-background-primary placeholder-red-500 w-full";
const errorTextClassName = "text-red-500 text-xs -mt-1";

export default function SignUp() {
    const router = useRouter();

    const [loading, setLoading] = React.useState(false);

    const [formData, setFormData] = React.useState({
        name: '', email: '', password: '', confirm: '',
    });

    const [errors, setErrors] = React.useState({
        name: '', email: '', password: '', confirm: '',
    });

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateFormData = (): boolean => {
        const newErrors = {
            name: '', email: '', password: '', confirm: '',
        };

        if (!formData.name) newErrors.name = 'Nome é obrigatório.';

        if (!formData.email) {
            newErrors.email = 'E-mail é obrigatório.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Formato de e-mail inválido.';
        }

        if (!formData.password) newErrors.password = 'Senha é obrigatória.';

        if (!formData.confirm) {
            newErrors.confirm = 'Confirmação de Senha é obrigatória.';
        } else if (formData.confirm !== formData.password) {
            newErrors.confirm = 'As senhas não coincidem.';
        }

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === '');
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateFormData()) return;

        setLoading(true);

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Salva no Local Storage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userId', data.userId);

                // Redireciona para a página inicial e recarrega a página
                window.location.href = '/';
            } else {
                // Erro no cadastro
                alert(data.message);
            }
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            alert('Ocorreu um erro ao tentar cadastrar. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleNavigation = () => {
        router.push('/pages/login');
    };

    return (
        <div className="mt-28 mb-10 mx-auto w-[250px] md:w-[350px]">
            {loading ? (
                <div className="transition-opacity duration-500 opacity-100">
                    <LoadingOverlay />
                </div>
            ) : (
                <div className="flex flex-col gap-y-3">
                    <p>Insira as suas informações:</p>

                    <div className="relative flex items-center">
                        <span className="absolute left-3 text-gray-400">
                            <PersonOutlineIcon className={errors.name ? 'text-red-500' : ''} />
                        </span>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nome Completo"
                            aria-label="Nome Completo"
                            aria-describedby={errors.name ? "name-error" : undefined}
                            className={errors.name ? errorInputClassName : inputClassName}
                            value={formData.name}
                            onChange={handleFormChange}
                        />
                    </div>
                    {errors.name && <p id="name-error" className={errorTextClassName}>{errors.name}</p>}

                    <div className="relative flex items-center">
                        <span className="absolute left-3 text-gray-400">
                            <MailOutlineIcon className={errors.email ? 'text-red-500' : ''} />
                        </span>
                        <input
                            type="email"
                            name="email"
                            placeholder="E-mail"
                            aria-label="E-mail"
                            aria-describedby={errors.email ? "email-error" : undefined}
                            className={`${errors.email ? errorInputClassName : inputClassName} pl-10`}
                            value={formData.email}
                            onChange={handleFormChange}
                        />
                    </div>
                    {errors.email && <p id="email-error" className={errorTextClassName}>{errors.email}</p>}

                    <div className="relative flex items-center">
                        <span className="absolute left-3 text-gray-400">
                            <LockOutlinedIcon className={errors.password ? 'text-red-500' : ''} />
                        </span>
                        <input
                            type="password"
                            name="password"
                            placeholder="Senha"
                            aria-label="Senha"
                            aria-describedby={errors.password ? "password-error" : undefined}
                            className={errors.password ? errorInputClassName : inputClassName}
                            value={formData.password}
                            onChange={handleFormChange}
                        />
                    </div>
                    {errors.password && <p id="password-error" className={errorTextClassName}>{errors.password}</p>}

                    <div className="relative flex items-center">
                        <span className="absolute left-3 text-gray-400">
                            <LockOutlinedIcon className={errors.confirm ? 'text-red-500' : ''} />
                        </span>
                        <input
                            type="password"
                            name="confirm"
                            placeholder="Confirmar Senha"
                            aria-label="Confirmar Senha"
                            aria-describedby={errors.confirm ? "confirm-error" : undefined}
                            className={errors.confirm ? errorInputClassName : inputClassName}
                            value={formData.confirm}
                            onChange={handleFormChange}
                        />
                    </div>
                    {errors.confirm && <p id="confirm-error" className={errorTextClassName}>{errors.confirm}</p>}

                    <button
                        className="px-4 py-2 mt-5 rounded-lg hover:opacity-90"
                        style={{
                            backgroundColor: "var(--action)",
                            color: "var(--background)",
                            fontFamily: "var(--font-inter)",
                        }}
                        onClick={handleFormSubmit}
                        aria-label="Cadastrar nova conta"
                    >
                        Cadastrar
                    </button>

                    <p className="mt-5 text-sm text-center">
                        <span>Já tem uma conta? </span>
                        <a
                            className="cursor-pointer underline"
                            style={{ color: "var(--action)" }}
                            onClick={handleNavigation}
                            role="link"
                            aria-label="Ir para a página de login"
                            tabIndex={0}
                        >
                            Fazer Login
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
}
